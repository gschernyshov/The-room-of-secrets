import { userRepository } from '../repositories/user.repository.js'
import { USER_REGISTERED } from '../events/userRegistered.event.js'
import { USER_LOGIN } from '../events/userLogin.event.js'
import { User } from '../types/user.type.js'
import { eventBus } from '../../../infrastructure/events/eventBus.js'
import { passwordService } from '../../../shared/utils/hash.js'
import { tokenService } from '../../../shared/utils/jwt.js'
import { tokenStorage } from '../../../shared/utils/tokenStorage.js'
import { logger } from '../../../shared/utils/logger.js'
import { AppError } from '../../../shared/utils/errors.js'

export const authService = {
  registerUser: async (
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

      const { accessToken, refreshToken } = tokenService.generateTokens(user.id)
      await tokenStorage.saveRefreshToken(user.id, refreshToken)

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

  loginUser: async (email: User['email'], password: User['password']) => {
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

      const { accessToken, refreshToken } = tokenService.generateTokens(user.id)

      await tokenStorage.removeRefreshTokenByUserId(user.id)
      await tokenStorage.saveRefreshToken(user.id, refreshToken)

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

  logoutUser: async (userId: User['id'], refreshToken: string) => {
    try {
      const decodedToken = tokenService.verifyRefreshToken(refreshToken)
      if (!decodedToken) {
        throw new AppError('Неверный refresh token', 401)
      }

      const storedUserId = await tokenStorage.findRefreshToken(refreshToken)
      if (!storedUserId) {
        logger.warning(
          `Попытка выхода пользователя с id: ${userId} с несуществующим refresh token: ${refreshToken}`
        )
        return
      }

      if (userId !== storedUserId) {
        throw new AppError('Несоответствие пользователя и токена', 401)
      }

      await tokenStorage.removeRefreshToken(userId, refreshToken)

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

  refreshToken: async (refreshToken: string) => {
    try {
      const decodedToken = tokenService.verifyRefreshToken(refreshToken)
      if (!decodedToken) {
        throw new AppError('Неверный refresh token', 401)
      }

      const storedUserId = await tokenStorage.findRefreshToken(refreshToken)
      if (!storedUserId) {
        throw new AppError(
          `Refresh token: ${refreshToken} для пользователя с id: ${decodedToken.userId} не найден или отозван`,
          403
        )
      }

      const { accessToken, refreshToken: newRefreshToken } =
        tokenService.generateTokens(storedUserId)

      await tokenStorage.removeRefreshToken(storedUserId, refreshToken)
      await tokenStorage.saveRefreshToken(storedUserId, newRefreshToken)

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
