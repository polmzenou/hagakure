import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { styleApi } from '../../services/api'
import Header from '../../components/Header'
import Footer from '../../components/Footer'

function StyleList() {
  const [styles, setStyles] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStyles()
  }, [])

  const loadStyles = async () => {
    try {
      const data = await styleApi.getAll()
      setStyles(data)
      setLoading(false)
    } catch (error) {
      console.error('Error loading styles:', error)
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce style ?')) {
      try {
        await styleApi.delete(id)
        loadStyles()
      } catch (error) {
        console.error('Error deleting style:', error)
      }
    }
  }

  if (loading) return <div className="loading">Chargement...</div>

  return (
    <div className="app">
      <Header />
      <div className="list-container">
        <div className="list-header">
          <h1>🥋 Styles de Combat</h1>
          <div className="list-actions">
            <Link to="/" className="btn btn-secondary">← Retour</Link>
            <Link to="/styles/new" className="btn btn-primary">+ Nouveau Style</Link>
          </div>
        </div>

        {styles.length === 0 ? (
          <div className="empty-state">
            <p>Aucun style enregistré.</p>
            <Link to="/styles/new" className="btn btn-primary">Créer le premier style</Link>
          </div>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nom</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {styles.map(style => (
                  <tr key={style.id}>
                    <td>{style.id}</td>
                    <td className="font-bold">{style.name}</td>
                    <td className="description-cell">{style.description?.substring(0, 150)}...</td>
                    <td className="actions-cell">
                      <Link to={`/styles/${style.id}/edit`} className="btn-icon btn-edit">✏️</Link>
                      <button onClick={() => handleDelete(style.id)} className="btn-icon btn-delete">🗑️</button>
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

export default StyleList
