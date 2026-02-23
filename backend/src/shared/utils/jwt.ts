import jwt from 'jsonwebtoken'
import { TOKEN_CONFIG } from './config.js'

const ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_TOKEN_SECRET
const REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_TOKEN_SECRET
const ACCESS_TOKEN_EXPIRES_IN = TOKEN_CONFIG.ACCESS_TOKEN_EXPIRES_IN
const REFRESH_TOKEN_EXPIRES_IN = TOKEN_CONFIG.REFRESH_TOKEN_EXPIRES_IN

export const tokenService = {
  generateTokens(userId: number) {
    const accessToken = jwt.sign({ userId }, ACCESS_TOKEN_SECRET, {
      expiresIn: ACCESS_TOKEN_EXPIRES_IN,
    })

    const refreshToken = jwt.sign({ userId }, REFRESH_TOKEN_SECRET, {
      expiresIn: REFRESH_TOKEN_EXPIRES_IN,
    })

    return { accessToken, refreshToken }
  },

  verifyToken(token: string) {
    try {
      return jwt.verify(token, ACCESS_TOKEN_SECRET)
    } catch (_) {
      return null
    }
  },

  verifyRefreshToken(token: string) {
    try {
      return jwt.verify(token, REFRESH_TOKEN_SECRET)
    } catch (_) {
      return null
    }
  },
}
