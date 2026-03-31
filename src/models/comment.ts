import { type Document, model, Schema, type Types } from 'mongoose';

export interface IComment {
	_id: Types.ObjectId;
	author_id: string;
	content: string;
	created_at: Date;
	updated_at: Date;
}

// Subdocument schema; Mongoose auto-generates _id for each comment
export const commentSchema = new Schema<IComment>(
	{
		author_id: { type: String, required: true },
		content: { type: String, required: true, minlength: 1 },
	},
	{ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } },
);