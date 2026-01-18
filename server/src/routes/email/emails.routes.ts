import { Router } from 'express'
import { scheduleEmail, getScheduledEmails, getSentEmails } from '../../controllers/email/emailController.js'
import { requireAuth } from '../../middleware/auth.middleware.js'

const router = Router()

router.post('/bulk-schedule', requireAuth, scheduleEmail)
router.get('/scheduled', requireAuth, getScheduledEmails)
router.get('/sent', requireAuth, getSentEmails)

export default router
