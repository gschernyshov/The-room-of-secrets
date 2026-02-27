import { roomService } from '../../../domains/room/services/room.service.js'

export const roomHandler = socket => {
  socket.on('create_room', async ({ name }, callback) => {
    try {
      const userId = socket.data.user.id
      const room = roomService.createRoom(userId, name)

      await socket.join(room.id)

      if (typeof callback === 'function')
        callback({ success: true, data: room })
    } catch (error) {
      if (typeof callback === 'function')
        callback({ success: false, error: { message: error.message } })
    }
  })

  socket.on('join_room', async ({ roomId }, callback) => {
    try {
      const userId = socket.data.user.id
      const { room, messages } = roomService.joinRoom(userId, roomId)

      await socket.join(roomId)

      socket.broadcast.to(roomId).emit('user_joined', {
        userId,
        timestamp: new Date().toISOString(),
      })

      if (typeof callback === 'function')
        callback({ success: true, data: { room, messages } })
    } catch (error) {
      if (typeof callback === 'function')
        callback({ success: false, error: { message: error.message } })
    }
  })

  socket.on('send_message', async ({ roomId, content }, callback) => {
    try {
      const userId = socket.data.user.id
      const message = roomService.sendMessage(userId, roomId, content)

      socket.to(roomId).emit('new_message', message)

      if (typeof callback === 'function') callback({ success: true })
    } catch (error) {
      if (typeof callback === 'function')
        callback({ success: false, error: { message: error.message } })
    }
  })
}
