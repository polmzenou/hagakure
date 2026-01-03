import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { samouraiApi } from '../../services/api'
import Header from '../../components/Header'
import Footer from '../../components/Footer'

function SamouraiList() {
  const [samourais, setSamourais] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadSamourais()
  }, [])

  const loadSamourais = async () => {
    try {
      const data = await samouraiApi.getAll()
      setSamourais(data)
      setLoading(false)
    } catch (error) {
      console.error('Error loading samourais:', error)
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce samouraï ?')) {
      try {
        await samouraiApi.delete(id)
        loadSamourais()
      } catch (error) {
        console.error('Error deleting samourai:', error)
      }
    }
  }

  if (loading) return <div className="loading">Chargement...</div>

  return (
    <div className="app">
      <Header />
      <div className="list-container">
        <div className="list-header">
          <h1>⚔️ Samourais</h1>
          <div className="list-actions">
            <Link to="/" className="btn btn-secondary">← Retour</Link>
            <Link to="/samourais/new" className="btn btn-primary">+ Nouveau Samouraï</Link>
          </div>
        </div>

        {samourais.length === 0 ? (
          <div className="empty-state">
            <p>Aucun samouraï enregistré.</p>
            <Link to="/samourais/new" className="btn btn-primary">Créer le premier samouraï</Link>
          </div>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nom</th>
                  <th>Clan</th>
                  <th>Date de naissance</th>
                  <th>Date de mort</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {samourais.map(samourai => (
                  <tr key={samourai.id}>
                    <td>{samourai.id}</td>
                    <td className="font-bold">{samourai.name}</td>
                    <td>{samourai.clan?.name || '-'}</td>
                    <td>{samourai.birth_date || '-'}</td>
                    <td>{samourai.death_date || '-'}</td>
                    <td className="description-cell">{samourai.description?.substring(0, 100)}...</td>
                    <td className="actions-cell">
                      <Link to={`/samourais/${samourai.id}/edit`} className="btn-icon btn-edit" title="Modifier">
                        ✏️
                      </Link>
                      <button 
                        onClick={() => handleDelete(samourai.id)} 
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

export default SamouraiList
