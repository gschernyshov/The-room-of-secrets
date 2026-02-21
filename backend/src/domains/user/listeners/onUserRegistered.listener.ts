import { USER_REGISTERED } from '../events/userRegistered.event.js'
import { eventBus } from '../../../infrastructure/events/eventBus.js'

export const setupUserRegisteredListener = () => {
  eventBus.on(USER_REGISTERED, data => {})
}
