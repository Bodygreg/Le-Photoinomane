import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import './Footer.css'

function Footer() {
  const { t } = useTranslation()
  const isAdmin = !!localStorage.getItem('adminToken')

  return (
    <footer className="footer">
      <Link to="/livre-or" className="footer__link">{t('footer.guestbook')}</Link>
      <Link to="/a-propos" className="footer__link">{t('footer.about')}</Link>
      <Link to="/contact" className="footer__link">{t('footer.contact')}</Link>
      {isAdmin && <Link to="/admin" className="footer__link footer__link--admin">{t('footer.admin')}</Link>}
    </footer>
  )
}

export default Footer