import { type Request, type Response } from 'express'
import type { IAuthService } from '../interfaces/auth.service.interface'

export class AuthController {
    constructor(private readonly authService: IAuthService) {}

    async register(req: Request, res: Response) {
        try {
            const { name, email, password } = req.body
            const result = await this.authService.register(name, email, password)
            res.status(201).json(result)
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Registration failed'
            res.status(400).json({ message })
        }
    }

    async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body
            const result = await this.authService.login(email, password)
            res.json(result)
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Login failed'
            res.status(400).json({ message })
        }
    }
}
