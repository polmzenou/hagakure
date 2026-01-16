import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { samouraiApi, authApi, favoriteApi } from '../services/api'
import { isAdmin } from '../utils/permissions'
import { formatDate } from '../utils/dateUtils'
import Header from '../components/Header'
import Footer from '../components/Footer'
import './Show.css'

interface Samourai {
  id: number
  name: string
  description?: string
  birth_date?: string
  death_date?: string
  source_url?: string
  image?: string
  clan?: {
    id: number
    name: string
  }
  weapon?: Array<{
    id: number
    name: string
  }>
  style_id?: Array<{
    id: number
    name: string
  }>
  battle_id?: Array<{
    id: number
    name: string
  }>
}

function SamouraiShow() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [samourai, setSamourai] = useState<Samourai | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)
  const [favoriteId, setFavoriteId] = useState<number | null>(null)

  useEffect(() => {
    setIsAuthenticated(authApi.isAuthenticated())
    if (id) {
      loadSamourai()
    }
  }, [id])

  useEffect(() => {
    if (samourai && isAuthenticated && id) {
      checkFavorite()
    }
  }, [samourai, isAuthenticated, id])

  const loadSamourai = async () => {
    try {
      const data = await samouraiApi.getOne(id!)
      setSamourai(data)
      setLoading(false)
    } catch (error) {
      console.error('Error loading samourai:', error)
      setLoading(false)
    }
  }

  const checkFavorite = async () => {
    if (!id || !isAuthenticated) return
    try {
      const result = await favoriteApi.check({
        entity_type: 'samourai',
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
        entity_type: 'samourai',
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
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce samouraï ?')) {
      try {
        await samouraiApi.delete(id!)
        navigate('/samourais')
      } catch (error) {
        console.error('Error deleting samourai:', error)
        alert('Erreur lors de la suppression')
      }
    }
  }

  if (loading) return <div className="loading">Chargement...</div>
  if (!samourai) return <div className="loading">Samouraï non trouvé</div>

  return (
    <div className="app">
      <Header />
      <div className="show-container">
        <div className="show-header">
          <Link to="/samourais" className="btn btn-secondary">
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
                <Link to={`/samourais/${id}/edit`} className="btn btn-primary">
                  ✏️
                </Link>
                <button onClick={handleDelete} className="btn btn-danger">
                  🗑️
                </button>
              </>
            )}
          </div>
        </div>

        <div className="show-content">
          <div className="show-main">
            {samourai.image && (
              <div className="show-image">
                <img src={samourai.image} alt={samourai.name} />
              </div>
            )}
            <div className="show-info">
              <h1 className="show-title">⚔️ {samourai.name}</h1>
              
              <div className="show-details">
                {samourai.birth_date && (
                  <div className="detail-item">
                    <span className="detail-label">Date de naissance :</span>
                    <span className="detail-value">{formatDate(samourai.birth_date)}</span>
                  </div>
                )}
                {samourai.death_date && (
                  <div className="detail-item">
                    <span className="detail-label">Date de mort :</span>
                    <span className="detail-value">{formatDate(samourai.death_date)}</span>
                  </div>
                )}
                {samourai.clan && (
                  <div className="detail-item">
                    <span className="detail-label">Clan :</span>
                    <Link to={`/clans/${samourai.clan.id}`} className="detail-link">
                      {samourai.clan.name}
                    </Link>
                  </div>
                )}
              </div>

              {samourai.description && (
                <div className="show-description">
                  <h2>Description</h2>
                  <p>{samourai.description}</p>
                </div>
              )}

              {samourai.weapon && samourai.weapon.length > 0 && (
                <div className="show-relations">
                  <h2>Armes</h2>
                  <div className="relation-list">
                    {samourai.weapon.map((weapon) => (
                      <Link
                        key={weapon.id}
                        to={`/weapons/${weapon.id}`}
                        className="relation-item"
                      >
                        {weapon.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {samourai.style_id && samourai.style_id.length > 0 && (
                <div className="show-relations">
                  <h2>Styles de combat</h2>
                  <div className="relation-list">
                    {samourai.style_id.map((style) => (
                      <Link
                        key={style.id}
                        to={`/styles/${style.id}`}
                        className="relation-item"
                      >
                        {style.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {samourai.battle_id && samourai.battle_id.length > 0 && (
                <div className="show-relations">
                  <h2>Batailles</h2>
                  <div className="relation-list">
                    {samourai.battle_id.map((battle) => (
                      <Link
                        key={battle.id}
                        to={`/battles/${battle.id}`}
                        className="relation-item"
                      >
                        {battle.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {samourai.source_url && (
                <div className="show-source">
                  <a
                    href={samourai.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="source-link"
                  >
                    Voir la source
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

export default SamouraiShow
