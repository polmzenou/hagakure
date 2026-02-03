import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import './StaticPage.css'

function Contact() {
  return (
    <div className="app">
      <Header />
      <div className="static-page-container">
        <div className="static-page-content">
          <h1>Nous contacter</h1>
          <p>
            Vous avez une question, une suggestion ou souhaitez signaler un problème ?
            N'hésitez pas à nous écrire.
          </p>

          <h2>Par e-mail</h2>
          <p>
            Pour toute demande concernant l'encyclopédie Hagakure, vous pouvez nous joindre
            à l'adresse : <a href="mailto:contact@hagakure.com">contact@hagakure.com</a>.
            Nous nous efforçons de répondre sous 48 à 72 heures.
          </p>

          <h2>Demandes techniques</h2>
          <p>
            Pour les problèmes techniques (connexion, compte, données), précisez votre
            adresse e-mail de compte et décrivez le problème rencontré afin que nous
            puissions vous aider au mieux.
          </p>

          <h2>Contenu et contributions</h2>
          <p>
            Si vous souhaitez proposer une correction ou un ajout concernant le contenu
            historique (samouraïs, batailles, clans, etc.), indiquez les sources et les
            références dans votre message.
          </p>

          <Link to="/" className="back-link">← Retour à l'accueil</Link>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Contact
