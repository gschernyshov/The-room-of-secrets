import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env') })

export const app = express()
app.use(cors({ origin: process.env.ORIGIN_CORS || 'http://localhost:3002' }))
app.use(express.json())
