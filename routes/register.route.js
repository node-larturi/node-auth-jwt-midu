import express from 'express'
import { UserRepository } from '../user-repository.js'
const router = express.Router()

router.post('/register', (req, res) => {
  const { username, password } = req.body

  try {
    const user = UserRepository.create({ username, password })
    res.json(user)
  } catch (error) {
    res.json({
      error: true,
      message: error.message
    })
  }
})

export default router
