import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { battleApi } from '../../services/api'
import Header from '../../components/Header'
import Footer from '../../components/Footer'

function BattleList() {
  const [battles, setBattles] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadBattles()
  }, [])

  const loadBattles = async () => {
    try {
      const data = await battleApi.getAll()
      setBattles(data)
      setLoading(false)
    } catch (error) {
      console.error('Error loading battles:', error)
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette bataille ?')) {
      try {
        await battleApi.delete(id)
        loadBattles()
      } catch (error) {
        console.error('Error deleting battle:', error)
      }
    }
  }

  if (loading) return <div className="loading">Chargement...</div>

  return (
    <div className="app">
      <Header />
      <div className="list-container">
        <div className="list-header">
          <h1>⚡ Batailles</h1>
          <div className="list-actions">
            <Link to="/" className="btn btn-secondary">← Retour</Link>
            <Link to="/battles/new" className="btn btn-primary">+ Nouvelle Bataille</Link>
          </div>
        </div>

        {battles.length === 0 ? (
          <div className="empty-state">
            <p>Aucune bataille enregistrée.</p>
            <Link to="/battles/new" className="btn btn-primary">Créer la première bataille</Link>
          </div>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nom</th>
                  <th>Date</th>
                  <th>Lieu</th>
                  <th>Clan vainqueur</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {battles.map(battle => (
                  <tr key={battle.id}>
                    <td>{battle.id}</td>
                    <td className="font-bold">{battle.name}</td>
                    <td>{battle.date || '-'}</td>
                    <td>{battle.location?.name || '-'}</td>
                    <td>{battle.winner_clan?.name || '-'}</td>
                    <td className="actions-cell">
                      <Link to={`/battles/${battle.id}/edit`} className="btn-icon btn-edit">✏️</Link>
                      <button onClick={() => handleDelete(battle.id)} className="btn-icon btn-delete">🗑️</button>
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

export default BattleList
