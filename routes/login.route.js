import express from 'express'
import { validateAuth } from '../schemas/auth.schema.js'
import { UserRepository } from '../repository/user-repository.js'
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../config.js'

const router = express.Router()

router.post('/login', validateAuth, async (req, res) => {
  const { username, password } = req.body

  try {
    const user = await UserRepository.login({ username, password })

    const { password: _, ...rest } = user
    const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, { expiresIn: '1h' })
    res
    .cookie('access_token', token, {
      httpOnly: true, // la cookie no se puede acceder desde el cliente
      secure: process.env.NODE_ENV === 'production', // solo se envia por https
      sameSite: 'strict', // evita ataques de phishing
      maxAge: 60 * 60 * 1000 // 1 hora
    })
    .status(200).json({ ...rest, token })

  } catch (error) {
    res.status(401).json({
      error: true,
      message: 'Invalid credentials'
    })
  }
})

export default router
