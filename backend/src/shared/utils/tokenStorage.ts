import { createClient } from 'redis'
import { logger } from './logger.js'
import { TOKEN_CONFIG } from './config.js'
import { User } from '../../domains/user/types/user.type.js'

const TTL = TOKEN_CONFIG.REFRESH_TOKEN_TTL_SECONDS
const KEYS = {
  token: (token: string) => `token:${token}`,
  userToken: (id: User['id']) => `user-token:${id}`,
}

const client = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
})

export const connectRedis = async (): Promise<void> => {
  try {
    logger.progress('Подключение к Redis...')
    await client.connect()
    logger.success('Подключение к Redis успешно выполнено')
  } catch (error) {
    logger.error(`Ошибка подключения к Redis: ${error.message}`)
    throw error
  }
}

client.on('error', error =>
  logger.error(`Redis Client Error: ${error.message}`)
)

client.on('end', () => {
  logger.warning('Соединение с Redis закрыто. Попытка переподключения...')
  setTimeout(connectRedis, 5000)
})

export const tokenStorage = {
  async saveRefreshToken(userId: User['id'], token: string): Promise<void> {
    await client.set(KEYS.token(token), userId, { EX: TTL })
    await client.set(KEYS.userToken(userId), token, { EX: TTL })
  },

  async findRefreshToken(token: string): Promise<number | null> {
    const userId = await client.get(KEYS.token(token))
    return userId ? parseInt(userId, 10) : null
  },

  async removeRefreshToken(userId: User['id'], token: string): Promise<void> {
    await client.del(KEYS.token(token))
    await client.del(KEYS.userToken(userId))
  },

  async removeRefreshTokenByUserId(userId: User['id']): Promise<void> {
    const token = await client.get(KEYS.userToken(userId))
    token && (await client.del(KEYS.token(token)))
    await client.del(KEYS.userToken(userId))
  },
}
