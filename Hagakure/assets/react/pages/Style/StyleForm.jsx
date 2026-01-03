import React, { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { styleApi } from '../../services/api'
import Header from '../../components/Header'
import Footer from '../../components/Footer'

function StyleForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: ''
  })

  useEffect(() => {
    if (id) loadStyle()
  }, [id])

  const loadStyle = async () => {
    try {
      const data = await styleApi.getOne(id)
      setFormData({
        name: data.name || '',
        description: data.description || '',
        image: data.image || ''
      })
    } catch (error) {
      console.error('Error loading style:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (id) await styleApi.update(id, formData)
      else await styleApi.create(formData)
      navigate('/styles')
    } catch (error) {
      console.error('Error saving style:', error)
      setLoading(false)
    }
  }

  return (
    <div className="app">
      <Header />
      <div className="form-container">
        <div className="form-header">
          <h1>🥋 {id ? 'Modifier' : 'Nouveau'} Style</h1>
          <Link to="/styles" className="btn btn-secondary">← Retour</Link>
        </div>
        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label htmlFor="name">Nom *</label>
            <input type="text" id="name" name="name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required className="form-control" />
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
            <Link to="/styles" className="btn btn-secondary">Annuler</Link>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  )
}

export default StyleForm
