import type { ITaskService } from '../interfaces/task.service.interface'
import type { ITaskRepository, TaskStatsResult } from '../interfaces/task.repository.interface'
import type { ITask } from '../types/task.types'
import { getIO } from '../../../config/socket'
import { HTTP_STATUS } from '../../../constants/http-status'
import { TASK_MESSAGES } from '../../../constants/messages'
import { AppError } from '../../../errors/AppError'
import mongoose from 'mongoose'

export class TaskService implements ITaskService {
    constructor(private readonly _repo: ITaskRepository) {}

    async getAll(userId: string): Promise<ITask[]> {
        return this._repo.findAll(userId)
    }

    async create(
        userId: string,
        data: { title: string; description?: string; status?: string; dueDate?: string },
    ): Promise<ITask> {
        const task = await this._repo.create({
            title: data.title,
            description: data.description,
            status: data.status as ITask['status'],
            dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
            user: new mongoose.Types.ObjectId(userId),
        })
        getIO().to(userId).emit('task:created', task)
        return task
    }

    async update(id: string, userId: string, data: Partial<ITask>): Promise<ITask> {
        const task = await this._repo.update(id, userId, data)
        if (!task) throw new AppError(TASK_MESSAGES.NOT_FOUND, HTTP_STATUS.NOT_FOUND)
        getIO().to(userId).emit('task:updated', task)
        return task
    }

    async delete(id: string, userId: string): Promise<void> {
        const task = await this._repo.delete(id, userId)
        if (!task) throw new AppError(TASK_MESSAGES.NOT_FOUND, HTTP_STATUS.NOT_FOUND)
        getIO().to(userId).emit('task:deleted', task._id)
    }

    async getStats(userId: string): Promise<TaskStatsResult> {
        return this._repo.getStats(userId)
    }
}
