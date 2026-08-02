import { type Request, type Response, type NextFunction } from 'express'
import { HTTP_STATUS } from '../constants/http-status'
import { AUTH_MESSAGES } from '../constants/messages'
import { AppError } from '../errors/AppError'
import { verifyToken } from '../config/token'

export interface AuthRequest extends Request {
    userId?: string
}

export function authenticate(req: AuthRequest, _res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null

    if (!token) {
        next(new AppError(AUTH_MESSAGES.AUTH_REQUIRED, HTTP_STATUS.UNAUTHORIZED))
        return
    }

    const { userId } = verifyToken(token)
    req.userId = userId
    next()
}