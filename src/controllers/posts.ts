import { z } from 'zod';
import { postsService } from '@/services/posts.js';
import {
	create_post_schema,
	toggle_like_schema,
	update_post_schema,
} from '@/types/social/post.js';
import {
	type RpcMessage,
	type RpcResponse,
	toResponse,
} from '@/utils/rpc-response.js';

// Routes post-related RabbitMQ actions to the posts service; Zod validates the payload first
export async function handlePostAction(
	message: RpcMessage,
): Promise<RpcResponse | null> {
	const { action, payload } = message;

	try {
		switch (action) {
			case 'CREATE_POST': {
				const data = create_post_schema.parse(payload);
				return toResponse(await postsService.createPost(data));
			}

			case 'GET_POSTS': {
				const { page, pageSize } = z
					.object({
						page: z.coerce.number().int().positive().optional(),
						pageSize: z.coerce.number().int().positive().optional(),
					})
					.parse(payload);
				return toResponse(await postsService.getPosts(page, pageSize));
			}

			case 'GET_POST': {
				const { id } = z.object({ id: z.string() }).parse(payload);
				return toResponse(await postsService.getPost(id));
			}

			case 'UPDATE_POST': {
				const { id, requester_id, ...rest } = update_post_schema
					.omit({ author_id: true })
					.extend({ id: z.string(), requester_id: z.uuid() })
					.parse(payload);
				return toResponse(
					await postsService.updatePost(id, requester_id, {
						author_id: requester_id,
						...rest,
					}),
				);
			}

			case 'DELETE_POST': {
				const { id, requester_id } = z
					.object({ id: z.string(), requester_id: z.uuid() })
					.parse(payload);
				return toResponse(await postsService.deletePost(id, requester_id));
			}

			case 'TOGGLE_LIKE': {
				const { post_id, ...rest } = toggle_like_schema
					.extend({ post_id: z.string() })
					.parse(payload);
				return toResponse(await postsService.toggleLike(post_id, rest));
			}

			// Not a post action — let the caller try the next controller
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
