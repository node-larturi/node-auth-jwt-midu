import crypto from 'crypto'
import DBLocal from 'db-local'
const { Schema } = new DBLocal({ path: './db' })

const User = Schema('User', {
  _id: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true }
})

export class UserRepository {
  static create({ username, password }) {
    // Validaciones (podemos usar zod)
    if (typeof username !== 'string') throw new Error('User must be a string')
    if (username.length < 3)
      throw new Error('User must be at least 3 characters long')

    if (typeof password !== 'string')
      throw new Error('Password must be a string')
    if (password.length < 6)
      throw new Error('Password must be at least 6 characters long')

    // Verificar que el username no existe en la bd
    const user = User.findOne({ username })
    if (user) throw new error('Username already exists')

    // Crear el usuario
    const id = crypto.randomUUID()

    const newUser = {
      _id: id,
      username,
      password
    }

    User.create(newUser).save()

    return newUser
  }

  static login({ username, password }) {}
}
