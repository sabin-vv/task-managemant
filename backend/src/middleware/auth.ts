import { type Request, type Response, type NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { env } from '../config/env'
import { HTTP_STATUS } from '../constants/http-status'
import { AUTH_MESSAGES } from '../constants/messages'
import { ResponseHelper } from '../utils/ResponseHelper'

export interface AuthRequest extends Request {
    userId?: string
}

interface JwtPayload {
    userId: string
}

export function authenticate(req: AuthRequest, res: Response, next: NextFunction) {
    const token = req.cookies?.token || req.headers.authorization?.replace('Bearer ', '')

    if (!token) {
        ResponseHelper.error(res, AUTH_MESSAGES.AUTH_REQUIRED, HTTP_STATUS.UNAUTHORIZED)
        return
    }

    try {
        const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload
        req.userId = decoded.userId
        next()
    } catch {
        ResponseHelper.error(res, AUTH_MESSAGES.INVALID_TOKEN, HTTP_STATUS.UNAUTHORIZED)
    }
}
