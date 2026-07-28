import { io, type Socket } from 'socket.io-client'

const SOCKET_URL = 'http://localhost:3000'

let socket: Socket | null = null

export function connectSocket() {
    if (socket?.connected) return socket

    socket = io(SOCKET_URL, {
        withCredentials: true,
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
