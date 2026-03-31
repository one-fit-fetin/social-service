import { z } from 'zod';

export const postIdParam = z.object({ id: z.string() });

export const commentIdParam = z.object({
	id: z.string(),
	commentId: z.string(),
});
