import { useState } from 'react'
import mockGuestbook from '../data/mockGuestbook'
import './GuestBook.css'

function GuestBook() {
  const [view, setView] = useState('list') // 'list' | 'write'
  const [sortOrder, setSortOrder] = useState('desc') // 'desc' = récent d'abord
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState(null) // null | 'sending' | 'success' | 'error'

  const sortedEntries = [...mockGuestbook].sort((a, b) => {
    return sortOrder === 'desc'
      ? new Date(b.date) - new Date(a.date)
      : new Date(a.date) - new Date(b.date)
  })

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === 'desc' ? 'asc' : 'desc'))
  }

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!message.trim()) {
      setStatus('error')
      return
    }

    // Simulation d'envoi en attendant le backend (le message part en attente de validation admin)
    setStatus('sending')
    setTimeout(() => {
      console.log('Message envoyé pour validation :', message)
      setStatus('success')
      setMessage('')
    }, 800)
  }

  return (
    <div className="guestbook">
      <h1 className="guestbook__title">Livre d'Or</h1>

      {view === 'list' ? (
        <>
          <button className="guestbook__sort" onClick={toggleSortOrder}>
            ↑↓
          </button>

          <div className="guestbook__list">
            {sortedEntries.map((entry) => (
              <div key={entry.id} className="guestbook__entry">
                <p className="guestbook__date">{formatDate(entry.date)}</p>
                <p className="guestbook__text">{entry.text}</p>
              </div>
            ))}
          </div>

          <button className="guestbook__write-btn" onClick={() => setView('write')}>
            Ecrire un message
          </button>
        </>
      ) : (
        <form className="guestbook__form" onSubmit={handleSubmit}>
          <textarea
            placeholder="Vos impressions"
            className="guestbook__textarea"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          <p className="guestbook__notice">
            Toute impression est la bienvenue, tant qu'elle est courtoise et respectueuse.
            <br />
            Toute critique aussi, tant qu'elle est objective et constructive.
            <br />
            Merci !
          </p>

          <div className="guestbook__form-actions">
            <button type="button" className="guestbook__cancel" onClick={() => setView('list')}>
              Retour
            </button>
            <button type="submit" className="guestbook__submit" disabled={status === 'sending'}>
              {status === 'sending' ? 'Envoi...' : 'Envoyer'}
            </button>
          </div>

          {status === 'success' && (
            <p className="guestbook__feedback guestbook__feedback--success">
              Message envoyé ! Il sera publié après validation.
            </p>
          )}
          {status === 'error' && (
            <p className="guestbook__feedback guestbook__feedback--error">
              Merci d'écrire un message avant d'envoyer.
            </p>
          )}
        </form>
      )}
    </div>
  )
}

export default GuestBook