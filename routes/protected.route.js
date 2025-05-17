import express from 'express'
const router = express.Router()

router.post('/protected', (req, res) => {
  res.send('Protected')
})

export default router
