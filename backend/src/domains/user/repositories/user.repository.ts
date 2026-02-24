import { User } from '../types/user.type.js'
import { db } from '../../../infrastructure/database/client.js'

class UserRepository {
  private static readonly userSelect = `
    id,
    username,
    email,
    password,
    created_at AS createdAt
  `
  async createUser(
    username: User['username'],
    email: User['email'],
    hashedPassword: User['password']
  ): Promise<User> {
    const [user] = await db.query<User>(
      `INSERT INTO users (username, email, password)
       VALUES ($1, $2, $3) RETURNING ${UserRepository.userSelect}`,
      [username, email, hashedPassword]
    )
    return user
  }

  async findUserByEmail(email: User['email']): Promise<User | null> {
    const [user] = await db.query<User>(
      `SELECT ${UserRepository.userSelect} FROM users WHERE email = $1`,
      [email]
    )
    return user ?? null
  }

  async findUserByUsername(username: User['username']): Promise<User | null> {
    const [user] = await db.query<User>(
      `SELECT ${UserRepository.userSelect} FROM users WHERE username = $1`,
      [username]
    )
    return user ?? null
  }

  async findUserByEmailOrUsername(
    email: User['email'],
    username: User['username']
  ): Promise<User | null> {
    const [user] = await db.query<User>(
      `SELECT ${UserRepository.userSelect} FROM users WHERE email=$1 OR username=$2`,
      [email, username]
    )
    return user ?? null
  }

  async updateUsername(
    id: User['id'],
    username: User['username']
  ): Promise<void> {
    await db.query(`UPDATE users SET username = $1 WHERE id = $2`, [
      username,
      id,
    ])
  }

  async updateEmail(id: User['id'], email: User['email']): Promise<void> {
    await db.query(`UPDATE users SET email = $1 WHERE id = $2 `, [email, id])
  }

  async updatePassword(
    id: User['id'],
    password: User['password']
  ): Promise<void> {
    await db.query(`UPDATE users SET password = $1 WHERE id = $2`, [
      password,
      id,
    ])
  }
}

export const userRepository = new UserRepository()
