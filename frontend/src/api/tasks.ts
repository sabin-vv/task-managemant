import api from './axios'

export interface Task {
    _id: string
    title: string
    description?: string
    status: 'pending' | 'in-progress' | 'completed'
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

export async function fetchTasks(): Promise<Task[]> {
    const { data } = await api.get('/api/tasks')
    return data
}

export async function fetchStats(): Promise<TaskStats> {
    const { data } = await api.get('/api/tasks/stats')
    return data
}

export async function createTask(body: { title: string; description?: string; dueDate?: string }): Promise<Task> {
    const { data } = await api.post('/api/tasks', body)
    return data
}

export async function updateTask(id: string, body: Partial<Task>): Promise<Task> {
    const { data } = await api.put(`/api/tasks/${id}`, body)
    return data
}

export async function deleteTask(id: string): Promise<void> {
    await api.delete(`/api/tasks/${id}`)
}
