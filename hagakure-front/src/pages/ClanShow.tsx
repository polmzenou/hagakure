import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { clanApi, authApi, favoriteApi } from '../services/api'
import { isAdmin } from '../utils/permissions'
import { formatDate } from '../utils/dateUtils'
import Header from '../components/Header'
import Footer from '../components/Footer'
import './Show.css'

interface Clan {
  id: number
  name: string
  description?: string
  founded_date?: string
  disbanded_date?: string
  image?: string
  samourais?: Array<{
    id: number
    name: string
  }>
  battles?: Array<{
    id: number
    name: string
  }>
}

function ClanShow() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [clan, setClan] = useState<Clan | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)
  const [favoriteId, setFavoriteId] = useState<number | null>(null)

  useEffect(() => {
    setIsAuthenticated(authApi.isAuthenticated())
    if (id) {
      loadClan()
    }
  }, [id])

  useEffect(() => {
    if (clan && isAuthenticated && id) {
      checkFavorite()
    }
  }, [clan, isAuthenticated, id])

  const loadClan = async () => {
    try {
      const data = await clanApi.getOne(id!)
      setClan(data)
      setLoading(false)
    } catch (error) {
      console.error('Error loading clan:', error)
      setLoading(false)
    }
  }

  const checkFavorite = async () => {
    if (!id || !isAuthenticated) return
    try {
      const result = await favoriteApi.check({
        entity_type: 'clan',
        entity_id: parseInt(id)
      })
      setIsFavorite(result.is_favorite)
      setFavoriteId(result.favorite_id || null)
    } catch (error) {
      console.error('Error checking favorite:', error)
    }
  }

  const handleToggleFavorite = async () => {
    if (!id || !isAuthenticated) return
    try {
      const result = await favoriteApi.toggle({
        entity_type: 'clan',
        entity_id: parseInt(id)
      })
      setIsFavorite(result.is_favorite)
      setFavoriteId(result.favorite_id || null)
    } catch (error: any) {
      console.error('Error toggling favorite:', error)
      alert(error.message || 'Erreur lors de l\'ajout aux favoris')
    }
  }

  const handleDelete = async () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce clan ?')) {
      try {
        await clanApi.delete(id!)
        navigate('/clans')
      } catch {
        alert('Erreur lors de la suppression')
      }
    }
  }

  if (loading) return <div className="loading">Chargement...</div>
  if (!clan) return <div className="loading">Clan non trouvé</div>

  return (
    <div className="app">
      <Header />
      <div className="show-container">
        <div className="show-header">
          <Link to="/clans" className="btn btn-secondary">
            ← Retour à la liste
          </Link>
          <div className="show-actions">
            {isAuthenticated && (
              <button 
                className={`btn btn-favorites ${isFavorite ? 'active' : ''}`}
                onClick={handleToggleFavorite}
              >
                {isFavorite ? '★ Retirer des Favoris' : '☆ Ajouter aux Favoris'}
              </button>
            )}
            {isAdmin() && (
              <>
                <Link to={`/clans/${id}/edit`} className="btn btn-primary">
                  Modifier
                </Link>
                <button onClick={handleDelete} className="btn btn-danger">
                  Supprimer
                </button>
              </>
            )}
          </div>
        </div>

        <div className="show-content">
          <div className="show-main">
            {clan.image && (
              <div className="show-image">
                <img src={clan.image} alt={clan.name} />
              </div>
            )}
            <div className="show-info">
              <h1 className="show-title">{clan.name}</h1>
              
              <div className="show-details">
                {clan.founded_date && (
                  <div className="detail-item">
                    <span className="detail-label">Date de fondation :</span>
                    <span className="detail-value">{formatDate(clan.founded_date)}</span>
                  </div>
                )}
                {clan.disbanded_date && (
                  <div className="detail-item">
                    <span className="detail-label">Date de dissolution :</span>
                    <span className="detail-value">{formatDate(clan.disbanded_date)}</span>
                  </div>
                )}
              </div>

              {clan.description && (
                <div className="show-description">
                  <h2>Description</h2>
                  <p>{clan.description}</p>
                </div>
              )}

              {clan.samourais && clan.samourais.length > 0 && (
                <div className="show-relations">
                  <h2>Samouraïs ({clan.samourais.length})</h2>
                  <div className="relation-list">
                    {clan.samourais.map((samourai) => (
                      <Link
                        key={samourai.id}
                        to={`/samourais/${samourai.id}`}
                        className="relation-item"
                      >
                        ⚔️ {samourai.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {clan.battles && clan.battles.length > 0 && (
                <div className="show-relations">
                  <h2>Batailles ({clan.battles.length})</h2>
                  <div className="relation-list">
                    {clan.battles.map((battle) => (
                      <Link
                        key={battle.id}
                        to={`/battles/${battle.id}`}
                        className="relation-item"
                      >
                        ⚡ {battle.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default ClanShow
