import { Router } from 'express'
import {
  changePassword,
  login,
  me,
  register,
  updateProfile,
  verifyPassword,
} from '../controllers/authController'
import { requireAuth } from '../middlewares/auth'

const router = Router()

router.post('/register', register)
router.post('/login', login)
router.get('/me', requireAuth, me)
router.put('/profile', requireAuth, updateProfile)
router.post('/verify-password', requireAuth, verifyPassword)
router.put('/change-password', requireAuth, changePassword)

export default router
