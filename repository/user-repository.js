import crypto from 'node:crypto'
import DBLocal from 'db-local'
import bcrypt from 'bcrypt'

const { Schema } = new DBLocal({ path: './db' })

const User = Schema('User', {
  _id: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true }
})

export class UserRepository {
  static async create({ username, password }) {
    try {
      // Verificar que el username no existe en la bd
      const existingUser = await User.findOne({ username })
      if (existingUser) {
        throw new Error('Username already exists')
      }

      // Encriptar el password
      const hashedPassword = await bcrypt.hash(password, 10)

      // Crear el usuario
      const id = crypto.randomUUID()
      const newUser = {
        _id: id,
        username,
        password: hashedPassword
      }

      await User.create(newUser).save()
      return newUser
    } catch (error) {
      console.error('Error creating user:', error)
      throw error
    }
  }

  static async login({ username, password }) {
    try {
      const user = await User.findOne({ username })
      if (!user) {
        throw new Error('User not found')
      }

      const isPasswordValid = await bcrypt.compare(password, user.password)
      if (!isPasswordValid) {
        throw new Error('Invalid password')
      }

      return user
    } catch (error) {
      console.error('Error logging in:', error)
      throw error
    }
  }
}
