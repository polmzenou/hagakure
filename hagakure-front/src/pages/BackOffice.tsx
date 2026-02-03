import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import './BackOffice.css'

const BACK_OFFICE_ITEMS = [
  { to: '/samourais', label: 'Samourais', description: 'Gérer les samourais' },
  { to: '/battles', label: 'Batailles', description: 'Gérer les batailles' },
  { to: '/weapons', label: 'Armes', description: 'Gérer les armes' },
  { to: '/styles', label: 'Styles de combat', description: 'Gérer les styles de combat' },
  { to: '/users', label: 'Utilisateurs', description: 'Gérer les comptes utilisateurs' },
]

function BackOffice() {
  return (
    <div className="app">
      <Header />
      <div className="backoffice-container">
        <div className="backoffice-header">
          <h1 className="backoffice-title">Back Office</h1>
          <p className="backoffice-subtitle">
            Choisissez la section à gérer
          </p>
        </div>
        <div className="backoffice-grid">
          {BACK_OFFICE_ITEMS.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="backoffice-card"
            >
              <span className="backoffice-card-label">{item.label}</span>
              <span className="backoffice-card-desc">{item.description}</span>
            </Link>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default BackOffice
