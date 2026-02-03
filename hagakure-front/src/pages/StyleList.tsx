import { useState, useEffect, useMemo, useRef } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { styleApi } from '../services/api'
import { isAdmin } from '../utils/permissions'
import Header from '../components/Header'
import Footer from '../components/Footer'
import './List.css'

interface Style {
  id: number
  name: string
  description?: string
  image?: string
}

function StyleList() {
  const [styles, setStyles] = useState<Style[]>([])
  const [filteredStyles, setFilteredStyles] = useState<Style[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchTerm, setSearchTerm] = useState('')
  const itemsPerPage = 6

  const loadData = async () => {
    setError(null)
    try {
      const data = await styleApi.getAll()
      setStyles(Array.isArray(data) ? data : [])
    } catch (err: unknown) {
      console.error('Error loading styles:', err)
      setError((err as { message?: string })?.message || 'Impossible de charger les styles.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    let filtered = [...styles]

    // Filtre par recherche
    if (searchTerm) {
      filtered = filtered.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredStyles(filtered)
    if (prevFiltersRef.current !== searchTerm) {
      prevFiltersRef.current = searchTerm
      setSearchParams(prev => {
        const o = Object.fromEntries(prev)
        o.page = '1'
        return o
      })
    }
  }, [searchTerm, styles])

  const totalPages = Math.ceil(filteredStyles.length / itemsPerPage)
  const currentPage = useMemo(() => {
    const p = parseInt(searchParams.get('page') || '1', 10)
    if (isNaN(p) || p < 1) return 1
    return Math.min(p, totalPages || 1)
  }, [searchParams, totalPages])
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentStyles = filteredStyles.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    setSearchParams(prev => {
      const o = Object.fromEntries(prev)
      o.page = String(page)
      return o
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (loading) return <div className="loading">Chargement...</div>

  if (error) {
    return (
      <div className="app">
        <Header />
        <div className="list-container">
          <div className="page-header">
            <div>
              <h1 className="page-title">Les Styles de Combat</h1>
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
            <h1 className="page-title">Les Styles de Combat</h1>
            <p className="page-subtitle">
              Découvrez les différentes techniques et philosophies martiales
              qui ont façonné l'art du combat des samouraïs.
            </p>
            {isAdmin() && (
              <Link to="/styles/new" className="btn-add">
                ➕ Ajouter un Style
              </Link>
            )}
          </div>
        </div>

        {/* Search Bar */}
        <div className="search-container">
          <input
            type="text"
            className="search-input"
            placeholder="Rechercher un style de combat..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <svg className="search-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
        </div>

        {/* Results count */}
        <div className="results-info">
          {filteredStyles.length} style{filteredStyles.length > 1 ? 's' : ''} trouvé{filteredStyles.length > 1 ? 's' : ''}
        </div>

        {/* Styles Grid */}
        {currentStyles.length === 0 ? (
          <div className="empty-state">
            <p>Aucun style de combat trouvé.</p>
          </div>
        ) : (
          <div className="samourais-grid">
            {currentStyles.map((style) => (
              <div key={style.id} className="samourai-card">
                {style.image ? (
                  <div className="samourai-image">
                    <img src={style.image} alt={style.name} loading="lazy" width="300" height="250" />
                  </div>
                ) : (
                  <div className="samourai-image-placeholder">
                    <span className="placeholder-icon">🎭</span>
                  </div>
                )}
                <div className="samourai-info">
                  <h3 className="samourai-name">{style.name}</h3>
                  <p className="samourai-description">
                    {style.description?.substring(0, 100) || 'Aucune description'}
                    {style.description && style.description.length > 100 ? '...' : ''}
                  </p>
                  <Link to={`/styles/${style.id}`} state={{ fromPage: currentPage }} className="view-button">
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

export default StyleList
