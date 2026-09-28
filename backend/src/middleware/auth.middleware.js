import jwt from 'jsonwebtoken'

export function requireAuth(req, res, next) {
  const token = req.cookies?.adminToken

  if (!token) {
    return res.status(401).json({ error: 'Non authentifié.' })
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] })
    next()
  } catch {
    return res.status(401).json({ error: 'Session invalide ou expirée.' })
  }
}