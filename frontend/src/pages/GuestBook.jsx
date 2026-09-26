import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import './GuestBook.css'

function GuestBook() {
  const { t } = useTranslation()
  const [view, setView] = useState('list')
  const [sortOrder, setSortOrder] = useState('desc')
  const [entries, setEntries] = useState([])
  const [loadingEntries, setLoadingEntries] = useState(true)
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState(null)

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
    return new Date(dateStr).toLocaleDateString(undefined, {
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
      <h1 className="guestbook__title">{t('guestbook.title')}</h1>

      {view === 'list' ? (
        <>
          <button className="guestbook__sort" onClick={toggleSortOrder}>↑↓</button>

          {loadingEntries ? (
            <p className="guestbook__status">{t('guestbook.loading')}</p>
          ) : (
            <div className="guestbook__list">
              {sortedEntries.length === 0 ? (
                <p className="guestbook__status">{t('guestbook.empty')}</p>
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
            {t('guestbook.writeButton')}
          </button>
        </>
      ) : (
        <form className="guestbook__form" onSubmit={handleSubmit}>
          <textarea
            placeholder={t('guestbook.textareaPlaceholder')}
            className="guestbook__textarea"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          <p className="guestbook__notice">
            {t('guestbook.notice').split('\n').map((line, i) => (
              <span key={i}>{line}<br /></span>
            ))}
          </p>

          <div className="guestbook__form-actions">
            <button type="button" className="guestbook__cancel" onClick={() => setView('list')}>
              {t('guestbook.backButton')}
            </button>
            <button type="submit" className="guestbook__submit" disabled={status === 'sending'}>
              {status === 'sending' ? t('guestbook.sending') : t('guestbook.send')}
            </button>
          </div>

          {status === 'success' && <p className="guestbook__feedback guestbook__feedback--success">{t('guestbook.success')}</p>}
          {status === 'error' && <p className="guestbook__feedback guestbook__feedback--error">{t('guestbook.error')}</p>}
        </form>
      )}
    </div>
  )
}

export default GuestBook