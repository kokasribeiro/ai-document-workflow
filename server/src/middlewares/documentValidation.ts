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

export function validateCreateDocument(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const result = documentCreateSchema.safeParse(req.body)
  if (!result.success) {
    res.status(400).json({ error: 'Invalid payload', details: result.error.flatten() })
    return
  }
  req.body = result.data
  next()
}

export function validateUpdateDocument(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const result = documentUpdateSchema.safeParse(req.body)
  if (!result.success) {
    res.status(400).json({ error: 'Invalid payload', details: result.error.flatten() })
    return
  }
  req.body = result.data
  next()
}
