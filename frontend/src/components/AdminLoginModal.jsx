import { useState } from 'react'
import './AdminLoginModal.css'

function AdminLoginModal({ onClose }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ password }),
      })

      if (res.status === 401) {
        setError('Mot de passe incorrect.')
      } else if (res.status === 429) {
        setError('Trop de tentatives. Réessayez dans 15 minutes.')
      } else if (!res.ok) {
        setError('Erreur du serveur.')
      } else {
        localStorage.setItem('adminSession', '1')
        window.location.href = '/admin'
        return
      }
    } catch {
      setError('Impossible de joindre le serveur.')
    }

    setLoading(false)
  }

  return (
    <div className="admin-modal__overlay" onClick={onClose}>
      <div className="admin-modal__box" onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            autoFocus
            placeholder="Mot de passe admin"
            className="admin-modal__input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="admin-modal__submit" disabled={loading}>
            {loading ? '...' : 'Valider'}
          </button>
          {error && <p className="admin-modal__error">{error}</p>}
        </form>
      </div>
    </div>
  )
}

export default AdminLoginModal