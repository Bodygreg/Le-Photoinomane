import jwt from 'jsonwebtoken'
import prisma from '../prisma.js'

export function login(req, res) {
  const { password } = req.body

  if (password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Mot de passe incorrect.' })
  }

  const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1h' })
  res.json({ token })
}

export async function getPendingEntries(req, res) {
  const entries = await prisma.guestbookEntry.findMany({
    where: { status: 'PENDING' },
    orderBy: { createdAt: 'asc' },
  })
  res.json(entries)
}

export async function updateEntryStatus(req, res) {
  const { id } = req.params
  const { status } = req.body

  if (!['APPROVED', 'REJECTED'].includes(status)) {
    return res.status(400).json({ error: 'Statut invalide.' })
  }

  const entry = await prisma.guestbookEntry.update({
    where: { id: Number(id) },
    data: { status },
  })

  res.json(entry)
}