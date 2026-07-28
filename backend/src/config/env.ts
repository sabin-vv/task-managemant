export const env = {
    MONGO_URI: process.env.MONGO_URI || '',
    PORT: process.env.PORT || '3000',
    JWT_SECRET: process.env.JWT_SECRET || 'fallback-secret-change-in-production',
    NODE_ENV: process.env.NODE_ENV || 'development',
}
