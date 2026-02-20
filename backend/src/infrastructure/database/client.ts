import { Pool } from 'pg'
import { logger } from '../../shared/utils/logger.js'

const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5445', 10),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
})

export const db = {
  connection: async () => {
    logger.progress('Подключение к БД...')

    try {
      await pool.connect()
      logger.success('Подключение к БД успешно выполнено')
    } catch (error) {
      logger.error(`Ошибка подключения к БД: ${error.message}`)
      throw error
    }
  },
  query: async (text, params?) => {
    try {
      const result = await pool.query(text, params)
      return result
    } catch (error) {
      throw error
    }
  },
}
