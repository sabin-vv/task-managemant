import type { ITask } from '../types/task.types'
import type { TaskStatsResult } from './task.repository.interface'

export interface ITaskService {
    getAll(userId: string): Promise<ITask[]>
    create(
        userId: string,
        data: { title: string; description?: string; status?: string; dueDate?: string },
    ): Promise<ITask>
    update(id: string, userId: string, data: Partial<ITask>): Promise<ITask>
    delete(id: string, userId: string): Promise<void>
    getStats(userId: string): Promise<TaskStatsResult>
}
