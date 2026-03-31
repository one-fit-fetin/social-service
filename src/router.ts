import type { FastifyInstance } from 'fastify';
import { commentRoutes } from '@/routes/comments.js';
import { postRoutes } from '@/routes/posts.js';

export const routes = async (app: FastifyInstance) => {
	app.register(postRoutes);
	app.register(commentRoutes);
};
