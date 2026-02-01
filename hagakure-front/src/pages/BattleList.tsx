import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { battleApi } from '../services/api'
import { isAdmin } from '../utils/permissions'
import { formatDateShort } from '../utils/dateUtils'
import Header from '../components/Header'
import Footer from '../components/Footer'
import './List.css'

interface Battle {
  id: number
  name: string
  date?: string
  description?: string
  image?: string
  location?: {
    name: string
  }
  winner_clan?: {
    name: string
  }
}

function BattleList() {
  const [battles, setBattles] = useState<Battle[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadBattles()
  }, [])

  const loadBattles = async () => {
    try {
      const data = await battleApi.getAll()
      setBattles(Array.isArray(data) ? data : [])
      setLoading(false)
    } catch (error) {
      console.error('Error loading battles:', error)
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette bataille ?')) {
      try {
        await battleApi.delete(id)
        loadBattles()
      } catch (error) {
        console.error('Error deleting battle:', error)
        alert('Erreur lors de la suppression')
      }
    }
  }

  if (loading) return <div className="loading">Chargement...</div>

  return (
    <div className="app">
      <Header />
      <div className="list-container">
        <div className="page-header">
          <div>
            <h1 className="page-title">Les Batailles</h1>
            <p className="page-subtitle">
              Revivez les batailles légendaires qui ont façonné l'histoire du Japon féodal.
            </p>
            {isAdmin() && (
              <Link to="/battles/new" className="btn-add">
                ➕ Ajouter une Bataille
              </Link>
            )}
          </div>
        </div>

        {battles.length === 0 ? (
          <div className="empty-state">
            <p>Aucune bataille enregistrée.</p>
            <Link to="/battles/new" className="btn btn-primary">
              Créer la première bataille
            </Link>
          </div>
        ) : (
          <div className="battles-list">
            {battles.map((battle) => (
              <div key={battle.id} className="battle-card">
                <div className="battle-card-image">
                  {battle.image ? (
                    <img src={battle.image} alt={battle.name} />
                  ) : (
                    <div className="battle-image-placeholder">
                      <span className="placeholder-icon">⚔️</span>
                    </div>
                  )}
                </div>
                <div className="battle-card-content">
                  <div className="battle-card-header">
                    <h3 className="battle-name">{battle.name}</h3>
                    <div className="battle-meta">
                      {battle.date && (
                        <span className="battle-date">
                          📅 {formatDateShort(battle.date, '-')}
                        </span>
                      )}
                      {battle.location && (
                        <span className="battle-location">
                          📍 {battle.location.name}
                        </span>
                      )}
                      {battle.winner_clan && (
                        <span className="battle-winner">
                          🏆 {battle.winner_clan.name}
                        </span>
                      )}
                    </div>
                  </div>
                  {battle.description && (
                    <p className="battle-description">
                      {battle.description.length > 150
                        ? `${battle.description.substring(0, 150)}...`
                        : battle.description}
                    </p>
                  )}
                </div>
                <div className="battle-card-actions">
                  <Link
                    to={`/battles/${battle.id}`}
                    className="btn-icon btn-view"
                    title="Voir"
                  >
                    👁️
                  </Link>
                  {isAdmin() && (
                    <>
                      <Link
                        to={`/battles/${battle.id}/edit`}
                        className="btn-icon btn-edit"
                        title="Modifier"
                      >
                        ✏️
                      </Link>
                      <button
                        onClick={() => handleDelete(battle.id)}
                        className="btn-icon btn-delete"
                        title="Supprimer"
                      >
                        🗑️
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}

export default BattleList
