import './HistoricalEras.css'

interface Era {
  name: string
  start: number
  end: number
  startEvent: string
  endEvent: string
  highlights: string[]
  color: string
}

const eras: Era[] = [
  {
    name: 'Heian',
    start: 794,
    end: 1185,
    startEvent: 'Fondation de Heian-kyō (Kyoto) par l\'empereur Kanmu',
    endEvent: 'Début de la guerre de Genpei entre les clans Minamoto et Taira',
    highlights: [
      'Âge d\'or de la culture aristocratique japonaise',
      'Émergence de la littérature classique (Le Dit du Genji)',
      'Règne du clan Fujiwara sur la cour impériale',
      'Premiers conflits guerriers qui donneront naissance aux samouraïs',
      'Développement des arts raffinés et de l\'esthétique japonaise'
    ],
    color: 'rgba(138, 43, 226, 0.15)'
  },
  {
    name: 'Kamakura',
    start: 1185,
    end: 1333,
    startEvent: 'Victoire de Minamoto no Yoritomo à la bataille de Dan-no-ura',
    endEvent: 'Chute du shogunat Kamakura face à l\'empereur Go-Daigo',
    highlights: [
      'Premier shogunat militaire du Japon (bakufu)',
      'Établissement du code d\'honneur des samouraïs (bushidō)',
      'Invasions mongoles repoussées par les samouraïs (1274 et 1281)',
      'Développement du bouddhisme Zen',
      'Centralisation du pouvoir militaire à Kamakura'
    ],
    color: 'rgba(30, 144, 255, 0.15)'
  },
  {
    name: 'Muromachi',
    start: 1336,
    end: 1573,
    startEvent: 'Ashikaga Takauji établit le shogunat Muromachi à Kyoto',
    endEvent: 'Oda Nobunaga renverse le shogunat Ashikaga',
    highlights: [
      'Shogunat Ashikaga et retour de la cour à Kyoto',
      'Guerre d\'Ōnin (1467-1477) marquant le début de l\'ère Sengoku',
      'Développement de la culture Nō et de la cérémonie du thé',
      'Architecture des châteaux japonais (shiro)',
      'Commerce florissant avec la Chine et la Corée'
    ],
    color: 'rgba(50, 205, 50, 0.15)'
  },
  {
    name: 'Sengoku',
    start: 1467,
    end: 1603,
    startEvent: 'Guerre d\'Ōnin déclenchant l\'âge des provinces en guerre',
    endEvent: 'Tokugawa Ieyasu unifie le Japon après Sekigahara',
    highlights: [
      'Période des "Provinces en guerre" (Sengoku Jidai)',
      'Guerres constantes entre daimyō pour le contrôle du territoire',
      'Les Trois Unificateurs : Oda Nobunaga, Toyotomi Hideyoshi, Tokugawa Ieyasu',
      'Introduction des armes à feu par les Portugais',
      'Batailles légendaires : Okehazama, Nagashino, Sekigahara',
      'Construction de châteaux défensifs massifs'
    ],
    color: 'rgba(255, 140, 0, 0.15)'
  },
  {
    name: 'Edo',
    start: 1603,
    end: 1868,
    startEvent: 'Tokugawa Ieyasu devient shogun et établit le bakufu à Edo',
    endEvent: 'Restauration Meiji et fin du shogunat Tokugawa',
    highlights: [
      '260 ans de paix Tokugawa (Pax Tokugawa)',
      'Système de contrôle féodal (sankin-kōtai)',
      'Fermeture du Japon au monde extérieur (sakoku)',
      'Épanouissement des arts : ukiyo-e, kabuki, haïku',
      'Développement de la culture urbaine et marchande',
      'Les samouraïs deviennent bureaucrates et administrateurs'
    ],
    color: 'rgba(220, 20, 60, 0.15)'
  },
  {
    name: 'Meiji',
    start: 1868,
    end: 1912,
    startEvent: 'Restauration Meiji et abolition du shogunat',
    endEvent: 'Mort de l\'empereur Meiji',
    highlights: [
      'Modernisation rapide du Japon (Meiji Ishin)',
      'Abolition du système féodal et des privilèges des samouraïs',
      'Industrialisation et ouverture au commerce international',
      'Guerres sino-japonaise (1894-1895) et russo-japonaise (1904-1905)',
      'Adoption de la Constitution Meiji',
      'Fin de l\'ère des samouraïs et transition vers l\'État moderne'
    ],
    color: 'rgba(255, 215, 0, 0.15)'
  }
]

function HistoricalEras() {
  
  const samuraiKanjis = [
    { kanji: '侍', meaning: 'Samouraï' },
    { kanji: '武士', meaning: 'Guerrier' },
    { kanji: '刀', meaning: 'Sabre' },
    { kanji: '戦', meaning: 'Bataille' },
    { kanji: '武', meaning: 'Martial' },
    { kanji: '道', meaning: 'Voie (Bushidō)' },
    { kanji: '忠', meaning: 'Loyauté' },
    { kanji: '義', meaning: 'Justice/Honneur' },
    { kanji: '勇', meaning: 'Courage' },
    { kanji: '仁', meaning: 'Bienveillance' }
  ]

  return (
    <div className="historical-eras-section">
      <div className="eras-watermarks">
        {samuraiKanjis.map((item, index) => (
          <div
            key={index}
            className="eras-watermark"
            style={{
              top: `${10 + index * 8}%`,
              left: index % 2 === 0 ? '5%' : 'auto',
              right: index % 2 === 1 ? '5%' : 'auto',
              fontSize: `${6 + (index % 3) * 2}rem`
            }}
            title={item.meaning}
          >
            {item.kanji}
          </div>
        ))}
      </div>
      
      <div className="eras-container">
        <h2 className="eras-title">Les Ères du Japon Féodal</h2>
        <p className="eras-subtitle">
          Découvrez les périodes historiques qui ont façonné le Japon et l\'histoire des samouraïs
        </p>
        
        <div className="eras-grid">
          {eras.map((era) => (
            <div key={era.name} className="era-card" style={{ borderLeftColor: era.color }}>
              <div className="era-header">
                <h3 className="era-name">{era.name}</h3>
                <span className="era-dates">{era.start} - {era.end}</span>
              </div>
              
              <div className="era-content">
                <div className="era-event">
                  <span className="era-event-label">Début :</span>
                  <p className="era-event-text">{era.startEvent}</p>
                </div>
                
                <div className="era-event">
                  <span className="era-event-label">Fin :</span>
                  <p className="era-event-text">{era.endEvent}</p>
                </div>
                
                <div className="era-highlights">
                  <span className="era-highlights-label">Faits marquants :</span>
                  <ul className="era-highlights-list">
                    {era.highlights.map((highlight, index) => (
                      <li key={index}>{highlight}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default HistoricalEras
