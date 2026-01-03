import React, { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { clanApi } from '../../services/api'
import Header from '../../components/Header'
import Footer from '../../components/Footer'

function ClanList() {
  const [clans, setClans] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadClans()
  }, [])

  const loadClans = async () => {
    try {
      const data = await clanApi.getAll()
      setClans(data)
      setLoading(false)
    } catch (error) {
      console.error('Error loading clans:', error)
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce clan ?')) {
      try {
        await clanApi.delete(id)
        loadClans()
      } catch (error) {
        console.error('Error deleting clan:', error)
      }
    }
  }

  if (loading) return <div className="loading">Chargement...</div>

  return (
    <div className="app">
      <Header />
      <div className="list-container">
        <div className="list-header">
          <h1>🏯 Clans</h1>
          <div className="list-actions">
            <Link to="/" className="btn btn-secondary">← Retour</Link>
            <Link to="/clans/new" className="btn btn-primary">+ Nouveau Clan</Link>
          </div>
        </div>

        {clans.length === 0 ? (
          <div className="empty-state">
            <p>Aucun clan enregistré.</p>
            <Link to="/clans/new" className="btn btn-primary">Créer le premier clan</Link>
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
                {clans.map(clan => (
                  <tr key={clan.id}>
                    <td>{clan.id}</td>
                    <td className="font-bold">{clan.name}</td>
                    <td>{clan.founded_date || '-'}</td>
                    <td>{clan.disbanded_date || '-'}</td>
                    <td>{clan.samourais_count || 0}</td>
                    <td className="actions-cell">
                      <Link to={`/clans/${clan.id}/edit`} className="btn-icon btn-edit">✏️</Link>
                      <button onClick={() => handleDelete(clan.id)} className="btn-icon btn-delete">🗑️</button>
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
