export function sendContactMessage(req, res) {
  const { email, message } = req.body

  if (!email || !message) {
    return res.status(400).json({ error: 'Email et message requis.' })
  }

  // TODO: enregistrer en base + envoyer via Resend, une fois branchés
  console.log('Message de contact reçu :', { email, message })
  res.status(201).json({ success: true })
}