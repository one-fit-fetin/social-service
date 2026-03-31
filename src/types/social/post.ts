import { z } from 'zod';
import type { SerializedComment } from './comment.js';
import {
	comment_schema,
	create_comment_schema,
	update_comment_schema,
} from './comment.js';

// Zod schemas used for HTTP request validation and Swagger docs
export const post_schema = z.object({
	_id: z.string(),
	author_id: z.uuid(),
	content: z.string().min(3),
	img_url: z.string().nullable().optional(),
	likes: z.array(z.string()),
	comments: z.array(comment_schema),
	created_at: z.coerce.date(),
	updated_at: z.coerce.date(),
});

export const create_post_schema = z.object({
	author_id: z.uuid(),
	content: z.string().min(3),
	img_url: z.string().nullable().optional(),
});

export const update_post_schema = z.object({
	author_id: z.uuid(),
	content: z.string().min(3).optional(),
	img_url: z.string().nullable().optional(),
});

export const toggle_like_schema = z.object({
	user_id: z.uuid(),
});

export { create_comment_schema, update_comment_schema };

export type Post = z.infer<typeof post_schema>;
export type CreatePost = z.infer<typeof create_post_schema>;
export type UpdatePost = z.infer<typeof update_post_schema>;
export type ToggleLike = z.infer<typeof toggle_like_schema>;

// Plain object shape returned by the repository after serializing MongoDB ObjectIds
export type SerializedPost = {
	_id: string;
	author_id: string;
	content: string;
	img_url?: string | null;
	likes: string[];
	comments: SerializedComment[];
	created_at: Date;
	updated_at: Date;
};
