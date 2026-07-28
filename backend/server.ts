import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import { createServer } from 'http'
import { connectDB } from './src/config/db'
import { env } from './src/config/env'
import { initSocket } from './src/config/socket'
import authRoutes from './src/module/auth/routes/auth'
import taskRoutes from './src/module/task/routes/task.routes'
import { errorHandler } from './src/middleware/errorHandler'

const app = express()
const httpServer = createServer(app)
const PORT = env.PORT
connectDB()

initSocket(httpServer)

app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:4173'],
    credentials: true,
}))
app.use(express.json())
app.use(cookieParser())
app.use('/api/auth', authRoutes)
app.use('/api/tasks', taskRoutes)
app.use(errorHandler)

httpServer.listen(PORT, () => {
    console.log(`server started at ${PORT}`)
})
