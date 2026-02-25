import { setupUserRegisteredListener } from '../../../domains/authentication/listeners/onRegistered.listener.js'
import { setupUserLoginListener } from '../../../domains/authentication/listeners/onLogin.listener.js'
import { logger } from '../../../shared/utils/logger.js'

export const setupListeners = () => {
  setupUserRegisteredListener()
  setupUserLoginListener()

  logger.info('Слушатели событий инициализированы')
}
