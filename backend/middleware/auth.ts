import { type Request, type Response, type NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { env } from '../config/env'

export interface AuthRequest extends Request {
    userId?: string
}

interface JwtPayload {
    userId: string
}

export function authenticate(req: AuthRequest, res: Response, next: NextFunction) {
    const header = req.headers.authorization
    if (!header || !header.startsWith('Bearer ')) {
        res.status(401).json({ message: 'Authentication required' })
        return
    }

    const token = header.split(' ')[1]

    try {
        const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload
        req.userId = decoded.userId
        next()
    } catch {
        res.status(401).json({ message: 'Invalid or expired token' })
    }
}
