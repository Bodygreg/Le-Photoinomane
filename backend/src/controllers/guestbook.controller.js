import prisma from '../prisma.js'

export async function getGuestbookEntries(req, res) {
  const entries = await prisma.guestbookEntry.findMany({
    where: { status: 'APPROVED' },
    orderBy: { createdAt: 'desc' },
  })
  res.json(entries)
}

export async function createGuestbookEntry(req, res) {
  const { text } = req.body

  if (!text || !text.trim()) {
    return res.status(400).json({ error: 'Message requis.' })
  }

  const entry = await prisma.guestbookEntry.create({
    data: { text },
  })

  res.status(201).json(entry)
}