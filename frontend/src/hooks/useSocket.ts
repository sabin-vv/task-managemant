import { useEffect } from 'react'
import { connectSocket, disconnectSocket } from '../api/socket'
import { useAuth } from './useAuth'

export function useSocket() {
    const { token } = useAuth()

    useEffect(() => {
        if (!token) return

        connectSocket(token)

        return () => {
            disconnectSocket()
        }
    }, [token])
}
