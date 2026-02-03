import { useState, useEffect, useRef, useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { samouraiApi, clanApi } from '../services/api'
import { isAdmin } from '../utils/permissions'
import { formatDateShort } from '../utils/dateUtils'
import Header from '../components/Header'
import Footer from '../components/Footer'
import './List.css'

interface Samourai {
  id: number
  name: string
  description?: string
  birth_date?: string
  death_date?: string
  image?: string
  clan?: {
    id: number
    name: string
  }
}

interface Clan {
  id: number
  name: string
}

function SamouraiList() {
  const [samourais, setSamourais] = useState<Samourai[]>([])
  const [filteredSamourais, setFilteredSamourais] = useState<Samourai[]>([])
  const [clans, setClans] = useState<Clan[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedClans, setSelectedClans] = useState<number[]>([])
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const itemsPerPage = 6
  const dropdownRef = useRef<HTMLDivElement>(null)
  const prevFiltersRef = useRef({ searchTerm, selectedClans })

  const loadData = async () => {
    setError(null)
    try {
      const [samouraisData, clansData] = await Promise.all([
        samouraiApi.getAll(),
        clanApi.getAll()
      ])
      setSamourais(Array.isArray(samouraisData) ? samouraisData : [])
      setClans(Array.isArray(clansData) ? clansData : [])
    } catch (err: unknown) {
      console.error('Error loading data:', err)
      setError((err as { message?: string })?.message || 'Impossible de charger les données.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    if (!searchParams.has('page')) {
      setSearchParams(prev => {
        const next = new URLSearchParams(prev)
        next.set('page', '1')
        return next
      })
    }
  }, [searchParams, setSearchParams])

  useEffect(() => {
    let filtered = [...samourais]

    if (searchTerm) {
      filtered = filtered.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (selectedClans.length > 0) {
      filtered = filtered.filter(s => s.clan && selectedClans.includes(s.clan.id))
    }

    setFilteredSamourais(filtered)
    const filtersChanged = prevFiltersRef.current.searchTerm !== searchTerm ||
      JSON.stringify(prevFiltersRef.current.selectedClans) !== JSON.stringify(selectedClans)
    prevFiltersRef.current = { searchTerm, selectedClans }
    if (filtersChanged) {
      setSearchParams(prev => {
        const next = new URLSearchParams(prev)
        next.set('page', '1')
        return next
      })
    }
  }, [searchTerm, selectedClans, samourais, setSearchParams])

  const totalPages = Math.ceil(filteredSamourais.length / itemsPerPage)
  const currentPage = useMemo(() => {
    const p = parseInt(searchParams.get('page') || '1', 10)
    if (isNaN(p) || p < 1) return 1
    return Math.min(p, totalPages || 1)
  }, [searchParams, totalPages])
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentSamourais = filteredSamourais.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev)
      next.set('page', String(page))
      return next
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleClanToggle = (clanId: number) => {
    setSelectedClans(prev =>
      prev.includes(clanId)
        ? prev.filter(id => id !== clanId)
        : [...prev, clanId]
    )
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  if (loading) return <div className="loading">Chargement...</div>

  if (error) {
    return (
      <div className="app">
        <Header />
        <div className="list-container">
          <div className="page-header">
            <div>
              <h1 className="page-title">Les Samourais</h1>
            </div>
          </div>
          <div className="list-error">
            <p>{error}</p>
            <button type="button" className="btn-retry" onClick={loadData}>Réessayer</button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="app">
      <Header />
      <div className="list-container">
        <div className="page-header">
          <div>
            <h1 className="page-title">Les Samourais</h1>
            <p className="page-subtitle">
              Découvrez les guerriers légendaires qui ont façonné l'histoire du Japon féodal
              à travers leur courage, leur maîtrise martiale et leur code d'honneur.
            </p>
            {isAdmin() && (
              <Link to="/samourais/new" className="btn-add">
                ➕ Ajouter un Samouraï
              </Link>
            )}
          </div>
        </div>

        <div className="search-container">
          <input
            type="text"
            className="search-input"
            placeholder="Rechercher un samouraï..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <svg className="search-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
        </div>

        <div className="custom-multiselect-container" ref={dropdownRef}>
          <label className="filter-label">Filtrer par clan :</label>
          
          <div className="custom-select">
            <button
              type="button"
              className="custom-select-trigger"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <span>
                {selectedClans.length === 0
                  ? 'Tous les clans'
                  : selectedClans.length === 1
                  ? clans.find(c => c.id === selectedClans[0])?.name
                  : `${selectedClans.length} clans sélectionnés`}
              </span>
              <svg className="dropdown-arrow" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>

            {isDropdownOpen && (
              <div className="custom-select-options">
                {selectedClans.length > 0 && (
                  <button
                    type="button"
                    className="clear-all-option"
                    onClick={() => setSelectedClans([])}
                  >
                    ✕ Effacer tous les filtres
                  </button>
                )}
                {clans.map(clan => (
                  <label key={clan.id} className="custom-option">
                    <input
                      type="checkbox"
                      checked={selectedClans.includes(clan.id)}
                      onChange={() => handleClanToggle(clan.id)}
                    />
                    <span className="option-label">{clan.name}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="results-info">
          {filteredSamourais.length} samouraï{filteredSamourais.length > 1 ? 's' : ''} trouvé{filteredSamourais.length > 1 ? 's' : ''}
        </div>

        {currentSamourais.length === 0 ? (
          <div className="empty-state">
            <p>Aucun samouraï trouvé.</p>
          </div>
        ) : (
          <div className="samourais-grid">
            {currentSamourais.map((samourai) => (
              <div key={samourai.id} className="samourai-card">
                {samourai.image ? (
                  <div className="samourai-image">
                    <img src={samourai.image} alt={samourai.name} loading="lazy" width="300" height="250" />
                  </div>
                ) : (
                  <div className="samourai-image-placeholder">
                    <span className="placeholder-icon">⚔️</span>
                  </div>
                )}
                <div className="samourai-info">
                  <h3 className="samourai-name">{samourai.name}</h3>
                  <p className="samourai-clan">{samourai.clan?.name || 'Sans clan'}</p>
                  <p className="samourai-dates">
                    {formatDateShort(samourai.birth_date)} - {formatDateShort(samourai.death_date)}
                  </p>
                  <Link to={`/samourais/${samourai.id}`} state={{ fromPage: currentPage }} className="view-button">
                    Voir la fiche
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="pagination">
            <button
              className="pagination-btn"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              ←
            </button>
            
            {[...Array(totalPages)].map((_, index) => {
              const page = index + 1
              return (
                <button
                  key={page}
                  className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </button>
              )
            })}
            
            <button
              className="pagination-btn"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              →
            </button>
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}

export default SamouraiList
