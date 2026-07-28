import { useState, useEffect, type ReactNode } from 'react'
import { AuthContext, type User } from './auth-context'
import { loginUser, registerUser, fetchMe, logoutUser, refreshAccessToken, type AuthResponse } from '../api/auth'
import { setAccessToken } from '../api/token'

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        refreshAccessToken()
            .then((data) => {
                setAccessToken(data.accessToken)
                return fetchMe()
            })
            .then((data) => setUser(data.user))
            .catch(() => setUser(null))
            .finally(() => setLoading(false))
    }, [])

    async function login(email: string, password: string) {
        const data: AuthResponse = await loginUser(email, password)
        setAccessToken(data.accessToken)
        setUser(data.user)
    }

    async function register(name: string, email: string, password: string) {
        const data: AuthResponse = await registerUser(name, email, password)
        setAccessToken(data.accessToken)
        setUser(data.user)
    }

    async function logout() {
        setAccessToken(null)
        await logoutUser()
        setUser(null)
    }

    if (loading) return null

    return (
        <AuthContext.Provider value={{ user, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    )
}
