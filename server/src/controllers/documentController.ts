import type { Request, Response } from 'express'
import type { Document } from '@prisma/client'
import { prisma } from '../lib/prisma'
import { notifyCeos, notifyDocumentOwner } from '../utils/notifications'
import { canUserAccessDocument } from '../utils/documentAccess'
import { paramId } from '../utils/params'

async function findAccessibleDocument(
  req: Request,
  res: Response,
  id: string
): Promise<Document | null> {
  const document = await prisma.document.findUnique({ where: { id } })

  if (!document) {
    res.status(404).json({ error: 'Document not found' })
    return null
  }

  if (!canUserAccessDocument(req.user, document)) {
    res.status(404).json({ error: 'Document not found' })
    return null
  }

  return document
}

export async function getDocuments(req: Request, res: Response): Promise<void> {
  try {
    const isCEO = req.user?.role === 'CEO'
    const documents = await prisma.document.findMany({
      where: isCEO ? undefined : { ownerEmail: req.user?.email },
      orderBy: { createdAt: 'desc' },
    })
    res.json(documents)
  } catch {
    res.status(500).json({ error: 'Failed to fetch documents' })
  }
}

export async function getDocumentById(req: Request, res: Response): Promise<void> {
  try {
    const id = paramId(req)
    const document = await findAccessibleDocument(req, res, id)
    if (!document) return
    res.json(document)
  } catch {
    res.status(500).json({ error: 'Failed to fetch document' })
  }
}

export async function createDocument(req: Request, res: Response): Promise<void> {
  try {
    const { title, description, category, status, aiSummary, aiSuggestedCategory } = req.body

    const document = await prisma.document.create({
      data: {
        title,
        description,
        category,
        status,
        ownerEmail: req.user?.email,
        aiSummary,
        aiSuggestedCategory,
      },
    })

    if (req.user?.role !== 'CEO') {
      await notifyCeos(
        `New document "${title}" submitted by ${req.user?.email}`,
        document.id,
      )
    }

    res.status(201).json(document)
  } catch {
    res.status(500).json({ error: 'Failed to create document' })
  }
}

export async function updateDocument(req: Request, res: Response): Promise<void> {
  try {
    const id = paramId(req)
    const existing = await findAccessibleDocument(req, res, id)
    if (!existing) return

    const { title, description, category, status, aiSummary, aiSuggestedCategory } = req.body

    if (status !== undefined && req.user?.role !== 'CEO') {
      res.status(403).json({ error: 'Only CEO can change document status' })
      return
    }

    const updated = await prisma.document.update({
      where: { id },
      data: { title, description, category, status, aiSummary, aiSuggestedCategory },
    })

    if (status && status !== existing.status && existing.ownerEmail) {
      await notifyDocumentOwner(
        existing.ownerEmail,
        `Your document "${existing.title}" was changed to ${status}`,
        existing.id,
      )
    }

    res.json(updated)
  } catch {
    res.status(500).json({ error: 'Failed to update document' })
  }
}

export async function deleteDocument(req: Request, res: Response): Promise<void> {
  try {
    const id = paramId(req)
    const existing = await findAccessibleDocument(req, res, id)
    if (!existing) return

    await prisma.document.delete({ where: { id } })
    res.status(204).send()
  } catch {
    res.status(500).json({ error: 'Failed to delete document' })
  }
}
