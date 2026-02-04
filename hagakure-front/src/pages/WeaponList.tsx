import { useState, useEffect, useMemo, useRef } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { weaponApi } from '../services/api'
import { isAdmin } from '../utils/permissions'
import Header from '../components/Header'
import Footer from '../components/Footer'
import './List.css'

interface Weapon {
  id: number
  name: string
  type: string
  description?: string
  image?: string
}

function WeaponList() {
  const [weapons, setWeapons] = useState<Weapon[]>([])
  const [filteredWeapons, setFilteredWeapons] = useState<Weapon[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const itemsPerPage = 6
  const dropdownRef = useRef<HTMLDivElement>(null)
  const prevFiltersRef = useRef({ searchTerm, selectedTypes })

  const loadData = async () => {
    setError(null)
    try {
      const data = await weaponApi.getAll()
      setWeapons(Array.isArray(data) ? data : [])
    } catch (err: unknown) {
      console.error('Error loading weapons:', err)
      setError((err as { message?: string })?.message || 'Impossible de charger les armes.')
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
    let filtered = [...weapons]

    // Filtre par recherche
    if (searchTerm) {
      filtered = filtered.filter(w =>
        w.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        w.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filtre par type
    if (selectedTypes.length > 0) {
      filtered = filtered.filter(w => w.type && selectedTypes.includes(w.type))
    }

    setFilteredWeapons(filtered)
    const filtersChanged = prevFiltersRef.current.searchTerm !== searchTerm ||
      JSON.stringify(prevFiltersRef.current.selectedTypes) !== JSON.stringify(selectedTypes)
    prevFiltersRef.current = { searchTerm, selectedTypes }
    if (filtersChanged) {
      setSearchParams(prev => {
        const next = new URLSearchParams(prev)
        next.set('page', '1')
        return next
      })
    }
  }, [searchTerm, selectedTypes, weapons, setSearchParams])

  const uniqueTypes = Array.from(new Set(weapons.map(w => w.type).filter(Boolean)))
  const totalPages = Math.ceil(filteredWeapons.length / itemsPerPage)
  const currentPage = useMemo(() => {
    const p = parseInt(searchParams.get('page') || '1', 10)
    if (isNaN(p) || p < 1) return 1
    return Math.min(p, totalPages || 1)
  }, [searchParams, totalPages])
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentWeapons = filteredWeapons.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev)
      next.set('page', String(page))
      return next
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleTypeToggle = (type: string) => {
    setSelectedTypes(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
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
              <h1 className="page-title">Les Armes</h1>
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
        {/* Header Section */}
        <div className="page-header">
          <div>
            <h1 className="page-title">Les Armes</h1>
            <p className="page-subtitle">
              Explorez l'arsenal des samouraïs, du légendaire katana aux armes
              traditionnelles qui ont marqué l'histoire du Japon féodal.
            </p>
            {isAdmin() && (
              <Link to="/weapons/new" className="btn-add">
                ➕ Ajouter une Arme
              </Link>
            )}
          </div>
        </div>

        {/* Search Bar */}
        <div className="search-container">
          <input
            type="text"
            className="search-input"
            placeholder="Rechercher une arme..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <svg className="search-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
        </div>

        {/* Filter Dropdown */}
        <div className="custom-multiselect-container" ref={dropdownRef}>
          <label className="filter-label">Filtrer par type :</label>
          
          <div className="custom-select">
            <button
              type="button"
              className="custom-select-trigger"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <span>
                {selectedTypes.length === 0
                  ? 'Tous les types'
                  : selectedTypes.length === 1
                  ? selectedTypes[0]
                  : `${selectedTypes.length} types sélectionnés`}
              </span>
              <svg className="dropdown-arrow" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>

            {isDropdownOpen && (
              <div className="custom-select-options">
                {selectedTypes.length > 0 && (
                  <button
                    type="button"
                    className="clear-all-option"
                    onClick={() => setSelectedTypes([])}
                  >
                    ✕ Effacer tous les filtres
                  </button>
                )}
                {uniqueTypes.map(type => (
                  <label key={type} className="custom-option">
                    <input
                      type="checkbox"
                      checked={selectedTypes.includes(type)}
                      onChange={() => handleTypeToggle(type)}
                    />
                    <span className="option-label">{type}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Results count */}
        <div className="results-info">
          {filteredWeapons.length} arme{filteredWeapons.length > 1 ? 's' : ''} trouvée{filteredWeapons.length > 1 ? 's' : ''}
        </div>

        {/* Weapons Grid */}
        {currentWeapons.length === 0 ? (
          <div className="empty-state">
            <p>Aucune arme trouvée.</p>
          </div>
        ) : (
          <div className="samourais-grid">
            {currentWeapons.map((weapon) => (
              <div key={weapon.id} className="samourai-card">
                {weapon.image ? (
                  <div className="samourai-image">
                    <img src={weapon.image} alt={weapon.name} loading="lazy" width="300" height="250" />
                  </div>
                ) : (
                  <div className="samourai-image-placeholder">
                    <span className="placeholder-icon">🗡️</span>
                  </div>
                )}
                <div className="samourai-info">
                  <h3 className="samourai-name">{weapon.name}</h3>
                  <p className="samourai-clan">{weapon.type || 'Type non spécifié'}</p>
                  <p className="samourai-description">
                    {weapon.description?.substring(0, 100) || 'Aucune description'}
                    {weapon.description && weapon.description.length > 100 ? '...' : ''}
                  </p>
                  <Link to={`/weapons/${weapon.id}`} state={{ fromPage: currentPage }} className="view-button">
                    Voir les détails
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
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

export default WeaponList
