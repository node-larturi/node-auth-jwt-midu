import express from 'express'
const router = express.Router()

router.get('/', (req, res) => {
  const { user } = req.session;
  if(!user) return res.redirect('/')
  res.render('protected', { user });
});

export default router