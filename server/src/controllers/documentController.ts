import { Request, Response } from 'express'
import { prisma } from '../lib/prisma'

export async function getDocuments(req: Request, res: Response) {
  try {
    const isCEO = req.user?.role === 'CEO'
    const documents = await prisma.document.findMany({
      where: isCEO ? undefined : { ownerEmail: req.user?.email },
      orderBy: {
        createdAt: 'desc',
      },
    })

    res.json(documents)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch documents' })
  }
}

export async function getDocumentById(req: Request, res: Response) {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id

    const document = await prisma.document.findUnique({
      where: { id },
    })

    if (!document) {
      return res.status(404).json({ error: 'Document not found' })
    }

    if (req.user?.role !== 'CEO' && document.ownerEmail !== req.user?.email) {
      return res.status(404).json({ error: 'Document not found' })
    }

    return res.json(document)
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch document' })
  }
}

export async function createDocument(req: Request, res: Response) {
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

    return res.status(201).json(document)
  } catch (error) {
    return res.status(500).json({ error: 'Failed to create document' })
  }
}

export async function updateDocument(req: Request, res: Response) {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id
    const {
      title,
      description,
      category,
      status,
      aiSummary,
      aiSuggestedCategory,
    } = req.body

    const existing = await prisma.document.findUnique({
      where: { id },
    })

    if (!existing) {
      return res.status(404).json({ error: 'Document not found' })
    }

    if (req.user?.role !== 'CEO' && existing.ownerEmail !== req.user?.email) {
      return res.status(404).json({ error: 'Document not found' })
    }

    if ((status === 'Approved' || status === 'Rejected') && req.user?.role !== 'CEO') {
      return res.status(403).json({ error: 'Only CEO can set Approved or Rejected' })
    }

    const updated = await prisma.document.update({
      where: { id },
      data: {
        title,
        description,
        category,
        status,
        aiSummary,
        aiSuggestedCategory,
      },
    })

    return res.json(updated)
  } catch (error) {
    return res.status(500).json({ error: 'Failed to update document' })
  }
}

export async function deleteDocument(req: Request, res: Response) {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id

    const existing = await prisma.document.findUnique({
      where: { id },
    })

    if (!existing) {
      return res.status(404).json({ error: 'Document not found' })
    }

    if (req.user?.role !== 'CEO' && existing.ownerEmail !== req.user?.email) {
      return res.status(404).json({ error: 'Document not found' })
    }

    await prisma.document.delete({
      where: { id },
    })

    return res.status(204).send()
  } catch (error) {
    return res.status(500).json({ error: 'Failed to delete document' })
  }
}
