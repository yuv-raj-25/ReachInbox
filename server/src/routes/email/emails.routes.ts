import { Router } from 'express'
import { scheduleEmail } from '../../controllers/email/emailController.js'
import { requireAuth } from '../../middleware/auth.middleware.js'

const router = Router()

router.post('/bulk-schedule', requireAuth, scheduleEmail)

export default router
