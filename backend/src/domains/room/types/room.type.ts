import { UUID } from 'node:crypto'
import { User } from '../../user/types/user.type.js'

export type Room = {
  id: UUID
  name: string
  participants: User['id'][]
  createdAt: Date
}

export type Message = {
  id: UUID
  roomId: Room['id']
  senderId: User['id']
  content: string
  timestamp: Date
}
