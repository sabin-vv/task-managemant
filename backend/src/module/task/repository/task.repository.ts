import type { ITaskRepository, TaskStatsResult } from '../interfaces/task.repository.interface'
import type { ITask } from '../types/task.types'
import Task from '../model/task.model'

export class TaskRepository implements ITaskRepository {
    async findAll(userId: string): Promise<ITask[]> {
        return Task.find({ user: userId }).sort({ createdAt: -1 })
    }

    async findById(id: string, userId: string): Promise<ITask | null> {
        return Task.findOne({ _id: id, user: userId })
    }

    async create(data: Partial<ITask>): Promise<ITask> {
        return Task.create(data)
    }

    async update(id: string, userId: string, data: Partial<ITask>): Promise<ITask | null> {
        return Task.findOneAndUpdate({ _id: id, user: userId }, data, { new: true, runValidators: true })
    }

    async delete(id: string, userId: string): Promise<ITask | null> {
        return Task.findOneAndDelete({ _id: id, user: userId })
    }

    async getStats(userId: string): Promise<TaskStatsResult> {
        const [total, byStatus, overdue] = await Promise.all([
            Task.countDocuments({ user: userId }),
            Task.aggregate([{ $match: { user: userId } }, { $group: { _id: '$status', count: { $sum: 1 } } }]),
            Task.countDocuments({
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
