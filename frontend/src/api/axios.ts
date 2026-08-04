import axios from 'axios'
import { API_BASE } from './config'
import { AUTH_API } from '../constants/routes.constants'
import { getAccessToken, setAccessToken } from './token'

const api = axios.create({
    baseURL: API_BASE,
    withCredentials: true,
    headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
    const token = getAccessToken()
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

let isRefreshing = false
let failedQueue: Array<{ resolve: (token: string) => void; reject: (err: unknown) => void }> = []

function processQueue(error: unknown, token: string | null = null) {
    failedQueue.forEach(({ resolve, reject }) => {
        if (error) reject(error)
        else resolve(token!)
    })
    failedQueue = []
}

api.interceptors.response.use(
    (res) => {
        const d = res.data
        if (d && typeof d === 'object' && 'success' in d && 'message' in d && 'data' in d) {
            return { ...res, data: d.data }
        }
        return res
    },
    async (err) => {
        const originalRequest = err.config

        if (err.response?.status === 401 && originalRequest && !originalRequest._retry && !originalRequest.url?.includes(AUTH_API.REFRESH)) {
            if (isRefreshing) {
                return new Promise<string>((resolve, reject) => {
                    failedQueue.push({ resolve, reject })
                }).then((token) => {
                    originalRequest.headers.Authorization = `Bearer ${token}`
                    return api(originalRequest)
                })
            }

            originalRequest._retry = true
            isRefreshing = true

            try {
                const { data } = await api.post(AUTH_API.REFRESH)
                setAccessToken(data.accessToken)
                processQueue(null, data.accessToken)
                originalRequest.headers.Authorization = `Bearer ${data.accessToken}`
                return api(originalRequest)
            } catch (refreshError) {
                processQueue(refreshError, null)
                setAccessToken(null)
                return Promise.reject(refreshError)
            } finally {
                isRefreshing = false
            }
        }

        const message = err.response?.data?.message || err.message || 'Something went wrong'
        return Promise.reject(new Error(message))
    },
)

export default api
