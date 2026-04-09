import { Router } from 'express'
import { addComment, getComments } from '../controllers/commentController'
import { requireAuth } from '../middlewares/auth'

const router = Router()

router.use(requireAuth)

router.get('/:documentId/comments', getComments)
router.post('/:documentId/comments', addComment)

export default router
