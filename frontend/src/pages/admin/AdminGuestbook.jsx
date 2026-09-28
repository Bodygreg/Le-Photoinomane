import { useState, useEffect } from 'react'
import { adminFetch } from '../../adminApi'

function AdminGuestbook() {
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    adminFetch('/api/admin/guestbook/pending')
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        setEntries(data)
        setLoading(false)
      })
  }, [])

  const handleModeration = async (id, status) => {
    await adminFetch(`/api/admin/guestbook/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })

    setEntries((prev) => prev.filter((entry) => entry.id !== id))
  }

  return (
    <div>
      <h2 className="admin-dashboard__section-title">Messages en attente</h2>

      {loading ? (
        <p>Chargement...</p>
      ) : entries.length === 0 ? (
        <p>Aucun message en attente.</p>
      ) : (
        <div className="admin-dashboard__entries">
          {entries.map((entry) => (
            <div key={entry.id} className="admin-entry">
              <p className="admin-entry__text">{entry.text}</p>
              <div className="admin-entry__actions">
                <button
                  className="admin-entry__approve"
                  onClick={() => handleModeration(entry.id, 'APPROVED')}
                >
                  Approuver
                </button>
                <button
                  className="admin-entry__reject"
                  onClick={() => handleModeration(entry.id, 'REJECTED')}
                >
                  Refuser
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default AdminGuestbook