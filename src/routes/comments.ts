import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { commentsService } from '@/services/comments.js';
import { ErrorSchema } from '@/types/error.js';
import { commentIdParam } from '@/types/params.js';
import {
	create_comment_schema,
	update_comment_schema,
} from '@/types/social/comment.js';
import { post_schema } from '@/types/social/post.js';
import { sendError } from '@/utils/send-error.js';

export const commentRoutes: FastifyPluginAsyncZod = async (app) => {
	app.post(
		'/posts/:id/comments',
		{
			schema: {
				tags: ['comments'],
				params: z.object({ id: z.string() }),
				body: create_comment_schema,
				response: { 201: post_schema, 404: ErrorSchema },
			},
		},
		async (req, reply) => {
			const result = await commentsService.createComment(
				req.params.id,
				req.body,
			);
			if (!result.success)
				return sendError(reply, result.status, result.message);
			return reply.status(201).send(result.data as never);
		},
	);

	app.patch(
		'/posts/:id/comments/:commentId',
		{
			schema: {
				tags: ['comments'],
				params: commentIdParam,
				body: update_comment_schema,
				response: { 200: post_schema, 403: ErrorSchema, 404: ErrorSchema },
			},
		},
		async (req, reply) => {
			const result = await commentsService.updateComment(
				req.params.id,
				req.params.commentId,
				req.body.author_id,
				req.body,
			);
			if (!result.success)
				return sendError(reply, result.status, result.message);
			return reply.send(result.data as never);
		},
	);

	app.delete(
		'/posts/:id/comments/:commentId',
		{
			schema: {
				tags: ['comments'],
				params: commentIdParam,
				body: z.object({ author_id: z.uuid() }),
				response: { 200: post_schema, 403: ErrorSchema, 404: ErrorSchema },
			},
		},
		async (req, reply) => {
			const result = await commentsService.deleteComment(
				req.params.id,
				req.params.commentId,
				req.body.author_id,
			);
			if (!result.success)
				return sendError(reply, result.status, result.message);
			return reply.send(result.data as never);
		},
	);
};
