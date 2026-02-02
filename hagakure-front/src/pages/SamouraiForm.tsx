import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { samouraiApi, clanApi, weaponApi, styleApi } from '../services/api'
import { useToast } from '../contexts/ToastContext'
import Header from '../components/Header'
import Footer from '../components/Footer'
import ImageUpload from '../components/ImageUpload'
import './Form.css'

interface Clan {
  id: number
  name: string
}

interface Weapon {
  id: number
  name: string
}

interface Style {
  id: number
  name: string
}

function SamouraiForm() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [loading, setLoading] = useState(false)
  const [clans, setClans] = useState<Clan[]>([])
  const [weapons, setWeapons] = useState<Weapon[]>([])
  const [styles, setStyles] = useState<Style[]>([])
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    birth_date: '',
    death_date: '',
    source_url: '',
    image: '',
    clan_id: '',
    weapon_ids: [] as number[],
    style_ids: [] as number[],
  })

  const loadRelatedData = async () => {
    try {
      const [clansData, weaponsData, stylesData] = await Promise.all([
        clanApi.getAll(),
        weaponApi.getAll(),
        styleApi.getAll()
      ])
      setClans(Array.isArray(clansData) ? clansData : [])
      setWeapons(Array.isArray(weaponsData) ? weaponsData : [])
      setStyles(Array.isArray(stylesData) ? stylesData : [])
    } catch (error) {
      console.error('Error loading related data:', error)
    }
  }

  const loadSamourai = async () => {
    try {
      const data = await samouraiApi.getOne(id!)
      setFormData({
        name: data.name || '',
        description: data.description || '',
        birth_date: data.birth_date || '',
        death_date: data.death_date || '',
        source_url: data.source_url || '',
        image: data.image || '',
        clan_id: data.clan?.id?.toString() || '',
        weapon_ids: data.weapon?.map((w: { id: number }) => w.id) || [],
        style_ids: data.style_id?.map((s: { id: number }) => s.id) || [],
      })
    } catch (error) {
      console.error('Error loading samourai:', error)
    }
  }

  useEffect(() => {
    loadRelatedData()
    if (id) {
      loadSamourai()
    }
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        birth_date: formData.birth_date || null,
        death_date: formData.death_date || null,
        source_url: formData.source_url || null,
        image: formData.image || null, // Temporairement désactivé pour test
        clan_id: formData.clan_id ? parseInt(formData.clan_id) : null,
        weapon_ids: formData.weapon_ids.length > 0 ? formData.weapon_ids : [],
        style_ids: formData.style_ids.length > 0 ? formData.style_ids : [],
      }

      console.log('Payload envoyé:', { ...payload, image: payload.image ? `[Image: ${(payload.image.length / 1024).toFixed(2)} KB]` : null })
      console.log('Taille totale du payload:', JSON.stringify(payload).length, 'caractères')
      console.log('Image size:', formData.image ? (formData.image.length / 1024).toFixed(2) + ' KB' : 'No image')

      if (id) {
        await samouraiApi.update(id, payload)
        showToast('Samouraï modifié avec succès')
      } else {
        await samouraiApi.create(payload)
        showToast('Samouraï créé avec succès')
      }
      navigate('/samourais')
    } catch (error) {
      console.error('Error saving samourai:', error)
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

  const handleWeaponToggle = (weaponId: number) => {
    setFormData(prev => ({
      ...prev,
      weapon_ids: prev.weapon_ids.includes(weaponId)
        ? prev.weapon_ids.filter(id => id !== weaponId)
        : [...prev.weapon_ids, weaponId]
    }))
  }

  const handleStyleToggle = (styleId: number) => {
    setFormData(prev => ({
      ...prev,
      style_ids: prev.style_ids.includes(styleId)
        ? prev.style_ids.filter(id => id !== styleId)
        : [...prev.style_ids, styleId]
    }))
  }

  return (
    <div className="app">
      <Header />
      <div className="form-container">
        <div className="form-header">
          <h1>{id ? 'Modifier' : 'Nouveau'} Samouraï</h1>
          <Link to="/samourais" className="btn btn-secondary">
            ← Retour à la liste
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="form" aria-label="Formulaire de samouraï">
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
            <label htmlFor="clan_id">Clan</label>
            <select
              id="clan_id"
              name="clan_id"
              value={formData.clan_id}
              onChange={handleChange}
              className="form-control"
            >
              <option value="">Aucun clan</option>
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
              placeholder="Description du samouraï..."
            />
          </div>

          <ImageUpload
            value={formData.image}
            onChange={handleImageChange}
            label="Image du Samouraï"
          />

          <fieldset className="form-group">
            <legend>Armes</legend>
            <div className="checkbox-grid" role="group" aria-label="Sélection des armes">
              {weapons.map(weapon => (
                <label key={weapon.id} className="checkbox-item">
                  <input
                    type="checkbox"
                    checked={formData.weapon_ids.includes(weapon.id)}
                    onChange={() => handleWeaponToggle(weapon.id)}
                    aria-label={weapon.name}
                  />
                  <span>{weapon.name}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="form-group">
            <legend>Styles de combat</legend>
            <div className="checkbox-grid" role="group" aria-label="Sélection des styles de combat">
              {styles.map(style => (
                <label key={style.id} className="checkbox-item">
                  <input
                    type="checkbox"
                    checked={formData.style_ids.includes(style.id)}
                    onChange={() => handleStyleToggle(style.id)}
                    aria-label={style.name}
                  />
                  <span>{style.name}</span>
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
            <Link to="/samourais" className="btn btn-secondary">
              Annuler
            </Link>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  )
}

export default SamouraiForm
