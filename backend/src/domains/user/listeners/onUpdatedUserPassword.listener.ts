import { UPDATED_PASSWORD } from '../events/index.js'
import { type User } from '../types/user.type.js'
import { eventBus } from '../../../infrastructure/events/eventBus.js'
import { logger } from '../../../shared/utils/logger.js'

export const setupUpdatedUserPasswordListener = () => {
  eventBus.on(UPDATED_PASSWORD, (user: User) => {
    const { id, username, email } = user

    /*
      EMAIL логика
    */

    logger.info(
      `Пользователь id: ${id} успешно обновил пароль: ${user.password}`
    )
  })
}
