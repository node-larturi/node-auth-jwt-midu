import express from 'express'
import { validateAuth } from '../schemas/auth.schema.js'
import { UserRepository } from '../repository/user-repository.js'

const router = express.Router()

router.post('/login', validateAuth, async (req, res) => {
  const { username, password } = req.body

  try {
    const user = await UserRepository.login({ username, password })
    res.status(200).json(user)
  } catch (error) {
    res.status(401).json({
      error: true,
      message: 'Invalid credentials'
    })
  }
})

export default router
