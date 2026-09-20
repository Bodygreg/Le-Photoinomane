import { useState } from 'react'
import './AdminLoginModal.css'

function AdminLoginModal({ onClose }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(false)

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })

      if (!res.ok) throw new Error()

      const data = await res.json()
      localStorage.setItem('adminToken', data.token)
      window.location.href = '/admin'
    } catch {
      setError(true)
      setLoading(false)
    }
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
          {error && <p className="admin-modal__error">Mot de passe incorrect.</p>}
        </form>
      </div>
    </div>
  )
}

export default AdminLoginModal