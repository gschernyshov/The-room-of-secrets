import { Room, Message } from '../types/room.type.js'

class RoomRepository {
  private static readonly rooms = new Map<Room['id'], Omit<Room, 'id'>>()
  private static readonly messages = new Map<Room['id'], Message[]>()

  create(room: Room): void {
    const { id, ...dataRoom } = room

    RoomRepository.rooms.set(id, dataRoom)
    RoomRepository.messages.set(id, [])
  }

  findById(roomId: Room['id']): Omit<Room, 'id'> | undefined {
    return RoomRepository.rooms.get(roomId)
  }

  update(roomId: Room['id'], dataRoom: Omit<Room, 'id'>): void {
    RoomRepository.rooms.set(roomId, dataRoom)
  }

  addMessage(roomId: Room['id'], message: Message): void {
    const messages = RoomRepository.messages.get(roomId) as Message[]
    RoomRepository.messages.set(roomId, [...messages, message])
  }

  getMessages(roomId: Room['id']): Message[] {
    return RoomRepository.messages.get(roomId) as Message[]
  }
}

export const roomRepository = new RoomRepository()
