import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import authRoutes from './routes/auth.routes.js'

export const app = express()

// app.use(cors({ origin: process.env.ORIGIN_CORS || 'http://localhost:3003' }))
app.use(cors())
app.use(express.json({ limit: '10mb' }))

app.use('/api/auth', authRoutes)
