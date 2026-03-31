import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { postsService } from '@/services/posts.js';
import { ErrorSchema } from '@/types/error.js';
import { postIdParam } from '@/types/params.js';
import {
	create_post_schema,
	post_schema,
	toggle_like_schema,
	update_post_schema,
} from '@/types/social/post.js';
import { sendError } from '@/utils/send-error.js';

export const postRoutes: FastifyPluginAsyncZod = async (app) => {
	app.post(
		'/posts',
		{
			schema: {
				tags: ['posts'],
				body: create_post_schema,
				response: { 201: post_schema, 422: ErrorSchema },
			},
		},
		async (req, reply) => {
			const result = await postsService.createPost(req.body);
			if (!result.success)
				return sendError(reply, result.status, result.message);
			return reply.status(201).send(result.data as never);
		},
	);

	app.get(
		'/posts',
		{
			schema: {
				tags: ['posts'],
				querystring: z.object({
					page: z.coerce.number().int().positive().optional(),
					pageSize: z.coerce.number().int().positive().optional(),
				}),
				response: { 200: z.array(post_schema) },
			},
		},
		async (req, reply) => {
			const { page, pageSize } = req.query;
			const result = await postsService.getPosts(page, pageSize);
			return reply.send((result.success ? result.data : []) as never);
		},
	);

	app.get(
		'/posts/:id',
		{
			schema: {
				tags: ['posts'],
				params: postIdParam,
				response: { 200: post_schema, 404: ErrorSchema },
			},
		},
		async (req, reply) => {
			const result = await postsService.getPost(req.params.id);
			if (!result.success)
				return sendError(reply, result.status, result.message);
			return reply.send(result.data as never);
		},
	);

	app.patch(
		'/posts/:id',
		{
			schema: {
				tags: ['posts'],
				params: postIdParam,
				body: update_post_schema,
				response: { 200: post_schema, 403: ErrorSchema, 404: ErrorSchema },
			},
		},
		async (req, reply) => {
			const result = await postsService.updatePost(
				req.params.id,
				req.body.author_id,
				req.body,
			);
			if (!result.success)
				return sendError(reply, result.status, result.message);
			return reply.send(result.data as never);
		},
	);

	app.delete(
		'/posts/:id',
		{
			schema: {
				tags: ['posts'],
				params: postIdParam,
				body: z.object({ author_id: z.uuid() }),
				response: {
					200: z.object({ deleted: z.boolean() }),
					403: ErrorSchema,
					404: ErrorSchema,
				},
			},
		},
		async (req, reply) => {
			const result = await postsService.deletePost(
				req.params.id,
				req.body.author_id,
			);
			if (!result.success)
				return sendError(reply, result.status, result.message);
			return reply.send(result.data);
		},
	);

	app.post(
		'/posts/:id/likes',
		{
			schema: {
				tags: ['likes'],
				params: postIdParam,
				body: toggle_like_schema,
				response: { 200: post_schema, 404: ErrorSchema },
			},
		},
		async (req, reply) => {
			const result = await postsService.toggleLike(req.params.id, req.body);
			if (!result.success)
				return sendError(reply, result.status, result.message);
			return reply.send(result.data as never);
		},
	);
};
