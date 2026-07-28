import { type Request, type Response, type NextFunction } from 'express'
import { HTTP_STATUS } from '../constants/http-status'
import { AUTH_MESSAGES } from '../constants/messages'
import { ResponseHelper } from '../utils/ResponseHelper'
import { verifyToken } from '../config/token'

export interface AuthRequest extends Request {
    userId?: string
}

export function authenticate(req: AuthRequest, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null

    if (!token) {
        ResponseHelper.error(res, AUTH_MESSAGES.AUTH_REQUIRED, HTTP_STATUS.UNAUTHORIZED)
        return
    }

    try {
        const { userId } = verifyToken(token)
        req.userId = userId
        next()
    } catch {
        ResponseHelper.error(res, AUTH_MESSAGES.INVALID_TOKEN, HTTP_STATUS.UNAUTHORIZED)
    }
}
