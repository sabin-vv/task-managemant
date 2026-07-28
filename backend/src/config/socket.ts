import { Server as HTTPServer } from 'http'
import { Server } from 'socket.io'
import jwt from 'jsonwebtoken'
import * as cookie from 'cookie'
import { env } from './env'

let io: Server | null = null

export function initSocket(httpServer: HTTPServer) {
    io = new Server(httpServer, {
        cors: {
            origin: ['http://localhost:5173', 'http://localhost:4173'],
            methods: ['GET', 'POST'],
            credentials: true,
        },
    })

    io.use((socket, next) => {
        const token = socket.handshake.auth?.token || cookie.parseCookie(socket.handshake.headers.cookie || '')?.token
        if (!token) {
            return next(new Error('Authentication required'))
        }
        try {
            const decoded = jwt.verify(token, env.JWT_SECRET) as { userId: string }
            socket.data.userId = decoded.userId
            next()
        } catch {
            next(new Error('Invalid token'))
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
