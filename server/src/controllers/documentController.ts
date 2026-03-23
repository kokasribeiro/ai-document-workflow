import type { Request, Response } from 'express'
import prisma from '../lib/prisma'

export async function getDocuments(_req: Request, res: Response): Promise<void> {
  const documents = await prisma.document.findMany({
    orderBy: { createdAt: 'desc' },
  })
  res.json(documents)
}

export async function getDocumentById(req: Request, res: Response): Promise<void> {
  const document = await prisma.document.findUnique({
    where: { id: req.params.id },
  })

  if (!document) {
    res.status(404).json({ message: 'Document not found' })
    return
  }

  res.json(document)
}

export async function createDocument(req: Request, res: Response): Promise<void> {
  const created = await prisma.document.create({
    data: req.body,
  })
  res.status(201).json(created)
}
