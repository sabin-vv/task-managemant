import api from './axios'
import { AUTH_API } from '../constants/routes.constants'

export interface AuthResponse {
    user: { id: string; name: string; email: string }
    accessToken: string
}

export async function loginUser(email: string, password: string): Promise<AuthResponse> {
    const { data } = await api.post(AUTH_API.LOGIN, { email, password })
    return data
}

export async function registerUser(name: string, email: string, password: string): Promise<AuthResponse> {
    const { data } = await api.post(AUTH_API.REGISTER, { name, email, password })
    return data
}

export async function fetchMe(): Promise<AuthResponse> {
    const { data } = await api.get(AUTH_API.ME)
    return data
}

export async function refreshAccessToken(): Promise<{ accessToken: string }> {
    const { data } = await api.post(AUTH_API.REFRESH)
    return data
}

export async function logoutUser(): Promise<void> {
    await api.post(AUTH_API.LOGOUT)
}
