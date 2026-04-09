import { prisma } from '../lib/prisma'

export async function notifyCeos(message: string, documentId?: string): Promise<void> {
  const ceos = await prisma.user.findMany({ where: { role: 'CEO' }, select: { id: true } })
  if (!ceos.length) return

  await prisma.notification.createMany({
    data: ceos.map((ceo) => ({
      userId: ceo.id,
      message,
      documentId: documentId ?? null,
    })),
  })
}

export async function notifyDocumentOwner(
  ownerEmail: string,
  message: string,
  documentId?: string,
): Promise<void> {
  const owner = await prisma.user.findUnique({ where: { email: ownerEmail }, select: { id: true } })
  if (!owner) return

  await prisma.notification.create({
    data: {
      userId: owner.id,
      message,
      documentId: documentId ?? null,
    },
  })
}
