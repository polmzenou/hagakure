import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { weaponApi } from '../../services/api'
import Header from '../../components/Header'
import Footer from '../../components/Footer'

function WeaponList() {
  const [weapons, setWeapons] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadWeapons()
  }, [])

  const loadWeapons = async () => {
    try {
      const data = await weaponApi.getAll()
      setWeapons(data)
      setLoading(false)
    } catch (error) {
      console.error('Error loading weapons:', error)
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette arme ?')) {
      try {
        await weaponApi.delete(id)
        loadWeapons()
      } catch (error) {
        console.error('Error deleting weapon:', error)
      }
    }
  }

  if (loading) return <div className="loading">Chargement...</div>

  return (
    <div className="app">
      <Header />
      <div className="list-container">
        <div className="list-header">
          <h1>🗡️ Armes</h1>
          <div className="list-actions">
            <Link to="/" className="btn btn-secondary">← Retour</Link>
            <Link to="/weapons/new" className="btn btn-primary">+ Nouvelle Arme</Link>
          </div>
        </div>

        {weapons.length === 0 ? (
          <div className="empty-state">
            <p>Aucune arme enregistrée.</p>
            <Link to="/weapons/new" className="btn btn-primary">Créer la première arme</Link>
          </div>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nom</th>
                  <th>Type</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {weapons.map(weapon => (
                  <tr key={weapon.id}>
                    <td>{weapon.id}</td>
                    <td className="font-bold">{weapon.name}</td>
                    <td>{weapon.type}</td>
                    <td className="description-cell">{weapon.description?.substring(0, 100)}...</td>
                    <td className="actions-cell">
                      <Link to={`/weapons/${weapon.id}/edit`} className="btn-icon btn-edit">✏️</Link>
                      <button onClick={() => handleDelete(weapon.id)} className="btn-icon btn-delete">🗑️</button>
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

export default WeaponList
