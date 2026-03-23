import type { Request } from 'express'

/** Normalizes Express `req.params.id` when it may be `string | string[]`. */
export function paramId(req: Request, key = 'id'): string {
  const raw = req.params[key]
  return Array.isArray(raw) ? raw[0] : raw ?? ''
}
