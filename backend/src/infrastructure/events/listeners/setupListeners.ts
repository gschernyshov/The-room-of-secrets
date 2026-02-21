import { setupUserRegisteredListener } from '../../../domains/user/listeners/onUserRegistered.listener.js'
import { logger } from '../../../shared/utils/logger.js'

export const setupListeners = () => {
  setupUserRegisteredListener()

  logger.info('Слушатели событий инициализированы')
}
