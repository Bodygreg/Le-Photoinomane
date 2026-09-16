import { Link } from 'react-router-dom'
import './Footer.css'

function Footer() {
  return (
    <footer className="footer">
      <Link to="/livre-or" className="footer__link">Livre d'or</Link>
      <Link to="/a-propos" className="footer__link">A propos</Link>
      <Link to="/contact" className="footer__link">Contact</Link>
    </footer>
  )
}

export default Footer