import { Router } from 'express'
import { authHandler } from '../domains/user/handlers/auth.handler.js'

const router = Router()

router.post('/register', authHandler.registerUser)
router.post('/login', (req, res) => {})

export default router
