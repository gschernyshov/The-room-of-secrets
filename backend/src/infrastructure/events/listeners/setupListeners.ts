import { setupUserRegisteredListener } from '../../../domains/user/listeners/onUserRegistered.listener.js'
import { setupUserLoginListener } from '../../../domains/user/listeners/onUserLogin.listener.js'
import { logger } from '../../../shared/utils/logger.js'

export const setupListeners = () => {
  setupUserRegisteredListener()
  setupUserLoginListener()

  logger.info('Слушатели событий инициализированы')
}
