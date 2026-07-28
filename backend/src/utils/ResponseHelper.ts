import { type Response } from 'express'

export class ResponseHelper {
    static success(res: Response, data: unknown, statusCode: number = 200) {
        res.status(statusCode).json(data)
    }

    static error(res: Response, message: string, statusCode: number = 400) {
        res.status(statusCode).json({ message })
    }
}
