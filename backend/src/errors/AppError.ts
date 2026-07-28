import { HTTP_STATUS } from '../constants/http-status'

export class AppError extends Error {
    statusCode: number

    constructor(message: string, statusCode: number = HTTP_STATUS.BAD_REQUEST) {
        super(message)
        this.statusCode = statusCode
        this.name = 'AppError'
    }
}
