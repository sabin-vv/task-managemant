const API_URL = 'http://localhost:3000/api/auth'

export interface AuthResponse {
    token: string
    user: { id: string; name: string; email: string }
}

export async function loginUser(email: string, password: string): Promise<AuthResponse> {
    const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
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
    })

    if (!res.ok) {
        const err = await res.json()
        throw new Error(err.message || 'Registration failed')
    }

    return res.json()
}
