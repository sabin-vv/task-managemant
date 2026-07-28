import { API_BASE } from './config'
const API_URL = `${API_BASE}/api/auth`

const creds = { credentials: 'include' as const }

export interface AuthResponse {
    user: { id: string; name: string; email: string }
}

export async function loginUser(email: string, password: string): Promise<AuthResponse> {
    const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        ...creds,
    })

    if (!res.ok) {
        const err = await res.json()
        throw new Error(err.message || 'Login failed')
    }

    return res.json()
}

export async function registerUser(
    name: string,
    email: string,
    password: string
): Promise<AuthResponse> {
    const res = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
        ...creds,
    })

    if (!res.ok) {
        const err = await res.json()
        throw new Error(err.message || 'Registration failed')
    }

    return res.json()
}

export async function fetchMe(): Promise<AuthResponse> {
    const res = await fetch(`${API_URL}/me`, { ...creds })
    if (!res.ok) throw new Error('Not authenticated')
    return res.json()
}

export async function logoutUser(): Promise<void> {
    await fetch(`${API_URL}/logout`, {
        method: 'POST',
        ...creds,
    })
}
