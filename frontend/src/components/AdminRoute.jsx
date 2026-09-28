import { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'

function AdminRoute({ children }) {
  const [status, setStatus] = useState('checking') // 'checking' | 'ok' | 'denied'

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/admin/session`, { credentials: 'include' })
      .then((res) => {
        if (res.ok) {
          setStatus('ok')
        } else {
          localStorage.removeItem('adminSession')
          setStatus('denied')
        }
      })
      .catch(() => setStatus('denied'))
  }, [])

  if (status === 'checking') return null
  if (status === 'denied') return <Navigate to="/" replace />

  return children
}

export default AdminRoute