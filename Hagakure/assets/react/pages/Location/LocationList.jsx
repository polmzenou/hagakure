import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { locationApi } from '../../services/api'
import Header from '../../components/Header'
import Footer from '../../components/Footer'

function LocationList() {
  const [locations, setLocations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadLocations()
  }, [])

  const loadLocations = async () => {
    try {
      const data = await locationApi.getAll()
      setLocations(data)
      setLoading(false)
    } catch (error) {
      console.error('Error loading locations:', error)
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce lieu ?')) {
      try {
        await locationApi.delete(id)
        loadLocations()
      } catch (error) {
        console.error('Error deleting location:', error)
      }
    }
  }

  if (loading) return <div className="loading">Chargement...</div>

  return (
    <div className="app">
      <Header />
      <div className="list-container">
        <div className="list-header">
          <h1>🗾 Lieux</h1>
          <div className="list-actions">
            <Link to="/" className="btn btn-secondary">← Retour</Link>
            <Link to="/locations/new" className="btn btn-primary">+ Nouveau Lieu</Link>
          </div>
        </div>

        {locations.length === 0 ? (
          <div className="empty-state">
            <p>Aucun lieu enregistré.</p>
            <Link to="/locations/new" className="btn btn-primary">Créer le premier lieu</Link>
          </div>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nom</th>
                  <th>Région</th>
                  <th>Latitude</th>
                  <th>Longitude</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {locations.map(location => (
                  <tr key={location.id}>
                    <td>{location.id}</td>
                    <td className="font-bold">{location.name}</td>
                    <td>{location.region}</td>
                    <td>{parseFloat(location.latitude).toFixed(6)}</td>
                    <td>{parseFloat(location.longitude).toFixed(6)}</td>
                    <td className="actions-cell">
                      <Link to={`/locations/${location.id}/edit`} className="btn-icon btn-edit">✏️</Link>
                      <button onClick={() => handleDelete(location.id)} className="btn-icon btn-delete">🗑️</button>
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

export default LocationList
