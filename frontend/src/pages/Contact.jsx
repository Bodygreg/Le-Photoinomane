import { useState } from 'react'
import './Contact.css'

function Contact() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState(null) // null | 'sending' | 'success' | 'error'

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!email || !message) {
      setStatus('error')
      return
    }

    setStatus('sending')

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, message }),
      })

      if (!res.ok) throw new Error()

      setStatus('success')
      setEmail('')
      setMessage('')
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="contact">
      <h1 className="contact__title">Contact</h1>

      <p className="contact__intro">
        Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of
        classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin
        professor at Hampden-Sydney College in Virginia.
      </p>

      <form className="contact__form" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="e-mail"
          className="contact__input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <textarea
          placeholder="Message"
          className="contact__textarea"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        />

        <button type="submit" className="contact__submit" disabled={status === 'sending'}>
          {status === 'sending' ? 'Envoi...' : 'Envoyer'}
        </button>

        {status === 'success' && <p className="contact__feedback contact__feedback--success">Message envoyé !</p>}
        {status === 'error' && <p className="contact__feedback contact__feedback--error">Une erreur est survenue. Merci de réessayer.</p>}
      </form>
    </div>
  )
}

export default Contact