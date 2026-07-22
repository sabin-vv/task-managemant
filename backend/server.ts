import express from 'express'
import { connectDB } from './config/db'
import { env } from './config/env'

const app = express()
const PORT = env.PORT
connectDB()

app.listen(PORT, () => {
    console.log(`server started at ${PORT}`)
})
