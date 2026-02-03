import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom'
import { styleApi, authApi, favoriteApi } from '../services/api'
import { isAdmin } from '../utils/permissions'
import Header from '../components/Header'
import Footer from '../components/Footer'
import './Show.css'

interface Style {
  id: number
  name: string
  description?: string
  image?: string
  samourais?: Array<{
    id: number
    name: string
  }>
}

function StyleShow() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const fromPage = (location.state as { fromPage?: number })?.fromPage
  const [style, setStyle] = useState<Style | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)
  const [favoriteId, setFavoriteId] = useState<number | null>(null)

  useEffect(() => {
    setIsAuthenticated(authApi.isAuthenticated())
    if (id) {
      loadStyle()
    }
  }, [id])

  useEffect(() => {
    if (style && isAuthenticated && id) {
      checkFavorite()
    }
  }, [style, isAuthenticated, id])

  const loadStyle = async () => {
    try {
      const data = await styleApi.getOne(id!)
      setStyle(data)
      setLoading(false)
    } catch (error) {
      console.error('Error loading style:', error)
      setLoading(false)
    }
  }

  const checkFavorite = async () => {
    if (!id || !isAuthenticated) return
    try {
      const result = await favoriteApi.check({
        entity_type: 'style',
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
        entity_type: 'style',
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
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce style ?')) {
      try {
        await styleApi.delete(id!)
        navigate('/styles')
      } catch {
        alert('Erreur lors de la suppression')
      }
    }
  }

  if (loading) return (
    <div className="app">
      <Header />
      <div className="show-container">
        <div className="loading">Chargement...</div>
      </div>
      <Footer />
    </div>
  )
  if (!style) return (
    <div className="app">
      <Header />
      <div className="show-container">
        <div className="show-not-found">
          <p className="show-not-found-message">Style non trouvé</p>
          <Link to={fromPage ? `/styles?page=${fromPage}` : '/styles'} className="btn btn-secondary">← Retour à la liste</Link>
        </div>
      </div>
      <Footer />
    </div>
  )

  return (
    <div className="app">
      <Header />
      <div className="show-container">
        <div className="show-header">
          <Link to={fromPage ? `/styles?page=${fromPage}` : '/styles'} className="btn btn-secondary">
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
                <Link to={`/styles/${id}/edit`} className="btn btn-primary">
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
            {style.image && (
              <div className="show-image">
                <img src={style.image} alt={style.name} loading="eager" width="400" height="300" />
              </div>
            )}
            <div className="show-info">
              <h1 className="show-title">{style.name}</h1>

              {style.description && (
                <div className="show-description">
                  <h2>Description</h2>
                  <p>{style.description}</p>
                </div>
              )}

              {style.samourais && style.samourais.length > 0 && (
                <div className="show-relations">
                  <h2>Samouraïs pratiquant ce style ({style.samourais.length})</h2>
                  <div className="relation-list">
                    {style.samourais.map((samourai) => (
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
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default StyleShow
