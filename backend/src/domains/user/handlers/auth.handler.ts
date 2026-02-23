import { Request, Response } from 'express'
import { authService } from '../services/auth.service.js'

export const authHandler = {
  registerUser: async (req: Request, res: Response) => {
    const { username, email, password } = req.body

    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        error: { message: 'Все поля обязательны' },
      })
    }

    try {
      const result = await authService.registerUser(username, email, password)

      res.status(201).json({
        success: true,
        data: result,
      })
    } catch (error) {
      res
        .status(error.statusCode)
        .json({ success: false, error: { message: error.message } })
    }
  },

  loginUser: async (req: Request, res: Response) => {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: { message: 'Email и пароль обязательны' },
      })
    }

    try {
      const result = await authService.loginUser(email, password)

      res.status(200).json({
        success: true,
        data: result,
      })
    } catch (error) {
      res
        .status(error.statusCode)
        .json({ success: false, error: { message: error.message } })
    }
  },

  logoutUser: async (req: Request, res: Response) => {
    const userId = req.userId
    const refreshToken = req.body.refreshToken

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        error: { message: 'Refresh token отсутствует' },
      })
    }

    try {
      await authService.logoutUser(userId, refreshToken)

      return res.status(200).json({ success: true })
    } catch (error) {
      res
        .status(error.statusCode)
        .json({ success: false, error: { message: error.message } })
    }
  },

  refreshToken: async (req: Request, res: Response) => {
    const refreshToken = req.body.refreshToken

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        error: { message: 'Refresh token отсутствует' },
      })
    }

    try {
      await authService.refreshToken(refreshToken)

      return res.status(200).json({ success: true })
    } catch (error) {
      res
        .status(error.statusCode)
        .json({ success: false, error: { message: error.message } })
    }
  },
}
