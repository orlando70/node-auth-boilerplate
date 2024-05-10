import {Request, Response, NextFunction } from "express"
import { AuthenticationError } from "../../utils/errors"




export function isAuthenticated () {
    return (req: Request, res: Response, next: NextFunction) => {
        if (req.session.user?._id) return next()

        else return next(new AuthenticationError('token has expired'))
    }
}
