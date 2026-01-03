import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { clanApi } from '../services/api'
import { isAdmin } from '../utils/permissions'
import Header from '../components/Header'
import Footer from '../components/Footer'
import './List.css'

interface Clan {
  id: number
  name: string
  founded_date?: string
  disbanded_date?: string
  samourais?: any[]
}

function ClanList() {
  const [clans, setClans] = useState<Clan[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadClans()
  }, [])

  const loadClans = async () => {
    try {
      const data = await clanApi.getAll()
      setClans(Array.isArray(data) ? data : [])
      setLoading(false)
    } catch (error) {
      console.error('Error loading clans:', error)
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce clan ?')) {
      try {
        await clanApi.delete(id)
        loadClans()
      } catch (error) {
        console.error('Error deleting clan:', error)
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
            <h1 className="page-title">Les Clans</h1>
            <p className="page-subtitle">
              Découvrez les grands clans qui ont dominé le Japon féodal, leurs alliances et leurs rivalités.
            </p>
          </div>
          {isAdmin() && (
            <Link to="/clans/new" className="btn-add">
              ➕ Ajouter un Clan
            </Link>
          )}
        </div>

        {clans.length === 0 ? (
          <div className="empty-state">
            <p>Aucun clan enregistré.</p>
            <Link to="/clans/new" className="btn btn-primary">
              Créer le premier clan
            </Link>
          </div>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nom</th>
                  <th>Date de fondation</th>
                  <th>Date de dissolution</th>
                  <th>Samourais</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {clans.map((clan) => (
                  <tr key={clan.id}>
                    <td>{clan.id}</td>
                    <td className="font-bold">{clan.name}</td>
                    <td>{clan.founded_date || '-'}</td>
                    <td>{clan.disbanded_date || '-'}</td>
                    <td>{clan.samourais?.length || 0}</td>
                    <td className="actions-cell">
                      <Link
                        to={`/clans/${clan.id}`}
                        className="btn-icon btn-view"
                        title="Voir"
                      >
                        👁️
                      </Link>
                      <Link
                        to={`/clans/${clan.id}/edit`}
                        className="btn-icon btn-edit"
                        title="Modifier"
                      >
                        ✏️
                      </Link>
                      <button
                        onClick={() => handleDelete(clan.id)}
                        className="btn-icon btn-delete"
                        title="Supprimer"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}

export default ClanList
