import prisma from '../prisma.js'

export async function sendContactMessage(req, res) {
  const { email, message } = req.body

  if (!email || !message) {
    return res.status(400).json({ error: 'Email et message requis.' })
  }

  const contactMessage = await prisma.contactMessage.create({
    data: { email, message },
  })

  // TODO: envoyer via Resend, une fois branché
  res.status(201).json(contactMessage)
}