import type { IAuthRepository } from '../interfaces/auth.repository.interface'
import type { IUser } from '../types/user.types'
import User from '../models/user.model'
import { BaseRepository } from '../../../config/BaseRepository'

export class AuthRepository extends BaseRepository<IUser> implements IAuthRepository {
    constructor() {
        super(User)
    }

    async findById(id: string): Promise<IUser | null> {
        return this.findOne({ _id: id })
    }

    async findByEmail(email: string): Promise<IUser | null> {
        return this.findOne({ email })
    }

    async create(data: { name: string; email: string; password: string }): Promise<IUser> {
        return this.model.create(data)
    }
}
