import { Request, Response } from 'express'
import { userService } from '../services/userService.js'
import { logger } from '../../../shared/utils/logger.js'

export const authHandler = {
  registerUser: async (req: Request, res: Response) => {
    const { username, email, password } = req.body

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Все поля обязательны' })
    }

    try {
      logger.info(
        `Регистрация пользователя: ${username}, ${email}, ${password}`
      )
      const user = await userService.createUser(username, email, password)
      logger.success(
        `Пользователь: ${username}, ${email}, ${password} зарегистрирован c id: ${user.id}`
      )

      res.status(201).json({ user })
    } catch (error) {
      logger.error(
        `При регистрации пользователя: ${username}, ${email}, ${password} возникла ошибка: ${error.message}`
      )
      res.status(400).json({ error: error.message })
    }
  },
}
