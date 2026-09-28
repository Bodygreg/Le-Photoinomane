import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import seriesRoutes from './routes/series.routes.js'
import contactRoutes from './routes/contact.routes.js'
import guestbookRoutes from './routes/guestbook.routes.js'
import adminRoutes from './routes/admin.routes.js'
import uploadRoutes from './routes/upload.routes.js'

const app = express()
const PORT = process.env.PORT || 3000

app.use(helmet())

const allowedOrigins = [process.env.FRONTEND_URL, 'http://localhost:5173'].filter(Boolean)

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true)
      callback(null, false)
    },
    credentials: true,
  })
)

app.use(express.json({ limit: '100kb' }))
app.use(cookieParser())

// Aucune réponse de l'API ne doit être mise en cache (Vercel ou navigateur)
app.use('/api', (req, res, next) => {
  res.set('Cache-Control', 'no-store')
  next()
})

app.use('/api/series', seriesRoutes)
app.use('/api/contact', contactRoutes)
app.use('/api/guestbook', guestbookRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/upload', uploadRoutes)

app.get('/', (req, res) => {
  res.json({ message: 'API Le Photoïnomane opérationnelle' })
})

app.listen(PORT, () => {
  console.log(`Serveur backend démarré sur le port ${PORT}`)
})