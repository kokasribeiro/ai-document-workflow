import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import documentRoutes from './routes/documentRoutes'

dotenv.config()

const app = express()
const port = Number(process.env.PORT ?? 3001)

app.use(cors())
app.use(express.json())

app.get('/health', (_req, res) => {
  res.json({ ok: true })
})

app.use('/documents', documentRoutes)

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
