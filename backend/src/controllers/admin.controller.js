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

export async function getAllSeriesAdmin(req, res) {
  const series = await prisma.series.findMany({
    orderBy: { createdAt: 'desc' },
    include: { photos: { orderBy: { order: 'asc' } } },
  })
  res.json(series)
}

export async function createSeries(req, res) {
  const { title, excerpt, description, photos } = req.body

  if (!title || !excerpt || !description) {
    return res.status(400).json({ error: 'Titre, extrait et description requis.' })
  }

  const series = await prisma.series.create({
    data: {
      title,
      excerpt,
      description,
      photos: {
        create: (photos || []).map((p, index) => ({
          url: p.url,
          caption: p.caption || null,
          order: index,
        })),
      },
    },
    include: { photos: true },
  })

  res.status(201).json(series)
}

export async function updateSeries(req, res) {
  const { id } = req.params
  const { title, excerpt, description, photos } = req.body

  if (!title || !excerpt || !description) {
    return res.status(400).json({ error: 'Titre, extrait et description requis.' })
  }

  // Stratégie simple : on remplace toutes les photos à chaque modification
  await prisma.photo.deleteMany({ where: { seriesId: Number(id) } })

  const series = await prisma.series.update({
    where: { id: Number(id) },
    data: {
      title,
      excerpt,
      description,
      photos: {
        create: (photos || []).map((p, index) => ({
          url: p.url,
          caption: p.caption || null,
          order: index,
        })),
      },
    },
    include: { photos: true },
  })

  res.json(series)
}

export async function deleteSeries(req, res) {
  const { id } = req.params
  await prisma.series.delete({ where: { id: Number(id) } })
  res.status(204).send()
}