import { z } from 'zod';
import { commentsService } from '@/services/comments.js';
import {
	create_comment_schema,
	update_comment_schema,
} from '@/types/social/comment.js';
import type { RpcMessage, RpcResponse } from '@/utils/rpc-response.js';
import { toResponse } from '@/utils/rpc-response.js';

// Routes comment-related RabbitMQ actions to the comments service
export async function handleCommentAction(
	message: RpcMessage,
): Promise<RpcResponse | null> {
	const { action, payload } = message;

	try {
		switch (action) {
			case 'CREATE_COMMENT': {
				const { post_id, ...rest } = create_comment_schema
					.extend({ post_id: z.string() })
					.parse(payload);
				return toResponse(await commentsService.createComment(post_id, rest));
			}

			case 'UPDATE_COMMENT': {
				const { post_id, comment_id, requester_id, ...rest } =
					update_comment_schema
						.omit({ author_id: true })
						.extend({
							post_id: z.string(),
							comment_id: z.string(),
							requester_id: z.uuid(),
						})
						.parse(payload);
				return toResponse(
					await commentsService.updateComment(
						post_id,
						comment_id,
						requester_id,
						{
							author_id: requester_id,
							...rest,
						},
					),
				);
			}

			case 'DELETE_COMMENT': {
				const { post_id, comment_id, requester_id } = z
					.object({
						post_id: z.string(),
						comment_id: z.string(),
						requester_id: z.uuid(),
					})
					.parse(payload);
				return toResponse(
					await commentsService.deleteComment(
						post_id,
						comment_id,
						requester_id,
					),
				);
			}

			// Not a comment action — let the caller try the next controller
			default:
				return null;
		}
	} catch (err) {
		// Return 422 for invalid payloads instead of crashing the consumer
		if (err instanceof z.ZodError) {
			return { success: false, status: 422, message: 'Validation error' };
		}
		throw err;
	}
}
