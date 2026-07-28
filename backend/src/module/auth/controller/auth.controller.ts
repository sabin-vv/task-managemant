import { type Request, type Response } from 'express'
import jwt from 'jsonwebtoken'
import type { IAuthService } from '../interfaces/auth.service.interface'
import type { AuthRequest } from '../../../middleware/auth'
import { env } from '../../../config/env'

export class AuthController {
    constructor(private readonly authService: IAuthService) {}

    private setTokenCookie(res: Response, userId: string) {
        const token = jwt.sign({ userId }, env.JWT_SECRET, { expiresIn: '7d' })
        res.cookie('token', token, {
            httpOnly: true,
            secure: env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        })
    }

    async register(req: Request, res: Response) {
        try {
            const { name, email, password } = req.body
            const result = await this.authService.register(name, email, password)
            const user = result.user
            this.setTokenCookie(res, user.id)
            res.status(201).json({ user })
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Registration failed'
            res.status(400).json({ message })
        }
    }

    async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body
            const result = await this.authService.login(email, password)
            const user = result.user
            this.setTokenCookie(res, user.id)
            res.json({ user })
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Login failed'
            res.status(400).json({ message })
        }
    }

    async me(req: AuthRequest, res: Response) {
        try {
            const result = await this.authService.me(req.userId!)
            res.json(result)
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Not authenticated'
            res.status(401).json({ message })
        }
    }

    async logout(_req: Request, res: Response) {
        res.clearCookie('token', {
            httpOnly: true,
            secure: env.NODE_ENV === 'production',
            sameSite: 'lax',
        })
        res.json({ message: 'Logged out' })
    }
}
