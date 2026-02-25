import { tokenService } from './token.service.js'
import { tokenRepository } from '../repositories/token.repository.js'
import { User } from '../../../domains/user/types/user.type.js'
import { logger } from '../../../shared/utils/logger.js'
import { AppError } from '../../../shared/utils/errors.js'

type CreateSessionResult = Record<'accessToken' | 'refreshToken', string>
type RefreshSessionResult = Record<'accessToken' | 'newRefreshToken', string>

export const sessionService = {
  createSession: async (userId: User['id']): Promise<CreateSessionResult> => {
    const { accessToken, refreshToken } = tokenService.generateTokens(userId)

    await tokenRepository.removeRefreshTokenByUserId(userId)
    await tokenRepository.saveRefreshToken(userId, refreshToken)

    return { accessToken, refreshToken }
  },

  invalidateSession: async (
    userId: User['id'],
    refreshToken: string
  ): Promise<void> => {
    const tokenPayload = tokenService.verifyRefreshToken(refreshToken)
    if (!tokenPayload) {
      throw new AppError('Неверный refresh token', 401)
    }

    const storedUserId = await tokenRepository.findRefreshToken(refreshToken)
    if (!storedUserId) {
      logger.warning(
        `Попытка выхода пользователя с id: ${userId} с несуществующим refresh token: ${refreshToken}`
      )
      return
    }

    if (userId !== storedUserId) {
      throw new AppError('Несоответствие пользователя и токена', 401)
    }

    await tokenRepository.removeRefreshToken(userId, refreshToken)
  },

  refreshSession: async (
    refreshToken: string
  ): Promise<RefreshSessionResult> => {
    const tokenPayload = tokenService.verifyRefreshToken(refreshToken)
    if (!tokenPayload) {
      throw new AppError('Неверный refresh token', 401)
    }

    const storedUserId = await tokenRepository.findRefreshToken(refreshToken)
    if (!storedUserId) {
      logger.warning(
        `Refresh token: ${refreshToken} для пользователя с id: ${tokenPayload.userId} не найден или отозван`
      )
      throw new AppError('Неверный refresh token', 401)
    }

    if (tokenPayload.userId !== storedUserId) {
      logger.warning(
        `Рассогласование: токен для userId=${tokenPayload.userId}, но найден в Redis как для userId=${storedUserId}`
      )
      throw new AppError('Неверный refresh token', 401)
    }

    const { accessToken, refreshToken: newRefreshToken } =
      tokenService.generateTokens(storedUserId)

    await tokenRepository.removeRefreshToken(storedUserId, refreshToken)
    await tokenRepository.saveRefreshToken(storedUserId, newRefreshToken)

    return { accessToken, newRefreshToken }
  },
}
