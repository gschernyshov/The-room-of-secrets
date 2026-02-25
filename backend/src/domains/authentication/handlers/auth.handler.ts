import { Request, Response } from 'express'
import { authService } from '../services/auth.service.js'

export const authHandler = {
  register: async (req: Request, res: Response) => {
    const { username, email, password } = req.body

    try {
      const result = await authService.register(username, email, password)

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

  login: async (req: Request, res: Response) => {
    const { email, password } = req.body

    try {
      const result = await authService.login(email, password)

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

  logout: async (req: Request, res: Response) => {
    const userId = req.user.id
    const refreshToken = req.body.refreshToken

    try {
      await authService.logout(userId, refreshToken)

      return res.status(200).json({ success: true })
    } catch (error) {
      res
        .status(error.statusCode)
        .json({ success: false, error: { message: error.message } })
    }
  },

  refresh: async (req: Request, res: Response) => {
    const refreshToken = req.body.refreshToken

    try {
      await authService.refresh(refreshToken)

      return res.status(200).json({ success: true })
    } catch (error) {
      res
        .status(error.statusCode)
        .json({ success: false, error: { message: error.message } })
    }
  },
}
