import { Router } from 'express'
import { sendContactMessage } from '../controllers/contact.controller.js'
import { formLimiter } from '../middleware/rateLimit.middleware.js'

const router = Router()

router.post('/', formLimiter, sendContactMessage)

export default router