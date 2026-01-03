import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { weaponApi } from '../services/api'
import Header from '../components/Header'
import Footer from '../components/Footer'
import ImageUpload from '../components/ImageUpload'
import './Form.css'

function WeaponForm() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    description: '',
    image: '',
  })

  useEffect(() => {
    if (id) {
      loadWeapon()
    }
  }, [id])

  const loadWeapon = async () => {
    try {
      const data = await weaponApi.getOne(id!)
      setFormData({
        name: data.name || '',
        type: data.type || '',
        description: data.description || '',
        image: data.image || '',
      })
    } catch (error) {
      console.error('Error loading weapon:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (id) {
        await weaponApi.update(id, formData)
      } else {
        await weaponApi.create(formData)
      }
      navigate('/weapons')
    } catch (error) {
      console.error('Error saving weapon:', error)
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
          <h1>{id ? 'Modifier' : 'Nouvelle'} Arme</h1>
          <Link to="/weapons" className="btn btn-secondary">
            ← Retour à la liste
          </Link>
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
              placeholder="Ex: Katana"
            />
          </div>

          <div className="form-group">
            <label htmlFor="type">Type *</label>
            <input
              type="text"
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
              className="form-control"
              placeholder="Ex: Épée"
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
              rows={5}
              className="form-control"
              placeholder="Description de l'arme..."
            />
          </div>

          <ImageUpload
            value={formData.image}
            onChange={handleImageChange}
            label="Image de l'Arme"
          />

          <div className="form-actions">
            <button type="submit" disabled={loading} className="btn btn-primary">
              {loading ? 'Enregistrement...' : 'Enregistrer'}
            </button>
            <Link to="/weapons" className="btn btn-secondary">
              Annuler
            </Link>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  )
}

export default WeaponForm
