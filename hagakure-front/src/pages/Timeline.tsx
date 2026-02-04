import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { timelineApi, authApi, favoriteApi, battleApi } from '../services/api'
import type { TimelineEvent } from '../services/api'
import { formatDate } from '../utils/dateUtils'
import { isAdmin } from '../utils/permissions'
import Header from '../components/Header'
import Footer from '../components/Footer'
import HistoricalEras from '../components/HistoricalEras'
import './Timeline.css'

function Timeline() {
  const navigate = useNavigate()
  const [events, setEvents] = useState<TimelineEvent[]>([])
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)
  const [favoriteId, setFavoriteId] = useState<number | null>(null)
  const [battleData, setBattleData] = useState<any | null>(null)
  const [loadingBattle, setLoadingBattle] = useState(false)
  const [zoomLevel, setZoomLevel] = useState(1)
  const [activeFilters, setActiveFilters] = useState<string[]>([])
  const [userIsAdmin, setUserIsAdmin] = useState(false)
  const timelineRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)
  const [velocity, setVelocity] = useState(0)
  const [lastX, setLastX] = useState(0)
  const [lastTime, setLastTime] = useState(0)
  const [snappedEvent, setSnappedEvent] = useState<number | null>(null)
  const [inertiaFrameCount, setInertiaFrameCount] = useState(0)
  const animationRef = useRef<number | null>(null)
  const MAX_INERTIA_FRAMES = 35

  const loadTimeline = async () => {
    try {
      const data = await timelineApi.getAll()
      setEvents(data)
      setLoading(false)
    } catch (error) {
      console.error('Error loading timeline:', error)
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTimeline()
    setIsAuthenticated(authApi.isAuthenticated())
    setUserIsAdmin(isAdmin())
  }, [])

  const years = events.map(e => e.year)
  const minYear = Math.min(...years, 1500)
  const maxYear = Math.max(...years, 1700)
  const yearRange = maxYear - minYear || 100

  const getEventPosition = (year: number): number => {
    return ((year - minYear) / yearRange) * 100
  }

  const generateYearMarkers = () => {
    const markers = []
    const step = yearRange > 200 ? 50 : yearRange > 100 ? 20 : 10
    
    for (let year = Math.floor(minYear / step) * step; year <= maxYear; year += step) {
      if (year >= minYear) {
        markers.push(year)
      }
    }
    return markers
  }

  const handleEventClick = async (event: TimelineEvent) => {
    setSelectedEvent(event)
    setBattleData(null)
    
    if (event.type === 'battle' && event.battle_id) {
      setLoadingBattle(true)
      try {
        const battle = await battleApi.getOne(event.battle_id)
        setBattleData(battle)
        
        if (isAuthenticated) {
          try {
            const result = await favoriteApi.check({
              entity_type: 'battle',
              entity_id: event.battle_id
            })
            setIsFavorite(result.is_favorite)
            setFavoriteId(result.favorite_id || null)
          } catch (error) {
            console.error('Error checking favorite:', error)
            setIsFavorite(false)
            setFavoriteId(null)
          }
        }
      } catch (error) {
        console.error('Error loading battle:', error)
        setBattleData(null)
      } finally {
        setLoadingBattle(false)
      }
    } else {
      if (isAuthenticated) {
        try {
          const result = await favoriteApi.check({
            entity_type: 'timeline',
            entity_id: event.id
          })
          setIsFavorite(result.is_favorite)
          setFavoriteId(result.favorite_id || null)
        } catch (error) {
          console.error('Error checking favorite:', error)
          setIsFavorite(false)
          setFavoriteId(null)
        }
      }
    }
  }

  const handleAddToFavorites = async () => {
    if (!selectedEvent || !isAuthenticated) return

    try {
      // Utiliser entity_type: 'battle' pour synchroniser avec BattleShow
      if (selectedEvent.type === 'battle' && selectedEvent.battle_id) {
        const result = await favoriteApi.toggle({
          entity_type: 'battle',
          entity_id: selectedEvent.battle_id
        })
        setIsFavorite(result.is_favorite)
        setFavoriteId(result.favorite_id || null)
      } else {
        const result = await favoriteApi.toggle({
          entity_type: 'timeline',
          entity_id: selectedEvent.id
        })
        setIsFavorite(result.is_favorite)
        setFavoriteId(result.favorite_id || null)
      }
    } catch (error: any) {
      console.error('Error toggling favorite:', error)
      alert(error.message || 'Erreur lors de l\'ajout aux favoris')
    }
  }

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.2, 2))
  }

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.2, 0.5))
  }

  const handleResetZoom = () => {
    setZoomLevel(1)
  }

  const toggleFilter = (filter: string) => {
    if (filter === 'tous') {
      setActiveFilters([])
      return
    }

    setActiveFilters(prev => {
      if (prev.includes(filter)) {
        return prev.filter(f => f !== filter)
      } else {
        return [...prev, filter]
      }
    })
  }

  const isEventFiltered = (event: TimelineEvent): boolean => {
    if (activeFilters.length === 0) return true
    return activeFilters.includes(event.type)
  }

  const availableFilters = [
    { id: 'tous', label: 'Tous', color: '#666' },
    { id: 'battle', label: 'Batailles', color: '#D0391B' },
    { id: 'birth', label: 'Naissances', color: '#4A90E2' },
    { id: 'death', label: 'Morts', color: '#8B4513' },
    { id: 'duel', label: 'Duels', color: '#FF6B35' },
    { id: 'politique', label: 'Politique', color: '#7B68EE' },
  ]

  // Définition des périodes historiques avec leurs couleurs
  const historicalPeriods = [
    { name: 'Heian', start: 794, end: 1185, color: 'rgba(138, 43, 226, 0.08)' }, 
    { name: 'Kamakura', start: 1185, end: 1333, color: 'rgba(30, 144, 255, 0.08)' },
    { name: 'Muromachi', start: 1336, end: 1573, color: 'rgba(50, 205, 50, 0.08)' }, 
    { name: 'Sengoku', start: 1467, end: 1603, color: 'rgba(255, 140, 0, 0.1)' }, 
    { name: 'Edo', start: 1603, end: 1868, color: 'rgba(220, 20, 60, 0.08)' }, 
    { name: 'Meiji', start: 1868, end: 1912, color: 'rgba(255, 215, 0, 0.1)' }, 
  ]

  // Trouver l'événement le plus proche du centre visible
  const findNearestEvent = (): { event: TimelineEvent; position: number; distance: number } | null => {
    if (!timelineRef.current || events.length === 0) return null

    const container = timelineRef.current
    const containerCenter = container.scrollLeft + container.offsetWidth / 2

    let nearestEvent: { event: TimelineEvent; position: number; distance: number } | null = null
    let minDistance = Infinity

    events.forEach(event => {
      if (!isEventFiltered(event)) return 

      const eventPosition = (getEventPosition(event.year) / 100) * 
        (Math.max(1500, yearRange * 10) * zoomLevel) + 100

      const distance = Math.abs(containerCenter - eventPosition)
      
      if (distance < minDistance) {
        minDistance = distance
        nearestEvent = { event, position: eventPosition, distance }
      }
    })

    return nearestEvent
  }

  // Animation d'inertie avec décélération progressive et aimantation
  const applyInertia = () => {
    if (!timelineRef.current) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
        animationRef.current = null
      }
      return
    }

    const absVelocity = Math.abs(velocity)

    // Arrêt forcé après durée maximale (effet de glisse court)
    if (inertiaFrameCount >= MAX_INERTIA_FRAMES) {
      setVelocity(0)
      setInertiaFrameCount(0)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
        animationRef.current = null
      }
      return
    }

    setInertiaFrameCount(prev => prev + 1)

    // Ralentissement progressif (décélération exponentielle)
    if (absVelocity < 0.3) {
      // Phase d'aimantation : attirer vers l'événement le plus proche
      const nearest = findNearestEvent()
      
      if (nearest && nearest.distance < 300) {
        const container = timelineRef.current
        const containerCenter = container.scrollLeft + container.offsetWidth / 2
        const diff = nearest.position - containerCenter
        
        // Aimantation douce
        if (Math.abs(diff) > 2) {
          container.scrollLeft += diff * 0.15
          setSnappedEvent(nearest.event.id)
          animationRef.current = requestAnimationFrame(applyInertia)
        } else {
          // Snap final précis
          container.scrollLeft += diff
          setSnappedEvent(nearest.event.id)
          if (animationRef.current) {
            cancelAnimationFrame(animationRef.current)
            animationRef.current = null
          }
          setVelocity(0)
          setInertiaFrameCount(0)
        }
        return
      } else {
        // Arrêt si pas d'événement proche
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current)
          animationRef.current = null
        }
        setVelocity(0)
        setInertiaFrameCount(0)
        return
      }
    }

    // Phase de défilement avec friction progressive plus forte
    timelineRef.current.scrollLeft -= velocity
    
    // Friction plus forte pour un arrêt plus rapide
    const frictionFactor = absVelocity > 5 ? 0.92 : 
                          absVelocity > 2 ? 0.88 : 
                          absVelocity > 1 ? 0.82 : 0.75
    
    setVelocity(velocity * frictionFactor)
    animationRef.current = requestAnimationFrame(applyInertia)
  }

  // Gestion du scroll avec la souris (drag) avec vélocité
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!timelineRef.current) return
    
    // Annuler l'animation d'inertie en cours
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
      animationRef.current = null
    }
    
    setIsDragging(true)
    setStartX(e.pageX - timelineRef.current.offsetLeft)
    setScrollLeft(timelineRef.current.scrollLeft)
    setLastX(e.pageX)
    setLastTime(Date.now())
    setVelocity(0)
    setInertiaFrameCount(0)
    setSnappedEvent(null) 
  }

  const handleMouseLeave = () => {
    if (isDragging && velocity !== 0) {
      // Lancer l'animation d'inertie
      applyInertia()
    }
    setIsDragging(false)
  }

  const handleMouseUp = () => {
    if (isDragging && velocity !== 0) {
      // Lancer l'animation d'inertie
      applyInertia()
    }
    setIsDragging(false)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !timelineRef.current) return
    e.preventDefault()
    
    const currentTime = Date.now()
    const currentX = e.pageX
    const x = currentX - timelineRef.current.offsetLeft
    const walk = (x - startX) * 2
    
    timelineRef.current.scrollLeft = scrollLeft - walk
    
    // calculer la vélocité (réduite pour un scroll moins rapide)
    const timeDelta = currentTime - lastTime
    if (timeDelta > 0) {
      const newVelocity = (currentX - lastX) / timeDelta * 16
      setVelocity(newVelocity * 0.6)
    }
    
    setLastX(currentX)
    setLastTime(currentTime)
  }

  // nettoyer l'animation lors du démontage
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  if (loading) {
    return (
      <div className="app">
        <Header />
        <div className="timeline-container">
          <div className="loading">Chargement de la timeline...</div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="app">
      <Header />
      <div className="timeline-page">
        <div className="timeline-header">
          <h1 className="timeline-title">Frise Chronologique</h1>
          <h2 className="timeline-title-jp">「年代順」</h2>
          <p className="timeline-subtitle">
            Explorez l'histoire des samourais et des batailles légendaires du Japon féodal
          </p>
        </div>

        <div className="timeline-wrapper">
            {/* Contrôles et filtres */}
          <div className="timeline-controls">
            {/* Format d'affichage */}
            <div className="timeline-format">
              <span>Format d'affichage :</span>
              <button className="format-btn active">Frise</button>
            </div>

            {/* Contrôles de zoom */}
            <div className="zoom-controls">
              <button 
                className="zoom-btn" 
                onClick={handleZoomOut}
                disabled={zoomLevel <= 0.5}
                title="Dézoomer"
              >
                −
              </button>
              <span className="zoom-level">{Math.round(zoomLevel * 100)}%</span>
              <button 
                className="zoom-btn" 
                onClick={handleZoomIn}
                disabled={zoomLevel >= 2}
                title="Zoomer"
              >
                +
              </button>
              <button 
                className="zoom-btn reset" 
                onClick={handleResetZoom}
                title="Réinitialiser"
              >
                ↺
              </button>
            </div>
          </div>

          {/* Filtres par tags */}
          <div className="timeline-filters">
            {availableFilters.map(filter => (
              <button
                key={filter.id}
                className={`filter-tag ${
                  filter.id === 'tous' 
                    ? activeFilters.length === 0 ? 'active' : '' 
                    : activeFilters.includes(filter.id) ? 'active' : ''
                }`}
                onClick={() => toggleFilter(filter.id)}
                style={{
                  '--filter-color': filter.color
                } as React.CSSProperties}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {/* Frise chronologique scrollable */}
          <div 
            className="timeline-scroll-container" 
            ref={timelineRef}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
          >
            <div 
              className="timeline-canvas" 
              style={{ 
                minWidth: `${Math.max(1500, yearRange * 10) * zoomLevel}px`,
                transform: `scale(${zoomLevel})`,
                transformOrigin: 'left center'
              }}
            >
              {/* Zones colorées pour les périodes historiques */}
              <div className="historical-periods">
                {historicalPeriods.map(period => {
                  const startPos = getEventPosition(period.start)
                  const endPos = getEventPosition(period.end)
                  const width = endPos - startPos
                  
                  return (
                    <div
                      key={period.name}
                      className="period-zone"
                      style={{
                        left: `${startPos}%`,
                        width: `${width}%`,
                        backgroundColor: period.color
                      }}
                    >
                      <span className="period-label">{period.name}</span>
                    </div>
                  )
                })}
              </div>

              {/* Marqueurs d'années */}
              <div className="year-markers">
                {generateYearMarkers().map(year => (
                  <div
                    key={year}
                    className="year-marker"
                    style={{ left: `${getEventPosition(year)}%` }}
                  >
                    <div className="year-label">{year}</div>
                    <div className="year-line"></div>
                  </div>
                ))}
              </div>

              {/* Ligne centrale de la frise */}
              <div className="timeline-line"></div>

              {/* événements */}
              <div className="timeline-events">
                {events.map((event, index) => {
                  const isTop = index % 2 === 0
                  const isFiltered = isEventFiltered(event)
                  return (
                    <div
                      key={event.id}
                      className={`timeline-event ${isTop ? 'top' : 'bottom'} ${
                        selectedEvent?.id === event.id ? 'selected' : ''
                      } ${snappedEvent === event.id ? 'snapped' : ''} ${event.type}-event ${!isFiltered ? 'filtered-out' : ''}`}
                      style={{ left: `${getEventPosition(event.year)}%` }}
                      onClick={() => isFiltered && handleEventClick(event)}
                    >
                      <div className="event-marker">
                        <div className="event-dot"></div>
                        <div className="event-line"></div>
                      </div>
                      <div className="event-card">
                        <div className="event-year">{event.year}</div>
                        <div className="event-title">{event.title}</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* détails de l'événement sélectionné */}
          {selectedEvent && (
            <div className="event-details">
              <div className="details-header">
                <div>
                  <span className={`event-type-badge ${selectedEvent.type}`}>
                    {selectedEvent.type === 'battle' && 'Bataille'}
                    {selectedEvent.type === 'birth' && 'Naissance'}
                    {selectedEvent.type === 'death' && 'Mort'}
                    {selectedEvent.type === 'duel' && 'Duel'}
                    {selectedEvent.type === 'politique' && 'Politique'}
                  </span>
                  <h2 className="details-title">{selectedEvent.title}</h2>
                  <p className="details-date">
                    {formatDate(selectedEvent.date)}
                  </p>
                </div>
                {isAuthenticated && (
                  <button 
                    className={`btn-favorites ${isFavorite ? 'active' : ''}`}
                    onClick={handleAddToFavorites}
                  >
                    {isFavorite ? '★ Retirer des Favoris' : '☆ Ajouter aux Favoris'}
                  </button>
                )}
                {userIsAdmin && (
                  <div className="admin-actions-inline">
                    <button 
                      className="btn-admin btn-edit"
                      onClick={() => navigate(`/events/${selectedEvent.id}/edit`)}
                      title="Modifier cet événement"
                    >
                      Modifier
                    </button>
                    <button 
                      className="btn-admin btn-delete"
                      onClick={async () => {
                        if (window.confirm('Êtes-vous sûr de vouloir supprimer cet événement ?')) {
                          try {
                            await timelineApi.delete(selectedEvent.id)
                            setEvents(prev => prev.filter(e => e.id !== selectedEvent.id))
                            setSelectedEvent(null)
                          } catch (error) {
                            console.error('Error deleting event:', error)
                            alert('Erreur lors de la suppression')
                          }
                        }
                      }}
                      title="Supprimer cet événement"
                    >
                      Supprimer
                    </button>
                  </div>
                )}
              </div>
              <div className="details-description">
                <p>{selectedEvent.description}</p>
              </div>

              {/* lien vers la bataille si c'est un événement de type battle */}
              {selectedEvent.type === 'battle' && selectedEvent.battle_id && (
                <div className="battle-link-section">
                  {loadingBattle ? (
                    <div className="loading-battle">Chargement de la bataille...</div>
                  ) : battleData ? (
                    <Link to={`/battles/${selectedEvent.battle_id}`} className="battle-link-card">
                      {battleData.image && (
                        <div className="battle-link-image">
                          <img src={battleData.image} alt={battleData.name} loading="lazy" width="60" height="60" />
                        </div>
                      )}
                      <div className="battle-link-content">
                        <h3 className="battle-link-title">{battleData.name}</h3>
                        <p className="battle-link-text">Voir les détails de cette bataille →</p>
                      </div>
                    </Link>
                  ) : (
                    <Link to={`/battles/${selectedEvent.battle_id}`} className="battle-link-simple">
                      Voir les détails de la bataille →
                    </Link>
                  )}
                </div>
              )}

              <button 
                className="btn-close-details" 
                onClick={() => setSelectedEvent(null)}
              >
                Fermer
              </button>
            </div>
          )}
        </div>
      </div>
      <HistoricalEras />
      <Footer />
    </div>
  )
}

export default Timeline

