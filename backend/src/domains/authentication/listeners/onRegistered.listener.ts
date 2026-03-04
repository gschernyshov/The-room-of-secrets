import { USER_REGISTERED } from '../events/index.js'
import { type User } from '../../user/types/user.type.js'
import { eventBus } from '../../../infrastructure/events/eventBus.js'
import { logger } from '../../../shared/utils/logger.js'

export const setupUserRegisteredListener = () => {
  eventBus.on(USER_REGISTERED, (user: User) => {
    const { id, username, email, createdAt } = user

    /*
      EMAIL логика
    */

    logger.info(
      `Пользователь (${username}, ${email}) успешно зарегистрирован с id: ${id}`
    )
  })
}
