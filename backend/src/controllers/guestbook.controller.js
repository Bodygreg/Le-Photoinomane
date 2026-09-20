export function getGuestbookEntries(req, res) {
  // Pour l'instant, données factices — remplacé par Prisma juste après
  const entries = [
    { id: 1, date: '2026-09-12', text: 'Message factice 1' },
    { id: 2, date: '2026-09-10', text: 'Message factice 2' },
  ]
  res.json(entries)
}

export function createGuestbookEntry(req, res) {
  const { text } = req.body

  if (!text || !text.trim()) {
    return res.status(400).json({ error: 'Message requis.' })
  }

  // TODO: enregistrer en base avec statut "en attente de validation", une fois Prisma branché
  console.log('Message livre d\'or reçu (en attente de validation) :', text)
  res.status(201).json({ success: true })
}