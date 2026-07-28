import { type Request, type Response, type NextFunction } from 'express'
import { AppError } from '../errors/AppError'
import { HTTP_STATUS } from '../constants/http-status'
import { ResponseHelper } from '../utils/ResponseHelper'

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction) {
    if (err instanceof AppError) {
        ResponseHelper.error(res, err.message, err.statusCode)
        return
    }

    console.error('Unhandled error:', err)
    ResponseHelper.error(res, 'Internal server error', HTTP_STATUS.INTERNAL_SERVER_ERROR)
}
