import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import dotenv from 'dotenv'

import lettersRouter from './routes/letters'
import penpalsRouter from './routes/penpals'
import journalRouter from './routes/journal'
import audioRouter from './routes/audio'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(helmet())
app.use(cors())
app.use(morgan('combined'))
app.use(express.json())

// Routes
app.use('/api/letters', lettersRouter)
app.use('/api/penpals', penpalsRouter)
app.use('/api/journal', journalRouter)
app.use('/api/audio', audioRouter)

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() })
})

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
})