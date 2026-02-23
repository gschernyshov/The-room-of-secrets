import { Router } from 'express'
import { authHandler } from '../domains/user/handlers/auth.handler.js'
import { requireBody } from '../middleware/requiredBody.meddlware.js'
import { authMiddleware } from '../middleware/auth.middleware.js'

const router = Router()

router.post('/register', requireBody, authHandler.registerUser)
router.post('/login', requireBody, authHandler.loginUser)
router.post('/logout', requireBody, authMiddleware, authHandler.logoutUser)
router.post('/refresh', requireBody, authHandler.refreshToken)

router.get('/state', authMiddleware, (_, res) => {
  return res.status(401).json({ message: 'Пользователь авторизован' })
})

export default router
