import { userRepository } from '../repositories/user.repository.js'
import { USER_REGISTERED } from '../events/userRegistered.event.js'
import { eventBus } from '../../../infrastructure/events/eventBus.js'
import { logger } from '../../../shared/utils/logger.js'
// import { hashPassword } from '../../../shared/utils/hash.js'

export const userService = {
  createUser: async (username: string, email: string, password: string) => {
    const existingUser = await userRepository.findUserByEmail(email)
    if (existingUser) {
      throw new Error('Пользователь с таким email уже существует')
    }

    // const hashedPassword = await hashPassword(password)
    // const user = await userRepository.createUser(username, email, hashedPassword)
    const user = await userRepository.createUser(username, email, password)

    eventBus.emit(USER_REGISTERED, user.id)

    return user
  },
}
