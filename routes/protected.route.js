import express from 'express'
const router = express.Router()

router.post('/protected', (req, res) => {
  res.render('protected', { username: "Luis"})
})

export default router
