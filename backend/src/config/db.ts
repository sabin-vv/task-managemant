import mongoose from 'mongoose'
import dns from 'node:dns'
import { env } from './env'

dns.setServers(['8.8.8.8', '8.8.4.4'])

export const connectDB = async () => {
    try {
        await mongoose.connect(env.MONGO_URI)
    } catch (error) {
        console.error('Mongo Connection Failed', error)
    }
}
