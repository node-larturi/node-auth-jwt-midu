import { Validations } from '../repository/validations.js'

export const validateAuth = (req, res, next) => {
  try {
    Validations.validateUsername({ username: req.body.username })
    Validations.validatePassword({ password: req.body.password })
    next()
  } catch (error) {
    res.status(400).json({
      error: true,
      message: error.message
    })
  }
}
