import jwt from 'jsonwebtoken'
import { env } from './env'

export function signAccessToken(userId: string): string {
    return jwt.sign({ userId }, env.JWT_SECRET, { expiresIn: '15m' })
}

export function signRefreshToken(userId: string): string {
    return jwt.sign({ userId }, env.JWT_SECRET, { expiresIn: '7d' })
}

export function verifyToken(token: string): { userId: string } {
    return jwt.verify(token, env.JWT_SECRET) as { userId: string }
}
