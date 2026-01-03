import React, { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { samouraiApi } from '../../services/api'
import Header from '../../components/Header'
import Footer from '../../components/Footer'

function SamouraiForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    birth_date: '',
    death_date: '',
    source_url: '',
    image: ''
  })

  useEffect(() => {
    if (id) {
      loadSamourai()
    }
  }, [id])

  const loadSamourai = async () => {
    try {
      const data = await samouraiApi.getOne(id)
      setFormData({
        name: data.name || '',
        description: data.description || '',
        birth_date: data.birth_date || '',
        death_date: data.death_date || '',
        source_url: data.source_url || '',
        image: data.image || ''
      })
    } catch (error) {
      console.error('Error loading samourai:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (id) {
        await samouraiApi.update(id, formData)
      } else {
        await samouraiApi.create(formData)
      }
      navigate('/samourais')
    } catch (error) {
      console.error('Error saving samourai:', error)
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="app">
      <Header />
      <div className="form-container">
        <div className="form-header">
          <h1>⚔️ {id ? 'Modifier' : 'Nouveau'} Samouraï</h1>
          <Link to="/samourais" className="btn btn-secondary">← Retour à la liste</Link>
        </div>

        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label htmlFor="name">Nom *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="form-control"
              placeholder="Ex: Miyamoto Musashi"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="birth_date">Date de naissance</label>
              <input
                type="date"
                id="birth_date"
                name="birth_date"
                value={formData.birth_date}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label htmlFor="death_date">Date de mort</label>
              <input
                type="date"
                id="death_date"
                name="death_date"
                value={formData.death_date}
                onChange={handleChange}
                className="form-control"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="5"
              className="form-control"
              placeholder="Description du samouraï..."
            />
          </div>

          <div className="form-group">
            <label htmlFor="image">URL de l'image</label>
            <input
              type="text"
              id="image"
              name="image"
              value={formData.image}
              onChange={handleChange}
              className="form-control"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="form-group">
            <label htmlFor="source_url">URL source</label>
            <input
              type="text"
              id="source_url"
              name="source_url"
              value={formData.source_url}
              onChange={handleChange}
              className="form-control"
              placeholder="https://source.com"
            />
          </div>

          <div className="form-actions">
            <button type="submit" disabled={loading} className="btn btn-primary">
              {loading ? 'Enregistrement...' : 'Enregistrer'}
            </button>
            <Link to="/samourais" className="btn btn-secondary">Annuler</Link>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  )
}

export default SamouraiForm
