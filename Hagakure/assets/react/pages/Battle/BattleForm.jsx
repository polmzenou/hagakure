import React, { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { battleApi } from '../../services/api'
import Header from '../../components/Header'
import Footer from '../../components/Footer'

function BattleForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    date: '',
    source_url: '',
    image: ''
  })

  useEffect(() => {
    if (id) loadBattle()
  }, [id])

  const loadBattle = async () => {
    try {
      const data = await battleApi.getOne(id)
      setFormData({
        name: data.name || '',
        description: data.description || '',
        date: data.date || '',
        source_url: data.source_url || '',
        image: data.image || ''
      })
    } catch (error) {
      console.error('Error loading battle:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (id) await battleApi.update(id, formData)
      else await battleApi.create(formData)
      navigate('/battles')
    } catch (error) {
      console.error('Error saving battle:', error)
      setLoading(false)
    }
  }

  return (
    <div className="app">
      <Header />
      <div className="form-container">
        <div className="form-header">
          <h1>⚡ {id ? 'Modifier' : 'Nouvelle'} Bataille</h1>
          <Link to="/battles" className="btn btn-secondary">← Retour</Link>
        </div>
        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label htmlFor="name">Nom *</label>
            <input type="text" id="name" name="name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required className="form-control" />
          </div>
          <div className="form-group">
            <label htmlFor="date">Date</label>
            <input type="date" id="date" name="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} className="form-control" />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea id="description" name="description" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} required rows="5" className="form-control" />
          </div>
          <div className="form-group">
            <label htmlFor="image">URL de l'image</label>
            <input type="text" id="image" name="image" value={formData.image} onChange={(e) => setFormData({...formData, image: e.target.value})} className="form-control" />
          </div>
          <div className="form-group">
            <label htmlFor="source_url">URL source</label>
            <input type="text" id="source_url" name="source_url" value={formData.source_url} onChange={(e) => setFormData({...formData, source_url: e.target.value})} className="form-control" />
          </div>
          <div className="form-actions">
            <button type="submit" disabled={loading} className="btn btn-primary">{loading ? 'Enregistrement...' : 'Enregistrer'}</button>
            <Link to="/battles" className="btn btn-secondary">Annuler</Link>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  )
}

export default BattleForm
