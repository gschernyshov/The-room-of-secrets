import { randomUUID } from 'crypto'
import { ROOM_CREATED, ROOM_JOINED } from '../events/index.js'
import { roomRepository } from '../repositories/room.repository.js'
import { Message, Room } from '../types/room.type.js'
import { User } from '../../user/types/user.type.js'
import { eventBus } from '../../../infrastructure/events/eventBus.js'
import { AppError } from '../../../shared/utils/errors.js'

export const roomService = {
  createRoom: (creatorId: User['id'], name: Room['name']) => {
    const room: Room = {
      id: randomUUID(),
      name,
      participants: [creatorId],
      createdAt: new Date(),
    }

    roomRepository.create(room)

    // eventBus.emit(ROOM_CREATED, room)

    return room
  },

  joinRoom: (userId: User['id'], roomId: Room['id']) => {
    try {
      const room = roomRepository.findById(roomId)
      if (!room) {
        throw new AppError(`Комната не найдена`)
      }
      if (!room.participants.includes(userId)) {
        roomRepository.update(roomId, {
          ...room,
          participants: [...room.participants, userId],
        })

        // eventBus.emit(ROOM_JOINED, { userId, roomId })
      }

      const messages = roomRepository.getMessages(roomId)

      return { room, messages }
    } catch (error) {
      if (error instanceof AppError) {
        throw error
      }

      throw new Error(
        'При попытке присоединения к комнате возникла непредвиденная ошибка'
      )
    }
  },

  sendMessage: (
    senderId: User['id'],
    roomId: Room['id'],
    content: Message['content']
  ) => {
    const message: Message = {
      id: randomUUID(),
      roomId,
      senderId,
      content,
      timestamp: new Date(),
    }

    roomRepository.addMessage(roomId, message)

    return message
  },
}
