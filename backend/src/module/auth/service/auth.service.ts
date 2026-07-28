import jwt from 'jsonwebtoken'
import type { IAuthService, AuthResult } from '../interfaces/auth.service.interface'
import type { IAuthRepository } from '../interfaces/auth.repository.interface'
import { env } from '../../../config/env'

export class AuthService implements IAuthService {
    constructor(private readonly repo: IAuthRepository) {}

    async register(name: string, email: string, password: string): Promise<AuthResult> {
        const existing = await this.repo.findByEmail(email)
        if (existing) throw new Error('Email already registered')

        const user = await this.repo.create({ name, email, password })

        return {
            user: { id: user._id.toString(), name: user.name, email: user.email },
        }
    }

    async login(email: string, password: string): Promise<AuthResult> {
        const user = await this.repo.findByEmail(email)
        if (!user) throw new Error('Invalid email or password')

        const isMatch = await user.comparePassword(password)
        if (!isMatch) throw new Error('Invalid email or password')

        return {
            user: { id: user._id.toString(), name: user.name, email: user.email },
        }
    }

    async me(userId: string): Promise<AuthResult> {
        const user = await this.repo.findById(userId)
        if (!user) throw new Error('User not found')

        return {
            user: { id: user._id.toString(), name: user.name, email: user.email },
        }
    }
}
