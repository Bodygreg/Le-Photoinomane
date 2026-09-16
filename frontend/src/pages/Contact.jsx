import { useState } from 'react'
import './Contact.css'

function Contact() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState(null) // null | 'sending' | 'success' | 'error'

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!email || !message) {
      setStatus('error')
      return
    }

    // Simulation d'envoi en attendant le backend
    setStatus('sending')
    setTimeout(() => {
      console.log('Envoi simulé :', { email, message })
      setStatus('success')
      setEmail('')
      setMessage('')
    }, 800)
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
        {status === 'error' && <p className="contact__feedback contact__feedback--error">Merci de remplir tous les champs.</p>}
      </form>
    </div>
  )
}

export default Contact