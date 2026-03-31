// Shape of every incoming RabbitMQ message
export type RpcMessage = {
	action: string;
	payload: Record<string, unknown>;
	replyTo?: string;
	correlationId?: string;
};

// Uniform envelope sent back to the broker's reply queue
export type RpcResponse =
	| { success: true; data: unknown }
	| { success: false; status: number; message: string };

export function toResponse(
	result:
		| { success: true; data: unknown }
		| { success: false; status: number; message: string },
): RpcResponse {
	if (result.success) return { success: true, data: result.data };
	return { success: false, status: result.status, message: result.message };
}
