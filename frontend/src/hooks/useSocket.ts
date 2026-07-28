import { useEffect } from 'react'
import { connectSocket, disconnectSocket } from '../api/socket'
import { useAuth } from '../context/AuthContext'

export function useSocket() {
    const { token } = useAuth()

    useEffect(() => {
        if (!token) return

        const socket = connectSocket(token)

        return () => {
            disconnectSocket()
        }
    }, [token])
}
