import { Router } from 'express'
import {
  login,
  checkSession,
  getPendingEntries,
  updateEntryStatus,
  getAllSeriesAdmin,
  createSeries,
  updateSeries,
  deleteSeries,
} from '../controllers/admin.controller.js'
import { requireAuth } from '../middleware/auth.middleware.js'
import { loginLimiter } from '../middleware/rateLimit.middleware.js'

const router = Router()

router.post('/login', loginLimiter, login)
router.get('/session', requireAuth, checkSession)
router.get('/guestbook/pending', requireAuth, getPendingEntries)
router.patch('/guestbook/:id', requireAuth, updateEntryStatus)
router.get('/series', requireAuth, getAllSeriesAdmin)
router.post('/series', requireAuth, createSeries)
router.put('/series/:id', requireAuth, updateSeries)
router.delete('/series/:id', requireAuth, deleteSeries)

export default router