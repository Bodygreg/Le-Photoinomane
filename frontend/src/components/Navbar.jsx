import { Link } from 'react-router-dom'
import './Navbar.css'

function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar__lang navbar__lang--left">
        <button className="navbar__lang-btn">Fr</button>
        <button className="navbar__lang-btn">Рус</button>
      </div>

      <h1 className="navbar__title">
        <Link to="/">Le Photoïnomane</Link>
      </h1>

      <div className="navbar__lang navbar__lang--right">
        <button className="navbar__lang-btn">Eng</button>
        <button className="navbar__lang-btn">中文</button>
      </div>
    </header>
  )
}

export default Navbar