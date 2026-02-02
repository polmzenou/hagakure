import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { weaponApi, authApi, favoriteApi } from '../services/api'
import { isAdmin } from '../utils/permissions'
import Header from '../components/Header'
import Footer from '../components/Footer'
import './Show.css'

interface Weapon {
  id: number
  name: string
  type: string
  description?: string
  image?: string
  samourais?: Array<{
    id: number
    name: string
  }>
}

function WeaponShow() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [weapon, setWeapon] = useState<Weapon | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)
  const [favoriteId, setFavoriteId] = useState<number | null>(null)

  useEffect(() => {
    setIsAuthenticated(authApi.isAuthenticated())
    if (id) {
      loadWeapon()
    }
  }, [id])

  useEffect(() => {
    if (weapon && isAuthenticated && id) {
      checkFavorite()
    }
  }, [weapon, isAuthenticated, id])

  const loadWeapon = async () => {
    try {
      const data = await weaponApi.getOne(id!)
      setWeapon(data)
      setLoading(false)
    } catch (error) {
      console.error('Error loading weapon:', error)
      setLoading(false)
    }
  }

  const checkFavorite = async () => {
    if (!id || !isAuthenticated) return
    try {
      const result = await favoriteApi.check({
        entity_type: 'weapon',
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
        entity_type: 'weapon',
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
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette arme ?')) {
      try {
        await weaponApi.delete(id!)
        navigate('/weapons')
      } catch {
        alert('Erreur lors de la suppression')
      }
    }
  }

  if (loading) return <div className="loading">Chargement...</div>
  if (!weapon) return <div className="loading">Arme non trouvée</div>

  return (
    <div className="app">
      <Header />
      <div className="show-container">
        <div className="show-header">
          <Link to="/weapons" className="btn btn-secondary">
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
                <Link to={`/weapons/${id}/edit`} className="btn btn-primary">
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
            {weapon.image && (
              <div className="show-image">
                <img src={weapon.image} alt={weapon.name} />
              </div>
            )}
            <div className="show-info">
              <h1 className="show-title">{weapon.name}</h1>
              
              <div className="show-details">
                <div className="detail-item">
                  <span className="detail-label">Type :</span>
                  <span className="detail-value">{weapon.type}</span>
                </div>
              </div>

              {weapon.description && (
                <div className="show-description">
                  <h2>Description</h2>
                  <p>{weapon.description}</p>
                </div>
              )}

              {weapon.samourais && weapon.samourais.length > 0 && (
                <div className="show-relations">
                  <h2>Samouraïs utilisant cette arme</h2>
                  <div className="relation-list">
                    {weapon.samourais.map((samourai) => (
                      <Link
                        key={samourai.id}
                        to={`/samourais/${samourai.id}`}
                        className="relation-item"
                      >
                        {samourai.name}
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

export default WeaponShow
