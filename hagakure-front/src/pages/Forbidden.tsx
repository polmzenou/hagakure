import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import './Forbidden.css'

function Forbidden() {
  return (
    <div className="app">
      <Header />
      <div className="forbidden-container">
        <div className="forbidden-content">
          <div className="forbidden-icon">🚫</div>
          <h1 className="forbidden-title">Accès Refusé</h1>
          <p className="forbidden-message">
            Vous n'avez pas les permissions nécessaires pour accéder à cette page.
          </p>
          <p className="forbidden-submessage">
            Seuls les administrateurs peuvent créer, modifier ou supprimer du contenu.
          </p>
          <div className="forbidden-actions">
            <Link to="/" className="btn-primary">
              Retour à l'accueil
            </Link>
            <Link to="/login" className="btn-secondary">
              Se connecter
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Forbidden

