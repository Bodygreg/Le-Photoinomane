import { useState } from 'react'
import AdminGuestbook from './AdminGuestbook'
import AdminSeries from './AdminSeries'
import './AdminDashboard.css'

function AdminDashboard() {
  const [tab, setTab] = useState('guestbook') // 'guestbook' | 'series'

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    window.location.href = '/'
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-dashboard__header">
        <h1>Espace admin</h1>
        <button onClick={handleLogout} className="admin-dashboard__logout">Déconnexion</button>
      </div>

      <div className="admin-dashboard__tabs">
        <button
          className={`admin-dashboard__tab ${tab === 'guestbook' ? 'admin-dashboard__tab--active' : ''}`}
          onClick={() => setTab('guestbook')}
        >
          Modération
        </button>
        <button
          className={`admin-dashboard__tab ${tab === 'series' ? 'admin-dashboard__tab--active' : ''}`}
          onClick={() => setTab('series')}
        >
          Séries
        </button>
      </div>

      {tab === 'guestbook' ? <AdminGuestbook /> : <AdminSeries />}
    </div>
  )
}

export default AdminDashboard