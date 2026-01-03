import React from 'react'
import { Link } from 'react-router-dom'

function ExploreSection() {
  return (
    <section className="explore-section">
      <div className="section-container">
        <h2 className="section-title-jp">「歴史を探る」</h2>
        <h2 className="section-title-fr">Explorez l'Histoire</h2>
        <p className="section-subtitle">Naviguez à travers le temps et l'espace du Japon féodal</p>
        
        <div className="explore-cards">
          <div className="explore-card">
            <div className="explore-icon">🕐</div>
            <h3 className="explore-card-title">Découvrez l'Histoire du Japon féodal</h3>
            <p className="explore-card-text">Accéder à la frise chronologique pour visualiser les événements marquants du Japon féodal.</p>
            <Link to="#" className="explore-link">Timeline →</Link>
          </div>
          <div className="explore-card">
            <div className="explore-icon">📍</div>
            <h3 className="explore-card-title">Explorez l'Histoire du Japon féodal</h3>
            <p className="explore-card-text">Accéder à la map pour visualiser les événements marquants du Japon féodal.</p>
            <Link to="#" className="explore-link">Map →</Link>
          </div>
        </div>
        
        <div className="bg-text-jp">歴史を探る</div>
      </div>
    </section>
  )
}

export default ExploreSection

