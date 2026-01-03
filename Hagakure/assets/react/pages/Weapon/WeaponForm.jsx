import React, { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { weaponApi } from '../../services/api'
import Header from '../../components/Header'
import Footer from '../../components/Footer'

function WeaponForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    description: '',
    image: ''
  })

  useEffect(() => {
    if (id) loadWeapon()
  }, [id])

  const loadWeapon = async () => {
    try {
      const data = await weaponApi.getOne(id)
      setFormData({
        name: data.name || '',
        type: data.type || '',
        description: data.description || '',
        image: data.image || ''
      })
    } catch (error) {
      console.error('Error loading weapon:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (id) await weaponApi.update(id, formData)
      else await weaponApi.create(formData)
      navigate('/weapons')
    } catch (error) {
      console.error('Error saving weapon:', error)
      setLoading(false)
    }
  }

  return (
    <div className="app">
      <Header />
      <div className="form-container">
        <div className="form-header">
          <h1>🗡️ {id ? 'Modifier' : 'Nouvelle'} Arme</h1>
          <Link to="/weapons" className="btn btn-secondary">← Retour</Link>
        </div>
        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label htmlFor="name">Nom *</label>
            <input type="text" id="name" name="name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required className="form-control" />
          </div>
          <div className="form-group">
            <label htmlFor="type">Type *</label>
            <input type="text" id="type" name="type" value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})} required className="form-control" />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea id="description" name="description" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} required rows="5" className="form-control" />
          </div>
          <div className="form-group">
            <label htmlFor="image">URL de l'image</label>
            <input type="text" id="image" name="image" value={formData.image} onChange={(e) => setFormData({...formData, image: e.target.value})} className="form-control" />
          </div>
          <div className="form-actions">
            <button type="submit" disabled={loading} className="btn btn-primary">{loading ? 'Enregistrement...' : 'Enregistrer'}</button>
            <Link to="/weapons" className="btn btn-secondary">Annuler</Link>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  )
}

export default WeaponForm
