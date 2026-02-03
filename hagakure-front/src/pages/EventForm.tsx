import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { timelineApi } from '../services/api'
import { useToast } from '../contexts/ToastContext'
import Header from '../components/Header'
import Footer from '../components/Footer'
import './Form.css'

function EventForm() {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [loading, setLoading] = useState(false)
  
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    type: 'politique',
    description: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const payload = {
        title: formData.title,
        date: formData.date,
        type: formData.type,
        description: formData.description,
      }

      await timelineApi.create(payload)
      showToast('Événement créé avec succès')
      navigate('/users')
    } catch (error) {
      console.error('Error saving event:', error)
      const err = error as { message?: string }
      alert(`Erreur lors de l'enregistrement: ${err.message || 'Erreur inconnue'}`)
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="app">
      <Header />
      <div className="form-container">
        <div className="form-header">
          <h1>Ajouter un événement</h1>
          <Link to="/users" className="btn btn-secondary">
            ← Retour au Back Office
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="form" aria-label="Formulaire d'ajout d'événement">
          <div className="form-group">
            <label htmlFor="title">Titre de l'événement *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              aria-required="true"
              className="form-control"
              placeholder="Ex: Bataille de Sekigahara"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="date">Date *</label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                aria-required="true"
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label htmlFor="type">Type d'événement *</label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
                aria-required="true"
                className="form-control"
              >
                <option value="politique">Politique</option>
                <option value="bataille">Bataille</option>
                <option value="naissance">Naissance</option>
                <option value="mort">Mort</option>
                <option value="duel">Duel</option>
              </select>
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
              aria-required="true"
              rows={5}
              className="form-control"
              placeholder="Description de l'événement..."
            />
          </div>

          <div className="form-actions">
            <button type="submit" disabled={loading} aria-busy={loading} className="btn btn-primary">
              {loading ? 'Enregistrement...' : 'Enregistrer'}
            </button>
            <Link to="/users" className="btn btn-secondary">
              Annuler
            </Link>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  )
}

export default EventForm
