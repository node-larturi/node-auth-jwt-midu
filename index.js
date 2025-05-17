import express from 'express'
import { PORT } from './config.js'

import loginRoute from './routes/login.route.js'
import registerRoute from './routes/register.route.js'
import logoutRoute from './routes/logout.route.js'
import protectedRoute from './routes/protected.route.js'

const app = express()
app.use(express.json())

app.use('/api', loginRoute)
app.use('/api', registerRoute)
app.use('/api', logoutRoute)
app.use('/api', protectedRoute)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
