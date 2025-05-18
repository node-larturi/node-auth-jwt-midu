import express from 'express'
const router = express.Router()

router.get('/protected', (req, res) => {
  const { user } = req.session;
  if(!user) return res.redirect('/')
  res.render('protected', { user });
});

export default router