import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import './NotFound.css'

function NotFound() {
  return (
    <div className="app">
      <Header />
      <div className="not-found-container">
        <div className="not-found-content">
          <h1 className="not-found-title">404</h1>
          <h2 className="not-found-subtitle">Page Non Trouvée</h2>
          <p className="not-found-message">
            La page que vous recherchez n'existe pas ou a été déplacée.
          </p>
          <p className="not-found-submessage">
            Il se peut que l'URL soit incorrecte ou que la page ait été supprimée.
          </p>
          <div className="not-found-actions">
            <Link to="/" className="btn-primary">
              Retour à l'accueil
            </Link>
            <Link to="/samourais" className="btn-secondary">
              Explorer les Samourais
            </Link>
          </div>
          <div className="not-found-suggestions">
            <p className="suggestions-title">Vous cherchez peut-être :</p>
            <div className="suggestions-links">
              <Link to="/samourais" className="suggestion-link">Samourais</Link>
              <Link to="/clans" className="suggestion-link">Clans</Link>
              <Link to="/weapons" className="suggestion-link">Armes</Link>
              <Link to="/styles" className="suggestion-link">Styles de combat</Link>
              <Link to="/timeline" className="suggestion-link">Timeline</Link>
              <Link to="/map" className="suggestion-link">Carte</Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default NotFound
