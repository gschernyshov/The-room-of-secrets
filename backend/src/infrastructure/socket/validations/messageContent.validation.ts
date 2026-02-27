import { Message } from '../../../domains/room/types/room.type.js'

export const isValidMessageContent = (
  content: unknown
): content is Message['content'] =>
  typeof content === 'string' && content.trim().length > 0
