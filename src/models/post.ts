import { type Document, model, Schema, type Types } from 'mongoose';
import { commentSchema, IComment } from './comment.js';

// Mongoose interfaces — used internally by the model layer only
export interface IPost extends Document {
	author_id: string;
	content: string;
	img_url?: string | null;
	likes: string[];
	comments: IComment[];
	created_at: Date;
	updated_at: Date;
}

// Subdocument schema; Mongoose auto-generates _id for each comment
const postSchema = new Schema<IPost>(
	{
		author_id: { type: String, required: true },
		content: { type: String, required: true, minlength: 3 },
		img_url: { type: String, default: null },
		// likes stores user_ids; $addToSet / $pull keep it duplicate-free
		likes: { type: [String], default: [] },
		comments: { type: [commentSchema], default: [] },
	},
	{ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } },
);

export const PostModel = model<IPost>('Post', postSchema);
