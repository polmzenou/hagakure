import React from 'react'
import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer className="main-footer">
      <div className="footer-container">
        <div className="footer-column">
          <img src="/images/logo/Logo rouge.png" alt="Hagakure" className="footer-logo" />
          <p className="footer-description">
            Une encyclopédie dédiée à l'histoire fascinante du Japon féodal et de ses guerriers légendaires. 「葉隠・日本の魂を探る」
          </p>
        </div>
        <div className="footer-column">
          <h3 className="footer-title">Navigation</h3>
          <ul className="footer-links">
            <li><Link to="/samourais">Samourais</Link></li>
            <li><Link to="/clans">Clans</Link></li>
            <li><Link to="/weapons">Armes</Link></li>
            <li><Link to="/battles">Batailles</Link></li>
          </ul>
        </div>
        <div className="footer-column">
          <h3 className="footer-title">A propos</h3>
          <ul className="footer-links">
            <li><Link to="#">Nous contacter</Link></li>
            <li><Link to="#">A propos</Link></li>
            <li><Link to="#">Politique de confidentialité</Link></li>
          </ul>
        </div>
      </div>
      <div className="footer-copyright">
        <p>Hagakure. Tous droits réservés.</p>
      </div>
    </footer>
  )
}

export default Footer

