import express from 'express'
import { createServer } from 'http'
import { connectDB } from './config/db'
import { env } from './config/env'
import { initSocket } from './config/socket'
import authRoutes from './auth/routes/auth'
import taskRoutes from './task/routes/task.routes'

const app = express()
const httpServer = createServer(app)
const PORT = env.PORT
connectDB()

initSocket(httpServer)

app.use(express.json())
app.use('/api/auth', authRoutes)
app.use('/api/tasks', taskRoutes)

httpServer.listen(PORT, () => {
    console.log(`server started at ${PORT}`)
})
