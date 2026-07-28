import { Server as HTTPServer } from 'http'
import { Server } from 'socket.io'
import jwt from 'jsonwebtoken'
import * as cookie from 'cookie'
import { AppError } from '../errors/AppError'
import { env } from './env'

let io: Server | null = null

export function initSocket(httpServer: HTTPServer) {
    io = new Server(httpServer, {
        cors: {
            origin: ['http://localhost:5173'],
            methods: ['GET', 'POST'],
            credentials: true,
        },
    })

    io.use((socket, next) => {
        const token = socket.handshake.auth?.token || cookie.parseCookie(socket.handshake.headers.cookie || '')?.token
        if (!token) {
            return next(new AppError('Authentication required', 401))
        }
        try {
            const decoded = jwt.verify(token, env.JWT_SECRET) as { userId: string }
            socket.data.userId = decoded.userId
            next()
        } catch {
            next(new AppError('Invalid token', 401))
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
