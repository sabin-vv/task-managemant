import { useState, type ReactNode } from 'react'
import { AuthContext, type User } from './auth-context'
import { loginUser, registerUser, type AuthResponse } from '../api/auth'

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
    const [state, setState] = useState(() => {
        const stored = getStoredAuth()
        return {
            user: stored?.user ?? null,
            token: stored?.token ?? null,
        }
    })

    const { user, token } = state

    async function login(email: string, password: string) {
        const data: AuthResponse = await loginUser(email, password)
        setState({ user: data.user, token: data.token })
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
    }

    async function register(name: string, email: string, password: string) {
        const data: AuthResponse = await registerUser(name, email, password)
        setState({ user: data.user, token: data.token })
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
    }

    function logout() {
        setState({ user: null, token: null })
        localStorage.removeItem('token')
        localStorage.removeItem('user')
    }

    return (
        <AuthContext.Provider value={{ user, token, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    )
}
