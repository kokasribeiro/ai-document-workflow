import type { Request, Response } from 'express'
import { prisma } from '../lib/prisma'

export async function getNotifications(req: Request, res: Response): Promise<void> {
  try {
    const notifications = await prisma.notification.findMany({
      where: { userId: req.user!.id },
      orderBy: { createdAt: 'desc' },
      take: 20,
    })
    res.json(notifications)
  } catch {
    res.status(500).json({ error: 'Failed to fetch notifications' })
  }
}

export async function getUnreadCount(req: Request, res: Response): Promise<void> {
  try {
    const count = await prisma.notification.count({
      where: { userId: req.user!.id, read: false },
    })
    res.json({ count })
  } catch {
    res.status(500).json({ error: 'Failed to count notifications' })
  }
}

export async function markAsRead(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params
    await prisma.notification.updateMany({
      where: { id, userId: req.user!.id },
      data: { read: true },
    })
    res.json({ ok: true })
  } catch {
    res.status(500).json({ error: 'Failed to mark notification as read' })
  }
}

export async function markAllAsRead(req: Request, res: Response): Promise<void> {
  try {
    await prisma.notification.updateMany({
      where: { userId: req.user!.id, read: false },
      data: { read: true },
    })
    res.json({ ok: true })
  } catch {
    res.status(500).json({ error: 'Failed to mark notifications as read' })
  }
}
