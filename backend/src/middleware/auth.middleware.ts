import { Request, Response, NextFunction } from 'express'
import { tokenService } from '../shared/utils/jwt.js'

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization

  const token = authHeader && authHeader.split(' ')[1]
  if (!token) {
    return res.status(401).json({
      success: false,
      error: { message: 'Пользователь не авторизован' },
    })
  }

  const decodedToken = tokenService.verifyToken(token)
  if (!decodedToken) {
    return res.status(401).json({
      success: false,
      error: { message: 'Пользователь не авторизован' },
    })
  }

  req.userId = decodedToken.userId

  next()
}
