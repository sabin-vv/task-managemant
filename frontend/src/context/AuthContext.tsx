import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { loginUser, registerUser, type AuthResponse } from '../api/auth'

interface User {
    id: string
    name: string
    email: string
}

interface AuthContextType {
    user: User | null
    token: string | null
    loading: boolean
    login: (email: string, password: string) => Promise<void>
    register: (name: string, email: string, password: string) => Promise<void>
    logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

function getStoredAuth(): { user: User; token: string } | null {
    const token = localStorage.getItem('token')
    const user = localStorage.getItem('user')
    if (!token || !user) return null
    try {
        return { token, user: JSON.parse(user) }
    } catch {
        return null
    }
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [token, setToken] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const stored = getStoredAuth()
        if (stored) {
            setUser(stored.user)
            setToken(stored.token)
        }
        setLoading(false)
    }, [])

    async function login(email: string, password: string) {
        const data: AuthResponse = await loginUser(email, password)
        setUser(data.user)
        setToken(data.token)
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
    }

    async function register(name: string, email: string, password: string) {
        const data: AuthResponse = await registerUser(name, email, password)
        setUser(data.user)
        setToken(data.token)
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
    }

    function logout() {
        setUser(null)
        setToken(null)
        localStorage.removeItem('token')
        localStorage.removeItem('user')
    }

    return (
        <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error('useAuth must be inside AuthProvider')
    return ctx
}
