import { z } from 'zod';

export const userSchema = z.object({
	id: z.uuid(),
	author_id: z.uuid(),
});

export type User = z.infer<typeof userSchema>;
