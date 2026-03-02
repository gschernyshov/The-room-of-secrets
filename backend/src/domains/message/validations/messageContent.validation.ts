import { type Message } from '../types/message.type.js'

export const isValidMessageContent = (
  content: unknown
): content is Message['content'] =>
  typeof content === 'string' && content.trim().length > 0
