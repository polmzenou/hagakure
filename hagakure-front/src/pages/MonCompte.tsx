import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { profileApi, favoriteApi, authApi, type ProfileData, type Favorite } from '../services/api'
import { formatDate } from '../utils/dateUtils'
import Header from '../components/Header'
import Footer from '../components/Footer'
import './MonCompte.css'

function MonCompte() {
  const navigate = useNavigate()
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [favorites, setFavorites] = useState<Favorite[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  // Form states
  const [emailForm, setEmailForm] = useState({ email: '' })
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [activeTab, setActiveTab] = useState<'profile' | 'password' | 'favorites'>('profile')
  const [favoriteFilter, setFavoriteFilter] = useState<string>('all')

  useEffect(() => {
    const loadData = async () => {
      try {
        if (!authApi.isAuthenticated()) {
          navigate('/login')
          return
        }

        const profileData = await profileApi.get()
        setProfile(profileData)
        setEmailForm({ email: profileData.email })

        const favoritesData = await favoriteApi.getAll()
        setFavorites(favoritesData)
      } catch (err: any) {
        console.error('Error loading account data:', err)
        setError(err.message || 'Erreur lors du chargement des données')
        if (err.status === 401) {
          navigate('/login')
        }
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [navigate])

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    try {
      const updated = await profileApi.update(emailForm)
      setProfile(updated)
      setSuccess('Email mis à jour avec succès')
      
      // Mettre à jour le localStorage
      const user = authApi.getCurrentUser()
      if (user) {
        user.email = updated.email
        user.username = updated.username
        localStorage.setItem('user', JSON.stringify(user))
      }
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la mise à jour de l\'email')
    }
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError('Les mots de passe ne correspondent pas')
      return
    }

    if (passwordForm.newPassword.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères')
      return
    }

    try {
      await profileApi.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      })
      setSuccess('Mot de passe modifié avec succès')
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la modification du mot de passe')
    }
  }

  const getEntityTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      samourai: 'Samouraï',
      clan: 'Clan',
      weapon: 'Arme',
      style: 'Style de combat',
      battle: 'Bataille',
      timeline: 'Événement Timeline'
    }
    return labels[type] || type
  }

  const getEventTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      battle: 'Bataille',
      birth: 'Naissance',
      death: 'Mort',
      duel: 'Duel',
      politique: 'Politique'
    }
    return labels[type] || type
  }

  const handleRemoveFavorite = async (favoriteId: number) => {
    try {
      await favoriteApi.delete(favoriteId)
      setFavorites(favorites.filter(f => f.id !== favoriteId))
      setSuccess('Favori retiré avec succès')
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la suppression du favori')
    }
  }

  if (loading) {
    return (
      <div className="app">
        <Header />
        <div className="mon-compte-page">
          {/* Background */}
          <div className="mon-compte-background">
            <img
              src="/images/hero bg.png"
              alt="Background"
              className="mon-compte-bg-image"
            />
            <div className="mon-compte-overlay"></div>
          </div>
          <div className="mon-compte-container">
            <div className="loading">Chargement...</div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="app">
      <Header />
      <div className="mon-compte-page">
        {/* Background */}
        <div className="mon-compte-background">
          <img
            src="/images/hero bg.png"
            alt="Background"
            className="mon-compte-bg-image"
          />
          <div className="mon-compte-overlay"></div>
        </div>
        <div className="mon-compte-container">
        <h1 className="mon-compte-title">Mon compte</h1>

        {/* Tabs */}
        <div className="mon-compte-tabs">
          <button
            className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            Profil
          </button>
          <button
            className={`tab-button ${activeTab === 'password' ? 'active' : ''}`}
            onClick={() => setActiveTab('password')}
          >
            Mot de passe
          </button>
          <button
            className={`tab-button ${activeTab === 'favorites' ? 'active' : ''}`}
            onClick={() => setActiveTab('favorites')}
          >
            Favoris
          </button>
        </div>

        {/* Messages */}
        {error && <div className="mon-compte-error">{error}</div>}
        {success && <div className="mon-compte-success">{success}</div>}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="mon-compte-section">
            <h2>Modifier mon profil</h2>
            <form onSubmit={handleEmailSubmit} className="mon-compte-form">
              <div className="form-group">
                <label htmlFor="email">Email (nom d'utilisateur)</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={emailForm.email}
                  onChange={(e) => setEmailForm({ email: e.target.value })}
                  required
                />
                <small>Le nom d'utilisateur sera dérivé de votre email (partie avant @)</small>
              </div>
              <button type="submit" className="submit-button">
                Enregistrer les modifications
              </button>
            </form>
          </div>
        )}

        {/* Password Tab */}
        {activeTab === 'password' && (
          <div className="mon-compte-section">
            <h2>Changer mon mot de passe</h2>
            <form onSubmit={handlePasswordSubmit} className="mon-compte-form">
              <div className="form-group">
                <label htmlFor="currentPassword">Mot de passe actuel</label>
                <input
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="newPassword">Nouveau mot de passe</label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  required
                  minLength={6}
                />
              </div>
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirmer le nouveau mot de passe</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  required
                  minLength={6}
                />
              </div>
              <button type="submit" className="submit-button">
                Modifier le mot de passe
              </button>
            </form>
          </div>
        )}

        {/* Favorites Tab */}
        {activeTab === 'favorites' && (
          <div className="mon-compte-section">
            <h2>Mes favoris</h2>
            
            {/* Filtres */}
            <div className="favorites-filters">
              <button
                className={`filter-btn ${favoriteFilter === 'all' ? 'active' : ''}`}
                onClick={() => setFavoriteFilter('all')}
              >
                Tous ({favorites.length})
              </button>
              <button
                className={`filter-btn ${favoriteFilter === 'timeline' ? 'active' : ''}`}
                onClick={() => setFavoriteFilter('timeline')}
              >
                Timeline ({favorites.filter(f => f.entity.type === 'timeline').length})
              </button>
              <button
                className={`filter-btn ${favoriteFilter === 'samourai' ? 'active' : ''}`}
                onClick={() => setFavoriteFilter('samourai')}
              >
                Samouraïs ({favorites.filter(f => f.entity.type === 'samourai').length})
              </button>
              <button
                className={`filter-btn ${favoriteFilter === 'battle' ? 'active' : ''}`}
                onClick={() => setFavoriteFilter('battle')}
              >
                Batailles ({favorites.filter(f => f.entity.type === 'battle').length})
              </button>
              <button
                className={`filter-btn ${favoriteFilter === 'weapon' ? 'active' : ''}`}
                onClick={() => setFavoriteFilter('weapon')}
              >
                Armes ({favorites.filter(f => f.entity.type === 'weapon').length})
              </button>
              <button
                className={`filter-btn ${favoriteFilter === 'clan' ? 'active' : ''}`}
                onClick={() => setFavoriteFilter('clan')}
              >
                Clans ({favorites.filter(f => f.entity.type === 'clan').length})
              </button>
              <button
                className={`filter-btn ${favoriteFilter === 'style' ? 'active' : ''}`}
                onClick={() => setFavoriteFilter('style')}
              >
                Styles ({favorites.filter(f => f.entity.type === 'style').length})
              </button>
            </div>

            {favorites.length === 0 ? (
              <div className="no-favorites">
                <p>Vous n'avez pas encore de favoris.</p>
                <p>Explorez les samouraïs, clans, armes, styles de combat et batailles pour en ajouter !</p>
              </div>
            ) : (
              <div className="favorites-list">
                {favorites
                  .filter(favorite => favoriteFilter === 'all' || favorite.entity.type === favoriteFilter)
                  .map((favorite) => (
                  favorite.entity.type === 'timeline' ? (
                    <div key={favorite.id} className="favorite-timeline-item">
                      <div className="favorite-timeline-content">
                        <div className="favorite-timeline-header">
                          <span className={`favorite-event-type-badge ${favorite.entity.event_type || ''}`}>
                            {favorite.entity.event_type ? getEventTypeLabel(favorite.entity.event_type) : 'Événement'}
                          </span>
                          {favorite.entity.year && (
                            <span className="favorite-timeline-year">{favorite.entity.year}</span>
                          )}
                        </div>
                        <h3 className="favorite-timeline-title">{favorite.entity.name}</h3>
                        {favorite.entity.date && (
                          <p className="favorite-timeline-date">
                            {formatDate(favorite.entity.date)}
                          </p>
                        )}
                        {favorite.entity.description && (
                          <p className="favorite-timeline-description">{favorite.entity.description}</p>
                        )}
                        <div className="favorite-timeline-footer">
                          <span className="favorite-timeline-added">
                            Ajouté le {new Date(favorite.created_at).toLocaleDateString('fr-FR')}
                          </span>
                          <div className="favorite-timeline-actions">
                            <Link to={favorite.entity.url} className="favorite-link">
                              Voir sur la Timeline →
                            </Link>
                            <button 
                              className="favorite-remove-btn"
                              onClick={() => handleRemoveFavorite(favorite.id)}
                            >
                              Retirer
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div key={favorite.id} className="favorite-item">
                      {favorite.entity.image && (
                        <div className="favorite-image">
                          <img src={favorite.entity.image} alt={favorite.entity.name} />
                        </div>
                      )}
                      <div className="favorite-info">
                        <span className="favorite-type">{getEntityTypeLabel(favorite.entity.type)}</span>
                        <h3 className="favorite-name">{favorite.entity.name}</h3>
                        <span className="favorite-date">
                          Ajouté le {new Date(favorite.created_at).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                      <div className="favorite-actions">
                        <Link to={favorite.entity.url} className="favorite-link">
                          Voir →
                        </Link>
                        <button 
                          className="favorite-remove-btn"
                          onClick={() => handleRemoveFavorite(favorite.id)}
                        >
                          Retirer
                        </button>
                      </div>
                    </div>
                  )
                ))}
              </div>
            )}
          </div>
        )}
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default MonCompte

