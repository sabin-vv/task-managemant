import { type Request, type Response } from 'express'
import type { IAuthService } from '../interfaces/auth.service.interface'
import type { AuthRequest } from '../../../middleware/auth'
import { env } from '../../../config/env'
import { HTTP_STATUS } from '../../../constants/http-status'
import { AUTH_MESSAGES } from '../../../constants/messages'
import { ResponseHelper } from '../../../utils/ResponseHelper'
import { signRefreshToken, verifyToken } from '../../../config/token'

export class AuthController {
    constructor(private readonly authService: IAuthService) {}

    private setRefreshCookie(res: Response, userId: string) {
        const refreshToken = signRefreshToken(userId)
        const isProd = env.NODE_ENV === 'production'
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: isProd,
            sameSite: isProd ? 'none' : 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: '/api/auth',
        })
    }

    async register(req: Request, res: Response) {
        const { name, email, password } = req.body
        const result = await this.authService.register(name, email, password)
        this.setRefreshCookie(res, result.user.id)
        ResponseHelper.success(res, { user: result.user, accessToken: result.accessToken }, HTTP_STATUS.CREATED)
    }

    async login(req: Request, res: Response) {
        const { email, password } = req.body
        const result = await this.authService.login(email, password)
        this.setRefreshCookie(res, result.user.id)
        ResponseHelper.success(res, { user: result.user, accessToken: result.accessToken })
    }

    async me(req: AuthRequest, res: Response) {
        const result = await this.authService.me(req.userId!)
        ResponseHelper.success(res, result)
    }

    async refresh(req: Request, res: Response) {
        const token = req.cookies?.refreshToken
        if (!token) {
            ResponseHelper.error(res, AUTH_MESSAGES.AUTH_REQUIRED, HTTP_STATUS.UNAUTHORIZED)
            return
        }

        try {
            const { userId } = verifyToken(token)
            const result = await this.authService.refreshToken(userId)
            ResponseHelper.success(res, result)
        } catch {
            ResponseHelper.error(res, AUTH_MESSAGES.INVALID_TOKEN, HTTP_STATUS.UNAUTHORIZED)
        }
    }

    async logout(_req: Request, res: Response) {
        const isProd = env.NODE_ENV === 'production'
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: isProd,
            sameSite: isProd ? 'none' : 'lax',
            path: '/api/auth',
        })
        ResponseHelper.success(res, { message: AUTH_MESSAGES.LOGGED_OUT })
    }
}
