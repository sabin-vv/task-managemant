import type { ITaskRepository, TaskStatsResult } from '../interfaces/task.repository.interface'
import type { ITask } from '../types/task.types'
import Task from '../model/task.model'
import { BaseRepository } from '../../../repositories/BaseRepository'

export class TaskRepository extends BaseRepository<ITask> implements ITaskRepository {
    constructor() {
        super(Task)
    }

    async findAll(userId: string): Promise<ITask[]> {
        return this.find({ user: userId }, { createdAt: -1 })
    }

    async findById(id: string, userId: string): Promise<ITask | null> {
        return this.findOne({ _id: id, user: userId })
    }

    async update(id: string, userId: string, data: Partial<ITask>): Promise<ITask | null> {
        return this.findOneAndUpdate({ _id: id, user: userId }, data)
    }

    async delete(id: string, userId: string): Promise<ITask | null> {
        return this.findOneAndDelete({ _id: id, user: userId })
    }

    async getStats(userId: string): Promise<TaskStatsResult> {
        const [total, byStatus, overdue] = await Promise.all([
            this.countDocuments({ user: userId }),
            this.model.aggregate([{ $match: { user: userId } }, { $group: { _id: '$status', count: { $sum: 1 } } }]),
            this.countDocuments({
                user: userId,
                status: { $ne: 'completed' },
                dueDate: { $lt: new Date() },
            }),
        ])

        const statusMap: Record<string, number> = { pending: 0, 'in-progress': 0, completed: 0 }
        for (const entry of byStatus) {
            statusMap[entry._id] = entry.count
        }

        return {
            total,
            pending: statusMap.pending,
            inProgress: statusMap['in-progress'],
            completed: statusMap.completed,
            overdue,
        }
    }
}
