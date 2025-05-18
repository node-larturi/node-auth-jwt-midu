import express from 'express'
import jwt from 'jsonwebtoken'

import { UserRepository } from '../../repository/user-repository.js'
import { JWT_SECRET } from '../../config.js'
import { validateAuth } from '../../schemas/auth.schema.js'

const router = express.Router()

// POST /register - Handle registration form submission
router.post('/register', validateAuth, async (req, res) => {
  const { username, password } = req.body

  try {
    const user = await UserRepository.create({ username, password })
    
    // Create session and JWT token
    const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
    req.session.user = { id: user._id, username: user.username };
    
    res
      .cookie('access_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 1000 // 1 hour
      })
      .status(201)
      .json({
        success: true,
        user: {
          id: user._id,
          username: user.username
        },
        token
      });
      
  } catch (error) {
    if (error.message === 'Username already exists') {
      req.flash('error', 'Username already exists');
      res.status(409).json({
        error: true,
        message: 'Username already exists'
      });
    } else {
      console.error('Registration error:', error);
      req.flash('error', 'Error during registration');
      res.status(500).json({
        error: true,
        message: 'Internal server error'
      });
    }
  }
});

export default router
