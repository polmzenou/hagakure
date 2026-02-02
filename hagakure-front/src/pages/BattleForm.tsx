import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { battleApi, clanApi, samouraiApi, locationApi } from '../services/api'
import { useToast } from '../contexts/ToastContext'
import Header from '../components/Header'
import Footer from '../components/Footer'
import ImageUpload from '../components/ImageUpload'
import './Form.css'

interface Clan {
  id: number
  name: string
}

interface Samourai {
  id: number
  name: string
}

interface Location {
  id: number
  name: string
}

function BattleForm() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [loading, setLoading] = useState(false)
  const [clans, setClans] = useState<Clan[]>([])
  const [samourais, setSamourais] = useState<Samourai[]>([])
  const [locations, setLocations] = useState<Location[]>([])
  
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    description: '',
    source_url: '',
    image: '',
    location_id: '',
    winner_clan_id: '',
    samourai_ids: [] as number[],
  })

  const loadRelatedData = async () => {
    try {
      const [clansData, samouraisData, locationsData] = await Promise.all([
        clanApi.getAll(),
        samouraiApi.getAll(),
        locationApi.getAll()
      ])
      setClans(Array.isArray(clansData) ? clansData : [])
      setSamourais(Array.isArray(samouraisData) ? samouraisData : [])
      setLocations(Array.isArray(locationsData) ? locationsData : [])
    } catch (error) {
      console.error('Error loading related data:', error)
    }
  }

  const loadBattle = async () => {
    try {
      const data = await battleApi.getOne(id!)
      setFormData({
        name: data.name || '',
        date: data.date || '',
        description: data.description || '',
        source_url: data.source_url || '',
        image: data.image || '',
        location_id: data.location_id?.id?.toString() || '',
        winner_clan_id: data.winner_clan_id?.id?.toString() || '',
        samourai_ids: data.samourais?.map((s: Samourai) => s.id) || [],
      })
    } catch (error) {
      console.error('Error loading battle:', error)
    }
  }

  useEffect(() => {
    loadRelatedData()
    if (id) {
      loadBattle()
    }
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const payload = {
        name: formData.name,
        date: formData.date,
        description: formData.description,
        source_url: formData.source_url || null,
        image: formData.image || null,
        location_id: formData.location_id ? parseInt(formData.location_id) : null,
        winner_clan_id: formData.winner_clan_id ? parseInt(formData.winner_clan_id) : null,
        samourai_ids: formData.samourai_ids.length > 0 ? formData.samourai_ids : [],
      }

      console.log('Payload envoyé:', { ...payload, image: payload.image ? `[Image: ${(payload.image.length / 1024).toFixed(2)} KB]` : null })
      console.log('Taille totale du payload:', JSON.stringify(payload).length, 'caractères')

      if (id) {
        await battleApi.update(id, payload)
        showToast('Bataille modifiée avec succès')
      } else {
        await battleApi.create(payload)
        showToast('Bataille créée avec succès')
      }
      navigate('/battles')
    } catch (error) {
      console.error('Error saving battle:', error)
      const err = error as { response?: { data?: { message?: string } }; message?: string }
      console.error('Error details:', err.response?.data)
      alert(`Erreur lors de l'enregistrement: ${err.response?.data?.message || err.message || 'Erreur inconnue'}`)
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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

  const handleSamouraiToggle = (samouraiId: number) => {
    setFormData(prev => ({
      ...prev,
      samourai_ids: prev.samourai_ids.includes(samouraiId)
        ? prev.samourai_ids.filter(id => id !== samouraiId)
        : [...prev.samourai_ids, samouraiId]
    }))
  }

  return (
    <div className="app">
      <Header />
      <div className="form-container">
        <div className="form-header">
          <h1>{id ? 'Modifier' : 'Nouvelle'} Bataille</h1>
          <Link to="/battles" className="btn btn-secondary">
            ← Retour à la liste
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="form" aria-label="Formulaire de bataille">
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
              <label htmlFor="location_id">Lieu</label>
              <select
                id="location_id"
                name="location_id"
                value={formData.location_id}
                onChange={handleChange}
                className="form-control"
              >
                <option value="">Aucun lieu</option>
                {locations.map(location => (
                  <option key={location.id} value={location.id}>
                    {location.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="winner_clan_id">Clan vainqueur</label>
            <select
              id="winner_clan_id"
              name="winner_clan_id"
              value={formData.winner_clan_id}
              onChange={handleChange}
              className="form-control"
            >
              <option value="">Aucun vainqueur</option>
              {clans.map(clan => (
                <option key={clan.id} value={clan.id}>
                  {clan.name}
                </option>
              ))}
            </select>
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
              placeholder="Description de la bataille..."
            />
          </div>

          <ImageUpload
            value={formData.image}
            onChange={handleImageChange}
            label="Image de la Bataille"
          />

          <fieldset className="form-group">
            <legend>Samourais participants</legend>
            <div className="checkbox-grid" role="group" aria-label="Sélection des samourais participants">
              {samourais.map(samourai => (
                <label key={samourai.id} className="checkbox-item">
                  <input
                    type="checkbox"
                    checked={formData.samourai_ids.includes(samourai.id)}
                    onChange={() => handleSamouraiToggle(samourai.id)}
                    aria-label={samourai.name}
                  />
                  <span>{samourai.name}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <div className="form-group">
            <label htmlFor="source_url">URL source</label>
            <input
              type="url"
              id="source_url"
              name="source_url"
              value={formData.source_url}
              onChange={handleChange}
              className="form-control"
              placeholder="https://source.com"
            />
          </div>

          <div className="form-actions">
            <button type="submit" disabled={loading} aria-busy={loading} className="btn btn-primary">
              {loading ? 'Enregistrement...' : 'Enregistrer'}
            </button>
            <Link to="/battles" className="btn btn-secondary">
              Annuler
            </Link>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  )
}

export default BattleForm
