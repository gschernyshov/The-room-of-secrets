import { Request } from 'express'
import { tokenService } from '../services/token.service.js'
import { TokenPayload } from '../types/token.type.js'

export const jwtStrategy = (req: Request): TokenPayload | null => {
  const authHeader = req.headers.authorization

  const token = authHeader?.split(' ')[1]
  if (!token) return null

  const tokenPayload = tokenService.verifyToken(token)
  if (tokenPayload) return tokenPayload

  return null
}
