import { fastifyCors } from '@fastify/cors';
import { fastifyJwt } from '@fastify/jwt';
import { fastifySwagger } from '@fastify/swagger';
import ScalarApiReference from '@scalar/fastify-api-reference';
import { fastify } from 'fastify';
import {
	jsonSchemaTransform,
	serializerCompiler,
	validatorCompiler,
	type ZodTypeProvider,
} from 'fastify-type-provider-zod';
import { connectDB, disconnectDB } from './lib/mongodb.js';
import { closeRabbitMQ, connectRabbitMQ } from './lib/rabbitmq.js';
import { routes } from './router.js';

const app = fastify({
	logger: {
		level: 'info',
	},
}).withTypeProvider<ZodTypeProvider>();
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(fastifyCors, {
	origin: true,
	methods: ['GET', 'PUT', 'POST', 'PATCH', 'DELETE'],
});

if (!process.env.JWT_SECRET) {
	throw new Error('JWT_SECRET is not defined in .env');
}

app.register(fastifyJwt, {
	secret: process.env.JWT_SECRET,
});

app.register(fastifySwagger, {
	openapi: {
		info: {
			title: 'social-service-api',
			description: 'API to users, posts, feed',
			version: '1.0.0',
		},
		components: {
			securitySchemes: {
				bearerAuth: {
					type: 'http',
					scheme: 'bearer',
					bearerFormat: 'JWT',
				},
			},
		},
	},
	transform: jsonSchemaTransform,
});

app.register(ScalarApiReference, {
	routePrefix: '/docs',
});

app.register(routes);

app.addHook('onReady', async () => {
	await connectDB();
	await connectRabbitMQ();
});

const shutdown = async () => {
	await app.close();
	await disconnectDB();
	await closeRabbitMQ();
	process.exit(0);
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

app.listen({ port: 3333, host: '0.0.0.0' }).then(() => {
	console.log('HTTP server running on http://localhost:3333!');
	console.log('Docs available at http://localhost:3333/docs');
});
