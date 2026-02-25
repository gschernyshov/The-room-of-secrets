import { Request, Response, NextFunction } from 'express'
import { jwtStrategy } from '../strategies/jwt.strategy.js'

interface AuthRequest extends Request {
  user?: { id: string }
}

export const authenticateMiddleware = (
  req: Request,
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
