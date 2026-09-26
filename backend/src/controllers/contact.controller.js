import prisma from '../prisma.js'
import resend from '../resend.js'

export async function sendContactMessage(req, res) {
  const { email, message } = req.body

  if (!email || !message) {
    return res.status(400).json({ error: 'Email et message requis.' })
  }

  const contactMessage = await prisma.contactMessage.create({
    data: { email, message },
  })

  try {
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: process.env.ADMIN_EMAIL,
      replyTo: email,
      subject: 'Nouveau message de contact — Le Photoïnomane',
      text: `De : ${email}\n\n${message}`,
    })
  } catch (err) {
    console.error('Erreur envoi email:', err)
    // On ne bloque pas la réponse même si l'email échoue : le message est déjà en base
  }

  res.status(201).json(contactMessage)
}