import express from 'express'
import { createServer } from 'http'
import { connectDB } from './src/config/db'
import { env } from './src/config/env'
import { initSocket } from './src/config/socket'
import authRoutes from './src/module/auth/routes/auth'
import taskRoutes from './src/module/task/routes/task.routes'

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
