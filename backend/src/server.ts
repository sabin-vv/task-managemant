import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import { createServer } from 'http'
import { connectDB } from './config/db'
import { env } from './config/env'
import { initSocket } from './config/socket'
import authRoutes from './module/auth/routes/auth'
import taskRoutes from './module/task/routes/task.routes'
import { errorHandler } from './middleware/errorHandler'

const app = express()
const httpServer = createServer(app)
const PORT = env.PORT
connectDB()

initSocket(httpServer)

app.use((_req, res, next) => {
    res.setHeader('Access-Control-Allow-Private-Network', 'true')
    next()
})

app.use(
    cors({
        origin: [
            'http://localhost:5173',
            'https://task-managemant.vercel.app',
            'https://task-managemant-t1pd.vercel.app',
        ],
        credentials: true,
    }),
)
app.use(express.json())
app.use(cookieParser())
app.use('/api/auth', authRoutes)
app.use('/api/tasks', taskRoutes)
app.use(errorHandler)

httpServer.listen(PORT, () => {
    console.log(`server started at ${PORT}`)
})
