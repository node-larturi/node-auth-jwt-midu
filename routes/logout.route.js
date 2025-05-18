import express from 'express'
const router = express.Router()

router.get('/logout', (req, res) => {
  req.session.user = null;
  res.clearCookie('access_token');
  res.redirect('/');
});

export default router
