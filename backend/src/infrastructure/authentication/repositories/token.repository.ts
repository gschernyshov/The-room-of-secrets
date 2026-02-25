import { redis } from '../../database/redis.client.js'
import { User } from '../../../domains/user/types/user.type.js'
import { parseTTL } from '../../../shared/utils/parseTTL.js'

const REFRESH_TOKEN_EXPIRES_IN = process.env.JWT_REFRESH_TOKEN_EXPIRES_IN

export class TokenRepository {
  private static readonly TTL = parseTTL(REFRESH_TOKEN_EXPIRES_IN)
  private static readonly KEYS = {
    token: (token: string) => `token:${token}`,
    userToken: (id: User['id']) => `user-token:${id}`,
  }

  private static get client() {
    return redis.getClient()
  }

  async saveRefreshToken(
    userId: User['id'],
    refreshToken: string
  ): Promise<void> {
    await TokenRepository.client.set(
      TokenRepository.KEYS.userToken(userId),
      refreshToken,
      {
        EX: TokenRepository.TTL,
      }
    )
    await TokenRepository.client.set(
      TokenRepository.KEYS.token(refreshToken),
      userId,
      {
        EX: TokenRepository.TTL,
      }
    )
  }

  async findRefreshToken(refreshToken: string): Promise<User['id'] | null> {
    const userId = await TokenRepository.client.get(
      TokenRepository.KEYS.token(refreshToken)
    )
    return userId ? parseInt(userId, 10) : null
  }

  async removeRefreshToken(
    userId: User['id'],
    refreshToken: string
  ): Promise<void> {
    await TokenRepository.client.del(TokenRepository.KEYS.userToken(userId))
    await TokenRepository.client.del(TokenRepository.KEYS.token(refreshToken))
  }

  async removeRefreshTokenByUserId(userId: User['id']): Promise<void> {
    const refreshToken = await TokenRepository.client.get(
      TokenRepository.KEYS.userToken(userId)
    )
    if (refreshToken) {
      await this.removeRefreshToken(userId, refreshToken)
    }
  }
}

export const tokenRepository = new TokenRepository()
