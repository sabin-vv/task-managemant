import { Server as HTTPServer } from 'http'
import { Server } from 'socket.io'
import { AppError } from '../errors/AppError'
import { verifyToken } from './token'

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
        const token = socket.handshake.auth?.token
        if (!token) {
            return next(new AppError('Authentication required', 401))
        }
        try {
            const { userId } = verifyToken(token)
            socket.data.userId = userId
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
