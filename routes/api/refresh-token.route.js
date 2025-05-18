import express from 'express';
import jwt from 'jsonwebtoken';

import { JWT_SECRET } from '../../config.js';
import { UserRepository } from '../../repository/user-repository.js';

const router = express.Router();

// Handle both GET and POST for /api/refresh-token
const handleRefreshToken = async (req, res) => {
  console.log('Request cookies:', req.cookies);
  console.log('Request headers:', req.headers);
  
  // Get refresh token from cookies or Authorization header
  let refreshToken = req.cookies?.refresh_token || 
                  (req.headers.authorization && req.headers.authorization.split(' ')[1]);
  
  // If still no token, try to parse from raw headers
  if (!refreshToken && req.headers.cookie) {
    console.log('Parsing cookies from raw headers');
    const cookies = req.headers.cookie.split(';').reduce((cookies, cookie) => {
      const [name, value] = cookie.trim().split('=');
      cookies[name] = value;
      return cookies;
    }, {});
    refreshToken = cookies.refresh_token;
  }
  
  console.log('Extracted refresh token:', refreshToken ? '***' : 'Not found');
  
  if (!refreshToken) {
    // Try to get from body if not in cookies/headers
    refreshToken = req.body.refresh_token;
    console.log('Trying to get token from body:', refreshToken ? '***' : 'Not found');
  }
  
  if (!refreshToken) {
    return res.status(401).json({
      error: true,
      message: 'Refresh token is required',
      receivedCookies: req.cookies,
      receivedHeaders: {
        cookie: req.headers.cookie,
        authorization: req.headers.authorization
      }
    });
  }

  try {
    console.log('JWT_SECRET:', JWT_SECRET ? '***' : 'Not set');
    
    // Verify the refresh token
    const decoded = jwt.verify(refreshToken, JWT_SECRET);
    console.log('Token verified successfully. Payload:', decoded);
    
    // Check if user still exists
    const user = await UserRepository.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        error: true,
        message: 'User not found'
      });
    }

    // Generate new access token
    const accessToken = jwt.sign(
      { id: user._id, username: user.username },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Update session
    req.session.user = { id: user._id, username: user.username };

    // Set the new access token in HTTP-only cookie
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    };

    res
      .cookie('access_token', accessToken, {
        ...cookieOptions,
        maxAge: 60 * 60 * 1000 // 1 hour
      })
      .json({
        success: true,
        message: 'Token refreshed successfully',
        user: {
          id: user._id,
          username: user.username
        },
        tokens: {
          access_token: accessToken
        }
      });
  } catch (error) {
    console.error('Refresh token error:', error);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: true,
        code: 'TOKEN_EXPIRED',
        message: 'Refresh token has expired. Please log in again.'
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        error: true,
        code: 'INVALID_TOKEN',
        message: 'Invalid token format',
        details: error.message
      });
    }
    
    if (error.name === 'NotBeforeError') {
      return res.status(401).json({
        error: true,
        code: 'TOKEN_NOT_ACTIVE',
        message: 'Token not yet active',
        details: error.message
      });
    }
    
    // For any other error
    console.error('Unexpected error in refresh token:', error);
    res.status(500).json({
      error: true,
      code: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Register both GET and POST routes
router.get('/api/refresh-token', handleRefreshToken);
router.post('/api/refresh-token', handleRefreshToken);

export default router;