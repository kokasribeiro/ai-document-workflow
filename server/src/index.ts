import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import documentRoutes from './routes/documentRoutes'
import aiRoutes from './routes/aiRoutes'
import authRoutes from './routes/authRoutes'
import { requireAuth } from './middlewares/auth'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.json({ message: 'AI Document Workflow API is running' })
})

app.use('/auth', authRoutes)
app.use('/documents', documentRoutes)
app.use('/ai', requireAuth, aiRoutes)

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
