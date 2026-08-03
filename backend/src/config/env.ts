import type { StringValue } from 'ms'

export const env = {
    MONGO_URI: process.env.MONGO_URI || '',
    PORT: process.env.PORT || '3000',
    JWT_SECRET: process.env.JWT_SECRET || 'fallback-secret-change-in-production',
    NODE_ENV: process.env.NODE_ENV || 'development',
    ACCESS_TOKEN_EXPIRY: (process.env.ACCESS_TOKEN_EXPIRY || '15m') as StringValue,
    REFRESH_TOKEN_EXPIRY: (process.env.REFRESH_TOKEN_EXPIRY || '7d') as StringValue,
    REFRESH_COOKIE_MAX_AGE: Number(process.env.REFRESH_COOKIE_MAX_AGE) || 7 * 24 * 60 * 60 * 1000,
}
