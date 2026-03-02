import { USER_LOGIN } from '../events/login.event.js'
import { type User } from '../../user/types/user.type.js'
import { eventBus } from '../../../infrastructure/events/eventBus.js'
import { logger } from '../../../shared/utils/logger.js'

export const setupUserLoginListener = () => {
  eventBus.on(USER_LOGIN, (user: User) => {
    const { id, username, email, createdAt } = user

    logger.info(`Пользователь id: ${id} успешно авторизован`)
  })
}
