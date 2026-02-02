import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { styleApi } from '../services/api'
import { useToast } from '../contexts/ToastContext'
import Header from '../components/Header'
import Footer from '../components/Footer'
import ImageUpload from '../components/ImageUpload'
import './Form.css'

function StyleForm() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
  })

  useEffect(() => {
    if (id) {
      loadStyle()
    }
  }, [id])

  const loadStyle = async () => {
    try {
      const data = await styleApi.getOne(id!)
      setFormData({
        name: data.name || '',
        description: data.description || '',
        image: data.image || '',
      })
    } catch (error) {
      console.error('Error loading style:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (id) {
        await styleApi.update(id, formData)
        showToast('Style modifié avec succès')
      } else {
        await styleApi.create(formData)
        showToast('Style créé avec succès')
      }
      navigate('/styles')
    } catch (error) {
      console.error('Error saving style:', error)
      alert('Erreur lors de l\'enregistrement')
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleImageChange = (value: string) => {
    setFormData({
      ...formData,
      image: value,
    })
  }

  return (
    <div className="app">
      <Header />
      <div className="form-container">
        <div className="form-header">
          <h1>{id ? 'Modifier' : 'Nouveau'} Style de Combat</h1>
          <Link to="/styles" className="btn btn-secondary">
            ← Retour à la liste
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="form" aria-label="Formulaire de style de combat">
          <div className="form-group">
            <label htmlFor="name">Nom *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              aria-required="true"
              className="form-control"
              placeholder="Ex: Kendo"
            />
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
              placeholder="Description du style de combat..."
            />
          </div>

          <ImageUpload
            value={formData.image}
            onChange={handleImageChange}
            label="Image du Style"
          />

          <div className="form-actions">
            <button type="submit" disabled={loading} aria-busy={loading} className="btn btn-primary">
              {loading ? 'Enregistrement...' : 'Enregistrer'}
            </button>
            <Link to="/styles" className="btn btn-secondary">
              Annuler
            </Link>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  )
}

export default StyleForm
