import { USER_REGISTERED } from '../events/registered.event.js'
import { USER_LOGIN } from '../events/login.event.js'
import { userRepository } from '../../user/repositories/user.repository.js'
import { User } from '../../user/types/user.type.js'
import { sessionService } from '../../../infrastructure/authentication/services/session.service.js'
import { passwordService } from '../../../infrastructure/authentication/services/crypto.service.js'
import { eventBus } from '../../../infrastructure/events/eventBus.js'
import { logger } from '../../../shared/utils/logger.js'
import { AppError } from '../../../shared/utils/errors.js'

export const authService = {
  register: async (
    username: User['username'],
    email: User['email'],
    password: User['password']
  ) => {
    logger.info(`Регистрация пользователя (${username}, ${email})`)

    try {
      const existingUser = await userRepository.findUserByEmailOrUsername(
        email,
        username
      )
      if (existingUser) {
        throw new AppError(
          'Пользователь с таким username или email уже существует',
          409
        )
      }

      const hashedPassword = await passwordService.hashPassword(password)

      const user = await userRepository.createUser(
        username,
        email,
        hashedPassword
      )
      if (!user) {
        throw new AppError('Не удалось создать пользователя', 500)
      }

      const { accessToken, refreshToken } = await sessionService.createSession(
        user.id
      )

      eventBus.emit(USER_REGISTERED, user)

      return {
        accessToken,
        refreshToken,
        user: { id: user.id, username: user.username, email: user.email },
      }
    } catch (error) {
      logger.error(
        `При регистрации пользователя (${username}, ${email}) возникла ошибка: ${error.message.toLowerCase()}`
      )

      if (error instanceof AppError) {
        throw error
      }

      throw new AppError(
        'При регистрации пользователя возникла непредвиденная ошибка',
        500
      )
    }
  },

  login: async (email: User['email'], password: User['password']) => {
    logger.info(`Авторизация пользователя с email: ${email}`)

    try {
      const user = await userRepository.findUserByEmail(email)
      if (!user) {
        throw new AppError('Неверный email или пароль', 401)
      }

      const isPasswordValid = await passwordService.comparePassword(
        password,
        user.password
      )
      if (!isPasswordValid) {
        throw new AppError('Неверный email или пароль', 401)
      }

      const { accessToken, refreshToken } = await sessionService.createSession(
        user.id
      )

      eventBus.emit(USER_LOGIN, user)

      return {
        accessToken,
        refreshToken,
        user: { id: user.id, username: user.username, email: user.email },
      }
    } catch (error) {
      logger.error(
        `При авторизации пользователя с email: ${email} возникла ошибка: ${error.message.toLowerCase()}`
      )

      if (error instanceof AppError) {
        throw error
      }

      throw new AppError(
        'При авторизации пользователя возникла непредвиденная ошибка',
        500
      )
    }
  },

  logout: async (userId: User['id'], refreshToken: string) => {
    try {
      await sessionService.invalidateSession(userId, refreshToken)

      logger.info(`Пользователь с id: ${userId} успешно вышел`)
    } catch (error) {
      logger.error(
        `При выходе пользователя с id: ${userId} возникла ошибка: ${error.message.toLowerCase()}`
      )

      if (error instanceof AppError) {
        throw error
      }

      throw new AppError('Не удалось выйти', 500)
    }
  },

  refresh: async (refreshToken: string) => {
    try {
      const { accessToken, newRefreshToken } =
        await sessionService.refreshSession(refreshToken)

      return {
        accessToken,
        refreshToken: newRefreshToken,
      }
    } catch (error) {
      logger.error(
        `При выдаче access token и refresh token возникла ошибка: ${error.message.toLowerCase()}`
      )

      if (error instanceof AppError) {
        throw error
      }

      throw new AppError(
        'При выдаче access token и refresh token возникла непредвиденная ошибка',
        500
      )
    }
  },
}
