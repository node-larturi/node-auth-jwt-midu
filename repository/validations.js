export class Validations {
  static validateUsername({ username }) {
    if (!username) throw new Error('Username is required')
    if (typeof username !== 'string') throw new Error('Username must be a string')
    if (username.length < 3) throw new Error('Username must be at least 3 characters long')
    if (username.length > 50) throw new Error('Username must be less than 50 characters')
    if (username.includes(' ')) throw new Error('Username cannot contain spaces')
    if (!/^[a-zA-Z0-9_-]+$/.test(username)) 
      throw new Error('Username can only contain letters, numbers, underscores and hyphens')
  }

  static validatePassword({ password }) {
    if (!password) throw new Error('Password is required')
    if (typeof password !== 'string') throw new Error('Password must be a string')
    if (password.length < 8) throw new Error('Password must be at least 8 characters long')
    if (password.length > 100) throw new Error('Password must be less than 100 characters')
    if (!/[A-Z]/.test(password)) throw new Error('Password must contain at least one uppercase letter')
    if (!/[a-z]/.test(password)) throw new Error('Password must contain at least one lowercase letter')
    if (!/[0-9]/.test(password)) throw new Error('Password must contain at least one number')
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) 
      throw new Error('Password must contain at least one special character')
  }
}