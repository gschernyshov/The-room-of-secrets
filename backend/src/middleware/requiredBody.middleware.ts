import { Request, Response, NextFunction } from 'express'

export const requireBody = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.method === 'POST') {
    if (!req.body) {
      return res.status(400).json({
        success: false,
        error: { message: 'Тело запроса отсутствует или невалидно' },
      })
    }
  }
  next()
}
