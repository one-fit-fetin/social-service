import { PostModel } from '@/models/post.js';
import type { CreateComment, UpdateComment } from '@/types/social/comment.js';
import type { SerializedPost } from '@/types/social/post.js';
import { serialize } from '@/utils/serialize.js';

export const commentsRepository = {
	// Appends a comment to the post's embedded comments array
	async add(
		postId: string,
		data: CreateComment,
	): Promise<SerializedPost | null> {
		const doc = await PostModel.findByIdAndUpdate(
			postId,
			{ $push: { comments: data } },
			{ new: true },
		).lean();
		if (!doc) return null;
		return serialize(doc as unknown as Record<string, unknown>);
	},

	// Targets the specific comment subdocument using the positional $ operator
	async update(
		postId: string,
		commentId: string,
		data: UpdateComment,
	): Promise<SerializedPost | null> {
		const doc = await PostModel.findOneAndUpdate(
			{ _id: postId, 'comments._id': commentId },
			{
				$set: {
					'comments.$.content': data.content,
					'comments.$.updated_at': new Date(),
				},
			},
			{ new: true },
		).lean();
		if (!doc) return null;
		return serialize(doc as unknown as Record<string, unknown>);
	},

	async delete(
		postId: string,
		commentId: string,
	): Promise<SerializedPost | null> {
		const doc = await PostModel.findByIdAndUpdate(
			postId,
			{ $pull: { comments: { _id: commentId } } },
			{ new: true },
		).lean();
		if (!doc) return null;
		return serialize(doc as unknown as Record<string, unknown>);
	},
};
