import { Router } from 'express'
import { register, login, googleAuth, logout } from '../../controllers/auth/authController.js'
import { requireAuth } from '../../middleware/auth.middleware.js'

const router = Router()

router.post('/register', register)
router.get('/login', login)  
router.post('/google', googleAuth)
router.post('/logout', requireAuth,logout)  


export default router
