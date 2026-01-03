import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { statsApi } from '../services/api'
import Header from '../components/Header'
import Hero from '../components/Hero'
import StatsSection from '../components/StatsSection'
import OfferSection from '../components/OfferSection'
import AboutSection from '../components/AboutSection'
import ExploreSection from '../components/ExploreSection'
import Footer from '../components/Footer'

function Home() {
  const [stats, setStats] = useState({
    samourais: 0,
    clans: 0,
    battles: 0,
    weapons: 0
  })

  useEffect(() => {
    statsApi.getStats().then(setStats)
  }, [])

  return (
    <div className="app">
      <Header />
      <Hero />
      <StatsSection stats={stats} />
      <OfferSection />
      <AboutSection />
      <ExploreSection />
      <Footer />
    </div>
  )
}

export default Home
