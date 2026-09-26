import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import './Contact.css'

function Contact() {
  const { t } = useTranslation()
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState(null)

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
      <h1 className="contact__title">{t('contact.title')}</h1>

      <p className="contact__intro">{t('contact.intro')}</p>

      <form className="contact__form" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder={t('contact.emailPlaceholder')}
          className="contact__input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <textarea
          placeholder={t('contact.messagePlaceholder')}
          className="contact__textarea"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        />

        <button type="submit" className="contact__submit" disabled={status === 'sending'}>
          {status === 'sending' ? t('contact.sending') : t('contact.send')}
        </button>

        {status === 'success' && <p className="contact__feedback contact__feedback--success">{t('contact.success')}</p>}
        {status === 'error' && <p className="contact__feedback contact__feedback--error">{t('contact.error')}</p>}
      </form>
    </div>
  )
}

export default Contact