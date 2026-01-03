import React from 'react'

function StatsSection({ stats }) {
  return (
    <section className="encyclopedia-section">
      <div className="section-container">
        <h2 className="section-title-jp">「完全な百科事典」</h2>
        <h2 className="section-title-fr">Une encyclopédie complète</h2>
        <p className="section-subtitle">Plongez dans une base de données exhaustive sur le Japon féodal</p>
        
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">⚔️</div>
            <div className="stat-number">{stats.samourais}</div>
            <div className="stat-label">Samourais</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🏯</div>
            <div className="stat-number">{stats.clans}</div>
            <div className="stat-label">Clans</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⚡</div>
            <div className="stat-number">{stats.battles}</div>
            <div className="stat-label">Batailles</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🗡️</div>
            <div className="stat-number">{stats.weapons}</div>
            <div className="stat-label">Armes</div>
          </div>
        </div>
        
        <div className="bg-text-jp">完全な百科事典</div>
      </div>
    </section>
  )
}

export default StatsSection

