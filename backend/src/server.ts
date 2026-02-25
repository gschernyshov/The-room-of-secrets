import http from 'http'
import { app } from './app.js'
import { db, runMigrations, redis } from './infrastructure/database/index.js'
import { setupListeners } from './infrastructure/events/listeners/setupListeners.js'
import { logger } from './shared/utils/logger.js'

const server = http.createServer(app)

const PORT = process.env.PORT || 5005

const startServer = async () => {
  logger.progress('Запуск сервера...')

  try {
    await db.connect()
    await runMigrations()
    await redis.connect()

    setupListeners()

    server.listen(PORT, () => {
      logger.success(`Сервер запущен на порту: ${PORT}`)
    })
  } catch (error) {
    logger.error(`Критическая ошибка при запуске сервера: ${error.message}`)
    process.exit(1)
  }
}

startServer()
