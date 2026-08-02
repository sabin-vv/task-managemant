import { type Request, type Response, type NextFunction } from 'express'
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken'
import { AppError } from '../errors/AppError'
import { HTTP_STATUS } from '../constants/http-status'
import { RESPONSE_MESSAGES } from '../constants/messages'
import { ResponseHelper } from '../utils/ResponseHelper'

export function errorHandler(err: Error, _req: Request, res: Response, next: NextFunction) {
    if (res.headersSent) {
        next(err)
        return
    }

    if (err instanceof AppError) {
        ResponseHelper.error(res, err.message, err.statusCode)
        return
    }

    if (err instanceof TokenExpiredError) {
        ResponseHelper.error(res, RESPONSE_MESSAGES.TOKEN_EXPIRED, HTTP_STATUS.UNAUTHORIZED)
        return
    }

    if (err instanceof JsonWebTokenError) {
        ResponseHelper.error(res, RESPONSE_MESSAGES.INVALID_TOKEN, HTTP_STATUS.UNAUTHORIZED)
        return
    }

    if (err.name === 'CastError') {
        ResponseHelper.error(res, RESPONSE_MESSAGES.BAD_REQUEST, HTTP_STATUS.BAD_REQUEST)
        return
    }

    if (err.name === 'ValidationError') {
        const detail = (err as { errors?: Record<string, { message: string }> }).errors
        const message = detail ? Object.values(detail).map(({ message }) => message).join(', ') : RESPONSE_MESSAGES.VALIDATION_FAILED
        ResponseHelper.error(res, message, HTTP_STATUS.BAD_REQUEST)
        return
    }

    if ('code' in err && (err as { code: number }).code === 11000) {
        ResponseHelper.error(res, RESPONSE_MESSAGES.CONFLICT, HTTP_STATUS.CONFLICT)
        return
    }

    console.error('Unhandled error:', err)
    ResponseHelper.error(res, RESPONSE_MESSAGES.INTERNAL_SERVER_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR)
}