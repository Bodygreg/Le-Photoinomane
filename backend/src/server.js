import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import seriesRoutes from './routes/series.routes.js'
import contactRoutes from './routes/contact.routes.js'
import guestbookRoutes from './routes/guestbook.routes.js'
import adminRoutes from './routes/admin.routes.js'

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())
app.use('/api/admin', adminRoutes)
app.use('/api/series', seriesRoutes)
app.use('/api/contact', contactRoutes)
app.use('/api/guestbook', guestbookRoutes)

app.get('/', (req, res) => {
  res.json({ message: 'API Le Photoïnomane opérationnelle' })
})

app.listen(PORT, () => {
  console.log(`Serveur backend démarré sur le port ${PORT}`)
})