import { Router } from 'express'
import {
  createDocument,
  getDocumentById,
  getDocuments,
} from '../controllers/documentController'

const router = Router()

router.get('/', getDocuments)
router.get('/:id', getDocumentById)
router.post('/', createDocument)

export default router
