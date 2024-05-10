import { Request, Response, NextFunction } from 'express';
import { AuthenticationError, AuthorizationError, GenericError, NotFoundError, ServiceError, ValidationError } from '../../utils/errors';
import config from '../../config';


const logError = (err: any, req: Request) => {
 console.error(err.message, {
			url: req.originalUrl,
			method: req.method,
			body: req.body,
			stack: err.stack,
		});
};

export default (
	err: GenericError,
	req: Request,
	res: Response,
	next: NextFunction
): void | Response => {
	if (res.headersSent) {
		return next(err);
	}
	switch (err.name) {
	case ServiceError.name:
	case NotFoundError.name:
	case AuthenticationError.name:
	case AuthorizationError.name:
		if (config.env.isTest) logError(err, req);
		return res.status(err.statusCode || 500).send({
			status: 'error',
			statusCode: err.statusCode,
			message: err.message,
		});
	case ValidationError.name:
		if (config.env.isTest) logError(err, req);
		return res.status(err.statusCode || 500).send({
			status: 'error',
			statusCode: err.statusCode,
			message: err.message,
			errors: (err as ValidationError).errors,
		});
	default:
		logError(err, req);
		return res.status(500).send({
			status: 'error',
			statusCode: 500,
			message: 'an error occurred',
            stack: err.stack
		});
	}
};
