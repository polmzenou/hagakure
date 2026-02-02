import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { clanApi } from '../services/api'
import { isAdmin } from '../utils/permissions'
import { formatDateShort } from '../utils/dateUtils'
import Header from '../components/Header'
import Footer from '../components/Footer'
import './List.css'

interface Clan {
  id: number
  name: string
  description?: string
  founded_date?: string
  disbanded_date?: string
  image?: string
  samourais?: Array<{ id: number; name: string }>
}

function ClanList() {
  const location = useLocation()
  const [clans, setClans] = useState<Clan[]>([])
  const [filteredClans, setFilteredClans] = useState<Clan[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6

  const loadClans = async () => {
    setError(null)
    setLoading(true)
    try {
      const data = await clanApi.getAll()
      setClans(Array.isArray(data) ? data : [])
    } catch (err: unknown) {
      console.error('Error loading clans:', err)
      setError((err as { message?: string })?.message || 'Impossible de charger les clans.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadClans()
  }, [location.pathname])

  useEffect(() => {
    let filtered = [...clans]

    // Filtre par recherche
    if (searchTerm) {
      filtered = filtered.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredClans(filtered)
    setCurrentPage(1)
  }, [searchTerm, clans])

  // Pagination
  const totalPages = Math.ceil(filteredClans.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentClans = filteredClans.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
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
              <h1 className="page-title">Les Clans</h1>
            </div>
          </div>
          <div className="list-error">
            <p>{error}</p>
            <button type="button" className="btn-retry" onClick={loadClans}>Réessayer</button>
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
            <h1 className="page-title">Les Clans</h1>
            <p className="page-subtitle">
              Découvrez les grands clans qui ont dominé le Japon féodal, leurs alliances et leurs rivalités.
            </p>
            {isAdmin() && (
              <Link to="/clans/new" className="btn-add">
                ➕ Ajouter un Clan
              </Link>
            )}
          </div>
        </div>

        {/* Search Bar */}
        <div className="search-container">
          <input
            type="text"
            className="search-input"
            placeholder="Rechercher un clan..."
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
          {filteredClans.length} clan{filteredClans.length > 1 ? 's' : ''} trouvé{filteredClans.length > 1 ? 's' : ''}
        </div>

        {/* Clans Grid */}
        {currentClans.length === 0 ? (
          <div className="empty-state">
            <p>Aucun clan trouvé.</p>
          </div>
        ) : (
          <div className="samourais-grid">
            {currentClans.map((clan) => (
              <div key={clan.id} className="samourai-card">
                {clan.image && clan.image.trim() !== '' ? (
                  <div className="samourai-image">
                    <img src={clan.image} alt={clan.name} />
                  </div>
                ) : (
                  <div className="samourai-image-placeholder">
                    <span className="placeholder-icon">🏯</span>
                  </div>
                )}
                <div className="samourai-info">
                  <h3 className="samourai-name">{clan.name}</h3>
                  <p className="samourai-clan">
                    {clan.founded_date ? `Fondé en ${formatDateShort(clan.founded_date)}` : 'Date de fondation inconnue'}
                  </p>
                  <p className="samourai-description">
                    {clan.description?.substring(0, 100) || 'Aucune description'}
                    {clan.description && clan.description.length > 100 ? '...' : ''}
                  </p>
                  {clan.samourais && clan.samourais.length > 0 && (
                    <p className="samourai-dates">
                      {clan.samourais.length} samouraï{clan.samourais.length > 1 ? 's' : ''}
                    </p>
                  )}
                  <Link to={`/clans/${clan.id}`} className="view-button">
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

export default ClanList
