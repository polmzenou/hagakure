import React from 'react'
import { Link } from 'react-router-dom'

function Header() {
  return (
    <header className="main-header">
      <div className="header-container">
        <div className="logo-section">
          <img src="/images/logo/Logo noir-rouge.png" alt="Hagakure" className="header-logo" />
        </div>
        <nav className="main-nav">
          <Link to="#" className="nav-link active">Timeline</Link>
          <Link to="#" className="nav-link active">Map</Link>
          <Link to="/samourais" className="nav-link">Samourais</Link>
          <Link to="/clans" className="nav-link">Clans</Link>
          <Link to="/battles" className="nav-link">Batailles</Link>
          <Link to="/weapons" className="nav-link">Armes</Link>
          <Link to="/styles" className="nav-link">Style de combat</Link>
        </nav>
        <div className="user-section">
          <Link to="#" className="logout-link">Se déconnecter</Link>
          <div className="user-icon">👤</div>
        </div>
      </div>
    </header>
  )
}

export default Header

