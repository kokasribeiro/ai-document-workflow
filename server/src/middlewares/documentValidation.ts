import type { NextFunction, Request, Response } from 'express'
import { z } from 'zod'

const statusEnum = z.enum(['Draft', 'Review', 'Approved', 'Rejected'])

const documentCreateSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  category: z.string().min(1),
  status: statusEnum,
  aiSummary: z.string().optional(),
  aiSuggestedCategory: z.string().optional(),
})

const documentUpdateSchema = documentCreateSchema.partial()

function validateBody(schema: z.ZodType) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body)
    if (!result.success) {
      res.status(400).json({ error: 'Invalid payload', details: result.error.flatten() })
      return
    }
    req.body = result.data
    next()
  }
}

export const validateCreateDocument = validateBody(documentCreateSchema)
export const validateUpdateDocument = validateBody(documentUpdateSchema)
