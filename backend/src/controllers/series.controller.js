import prisma from '../prisma.js'

export async function getAllSeries(req, res) {
  const series = await prisma.series.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      photos: {
        orderBy: { order: 'asc' },
        take: 1,
      },
    },
  })
  res.json(series)
}

export async function getSeriesById(req, res) {
  const { id } = req.params
  const series = await prisma.series.findUnique({
    where: { id: Number(id) },
    include: { photos: { orderBy: { order: 'asc' } } },
  })

  if (!series) {
    return res.status(404).json({ error: 'Série introuvable.' })
  }

  res.json(series)
}