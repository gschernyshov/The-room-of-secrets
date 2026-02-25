import { body } from 'express-validator'

export const validateRegister = [
  body('username')
    .exists()
    .withMessage('Username обязателен')
    .bail()
    .trim()
    .notEmpty()
    .withMessage('Username не может быть пустым')
    .bail()
    .isLength({ min: 2 })
    .withMessage('Username должен быть не короче 2 символов'),

  body('email')
    .exists()
    .withMessage('Email обязателен')
    .bail()
    .isEmail()
    .withMessage('Некорректный email')
    .normalizeEmail(),

  body('password')
    .exists()
    .withMessage('Пароль обязателен')
    .bail()
    .trim()
    .notEmpty()
    .withMessage('Пароль не может быть пустым')
    .bail()
    .isLength({ min: 6 })
    .withMessage('Пароль должен быть не менее 6 символов'),
]
