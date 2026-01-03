import React, { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { clanApi } from '../../services/api'
import Header from '../../components/Header'
import Footer from '../../components/Footer'

function ClanForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    founded_date: '',
    disbanded_date: '',
    image: ''
  })

  useEffect(() => {
    if (id) {
      loadClan()
    }
  }, [id])

  const loadClan = async () => {
    try {
      const data = await clanApi.getOne(id)
      setFormData({
        name: data.name || '',
        description: data.description || '',
        founded_date: data.founded_date || '',
        disbanded_date: data.disbanded_date || '',
        image: data.image || ''
      })
    } catch (error) {
      console.error('Error loading clan:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (id) {
        await clanApi.update(id, formData)
      } else {
        await clanApi.create(formData)
      }
      navigate('/clans')
    } catch (error) {
      console.error('Error saving clan:', error)
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <div className="app">
      <Header />
      <div className="form-container">
        <div className="form-header">
          <h1>🏯 {id ? 'Modifier' : 'Nouveau'} Clan</h1>
          <Link to="/clans" className="btn btn-secondary">← Retour</Link>
        </div>

        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label htmlFor="name">Nom *</label>
            <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required className="form-control" />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="founded_date">Date de fondation</label>
              <input type="date" id="founded_date" name="founded_date" value={formData.founded_date} onChange={handleChange} className="form-control" />
            </div>
            <div className="form-group">
              <label htmlFor="disbanded_date">Date de dissolution</label>
              <input type="date" id="disbanded_date" name="disbanded_date" value={formData.disbanded_date} onChange={handleChange} className="form-control" />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea id="description" name="description" value={formData.description} onChange={handleChange} required rows="5" className="form-control" />
          </div>
          <div className="form-group">
            <label htmlFor="image">URL de l'image</label>
            <input type="text" id="image" name="image" value={formData.image} onChange={handleChange} className="form-control" />
          </div>
          <div className="form-actions">
            <button type="submit" disabled={loading} className="btn btn-primary">{loading ? 'Enregistrement...' : 'Enregistrer'}</button>
            <Link to="/clans" className="btn btn-secondary">Annuler</Link>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  )
}

export default ClanForm
