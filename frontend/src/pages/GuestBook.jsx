import { useState, useEffect } from 'react'
import './GuestBook.css'

function GuestBook() {
  const [view, setView] = useState('list') // 'list' | 'write'
  const [sortOrder, setSortOrder] = useState('desc') // 'desc' = récent d'abord
  const [entries, setEntries] = useState([])
  const [loadingEntries, setLoadingEntries] = useState(true)
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState(null) // null | 'sending' | 'success' | 'error'

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/guestbook`)
      .then((res) => res.json())
      .then((data) => {
        setEntries(data)
        setLoadingEntries(false)
      })
      .catch(() => setLoadingEntries(false))
  }, [])

  const sortedEntries = [...entries].sort((a, b) => {
    return sortOrder === 'desc'
      ? new Date(b.createdAt) - new Date(a.createdAt)
      : new Date(a.createdAt) - new Date(b.createdAt)
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

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!message.trim()) {
      setStatus('error')
      return
    }

    setStatus('sending')

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/guestbook`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: message }),
      })

      if (!res.ok) throw new Error()

      setStatus('success')
      setMessage('')
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="guestbook">
      <h1 className="guestbook__title">Livre d'Or</h1>

      {view === 'list' ? (
        <>
          <button className="guestbook__sort" onClick={toggleSortOrder}>
            ↑↓
          </button>

          {loadingEntries ? (
            <p className="guestbook__status">Chargement...</p>
          ) : (
            <div className="guestbook__list">
              {sortedEntries.length === 0 ? (
                <p className="guestbook__status">Aucun message pour l'instant.</p>
              ) : (
                sortedEntries.map((entry) => (
                  <div key={entry.id} className="guestbook__entry">
                    <p className="guestbook__date">{formatDate(entry.createdAt)}</p>
                    <p className="guestbook__text">{entry.text}</p>
                  </div>
                ))
              )}
            </div>
          )}

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
              Une erreur est survenue. Merci de réessayer.
            </p>
          )}
        </form>
      )}
    </div>
  )
}

export default GuestBook