import type { IAuthRepository } from '../interfaces/auth.repository.interface'
import type { IUser } from '../../user/types/user.types'
import User from '../../user/models/user.model'
import { BaseRepository } from '../../../repositories/BaseRepository'

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
}
