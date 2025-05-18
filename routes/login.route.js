import express from 'express'
import { validateAuth } from '../schemas/auth.schema.js'
import { UserRepository } from '../repository/user-repository.js'
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../config.js'

const router = express.Router()

// GET /login - Show login form
router.get('/login', (req, res) => {
  const { user } = req.session;
  if (user) {
    return res.redirect('/protected');
  }
  res.render('login');
});

// POST /login - Handle login form submission
router.post('/login', validateAuth, async (req, res) => {
  const { username, password } = req.body

  try {
    const user = await UserRepository.login({ username, password })

    const { password: _, ...rest } = user
    const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, { expiresIn: '1h' })
    
    // Set session
    req.session.user = { id: user._id, username: user.username };
    
    res
    .cookie('access_token', token, {
      httpOnly: true, // la cookie no se puede acceder desde el cliente
      secure: process.env.NODE_ENV === 'production', // solo se envia por https
      sameSite: 'strict', // evita ataques de phishing
      maxAge: 60 * 60 * 1000 // 1 hora
    })
    .status(200).json({ ...rest, token })

  } catch (error) {
    req.flash('error', 'Invalid credentials');
    res.status(401).json({
      error: true,
      message: 'Invalid credentials'
    })
  }
})

export default router
