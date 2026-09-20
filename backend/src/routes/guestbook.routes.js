import { Router } from 'express'
import { getGuestbookEntries, createGuestbookEntry } from '../controllers/guestbook.controller.js'

const router = Router()

router.get('/', getGuestbookEntries)
router.post('/', createGuestbookEntry)

export default router