# Social Service API

A high-performance microservice developed with **Fastify** and **TypeScript**, dedicated to managing social interactions like posts and comments. The service integrates with **MongoDB** for data persistence and **RabbitMQ** for asynchronous communication and RPC patterns.

## 🚀 Technologies

- **Framework:** [Fastify](https://www.fastify.io/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Database:** [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
- **Message Broker:** [RabbitMQ](https://www.rabbitmq.com/) with [amqplib](http://squaremo.github.io/amqp.node/)
- **Validation:** [Zod](https://zod.dev/) (via `fastify-type-provider-zod`)
- **Authentication:** [Fastify JWT](https://github.com/fastify/fastify-jwt)
- **Documentation:** [Swagger](https://swagger.io/) & [Scalar](https://scalar.com/)
- **Linting/Formatting:** [Biome](https://biomejs.dev/)
- **Testing:** [Vitest](https://vitest.dev/)
- **Build:** [Babel](https://babeljs.io/)

## 🏗️ Architecture

The project follows a modular layered architecture:

- **Routes:** Endpoint definitions and Zod validation schemas.
- **Controllers:** Request handling and orchestration. Also handles RabbitMQ RPC actions.
- **Services:** Core business logic and inter-service coordination.
- **Repositories:** Data access layer using Mongoose models.
- **Models:** MongoDB schema definitions.
- **Lib:** Configuration for external services (MongoDB, RabbitMQ).
- **Utils:** Common utilities for responses and error handling.

## 📋 Prerequisites

- Node.js (v20 or higher)
- MongoDB instance
- RabbitMQ server

## 🛠️ Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd social-service
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   Create a `.env` file based on `.env.example`:
   ```env
   JWT_SECRET=your_jwt_secret
   MONGODB_URI=mongodb://localhost:27017/social-service
   RABBITMQ_URL=amqp://localhost
   RABBITMQ_QUEUE=social_service_queue
   ```

## ⚙️ Available Scripts

- `npm run dev`: Starts the server in development mode with hot-reload.
- `npm run build`: Compiles the TypeScript project to JavaScript in the `dist` folder.
- `npm start`: Starts the server from the compiled code.
- `npm run lint`: Runs Biome for linting and formatting.
- `npm run test`: Runs the test suite using Vitest.

## 🐳 Docker

Run the application using Docker:

1. Build the image:
   ```bash
   docker build -t social-service-api .
   ```

2. Start the container:
   ```bash
   docker run -p 3333:3333 \
     --env-file .env \
     social-service-api
   ```

## 📖 API Documentation

Interactive API documentation is available via Scalar. With the server running, access:

`http://localhost:3333/docs`

### Main Modules:
- **Posts:** Create, list, update, and delete social posts.
- **Comments:** Manage comments on posts.
- **RabbitMQ RPC:** Listens for external requests via the configured queue for background processing.

---
Developed by [tobias.bp2004@gmail.com](mailto:tobias.bp2004@gmail.com)