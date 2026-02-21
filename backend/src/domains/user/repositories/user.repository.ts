import { User } from '../types/user.type.js'
import { db } from '../../../infrastructure/database/client.js'

class UserRepository {
  private static readonly userSelect = `
    id,
    username,
    email,
    created_at AS createdAt
  `
  async createUser(
    username: string,
    email: string,
    hashedPassword: string
  ): Promise<User> {
    const [user] = await db.query<User>(
      `INSERT INTO users (username, email, password)
       VALUES ($1, $2, $3) RETURNING ${UserRepository.userSelect}`,
      [username, email, hashedPassword]
    )
    return user
  }

  async findUserByEmail(email: string): Promise<User | null> {
    const [user] = await db.query<User>(
      `SELECT ${UserRepository.userSelect} FROM users WHERE email = $1`,
      [email]
    )
    return user ?? null
  }

  async findUserByUsername(username: string): Promise<User | null> {
    const [user] = await db.query<User>(
      `SELECT ${UserRepository.userSelect} FROM users WHERE username = $1`,
      [username]
    )
    return user ?? null
  }

  async updateUsername(id: number, username: string): Promise<void> {
    await db.query(`UPDATE users SET username = $1 WHERE id = $2`, [
      username,
      id,
    ])
  }

  async updateEmail(id: number, email: string): Promise<void> {
    await db.query(`UPDATE users SET email = $1 WHERE id = $2 `, [email, id])
  }

  async updatePassword(id: number, password: string): Promise<void> {
    await db.query(`UPDATE users SET password = $1 WHERE id = $2`, [
      password,
      id,
    ])
  }
}

export const userRepository = new UserRepository()
