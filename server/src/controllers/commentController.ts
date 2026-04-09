import type { Request, Response } from 'express'
import { z } from 'zod'
import { prisma } from '../lib/prisma'
import { canUserAccessDocument } from '../utils/documentAccess'

const createCommentSchema = z.object({
  text: z.string().min(1).max(2000),
})

export async function getComments(req: Request, res: Response): Promise<void> {
  try {
    const documentId = String(req.params.documentId)
    const document = await prisma.document.findUnique({ where: { id: documentId } })
    if (!document || !canUserAccessDocument(req.user, document)) {
      res.status(404).json({ error: 'Document not found' })
      return
    }

    const comments = await prisma.comment.findMany({
      where: { documentId },
      orderBy: { createdAt: 'asc' },
      include: { author: { select: { id: true, username: true, email: true, role: true } } },
    })
    res.json(comments)
  } catch {
    res.status(500).json({ error: 'Failed to fetch comments' })
  }
}

export async function addComment(req: Request, res: Response): Promise<void> {
  try {
    const documentId = String(req.params.documentId)
    const parsed = createCommentSchema.safeParse(req.body)
    if (!parsed.success) {
      res.status(400).json({ error: 'Comment text is required (max 2000 chars)' })
      return
    }

    const document = await prisma.document.findUnique({ where: { id: documentId } })
    if (!document || !canUserAccessDocument(req.user, document)) {
      res.status(404).json({ error: 'Document not found' })
      return
    }

    const comment = await prisma.comment.create({
      data: { text: parsed.data.text, documentId, authorId: req.user!.id },
      include: { author: { select: { id: true, username: true, email: true, role: true } } },
    })
    res.status(201).json(comment)
  } catch {
    res.status(500).json({ error: 'Failed to add comment' })
  }
}
