import { z } from 'zod';

// Zod schemas used for HTTP request validation and Swagger docs
export const comment_schema = z.object({
	_id: z.string(),
	author_id: z.uuid(),
	content: z.string().min(1),
	created_at: z.coerce.date(),
	updated_at: z.coerce.date(),
});

export const create_comment_schema = z.object({
	author_id: z.uuid(),
	content: z.string().min(1),
});

export const update_comment_schema = z.object({
	author_id: z.uuid(),
	content: z.string().min(1),
});

export type Comment = z.infer<typeof comment_schema>;
export type CreateComment = z.infer<typeof create_comment_schema>;
export type UpdateComment = z.infer<typeof update_comment_schema>;

// Plain object shape returned by the repository after serializing MongoDB ObjectIds
export type SerializedComment = {
	_id: string;
	author_id: string;
	content: string;
	created_at: Date;
	updated_at: Date;
};
