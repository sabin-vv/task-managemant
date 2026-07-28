import { type Request, type Response } from 'express'
import type { ITaskService } from '../interfaces/task.service.interface'
import type { AuthRequest } from '../../middleware/auth'

export class TaskController {
    constructor(private readonly taskService: ITaskService) {}

    async getStats(req: Request, res: Response) {
        try {
            const { userId } = req as AuthRequest
            if (!userId) {
                res.status(401).json({ message: 'Unauthorized' })
                return
            }
            const stats = await this.taskService.getStats(userId)
            res.json(stats)
        } catch {
            res.status(500).json({ message: 'Failed to fetch stats' })
        }
    }

    async getAll(req: Request, res: Response) {
        try {
            const { userId } = req as AuthRequest
            if (!userId) {
                res.status(401).json({ message: 'Unauthorized' })
                return
            }
            const tasks = await this.taskService.getAll(userId)
            res.json(tasks)
        } catch {
            res.status(500).json({ message: 'Failed to fetch tasks' })
        }
    }

    async create(req: Request, res: Response) {
        try {
            const { userId } = req as AuthRequest
            if (!userId) {
                res.status(401).json({ message: 'Unauthorized' })
                return
            }
            const { title, description, status, dueDate } = req.body
            const task = await this.taskService.create(userId, { title, description, status, dueDate })
            res.status(201).json(task)
        } catch {
            res.status(500).json({ message: 'Failed to create task' })
        }
    }

    async update(req: Request, res: Response) {
        try {
            const { userId } = req as AuthRequest
            if (!userId) {
                res.status(401).json({ message: 'Unauthorized' })
                return
            }
            const task = await this.taskService.update(String(req.params.id), userId, req.body)
            res.json(task)
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to update task'
            res.status(message === 'Task not found' ? 404 : 500).json({ message })
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const { userId } = req as AuthRequest
            if (!userId) {
                res.status(401).json({ message: 'Unauthorized' })
                return
            }
            await this.taskService.delete(String(req.params.id), userId)
            res.json({ message: 'Task deleted' })
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to delete task'
            res.status(message === 'Task not found' ? 404 : 500).json({ message })
        }
    }
}
