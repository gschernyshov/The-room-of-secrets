import { USER_LOGIN } from '../events/userLogin.event.js'
import { User } from '../types/user.type.js'
import { eventBus } from '../../../infrastructure/events/eventBus.js'
import { logger } from '../../../shared/utils/logger.js'

export const setupUserLoginListener = () => {
  eventBus.on(USER_LOGIN, (user: User) => {
    const { id, username, email, createdAt } = user

    logger.info(`Пользователь с id: ${id} успешно авторизован`)
  })
}
