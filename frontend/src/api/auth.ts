import api from './axios'

export interface AuthResponse {
    user: { id: string; name: string; email: string }
    accessToken: string
}

export async function loginUser(email: string, password: string): Promise<AuthResponse> {
    const { data } = await api.post('/api/auth/login', { email, password })
    return data
}

export async function registerUser(name: string, email: string, password: string): Promise<AuthResponse> {
    const { data } = await api.post('/api/auth/register', { name, email, password })
    return data
}

export async function fetchMe(): Promise<AuthResponse> {
    const { data } = await api.get('/api/auth/me')
    return data
}

export async function refreshAccessToken(): Promise<{ accessToken: string }> {
    const { data } = await api.post('/api/auth/refresh')
    return data
}

export async function logoutUser(): Promise<void> {
    await api.post('/api/auth/logout')
}
