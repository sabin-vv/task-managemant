import api from './axios'
import { TASK_API } from '../constants/routes.constants'
import type { Task, TaskStats } from '../shared/types/types'

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
