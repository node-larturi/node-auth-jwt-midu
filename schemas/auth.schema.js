import { z } from 'zod'

export const authSchema = z.object({
  username: z.string()
    .min(3, 'Username must be at least 3 characters long')
    .max(50, 'Username must be less than 50 characters')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores and hyphens')
    .refine(username => !username.includes(' '), 'Username cannot contain spaces')
    .refine(username => username.trim().length > 0, 'Username cannot be empty'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters long')
    .max(100, 'Password must be less than 100 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character')
})

export const validateAuth = (req, res, next) => {
  try {
    authSchema.parse(req.body)
    next()
  } catch (error) {
    const errors = error.errors.map(err => {
      return {
        field: err.path[0],
        message: err.message
      }
    })
    
    res.status(400).json({
      error: true,
      message: 'Validation failed',
      details: errors
    })
  }
}