import { Link } from 'react-router-dom'
import './Footer.css'

function Footer() {
  return (
    <footer className="main-footer">
      <div className="footer-container">
        <div className="footer-column footer-left">
          <img src="/images/logo/Logo blanc-rouge.png" alt="Hagakure" className="footer-logo" width="230" height="200" />
          <p className="footer-description">
            Une encyclopédie dédiée à l'histoire fascinante du Japon féodal et de ses guerriers légendaires.
          </p>
          <p className="footer-japanese">「葉隠・日本の魂を探る」</p>
        </div>
        <div className="footer-column">
          <h3 className="footer-title">Navigation</h3>
          <ul className="footer-links">
            <li>
              <Link to="/samourais">Samourais</Link>
            </li>
            <li>
              <Link to="/clans">Clans</Link>
            </li>
            <li>
              <Link to="/weapons">Armes</Link>
            </li>
            <li>
              <Link to="/battles">Batailles</Link>
            </li>
          </ul>
        </div>
        <div className="footer-column">
          <h3 className="footer-title">À propos</h3>
          <ul className="footer-links">
            <li>
              <Link to="#">Nous contacter</Link>
            </li>
            <li>
              <Link to="/#apropos">À propos</Link>
            </li>
            <li>
              <Link to="#">Politique de confidentialité</Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="footer-divider"></div>
        <p className="footer-copyright">Hagakure. Tous droits réservés.</p>
      </div>
    </footer>
  )
}

export default Footer
