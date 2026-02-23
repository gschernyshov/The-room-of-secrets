import { USER_REGISTERED } from '../events/userRegistered.event.js'
import { User } from '../types/user.type.js'
import { eventBus } from '../../../infrastructure/events/eventBus.js'
import { logger } from '../../../shared/utils/logger.js'

export const setupUserRegisteredListener = () => {
  eventBus.on(USER_REGISTERED, (user: User) => {
    const { id, username, email, createdAt } = user

    logger.info(
      `Пользователь (${username}, ${email}) успешно зарегистрирован с id: ${id}`
    )
  })
}
