import { randomUUID } from 'crypto'
import { messageRepository } from '../repositories/message.repository.js'
import { type Message } from '../types/message.type.js'
import { type User } from '../../user/types/user.type.js'
import { type Room } from '../../room/types/room.type.js'
import { logger } from '../../../shared/utils/logger.js'
import { AppError } from '../../../shared/utils/errors.js'

export const messageService = {
  send: async (
    roomId: Room['id'],
    senderId: User['id'],
    content: Message['content']
  ): Promise<Message> => {
    try {
      const message: Message = {
        id: randomUUID(),
        roomId,
        senderId,
        content,
        timestamp: new Date(),
      }

      await messageRepository.add(message)

      return message
    } catch (error) {
      logger.error(`При отправке сообщения возникла ошибка: ${error.message}`)

      throw new AppError(
        'При отправке сообщения возникла непредвиденная ошибка',
        500
      )
    }
  },
}
