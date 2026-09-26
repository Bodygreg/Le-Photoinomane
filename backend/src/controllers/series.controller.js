import prisma from '../prisma.js'

function applyTranslation(series, lang) {
  if (lang === 'fr' || !series.translations || !series.translations[lang]) {
    return series
  }

  const t = series.translations[lang]
  return {
    ...series,
    title: t.title || series.title,
    excerpt: t.excerpt || series.excerpt,
    description: t.description || series.description,
  }
}

export async function getAllSeries(req, res) {
  const lang = req.query.lang || 'fr'

  const series = await prisma.series.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      photos: {
        orderBy: { order: 'asc' },
        take: 1,
      },
    },
  })

  res.json(series.map((s) => applyTranslation(s, lang)))
}

export async function getSeriesById(req, res) {
  const { id } = req.params
  const lang = req.query.lang || 'fr'

  const series = await prisma.series.findUnique({
    where: { id: Number(id) },
    include: { photos: { orderBy: { order: 'asc' } } },
  })

  if (!series) {
    return res.status(404).json({ error: 'Série introuvable.' })
  }

  res.json(applyTranslation(series, lang))
}