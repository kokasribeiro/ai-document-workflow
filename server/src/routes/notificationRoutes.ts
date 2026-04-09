import { Router } from 'express'
import {
  getNotifications,
  getUnreadCount,
  markAllAsRead,
  markAsRead,
} from '../controllers/notificationController'
import { requireAuth } from '../middlewares/auth'

const router = Router()

router.use(requireAuth)

router.get('/', getNotifications)
router.get('/unread-count', getUnreadCount)
router.put('/:id/read', markAsRead)
router.put('/read-all', markAllAsRead)

export default router
