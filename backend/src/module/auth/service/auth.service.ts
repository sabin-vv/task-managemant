import type { IAuthService, AuthResult } from '../interfaces/auth.service.interface'
import type { IAuthRepository } from '../interfaces/auth.repository.interface'
import { AUTH_MESSAGES } from '../../../constants/messages'

export class AuthService implements IAuthService {
    constructor(private readonly repo: IAuthRepository) {}

    async register(name: string, email: string, password: string): Promise<AuthResult> {
        const existing = await this.repo.findByEmail(email)
        if (existing) throw new Error(AUTH_MESSAGES.EMAIL_EXISTS)

        const user = await this.repo.create({ name, email, password })

        return {
            user: { id: user._id.toString(), name: user.name, email: user.email },
        }
    }

    async login(email: string, password: string): Promise<AuthResult> {
        const user = await this.repo.findByEmail(email)
        if (!user) throw new Error(AUTH_MESSAGES.INVALID_CREDENTIALS)

        const isMatch = await user.comparePassword(password)
        if (!isMatch) throw new Error(AUTH_MESSAGES.INVALID_CREDENTIALS)

        return {
            user: { id: user._id.toString(), name: user.name, email: user.email },
        }
    }

    async me(userId: string): Promise<AuthResult> {
        const user = await this.repo.findById(userId)
        if (!user) throw new Error(AUTH_MESSAGES.USER_NOT_FOUND)

        return {
            user: { id: user._id.toString(), name: user.name, email: user.email },
        }
    }
}
