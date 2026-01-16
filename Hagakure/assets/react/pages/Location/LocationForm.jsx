import React, { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { locationApi } from '../../services/api'
import Header from '../../components/Header'
import Footer from '../../components/Footer'

function LocationForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    region: '',
    latitude: '',
    longitude: '',
    type: '',
    description: ''
  })

  useEffect(() => {
    if (id) loadLocation()
  }, [id])

  const loadLocation = async () => {
    try {
      const data = await locationApi.getOne(id)
      setFormData({
        name: data.name || '',
        region: data.region || '',
        latitude: data.latitude || '',
        longitude: data.longitude || '',
        type: data.type || '',
        description: data.description || ''
      })
    } catch (error) {
      console.error('Error loading location:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (id) await locationApi.update(id, formData)
      else await locationApi.create(formData)
      navigate('/locations')
    } catch (error) {
      console.error('Error saving location:', error)
      setLoading(false)
    }
  }

  return (
    <div className="app">
      <Header />
      <div className="form-container">
        <div className="form-header">
          <h1>🗾 {id ? 'Modifier' : 'Nouveau'} Lieu</h1>
          <Link to="/locations" className="btn btn-secondary">← Retour</Link>
        </div>
        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label htmlFor="name">Nom *</label>
            <input type="text" id="name" name="name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required className="form-control" />
          </div>
          <div className="form-group">
            <label htmlFor="region">Région *</label>
            <input type="text" id="region" name="region" value={formData.region} onChange={(e) => setFormData({...formData, region: e.target.value})} required className="form-control" />
          </div>
          <div className="form-group">
            <label htmlFor="type">Type</label>
            <input type="text" id="type" name="type" value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})} className="form-control" placeholder="Ex: Château, Ville, Province" />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea id="description" name="description" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="form-control" rows="4" placeholder="Description du lieu..."></textarea>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="latitude">Latitude *</label>
              <input type="text" id="latitude" name="latitude" value={formData.latitude} onChange={(e) => setFormData({...formData, latitude: e.target.value})} required className="form-control" />
            </div>
            <div className="form-group">
              <label htmlFor="longitude">Longitude *</label>
              <input type="text" id="longitude" name="longitude" value={formData.longitude} onChange={(e) => setFormData({...formData, longitude: e.target.value})} required className="form-control" />
            </div>
          </div>
          <div className="form-actions">
            <button type="submit" disabled={loading} className="btn btn-primary">{loading ? 'Enregistrement...' : 'Enregistrer'}</button>
            <Link to="/locations" className="btn btn-secondary">Annuler</Link>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  )
}

export default LocationForm
