import { Router } from 'express'
import { getGuestbookEntries, createGuestbookEntry } from '../controllers/guestbook.controller.js'
import { formLimiter } from '../middleware/rateLimit.middleware.js'

const router = Router()

router.get('/', getGuestbookEntries)
router.post('/', formLimiter, createGuestbookEntry)

export default router