import { useState, useEffect, type ReactNode } from 'react'
import { AuthContext, type User } from './auth-context'
import { loginUser, registerUser, fetchMe, logoutUser, type AuthResponse } from '../api/auth'

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchMe()
            .then((data) => setUser(data.user))
            .catch(() => setUser(null))
            .finally(() => setLoading(false))
    }, [])

    async function login(email: string, password: string) {
        const data: AuthResponse = await loginUser(email, password)
        setUser(data.user)
    }

    async function register(name: string, email: string, password: string) {
        const data: AuthResponse = await registerUser(name, email, password)
        setUser(data.user)
    }

    async function logout() {
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
