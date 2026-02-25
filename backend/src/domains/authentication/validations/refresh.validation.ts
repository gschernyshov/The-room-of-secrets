import { body } from 'express-validator'

export const validateRefresh = [
  body('refreshToken')
    .exists()
    .withMessage('Refresh token обязателен')
    .bail()
    .trim()
    .notEmpty()
    .withMessage('Refresh token не может быть пустым'),
]
