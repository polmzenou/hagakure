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
    navigate('/')
  }

  const isLoggedIn = !!user

  return (
    <header className="main-header">
      <div className="header-container">
        {/* Section Gauche : Logo + Timeline + Map */}
        <div className="header-left">
          <Link to="/" className="logo-link">
            <img src="/images/logo/Logo noir-rouge.png" alt="Hagakure" className="header-logo" />
          </Link>
          <nav className="left-nav">
            <Link to="/timeline" className="nav-link nav-timeline">Timeline</Link>
            <Link to="/map" className="nav-link nav-map">Map</Link>
          </nav>
        </div>

        {/* Section Milieu : Navigation CRUD */}
        <nav className="main-nav">
          <Link to="/samourais" className="nav-link">Samourais</Link>
          <Link to="/clans" className="nav-link">Clans</Link>
          {isAdmin() && (
            <Link to="/battles" className="nav-link">Batailles</Link>
          )}
          <Link to="/weapons" className="nav-link">Armes</Link>
          <Link to="/styles" className="nav-link">Style de combat</Link>
        </nav>

        {/* Section Droite : Connexion/Déconnexion + Profil */}
        <div className="header-right">
          {isLoggedIn ? (
            <>
              <span className="user-name">{user?.username}</span>
              <button onClick={handleLogout} className="auth-link logout-btn">Se déconnecter</button>
              <Link to="/account" className="profile-link">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2"/>
                  <path d="M4 20C4 16.6863 6.68629 14 10 14H14C17.3137 14 20 16.6863 20 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </Link>
            </>
          ) : (
            <Link to="/login" className="auth-link">Se connecter</Link>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header