import { mkdirSync, existsSync, appendFile } from 'fs'
import { join } from 'path'

type Color = 'reset' | 'green' | 'yellow' | 'blue' | 'red' | 'magenta'

class Logger {
  private static readonly colors: Record<Color, string> = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    red: '\x1b[31m',
    magenta: '\x1b[35m',
  }

  private isDevelopment: boolean
  private readonly logFile: string

  constructor() {
    this.isDevelopment = process.env.NODE_ENV === 'development'

    const logsDir = join(process.cwd(), 'logs')

    if (!existsSync(logsDir)) {
      mkdirSync(logsDir, { recursive: true })
    }

    this.logFile = join(logsDir, 'app.log')
  }

  private writeLog(level: string, message: string) {
    const timestamp = new Date().toLocaleString()
    const logEntry = `[${timestamp}] ${level}: ${message}\n`
    appendFile(this.logFile, logEntry, 'utf-8', _ => {})
  }

  private logToConsole(color: string, message: string) {
    if (this.isDevelopment)
      console.log(`${color}${message}${Logger.colors.reset}`)
  }

  progress(msg: string) {
    this.logToConsole(Logger.colors.magenta, msg)
    this.writeLog('PROGRESS', msg)
  }

  info(msg: string) {
    this.logToConsole(Logger.colors.blue, msg)
    this.writeLog('INFO', msg)
  }

  success(msg: string) {
    this.logToConsole(Logger.colors.green, msg)
    this.writeLog('SUCCESS', msg)
  }

  warning(msg: string) {
    this.logToConsole(Logger.colors.yellow, msg)
    this.writeLog('WARNING', msg)
  }

  error(msg: string) {
    this.logToConsole(Logger.colors.red, msg)
    this.writeLog('ERROR', msg)
  }
}

export const logger = new Logger()
