import { Link } from 'react-router-dom'
import './Footer.css'

function Footer() {
  const isAdmin = !!localStorage.getItem('adminToken')

  return (
    <footer className="footer">
      <Link to="/livre-or" className="footer__link">Livre d'or</Link>
      <Link to="/a-propos" className="footer__link">A propos</Link>
      <Link to="/contact" className="footer__link">Contact</Link>
      {isAdmin && <Link to="/admin" className="footer__link footer__link--admin">Admin</Link>}
    </footer>
  )
}

export default Footer