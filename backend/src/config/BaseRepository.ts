import { type Model, type Document } from 'mongoose'

export class BaseRepository<T extends Document> {
    constructor(protected readonly model: Model<T>) {}

    async findOne(filter: Record<string, unknown>): Promise<T | null> {
        return this.model.findOne(filter)
    }

    async find(filter: Record<string, unknown> = {}, sort?: Record<string, 1 | -1>): Promise<T[]> {
        let query = this.model.find(filter)
        if (sort) query = query.sort(sort)
        return query
    }

    async findOneAndUpdate(filter: Record<string, unknown>, update: Record<string, unknown>): Promise<T | null> {
        return this.model.findOneAndUpdate(filter, update, { new: true, runValidators: true })
    }

    async findOneAndDelete(filter: Record<string, unknown>): Promise<T | null> {
        return this.model.findOneAndDelete(filter)
    }

    async countDocuments(filter: Record<string, unknown> = {}): Promise<number> {
        return this.model.countDocuments(filter)
    }
}
