import express from 'express'
import { validateAuth } from '../middleware/validation.middleware.js'
import { UserRepository } from '../repository/user-repository.js'

const router = express.Router()

router.post('/register', validateAuth, async (req, res) => {
  const { username, password } = req.body

  try {
    const user = await UserRepository.create({ username, password })
    res.status(201).json(user)
  } catch (error) {
    if (error.message === 'Username already exists') {
      res.status(409).json({
        error: true,
        message: 'Username already exists'
      })
    } else {
      res.status(500).json({
        error: true,
        message: 'Internal server error'
      })
    }
  }
})

export default router
