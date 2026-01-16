import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { MapContainer, TileLayer, Marker, Popup, LayersControl, ScaleControl, ZoomControl } from 'react-leaflet'
import L from 'leaflet'
import { locationApi, battleApi } from '../services/api'
import Header from '../components/Header'
import Footer from '../components/Footer'
import 'leaflet/dist/leaflet.css'
import './Map.css'

// Interface pour les données Location
interface Location {
  id: number
  name: string
  region: string
  type: string | null
  description: string | null
  latitude: string
  longitude: string
  battles_count?: number
}

// Interface pour les batailles
interface Battle {
  id: number
  name: string
  location_id?: number
}

// Fonction pour déterminer si c'est une bataille
const isBattle = (type: string | null): boolean => {
  if (!type) return false
  const lowerType = type.toLowerCase()
  return lowerType.includes('bataille') || lowerType.includes('champ de bataille') || lowerType.includes('forteresse')
}

// Création des icônes personnalisées
const createBattleIcon = () => {
  return L.divIcon({
    className: 'custom-marker battle-marker',
    html: `
      <div class="marker-container battle">
        <div class="marker-icon">⚔️</div>
        <div class="marker-pulse"></div>
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40]
  })
}

const createLocationIcon = () => {
  return L.divIcon({
    className: 'custom-marker location-marker',
    html: `
      <div class="marker-container location">
        <div class="marker-icon">⭐</div>
        <div class="marker-pulse"></div>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36]
  })
}

// Composant pour le contenu du popup
function PopupContent({ 
  location, 
  battleForLocation
}: { 
  location: Location
  battleForLocation: Battle | null
}) {
  const isBattleType = isBattle(location.type)
  // const isFavorite = favorites[location.id] || false // Commenté pour plus tard

  return (
    <div className="popup-content">
      <h3 className="popup-title">{location.name}</h3>
      {location.type && (
        <span className={`popup-type ${isBattleType ? 'battle' : 'location'}`}>
          {location.type}
        </span>
      )}
      <p className="popup-region">
        <strong>Région:</strong> {location.region}
      </p>
      {location.description && (
        <p className="popup-description">{location.description}</p>
      )}
      {location.battles_count !== undefined && location.battles_count > 0 && (
        <p className="popup-battles">
          <strong>{location.battles_count}</strong> bataille(s) associée(s)
        </p>
      )}
      
      <div className="popup-actions">
        {/* Bouton pour voir la bataille si elle existe */}
        {isBattleType && battleForLocation && (
          <Link to={`/battles/${battleForLocation.id}`} className="popup-btn battle-link">
            <span className="btn-icon">⚔️</span>
            Voir la bataille
          </Link>
        )}
        
        {/* Bouton favoris - Commenté pour plus tard
        {isAuthenticated && (
          <button 
            className={`popup-btn favorite-btn ${isFavorite ? 'is-favorite' : ''}`}
            onClick={() => onToggleFavorite(location.id)}
          >
            <span className="btn-icon">{isFavorite ? '★' : '☆'}</span>
            {isFavorite ? 'Favori' : 'Ajouter aux favoris'}
          </button>
        )}
        */}
      </div>
    </div>
  )
}

function Map() {
  const [locations, setLocations] = useState<Location[]>([])
  const [battles, setBattles] = useState<Battle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  // const [isAuthenticated, setIsAuthenticated] = useState(false) // Commenté pour plus tard
  // const [favorites, setFavorites] = useState<Record<number, boolean>>({}) // Commenté pour plus tard

  // Kanjis pour le fond décoratif (thème carte/géographie)
  // 地 (chi) - Terre
  // 図 (zu) - Carte
  // 国 (kuni) - Pays
  // 城 (shiro) - Château
  // 山 (yama) - Montagne
  // 川 (kawa) - Rivière
  // 海 (umi) - Mer
  // 道 (michi) - Chemin
  // 戦 (ikusa) - Bataille
  // 侍 (samurai) - Samouraï
  const mapKanjis = [
    { kanji: '地', meaning: 'Terre' },
    { kanji: '図', meaning: 'Carte' },
    { kanji: '国', meaning: 'Pays' },
    { kanji: '城', meaning: 'Château' },
    { kanji: '山', meaning: 'Montagne' },
    { kanji: '川', meaning: 'Rivière' },
    { kanji: '海', meaning: 'Mer' },
    { kanji: '道', meaning: 'Chemin' },
    { kanji: '戦', meaning: 'Bataille' },
    { kanji: '侍', meaning: 'Samouraï' }
  ]

  useEffect(() => {
    // setIsAuthenticated(authApi.isAuthenticated()) // Commenté pour plus tard
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Charger les locations
      const locationsData = await locationApi.getAll()
      setLocations(Array.isArray(locationsData) ? locationsData : [])
      
      // Charger les batailles pour pouvoir les associer aux locations
      try {
        const battlesData = await battleApi.getAll()
        setBattles(Array.isArray(battlesData) ? battlesData : [])
      } catch {
        // Si l'utilisateur n'a pas accès aux batailles, on continue sans
        setBattles([])
      }
      
      /* Commenté pour plus tard - Vérifier les favoris
      if (authApi.isAuthenticated()) {
        await loadFavorites(Array.isArray(locationsData) ? locationsData : [])
      }
      */
    } catch (err) {
      console.error('Error loading locations:', err)
      setError('Erreur lors du chargement des lieux')
    } finally {
      setLoading(false)
    }
  }

  /* Commenté pour plus tard - Gestion des favoris
  const loadFavorites = async (locs: Location[]) => {
    const favoritesMap: Record<number, boolean> = {}
    
    for (const loc of locs) {
      try {
        const result = await favoriteApi.check({
          entity_type: 'location',
          entity_id: loc.id
        })
        favoritesMap[loc.id] = result.is_favorite
      } catch {
        favoritesMap[loc.id] = false
      }
    }
    
    setFavorites(favoritesMap)
  }

  const handleToggleFavorite = async (locationId: number) => {
    if (!isAuthenticated) return
    
    try {
      const result = await favoriteApi.toggle({
        entity_type: 'location',
        entity_id: locationId
      })
      
      setFavorites(prev => ({
        ...prev,
        [locationId]: result.is_favorite
      }))
    } catch (error: unknown) {
      console.error('Error toggling favorite:', error)
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de l\'ajout aux favoris'
      alert(errorMessage)
    }
  }
  */

  // Trouver la bataille associée à une location par son nom
  const findBattleForLocation = (location: Location): Battle | null => {
    // Chercher une bataille dont le nom contient le nom de la location
    const locationNameLower = location.name.toLowerCase()
    
    return battles.find(battle => {
      const battleNameLower = battle.name.toLowerCase()
      // Vérifier si le nom de la bataille contient le nom de la location
      // ou si le nom de la location contient le nom de la bataille
      return battleNameLower.includes(locationNameLower) || 
             locationNameLower.includes(battleNameLower.replace('bataille de ', '').replace('siège de ', '').replace('siège d\'', ''))
    }) || null
  }

  // Centre du Japon
  const japanCenter: [number, number] = [36.2, 138.2]
  const defaultZoom = 6

  // Icônes pré-créées
  const battleIcon = createBattleIcon()
  const locationIcon = createLocationIcon()

  return (
    <div className="app">
      <Header />
      <div className="map-page">
        {/* Watermarks japonais en arrière-plan */}
        <div className="map-watermarks">
          {mapKanjis.map((item, index) => (
            <div
              key={index}
              className="map-watermark"
              style={{
                top: `${5 + index * 9}%`,
                left: index % 2 === 0 ? '3%' : 'auto',
                right: index % 2 === 1 ? '3%' : 'auto',
                fontSize: `${5 + (index % 3) * 2}rem`
              }}
              title={item.meaning}
            >
              {item.kanji}
            </div>
          ))}
        </div>

        <div className="map-header">
          <h1 className="map-title">Carte du Japon Féodal</h1>
          <h2 className="map-title-jp">「日本地図」</h2>
          <p className="map-subtitle">
            Explorez les lieux historiques et champs de bataille légendaires du Japon des samouraïs
          </p>
        </div>

        <div className="map-legend">
          <div className="legend-item">
            <span className="legend-icon battle">⚔️</span>
            <span className="legend-label">Champ de bataille / Forteresse</span>
          </div>
          <div className="legend-item">
            <span className="legend-icon location">⭐</span>
            <span className="legend-label">Lieu historique</span>
          </div>
          {/* Commenté pour plus tard - Légende favoris
          {isAuthenticated && (
            <div className="legend-item">
              <span className="legend-icon favorite">★</span>
              <span className="legend-label">Cliquez pour ajouter aux favoris</span>
            </div>
          )}
          */}
        </div>

        {loading && (
          <div className="map-loading">
            <div className="loading-spinner"></div>
            <p>Chargement de la carte...</p>
          </div>
        )}

        {error && (
          <div className="map-error">
            <p>{error}</p>
            <button onClick={loadData} className="retry-btn">Réessayer</button>
          </div>
        )}

        {!loading && !error && (
          <div className="map-container-wrapper">
            <MapContainer
              center={japanCenter}
              zoom={defaultZoom}
              className="leaflet-map"
              zoomControl={false}
              scrollWheelZoom={true}
            >
              {/* Contrôle de zoom personnalisé */}
              <ZoomControl position="topright" />
              
              {/* Échelle */}
              <ScaleControl position="bottomleft" imperial={false} />

              {/* Contrôle des calques */}
              <LayersControl position="topright">
                {/* Calque de base - Style ancien/sépia */}
                <LayersControl.BaseLayer checked name="Carte ancienne">
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                  />
                </LayersControl.BaseLayer>

                {/* Calque alternatif - Relief montagneux */}
                <LayersControl.BaseLayer name="Relief montagneux">
                  <TileLayer
                    attribution='Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a>'
                    url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
                  />
                </LayersControl.BaseLayer>

                {/* Calque sombre */}
                <LayersControl.BaseLayer name="Carte sombre">
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                  />
                </LayersControl.BaseLayer>
              </LayersControl>

              {/* Marqueurs des lieux */}
              {locations.map((location) => {
                const lat = parseFloat(location.latitude)
                const lng = parseFloat(location.longitude)
                
                // Vérifier que les coordonnées sont valides
                if (isNaN(lat) || isNaN(lng) || lat === 0 || lng === 0) {
                  return null
                }

                const icon = isBattle(location.type) ? battleIcon : locationIcon
                const battleForLocation = findBattleForLocation(location)

                return (
                  <Marker
                    key={location.id}
                    position={[lat, lng]}
                    icon={icon}
                  >
                    <Popup className="custom-popup">
                      <PopupContent
                        location={location}
                        battleForLocation={battleForLocation}
                      />
                    </Popup>
                  </Marker>
                )
              })}
            </MapContainer>
          </div>
        )}

        {!loading && !error && locations.length === 0 && (
          <div className="map-empty">
            <p>Aucun lieu trouvé dans la base de données.</p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}

export default Map
