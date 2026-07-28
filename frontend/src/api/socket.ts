import { io, type Socket } from 'socket.io-client'
import { SOCKET_URL } from './config'
import { getAccessToken } from './token'

let socket: Socket | null = null

export function connectSocket() {
    if (socket?.connected) return socket

    socket = io(SOCKET_URL, {
        auth: { token: getAccessToken() },
        transports: ['websocket', 'polling'],
    })

    socket.on('connect_error', (err) => {
        console.error('Socket connection error:', err.message)
    })

    return socket
}

export function disconnectSocket() {
    if (socket) {
        socket.disconnect()
        socket = null
    }
}

export function getSocket() {
    return socket
}
