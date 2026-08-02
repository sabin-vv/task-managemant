import { Server as HTTPServer } from 'http'
import { Server } from 'socket.io'
import { TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken'
import { AppError } from '../errors/AppError'
import { HTTP_STATUS } from '../constants/http-status'
import { AUTH_MESSAGES, RESPONSE_MESSAGES } from '../constants/messages'
import { verifyToken } from './token'

let io: Server | null = null

export function initSocket(httpServer: HTTPServer) {
    io = new Server(httpServer, {
        cors: {
            origin: [
                'http://localhost:5173',
                'https://task-managemant.vercel.app',
                'https://task-managemant-t1pd.vercel.app',
            ],
            methods: ['GET', 'POST'],
            credentials: true,
        },
    })

    io.use((socket, next) => {
        const token = socket.handshake.auth?.token
        if (!token) {
            return next(new AppError(AUTH_MESSAGES.AUTH_REQUIRED, HTTP_STATUS.UNAUTHORIZED))
        }
        try {
            const { userId } = verifyToken(token)
            socket.data.userId = userId
            next()
        } catch (err) {
            if (err instanceof TokenExpiredError) {
                return next(new AppError(RESPONSE_MESSAGES.TOKEN_EXPIRED, HTTP_STATUS.UNAUTHORIZED))
            }
            if (err instanceof JsonWebTokenError) {
                return next(new AppError(RESPONSE_MESSAGES.INVALID_TOKEN, HTTP_STATUS.UNAUTHORIZED))
            }
            next(new AppError(AUTH_MESSAGES.INVALID_TOKEN, HTTP_STATUS.UNAUTHORIZED))
        }
    })

    io.on('connection', (socket) => {
        socket.join(socket.data.userId)
    })

    return io
}

export function getIO(): Server {
    if (!io) throw new Error('Socket.io not initialized')
    return io
}
