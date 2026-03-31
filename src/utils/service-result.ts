export type ServiceResult<T> =
	| { success: true; data: T }
	| { success: false; status: number; message: string };

export function ok<T>(data: T): ServiceResult<T> {
	return { success: true, data };
}

export function fail(status: number, message: string): ServiceResult<never> {
	return { success: false, status, message };
}
