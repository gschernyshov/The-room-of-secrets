import { USER_LOGIN } from '../events/index.js'
import { type User } from '../../user/types/user.type.js'
import { eventBus } from '../../../infrastructure/events/eventBus.js'
import { logger } from '../../../shared/utils/logger.js'

export const setupUserLoginListener = () => {
  eventBus.on(USER_LOGIN, (user: User) => {
    const { id, username, email, createdAt } = user

    /*
      EMAIL логика
    */

    logger.info(`Пользователь id: ${id} успешно авторизован`)
  })
}
