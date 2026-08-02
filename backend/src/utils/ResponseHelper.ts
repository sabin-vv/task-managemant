import { type Response } from 'express'
import { HTTP_STATUS } from '../constants/http-status'
import { RESPONSE_MESSAGES } from '../constants/messages'

export class ResponseHelper {
    static success(res: Response, data: unknown = null, message: string = RESPONSE_MESSAGES.SUCCESS, statusCode: number = HTTP_STATUS.OK) {
        res.status(statusCode).json({ success: true, message, data })
    }

    static error(res: Response, message: string, statusCode: number = HTTP_STATUS.BAD_REQUEST) {
        res.status(statusCode).json({ success: false, message, data: null })
    }
}
