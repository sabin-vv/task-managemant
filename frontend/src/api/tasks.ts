import api from './axios'
import { TASK_API } from '../constants/routes.constants'

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

export async function fetchTasks(): Promise<Task[]> {
    const { data } = await api.get(TASK_API.BASE)
    return data
}

export async function fetchStats(): Promise<TaskStats> {
    const { data } = await api.get(TASK_API.STATS)
    return data
}

export async function createTask(body: { title: string; description?: string; dueDate?: string }): Promise<Task> {
    const { data } = await api.post(TASK_API.BASE, body)
    return data
}

export async function updateTask(id: string, body: Partial<Task>): Promise<Task> {
    const { data } = await api.put(TASK_API.byId(id), body)
    return data
}

export async function deleteTask(id: string): Promise<void> {
    await api.delete(TASK_API.byId(id))
}
