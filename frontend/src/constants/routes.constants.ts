export const AUTH_API = {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    ME: '/api/auth/me',
    REFRESH: '/api/auth/refresh',
    LOGOUT: '/api/auth/logout',
} as const

export const TASK_API = {
    BASE: '/api/tasks',
    STATS: '/api/tasks/stats',
    byId: (id: string) => `/api/tasks/${id}`,
} as const
