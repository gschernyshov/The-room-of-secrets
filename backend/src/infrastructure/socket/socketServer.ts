import { Server } from 'socket.io'
import { createServer } from 'http'
import { roomHandler } from './handlers/room.handler.js'
import { tokenService } from '../authentication/services/token.service.js'
import { logger } from '../../shared/utils/logger.js'

export const initializeSocketServer = (
  server: ReturnType<typeof createServer>
) => {
  logger.progress('Инициализация Socket.IO сервера...')

  const io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
      credentials: true,
    },
  })

  io.on('error', error => {
    logger.error(`В Socket.IO сервере возникла ошибка : ${error}`)
  })

  io.use((socket, next) => {
    const token = socket.handshake.headers.authorization?.split(' ')[1]
    if (!token) {
      return next(new Error('Требуется аутентификация'))
    }

    const tokenPayload = tokenService.verifyToken(token)
    if (!tokenPayload) {
      return next(new Error('Требуется аутентификация'))
    }

    socket.data.user = { id: tokenPayload.userId }

    logger.info(
      `Сокет id: ${socket.id} аутентифицирован как пользователь с id: ${tokenPayload.userId}`
    )

    next()
  })

  io.on('connection', socket => {
    logger.info(
      `Пользователь с id: ${socket.data.user.id} подключился к серверу через сокет с id: ${socket.id}`
    )

    roomHandler(socket)

    socket.on('disconnect', reason => {
      logger.info(
        `Пользователь с id: ${socket.data.user.id} отключился. Причина: ${reason}. Cокет id: ${socket.id}`
      )
    })

    socket.on('error', error => {
      logger.error(
        `Ошибка сокета id: ${socket.id} пользователя с id: ${socket.data.user.id}: ${error}`
      )
    })
  })
}
