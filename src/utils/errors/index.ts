export class GenericError extends Error {
	public statusCode: number;

	constructor(message: string, statusCode = 400) {
		super(message);
		this.statusCode = statusCode;
		this.name = this.constructor.name;
		Error.captureStackTrace(this, this.constructor);
	}
}

export class ServiceError extends GenericError {}

export class ValidationError extends GenericError {
	public errors: string[];

	constructor(errors: string[] = []) {
		const message = `${errors[0]}`;
		super(message, 422);
		this.errors = errors;
	}
}

export class NotFoundError extends GenericError {
	constructor(message: string) {
		super(message, 404);
	}
}

export class AuthenticationError extends GenericError {
	constructor(message: string) {
		super(message, 401);
	}
}

export class AuthorizationError extends GenericError {
	constructor(message = 'You are not authorized to perform this action') {
		super(message, 403);
	}
}
