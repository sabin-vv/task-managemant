export interface User {
    id: string
    name: string
    email: string
}

export interface AuthContextType {
    user: User | null
    login: (email: string, password: string) => Promise<void>
    register: (name: string, email: string, password: string) => Promise<void>
    logout: () => void
}

export interface AuthResponse {
    user: User
    accessToken: string
}

export interface Task {
    _id: string
    title: string
    description?: string
    status: 'pending' | 'completed'
    dueDate?: string
    user: string
    createdAt: string
    updatedAt: string
}

export interface TaskStats {
    total: number
    pending: number
    completed: number
    overdue: number
}