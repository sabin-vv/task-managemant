import { type Request, type Response } from 'express'
import type { ITaskService } from '../interfaces/task.service.interface'
import type { AuthRequest } from '../../../middleware/auth'
import { HTTP_STATUS } from '../../../constants/http-status'
import { AUTH_MESSAGES, RESPONSE_MESSAGES, TASK_MESSAGES } from '../../../constants/messages'
import { ResponseHelper } from '../../../utils/ResponseHelper'
import { AppError } from '../../../errors/AppError'

export class TaskController {
    constructor(private readonly taskService: ITaskService) {}

    private getUserId(req: Request): string {
        const { userId } = req as AuthRequest
        if (!userId) {
            throw new AppError(AUTH_MESSAGES.AUTH_REQUIRED, HTTP_STATUS.UNAUTHORIZED)
        }
        return userId
    }

    async getStats(req: Request, res: Response) {
        const userId = this.getUserId(req)
        const stats = await this.taskService.getStats(userId)
        ResponseHelper.success(res, stats)
    }

    async getAll(req: Request, res: Response) {
        const userId = this.getUserId(req)
        const tasks = await this.taskService.getAll(userId)
        ResponseHelper.success(res, tasks)
    }

    async create(req: Request, res: Response) {
        const userId = this.getUserId(req)
        const { title, description, status, dueDate } = req.body
        const task = await this.taskService.create(userId, { title, description, status, dueDate })
        ResponseHelper.success(res, task, RESPONSE_MESSAGES.CREATED, HTTP_STATUS.CREATED)
    }

    async update(req: Request, res: Response) {
        const userId = this.getUserId(req)
        const task = await this.taskService.update(String(req.params.id), userId, req.body)
        ResponseHelper.success(res, task)
    }

    async delete(req: Request, res: Response) {
        const userId = this.getUserId(req)
        await this.taskService.delete(String(req.params.id), userId)
        ResponseHelper.success(res, null, TASK_MESSAGES.DELETED)
    }
}