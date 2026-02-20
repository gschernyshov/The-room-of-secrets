import http from 'http'
import { app } from './app.js'
import { db } from './infrastructure/database/client.js'
import { runMigrations } from './infrastructure/database/migrate.js'
import { logger } from './shared/utils/logger.js'

const server = http.createServer(app)
const PORT = process.env.PORT || 5001

const startServer = async () => {
  logger.progress('Запуск сервера...')

  try {
    await db.connection()
    await runMigrations()

    server.listen(PORT, () => {
      logger.success(`Сервер запущен на порту ${PORT}`)
    })
  } catch (error) {
    logger.error(`Критическая ошибка при запуске сервера: ${error.message}`)
  }
}

startServer()
