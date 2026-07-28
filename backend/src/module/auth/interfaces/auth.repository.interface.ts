import type { IUser } from '../types/user.types'

export interface IAuthRepository {
    findByEmail(email: string): Promise<IUser | null>
    findById(id: string): Promise<IUser | null>
    create(data: { name: string; email: string; password: string }): Promise<IUser>
}
