import { useState, useEffect } from 'react'

function AdminGuestbook() {
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)

  const token = localStorage.getItem('adminToken')

  const fetchPending = () => {
    fetch(`${import.meta.env.VITE_API_URL}/api/admin/guestbook/pending`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (res.status === 401) {
          localStorage.removeItem('adminToken')
          window.location.href = '/'
          return null
        }
        return res.json()
      })
      .then((data) => {
        if (data) {
          setEntries(data)
          setLoading(false)
        }
      })
  }

  useEffect(() => {
    fetchPending()
  }, [])

  const handleModeration = async (id, status) => {
    await fetch(`${import.meta.env.VITE_API_URL}/api/admin/guestbook/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
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