import { Router } from 'express'
import multer from 'multer'
import { uploadImage } from '../controllers/upload.controller.js'
import { requireAuth } from '../middleware/auth.middleware.js'

const upload = multer({ storage: multer.memoryStorage() })
const router = Router()

router.post('/', requireAuth, upload.single('image'), uploadImage)

export default router