import {
  setupUserRegisteredListener,
  setupUserLoginListener,
} from '../../../domains/authentication/listeners/index.js'
import {
  setupUpdatedUserEmailListener,
  setupUpdatedUsernameListener,
  setupUpdatedUserPasswordListener,
} from '../../../domains/user/listeners/index.js'
import { logger } from '../../../shared/utils/logger.js'

export const setupListeners = () => {
  setupUserRegisteredListener()
  setupUserLoginListener()

  setupUpdatedUsernameListener()
  setupUpdatedUserEmailListener()
  setupUpdatedUserPasswordListener()

  logger.info('Слушатели событий инициализированы')
}
