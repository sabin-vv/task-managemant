import axios from 'axios'
import { API_BASE } from './config'

const api = axios.create({
    baseURL: API_BASE,
    withCredentials: true,
    headers: { 'Content-Type': 'application/json' },
})

api.interceptors.response.use(
    (res) => res,
    (err) => {
        const message = err.response?.data?.message || err.message || 'Something went wrong'
        return Promise.reject(new Error(message))
    },
)

export default api
