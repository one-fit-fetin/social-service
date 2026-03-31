import amqplib, {
	type Channel,
	type ChannelModel,
	type ConsumeMessage,
} from 'amqplib';
import { handleCommentAction } from '@/controllers/comments.js';
import { handlePostAction } from '@/controllers/posts.js';
import type { RpcMessage } from '@/utils/rpc-response.js';

let connection: ChannelModel | null = null;
let channel: Channel | null = null;

export async function connectRabbitMQ(): Promise<void> {
	const url = process.env.RABBITMQ_URL;
	const queue = process.env.RABBITMQ_QUEUE;

	if (!url) throw new Error('RABBITMQ_URL is not defined');
	if (!queue) throw new Error('RABBITMQ_QUEUE is not defined');

	connection = await amqplib.connect(url);
	channel = await connection.createChannel();

	// durable: true ensures the queue survives broker restarts
	await channel.assertQueue(queue, { durable: true });
	// prefetch(1) processes one message at a time, avoiding overload
	channel.prefetch(1);

	channel.consume(queue, async (msg: ConsumeMessage | null) => {
		if (!msg) return;

		let response: unknown;
		try {
			const parsed: RpcMessage = JSON.parse(msg.content.toString());
			// Each controller returns null for actions it doesn't own
			response = (await handlePostAction(parsed)) ??
				(await handleCommentAction(parsed)) ?? {
					success: false,
					status: 400,
					message: `Unknown action: ${parsed.action}`,
				};
		} catch {
			response = {
				success: false,
				status: 500,
				message: 'Internal server error',
			};
		} finally {
			// Always ack to prevent infinite requeue on errors
			channel?.ack(msg);

			// RPC pattern: send the response back to the caller's reply queue
			const replyTo = msg.properties.replyTo;
			if (replyTo) {
				channel?.sendToQueue(replyTo, Buffer.from(JSON.stringify(response)), {
					correlationId: msg.properties.correlationId,
				});
			}
		}
	});

	console.log(`RabbitMQ consumer listening on queue: ${queue}`);
}

export async function closeRabbitMQ(): Promise<void> {
	await channel?.close();
	await connection?.close();
}
