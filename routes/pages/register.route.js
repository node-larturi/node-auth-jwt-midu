import express from 'express'
const router = express.Router()

router.get('/', (req, res) => {
  const { user } = req.session;
  if (user) {
    return res.redirect('/protected');
  }
  res.render('register');
});

export default router
