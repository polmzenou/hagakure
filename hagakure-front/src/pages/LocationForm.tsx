import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { locationApi } from '../services/api'
import { useToast } from '../contexts/ToastContext'
import Header from '../components/Header'
import Footer from '../components/Footer'
import './Form.css'

function LocationForm() {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [loading, setLoading] = useState(false)
  
  const [formData, setFormData] = useState({
    name: '',
    region: '',
    latitude: '',
    longitude: '',
    type: '',
    description: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const payload = {
        name: formData.name,
        region: formData.region,
        latitude: formData.latitude,
        longitude: formData.longitude,
        type: formData.type || null,
        description: formData.description || null,
      }

      await locationApi.create(payload)
      showToast('Lieu créé avec succès')
      navigate('/users')
    } catch (error) {
      console.error('Error saving location:', error)
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
          <h1>Ajouter un lieu</h1>
          <Link to="/users" className="btn btn-secondary">
            ← Retour au Back Office
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="form" aria-label="Formulaire d'ajout de lieu">
          <div className="form-group">
            <label htmlFor="name">Nom du lieu *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              aria-required="true"
              className="form-control"
              placeholder="Ex: Château de Himeji"
            />
          </div>

          <div className="form-group">
            <label htmlFor="region">Région *</label>
            <input
              type="text"
              id="region"
              name="region"
              value={formData.region}
              onChange={handleChange}
              required
              aria-required="true"
              className="form-control"
              placeholder="Ex: Hyogo"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="latitude">Latitude *</label>
              <input
                type="text"
                id="latitude"
                name="latitude"
                value={formData.latitude}
                onChange={handleChange}
                required
                aria-required="true"
                className="form-control"
                placeholder="Ex: 34.8394"
              />
            </div>

            <div className="form-group">
              <label htmlFor="longitude">Longitude *</label>
              <input
                type="text"
                id="longitude"
                name="longitude"
                value={formData.longitude}
                onChange={handleChange}
                required
                aria-required="true"
                className="form-control"
                placeholder="Ex: 134.6939"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="type">Type de lieu</label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="form-control"
            >
              <option value="">-- Sélectionner un type --</option>
              <option value="château">Château</option>
              <option value="champ de bataille">Champ de bataille</option>
              <option value="temple">Temple</option>
              <option value="sanctuaire">Sanctuaire</option>
              <option value="ville">Ville</option>
              <option value="province">Province</option>
              <option value="autre">Autre</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={5}
              className="form-control"
              placeholder="Description du lieu..."
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

export default LocationForm
