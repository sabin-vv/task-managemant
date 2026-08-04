import type { ITask } from '../types/task.types'

export interface TaskStatsResult {
    total: number
    pending: number
    completed: number
    overdue: number
}

export interface CreateTaskData {
    title: string
    description?: string
    status?: ITask['status']
    dueDate?: Date
    user: string
}

export interface ITaskRepository {
    findAll(userId: string): Promise<ITask[]>
    findById(id: string, userId: string): Promise<ITask | null>
    create(data: CreateTaskData): Promise<ITask>
    update(id: string, userId: string, data: Partial<ITask>): Promise<ITask | null>
    delete(id: string, userId: string): Promise<ITask | null>
    getStats(userId: string): Promise<TaskStatsResult>
}
