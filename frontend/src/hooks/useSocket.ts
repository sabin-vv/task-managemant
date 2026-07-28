import { useEffect } from 'react'
import { connectSocket, disconnectSocket } from '../api/socket'
import { useAuth } from './useAuth'

export function useSocket() {
    const { user } = useAuth()

    useEffect(() => {
        if (!user) return

        connectSocket()

        return () => {
            disconnectSocket()
        }
    }, [user])
}
