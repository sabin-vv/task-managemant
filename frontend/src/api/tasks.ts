const API_URL = 'http://localhost:3000/api/tasks'

const creds = { credentials: 'include' as const, headers: { 'Content-Type': 'application/json' } }

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
    inProgress: number
    completed: number
    overdue: number
}

export async function fetchTasks(): Promise<Task[]> {
    const res = await fetch(API_URL, creds)
    if (!res.ok) throw new Error('Failed to fetch tasks')
    return res.json()
}

export async function fetchStats(): Promise<TaskStats> {
    const res = await fetch(`${API_URL}/stats`, creds)
    if (!res.ok) throw new Error('Failed to fetch stats')
    return res.json()
}

export async function createTask(data: { title: string; description?: string; dueDate?: string }): Promise<Task> {
    const res = await fetch(API_URL, {
        method: 'POST',
        ...creds,
        body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error('Failed to create task')
    return res.json()
}

export async function updateTask(id: string, data: Partial<Task>): Promise<Task> {
    const res = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        ...creds,
        body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error('Failed to update task')
    return res.json()
}

export async function deleteTask(id: string): Promise<void> {
    const res = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        ...creds,
    })
    if (!res.ok) throw new Error('Failed to delete task')
}
