import React from 'react'

function Hero() {
  return (
    <section className="hero-section">
      <div className="hero-background">
        <img src="/images/hero bg.png" alt="Japanese landscape" className="hero-bg-image" />
      </div>
      <div className="hero-content">
        <div className="hero-logo">
          <img src="/images/logo/Logo rouge.png" alt="Hagakure" className="hero-logo-img" />
        </div>
        <h1 className="hero-title">L'encyclopédie interactive du Japon féodal</h1>
        <p className="hero-subtitle">「葉隠-日本の魂を探る」</p>
        <div className="scroll-indicator">
          <div className="scroll-arrow">↓</div>
        </div>
      </div>
    </section>
  )
}

export default Hero

