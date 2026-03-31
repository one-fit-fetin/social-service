import { PostModel } from '@/models/post.js';
import type {
	CreatePost,
	SerializedPost,
	UpdatePost,
} from '@/types/social/post.js';
import { serialize } from '@/utils/serialize.js';

export const postsRepository = {
	async create(data: CreatePost): Promise<SerializedPost> {
		const post = await PostModel.create(data);
		return serialize(post.toObject() as unknown as Record<string, unknown>);
	},

	async findAll(page = 1, pageSize = 20): Promise<SerializedPost[]> {
		const docs = await PostModel.find()
			.sort({ created_at: -1 })
			.skip((page - 1) * pageSize)
			.limit(pageSize)
			.lean();
		return docs.map((d) => serialize(d as unknown as Record<string, unknown>));
	},

	async findById(id: string): Promise<SerializedPost | null> {
		const doc = await PostModel.findById(id).lean();
		if (!doc) return null;
		return serialize(doc as unknown as Record<string, unknown>);
	},

	async update(id: string, data: UpdatePost): Promise<SerializedPost | null> {
		const doc = await PostModel.findByIdAndUpdate(id, data, {
			new: true,
		}).lean();
		if (!doc) return null;
		return serialize(doc as unknown as Record<string, unknown>);
	},

	async delete(id: string): Promise<boolean> {
		const result = await PostModel.deleteOne({ _id: id });
		return result.deletedCount === 1;
	},

	// Uses $addToSet or $pull to toggle the like atomically
	async toggleLike(
		postId: string,
		userId: string,
	): Promise<SerializedPost | null> {
		const post = await PostModel.findById(postId).lean();
		if (!post) return null;

		const hasLiked = post.likes.includes(userId);
		const operator = hasLiked ? '$pull' : '$addToSet';

		const doc = await PostModel.findByIdAndUpdate(
			postId,
			{ [operator]: { likes: userId } },
			{ new: true },
		).lean();
		if (!doc) return null;
		return serialize(doc as unknown as Record<string, unknown>);
	},
};
