import express from 'express'
import { connectDB } from './config/db'
import { env } from './config/env'
import authRoutes from './auth/routes/auth'
import taskRoutes from './task/routes/task.routes'

const app = express()
const PORT = env.PORT
connectDB()

app.use(express.json())
app.use('/api/auth', authRoutes)
app.use('/api/tasks', taskRoutes)

app.listen(PORT, () => {
    console.log(`server started at ${PORT}`)
})
