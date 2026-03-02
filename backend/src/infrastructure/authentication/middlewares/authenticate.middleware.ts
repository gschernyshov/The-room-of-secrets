import { Request, Response, NextFunction } from 'express'
import { jwtStrategy } from '../strategies/jwt.strategy.js'
import { type User } from '../../../domains/user/types/user.type.js'

interface AuthRequest extends Request {
  user?: { id: User['id'] }
}

export const authenticateMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const tokenPayload = jwtStrategy(req)

  if (!tokenPayload) {
    return res.status(401).json({
      success: false,
      error: { message: 'Требуется аутентификация' },
    })
  }

  req.user = { id: tokenPayload.userId }

  next()
}
