import { Router } from 'express'
import {
  suggestCategory,
  summarizeDocument,
} from '../controllers/aiController'

const router = Router()

router.post('/summarize', summarizeDocument)
router.post('/suggest-category', suggestCategory)

export default router
