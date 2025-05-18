import express from 'express'
const router = express.Router()

router.get('/logout', (req, res) => {
  req.session.user = null;
  res
    .clearCookie('access_token')
    .clearCookie('refresh_token')
    .redirect('/');
});

export default router
