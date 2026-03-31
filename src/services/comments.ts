import { commentsRepository } from '@/repositories/comments.js';
import { postsRepository } from '@/repositories/posts.js';
import type { CreateComment, UpdateComment } from '@/types/social/comment.js';
import { fail, ok } from '@/utils/service-result.js';

export const commentsService = {
	async createComment(postId: string, data: CreateComment) {
		const post = await postsRepository.findById(postId);
		if (!post) return fail(404, 'Post not found');

		const updated = await commentsRepository.add(postId, data);
		return ok(updated);
	},

	async updateComment(
		postId: string,
		commentId: string,
		requesterId: string,
		data: UpdateComment,
	) {
		const post = await postsRepository.findById(postId);
		if (!post) return fail(404, 'Post not found');

		const comment = post.comments.find((c) => c._id === commentId);
		if (!comment) return fail(404, 'Comment not found');
		// Only the comment author can edit it
		if (comment.author_id !== requesterId) return fail(403, 'Forbidden');

		const updated = await commentsRepository.update(postId, commentId, data);
		return ok(updated);
	},

	async deleteComment(postId: string, commentId: string, requesterId: string) {
		const post = await postsRepository.findById(postId);
		if (!post) return fail(404, 'Post not found');

		const comment = post.comments.find((c) => c._id === commentId);
		if (!comment) return fail(404, 'Comment not found');
		if (comment.author_id !== requesterId) return fail(403, 'Forbidden');

		const updated = await commentsRepository.delete(postId, commentId);
		return ok(updated);
	},
};
