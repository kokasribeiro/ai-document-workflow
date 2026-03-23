import { Router } from 'express'
import {
  createDocument,
  deleteDocument,
  getDocumentById,
  getDocuments,
  updateDocument,
} from '../controllers/documentController'
import {
  validateCreateDocument,
  validateUpdateDocument,
} from '../middlewares/documentValidation'
import { requireAuth } from '../middlewares/auth'

const router = Router()

router.use(requireAuth)

router.get('/', getDocuments)
router.get('/:id', getDocumentById)
router.post('/', validateCreateDocument, createDocument)
router.put('/:id', validateUpdateDocument, updateDocument)
router.delete('/:id', deleteDocument)

export default router
