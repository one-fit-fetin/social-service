import mongoose from 'mongoose';

// Singleton flag prevents re-connecting if called multiple times (e.g. in tests)
let connected = false;

export async function connectDB(): Promise<void> {
	if (connected) return;

	const uri = process.env.MONGODB_URI;
	if (!uri) throw new Error('MONGODB_URI is not defined');

	await mongoose.connect(uri);
	connected = true;
	console.log('MongoDB connected');
}

export async function disconnectDB(): Promise<void> {
	await mongoose.disconnect();
	connected = false;
}
