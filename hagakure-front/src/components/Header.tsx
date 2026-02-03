import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { authApi } from '../services/api'
import { isAdmin } from '../utils/permissions'
import './Header.css'

interface User {
  id: number
  email: string
  username: string
}

function Header() {
  const [user, setUser] = useState<User | null>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const currentUser = authApi.getCurrentUser()
    if (currentUser) {
      setUser(currentUser)
    }
  }, [])

  const handleLogout = () => {
    authApi.logout()
    setUser(null)
    setIsMobileMenuOpen(false)
    navigate('/')
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  const isLoggedIn = !!user

  return (
    <header className="main-header">
      <div className="header-container">
        <div className="header-left">
          <Link to="/" className="logo-link" onClick={closeMobileMenu}>
            <img src="/images/logo/Logo noir-rouge.png" alt="Hagakure" className="header-logo" width="58" height="50" />
          </Link>
          <nav className="left-nav">
            <Link to="/timeline" className="nav-link nav-timeline" onClick={closeMobileMenu}>Timeline</Link>
            <Link to="/map" className="nav-link nav-map" onClick={closeMobileMenu}>Map</Link>
          </nav>
        </div>

        <nav className="main-nav">
          <Link to="/samourais" className="nav-link" onClick={closeMobileMenu}>Samourais</Link>
          <Link to="/clans" className="nav-link" onClick={closeMobileMenu}>Clans</Link>
          <Link to="/battles" className="nav-link" onClick={closeMobileMenu}>Batailles</Link>
          <Link to="/weapons" className="nav-link" onClick={closeMobileMenu}>Armes</Link>
          {isLoggedIn && isAdmin() && (
            <Link to="/styles" className="nav-link" onClick={closeMobileMenu}>Styles de combat</Link>
          )}
          {isLoggedIn && isAdmin() && (
            <Link to="/users" className="nav-link" onClick={closeMobileMenu}>Back Office</Link>
          )}
        </nav>

        <div className="header-right">
          {isLoggedIn ? (
            <>
              <button onClick={handleLogout} className="auth-link logout-btn">Se déconnecter</button>
              <Link to="/account" className="profile-link" onClick={closeMobileMenu} aria-label="Mon compte">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2"/>
                  <path d="M4 20C4 16.6863 6.68629 14 10 14H14C17.3137 14 20 16.6863 20 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </Link>
            </>
          ) : (
            <Link to="/login" className="auth-link" onClick={closeMobileMenu}>Se connecter</Link>
          )}
        </div>

        <button 
          className="mobile-menu-toggle"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          <span className={`hamburger-line ${isMobileMenuOpen ? 'open' : ''}`}></span>
          <span className={`hamburger-line ${isMobileMenuOpen ? 'open' : ''}`}></span>
          <span className={`hamburger-line ${isMobileMenuOpen ? 'open' : ''}`}></span>
        </button>
      </div>

      <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
        <nav className="mobile-nav">
          <Link to="/timeline" className="mobile-nav-link nav-timeline" onClick={closeMobileMenu}>Timeline</Link>
          <Link to="/map" className="mobile-nav-link nav-map" onClick={closeMobileMenu}>Map</Link>
          <Link to="/samourais" className="mobile-nav-link" onClick={closeMobileMenu}>Samourais</Link>
          <Link to="/clans" className="mobile-nav-link" onClick={closeMobileMenu}>Clans</Link>
          <Link to="/battles" className="mobile-nav-link" onClick={closeMobileMenu}>Batailles</Link>
          <Link to="/weapons" className="mobile-nav-link" onClick={closeMobileMenu}>Armes</Link>
          {isLoggedIn && isAdmin() && (
            <Link to="/styles" className="mobile-nav-link" onClick={closeMobileMenu}>Styles de combat</Link>
          )}
          {isLoggedIn && isAdmin() && (
            <Link to="/users" className="mobile-nav-link" onClick={closeMobileMenu}>Gestion des utilisateurs</Link>
          )}
        </nav>
        <div className="mobile-auth">
          {isLoggedIn ? (
            <>
              <div className="mobile-user-info">
                <span className="mobile-user-name">{user?.username}</span>
                <Link to="/account" className="mobile-profile-link" onClick={closeMobileMenu}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2"/>
                    <path d="M4 20C4 16.6863 6.68629 14 10 14H14C17.3137 14 20 16.6863 20 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  Mon compte
                </Link>
              </div>
              <button onClick={handleLogout} className="mobile-logout-btn">Se déconnecter</button>
            </>
          ) : (
            <Link to="/login" className="mobile-login-link" onClick={closeMobileMenu}>Se connecter</Link>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header