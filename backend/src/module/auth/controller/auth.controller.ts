import { type Request, type Response } from 'express'
import jwt from 'jsonwebtoken'
import type { IAuthService } from '../interfaces/auth.service.interface'
import type { AuthRequest } from '../../../middleware/auth'
import { env } from '../../../config/env'
import { HTTP_STATUS } from '../../../constants/http-status'
import { AUTH_MESSAGES } from '../../../constants/messages'
import { ResponseHelper } from '../../../utils/ResponseHelper'

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
        const { name, email, password } = req.body
        const result = await this.authService.register(name, email, password)
        this.setTokenCookie(res, result.user.id)
        ResponseHelper.success(res, { user: result.user }, HTTP_STATUS.CREATED)
    }

    async login(req: Request, res: Response) {
        const { email, password } = req.body
        const result = await this.authService.login(email, password)
        this.setTokenCookie(res, result.user.id)
        ResponseHelper.success(res, { user: result.user })
    }

    async me(req: AuthRequest, res: Response) {
        const result = await this.authService.me(req.userId!)
        ResponseHelper.success(res, result)
    }

    async logout(_req: Request, res: Response) {
        res.clearCookie('token', {
            httpOnly: true,
            secure: env.NODE_ENV === 'production',
            sameSite: 'lax',
        })
        ResponseHelper.success(res, { message: AUTH_MESSAGES.LOGGED_OUT })
    }
}
