import express from 'express';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import flash from 'connect-flash';
import jwt from 'jsonwebtoken';

import { PORT, JWT_SECRET } from './config.js';

import loginRoute from './routes/login.route.js';
import registerRoute from './routes/register.route.js';
import logoutRoute from './routes/logout.route.js';
import protectedRoute from './routes/protected.js';

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
app.use('/', loginRoute);
app.use('/', registerRoute);
app.use('/', logoutRoute);
app.use('/', protectedRoute);

// Home - Redirect to login
app.get('/', (req, res) => {
  const { user } = req.session;
  if (user) {
    return res.redirect('/protected');
  }
  res.redirect('/login');
});

// API Routes
app.use('/api', loginRoute);
app.use('/api', registerRoute);
app.use('/api', logoutRoute)

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  req.flash('error', 'Something went wrong!');
  res.redirect('/');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
