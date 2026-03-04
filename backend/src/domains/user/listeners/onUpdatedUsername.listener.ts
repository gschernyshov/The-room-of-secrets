import { UPDATED_USERNAME } from '../events/index.js'
import { type User } from '../types/user.type.js'
import { eventBus } from '../../../infrastructure/events/eventBus.js'
import { logger } from '../../../shared/utils/logger.js'

export const setupUpdatedUsernameListener = () => {
  eventBus.on(UPDATED_USERNAME, (user: User) => {
    const { id, username, email } = user

    /*
      EMAIL логика
    */

    logger.info(
      `Пользователь id: ${id} успешно обновил username: ${user.username}`
    )
  })
}
