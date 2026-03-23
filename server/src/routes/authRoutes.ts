import { Router } from 'express'
import { login, me, register, updateProfile } from '../controllers/authController'
import { requireAuth } from '../middlewares/auth'

const router = Router()

router.post('/register', register)
router.post('/login', login)
router.get('/me', requireAuth, me)
router.put('/profile', requireAuth, updateProfile)

export default router
