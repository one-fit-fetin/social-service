import { postsRepository } from '@/repositories/posts.js';
import type {
	CreatePost,
	ToggleLike,
	UpdatePost,
} from '@/types/social/post.js';
import { fail, ok } from '@/utils/service-result.js';

export const postsService = {
	async createPost(data: CreatePost) {
		const post = await postsRepository.create(data);
		return ok(post);
	},

	async getPosts(page?: number, pageSize?: number) {
		const posts = await postsRepository.findAll(page, pageSize);
		return ok(posts);
	},

	async getPost(id: string) {
		const post = await postsRepository.findById(id);
		if (!post) return fail(404, 'Post not found');
		return ok(post);
	},

	async updatePost(id: string, requesterId: string, data: UpdatePost) {
		const post = await postsRepository.findById(id);
		if (!post) return fail(404, 'Post not found');
		// Only the author can edit their own post
		if (post.author_id !== requesterId) return fail(403, 'Forbidden');

		const updated = await postsRepository.update(id, data);
		return ok(updated);
	},

	async deletePost(id: string, requesterId: string) {
		const post = await postsRepository.findById(id);
		if (!post) return fail(404, 'Post not found');
		if (post.author_id !== requesterId) return fail(403, 'Forbidden');

		await postsRepository.delete(id);
		return ok({ deleted: true });
	},

	async toggleLike(postId: string, data: ToggleLike) {
		const post = await postsRepository.findById(postId);
		if (!post) return fail(404, 'Post not found');

		const updated = await postsRepository.toggleLike(postId, data.user_id);
		return ok(updated);
	},
};
