import type { SerializedComment } from '@/types/social/comment.js';
import type { SerializedPost } from '@/types/social/post.js';

// Converts a raw Mongoose document to a plain object with _id as string
export function serialize(doc: Record<string, unknown>): SerializedPost {
	const comments = ((doc.comments as Record<string, unknown>[]) ?? []).map(
		(c) => ({
			...(c as Omit<SerializedComment, '_id'>),
			_id: String(c._id),
		}),
	);

	return {
		...(doc as Omit<SerializedPost, '_id' | 'comments'>),
		_id: String(doc._id),
		comments,
	};
}
