import express from 'express'
import { validateAuth } from '../../schemas/auth.schema.js'
import { UserRepository } from '../../repository/user-repository.js'
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../../config.js'

const router = express.Router()

// POST /login - Handle login form submission
router.post('/login', validateAuth, async (req, res) => {
  const { username, password } = req.body

  try {
    const user = await UserRepository.login({ username, password })

    const { password: _, ...rest } = user
    const accessToken = jwt.sign(
      { id: user._id, username: user.username },
      JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    const refreshToken = jwt.sign(
      { id: user._id },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    // Set session
    req.session.user = { id: user._id, username: user.username };
    
    // Set HTTP-only cookies
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax', // Changed from 'strict' to 'lax' for better compatibility
      path: '/', // Ensure cookie is available on all paths
    };

    res
      .cookie('access_token', accessToken, {
        ...cookieOptions,
        maxAge: 60 * 60 * 1000 // 1 hour
      })
      .cookie('refresh_token', refreshToken, {
        ...cookieOptions,
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      })
      .status(200)
      .json({ 
        success: true,
        user: rest,
        tokens: {
          access_token: accessToken,
          refresh_token: refreshToken
        }
      })

  } catch (error) {
    req.flash('error', 'Invalid credentials');
    res.status(401).json({
      error: true,
      message: 'Invalid credentials'
    })
  }
})

export default router
