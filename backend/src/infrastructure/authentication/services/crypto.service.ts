import bcrypt from 'bcrypt'

const SALT_ROUNDS = 10

export const passwordService = {
  hashPassword: (password: string): Promise<string> => {
    return bcrypt.hash(password, SALT_ROUNDS)
  },

  comparePassword: (
    password: string,
    hashedPassword: string
  ): Promise<boolean> => {
    return bcrypt.compare(password, hashedPassword)
  },
}
