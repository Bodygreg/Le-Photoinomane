import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import AdminLoginModal from './AdminLoginModal'
import './Navbar.css'

const SECRET_SEQUENCE = ['fr', 'zh', 'ru', 'en']
const SEQUENCE_TIMEOUT = 5000 // 5 secondes

function Navbar() {
  const [showAdminModal, setShowAdminModal] = useState(false)
  const clicksRef = useRef([])
  const timeoutRef = useRef(null)

  const handleLangClick = (lang) => {
    clicksRef.current.push(lang)

    clearTimeout(timeoutRef.current)

    const expectedSoFar = SECRET_SEQUENCE.slice(0, clicksRef.current.length)
    const isStillCorrect = clicksRef.current.every((click, i) => click === expectedSoFar[i])

    if (!isStillCorrect) {
      clicksRef.current = []
      return
    }

    if (clicksRef.current.length === SECRET_SEQUENCE.length) {
      clicksRef.current = []
      setShowAdminModal(true)
      return
    }

    timeoutRef.current = setTimeout(() => {
      clicksRef.current = []
    }, SEQUENCE_TIMEOUT)
  }

  return (
    <header className="navbar">
      <div className="navbar__lang navbar__lang--left">
        <button className="navbar__lang-btn" onClick={() => handleLangClick('fr')}>Fr</button>
        <button className="navbar__lang-btn" onClick={() => handleLangClick('ru')}>Рус</button>
      </div>

      <h1 className="navbar__title">
        <Link to="/">Le Photoïnomane</Link>
      </h1>

      <div className="navbar__lang navbar__lang--right">
        <button className="navbar__lang-btn" onClick={() => handleLangClick('en')}>Eng</button>
        <button className="navbar__lang-btn" onClick={() => handleLangClick('zh')}>中文</button>
      </div>

      {showAdminModal && <AdminLoginModal onClose={() => setShowAdminModal(false)} />}
    </header>
  )
}

export default Navbar