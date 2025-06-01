export class ApiError extends Error {
	constructor(
		message: string,
		public statusCode: number = 500,
		public shouldRedirect: boolean = false
	) {
		super(message);
		this.name = 'ApiError';
	}
}
