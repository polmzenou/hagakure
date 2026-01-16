import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { battleApi, authApi, favoriteApi } from '../services/api'
import { isAdmin } from '../utils/permissions'
import { formatDate } from '../utils/dateUtils'
import Header from '../components/Header'
import Footer from '../components/Footer'
import './Show.css'

interface Battle {
  id: number
  name: string
  date?: string
  description?: string
  source_url?: string
  image?: string
  location?: {
    id: number
    name: string
  }
  winner_clan?: {
    id: number
    name: string
  }
  samourais?: Array<{
    id: number
    name: string
  }>
}

function BattleShow() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [battle, setBattle] = useState<Battle | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)
  const [favoriteId, setFavoriteId] = useState<number | null>(null)

  useEffect(() => {
    setIsAuthenticated(authApi.isAuthenticated())
    if (id) {
      loadBattle()
    }
  }, [id])

  useEffect(() => {
    if (battle && isAuthenticated && id) {
      checkFavorite()
    }
  }, [battle, isAuthenticated, id])

  const loadBattle = async () => {
    try {
      const data = await battleApi.getOne(id!)
      setBattle(data)
      setLoading(false)
    } catch (error) {
      console.error('Error loading battle:', error)
      setLoading(false)
    }
  }

  const checkFavorite = async () => {
    if (!id || !isAuthenticated) return
    try {
      const result = await favoriteApi.check({
        entity_type: 'battle',
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
        entity_type: 'battle',
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
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette bataille ?')) {
      try {
        await battleApi.delete(id!)
        navigate('/battles')
      } catch (error) {
        console.error('Error deleting battle:', error)
        alert('Erreur lors de la suppression')
      }
    }
  }

  if (loading) return <div className="loading">Chargement...</div>
  if (!battle) return <div className="loading">Bataille non trouvée</div>

  return (
    <div className="app">
      <Header />
      <div className="show-container">
        <div className="show-header">
          {isAdmin() && (   
            <>
            <Link to="/battles" className="btn btn-secondary">
              ← Retour à la liste
            </Link>
            <Link to={`/battles/${id}/edit`} className="btn btn-primary">
              ✏️ Modifier
            </Link>
            <button onClick={handleDelete} className="btn btn-danger">
              🗑️ Supprimer
            </button>
          </>
          )}
          <div className="show-actions">
            {isAuthenticated && (
              <button 
                className={`btn btn-favorites ${isFavorite ? 'active' : ''}`}
                onClick={handleToggleFavorite}
              >
                {isFavorite ? '★ Retirer des Favoris' : '☆ Ajouter aux Favoris'}
              </button>
            )}
            
          </div>
        </div>

        <div className="show-content">
          <div className="show-main">
            {battle.image && (
              <div className="show-image">
                <img src={battle.image} alt={battle.name} />
              </div>
            )}
            <div className="show-info">
              <h1 className="show-title">⚡ {battle.name}</h1>
              
              <div className="show-details">
                {battle.date && (
                  <div className="detail-item">
                    <span className="detail-label">Date :</span>
                    <span className="detail-value">{formatDate(battle.date)}</span>
                  </div>
                )}
                {battle.location && (
                  <div className="detail-item">
                    <span className="detail-label">Lieu :</span>
                    <Link to={`/locations/${battle.location.id}`} className="detail-link">
                      🗺️ {battle.location.name}
                    </Link>
                  </div>
                )}
                {battle.winner_clan && (
                  <div className="detail-item">
                    <span className="detail-label">Clan vainqueur :</span>
                    <Link to={`/clans/${battle.winner_clan.id}`} className="detail-link">
                      🏯 {battle.winner_clan.name}
                    </Link>
                  </div>
                )}
              </div>

              {battle.description && (
                <div className="show-description">
                  <h2>Description</h2>
                  <p>{battle.description}</p>
                </div>
              )}

              {battle.samourais && battle.samourais.length > 0 && (
                <div className="show-relations">
                  <h2>Samouraïs impliqués ({battle.samourais.length})</h2>
                  <div className="relation-list">
                    {battle.samourais.map((samourai) => (
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

              {battle.source_url && (
                <div className="show-source">
                  <a
                    href={battle.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="source-link"
                  >
                    📚 Voir la source
                  </a>
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

export default BattleShow
