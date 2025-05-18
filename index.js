import express from 'express';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import flash from 'connect-flash';
import jwt from 'jsonwebtoken';

import { PORT, JWT_SECRET } from './config.js';

// API routes
import loginApiRoute from './routes/api/login.route.js';
import registerApiRoute from './routes/api/register.route.js';
import logoutApiRoute from './routes/api/logout.route.js';
import refreshTokenApiRoute from './routes/api/refresh-token.route.js';

// Public pages
import loginRoute from './routes/login.route.js';
import registerRoute from './routes/register.route.js';

// Protected pages
import protectedRoute from './routes/protected.route.js';

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Session configuration
app.use(session({
  secret: JWT_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: process.env.NODE_ENV === 'production' } // Set to true if using HTTPS
}));

// Flash messages middleware
app.use(flash());

// Make flash messages available to all views
app.use((req, res, next) => {
  res.locals.messages = {
    error: req.flash('error'),
    success: req.flash('success')
  };
  next();
});

// Auth middleware
app.use((req, res, next) => {
  const token = req.cookies.access_token;
  
  if (token) {
    try {
      const data = jwt.verify(token, JWT_SECRET);
      req.session.user = data;
    } catch (error) {
      console.error('Token verification failed:', error.message);
      req.session.user = null;
    }
  } else {
    req.session.user = null;
  }

  next();
});

// View engine setup
app.set('view engine', 'ejs');
app.set('views', './views');

// Static files
app.use(express.static('public'));

// APIRoutes
app.use('/api', loginApiRoute);
app.use('/api', registerApiRoute);
app.use('/api', logoutApiRoute);
app.use('/api', refreshTokenApiRoute);

// Protected pages
app.use('/protected', protectedRoute);

// Public pages
app.use('/login', loginRoute);
app.use('/register', registerRoute);

// Home - Redirect to login
app.get('/', (req, res) => {
  const { user } = req.session;
  if (user) {
    return res.redirect('/protected');
  }
  res.redirect('/login');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  req.flash('error', 'Something went wrong!');
  res.redirect('/');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
