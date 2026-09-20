import { Router } from 'express'
import { login, getPendingEntries, updateEntryStatus } from '../controllers/admin.controller.js'
import { requireAuth } from '../middleware/auth.middleware.js'

const router = Router()

router.post('/login', login)
router.get('/guestbook/pending', requireAuth, getPendingEntries)
router.patch('/guestbook/:id', requireAuth, updateEntryStatus)

export default router