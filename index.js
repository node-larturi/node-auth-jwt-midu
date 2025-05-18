import express from 'express';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import flash from 'connect-flash';
import { PORT } from './config.js';

import loginRoute from './routes/login.route.js';
import registerRoute from './routes/register.route.js';
import logoutRoute from './routes/logout.route.js';

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Session configuration
app.use(session({
  secret: 'your-secret-key', // Change this to a secure secret in production
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // Set to true if using HTTPS
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

// View engine setup
app.set('view engine', 'ejs');
app.set('views', './views');

// Static files
app.use(express.static('public'));

// Routes
app.get('/', (req, res) => {
  res.render('index', {
    messages: {
      error: res.locals.messages.error,
      success: res.locals.messages.success
    }
  });
});

app.use('/api', loginRoute);
app.use('/api', registerRoute);
app.use('/api', logoutRoute);

app.get('/protected', (req, res) => {
  const token = req.cookies.access_token

  if (!token) {
    return res.status(401).json({
      error: true,
      message: 'Unauthorized'
    })
  }

  try {
    const data = jwt.verify(token, JWT_SECRET)
    console.log(data)
    res.render('protected', {
      data
    });
  } catch (error) {
    return res.status(401).json({
      error: true,
      message: 'Unauthorized'
    })
  }
 
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
