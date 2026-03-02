export type SocketCallback<T = unknown> = (response: {
  success: boolean
  data?: T
  error?: { message: string }
}) => void
