import type { IAuthRepository } from '../interfaces/auth.repository.interface'
import type { IUser } from '../../user/types/user.types'
import User from '../../user/models/user.model'

export class AuthRepository implements IAuthRepository {
    async findByEmail(email: string): Promise<IUser | null> {
        return User.findOne({ email })
    }

    async create(data: { name: string; email: string; password: string }): Promise<IUser> {
        return User.create(data)
    }
}
