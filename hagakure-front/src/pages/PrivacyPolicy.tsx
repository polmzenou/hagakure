import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import './StaticPage.css'

function PrivacyPolicy() {
  return (
    <div className="app">
      <Header />
      <div className="static-page-container">
        <div className="static-page-content">
          <h1>Politique de confidentialité</h1>
          <p>
            Hagakure s'engage à protéger la vie privée des utilisateurs de cette encyclopédie
            interactive. Cette politique décrit les données que nous collectons et comment
            nous les utilisons.
          </p>

          <h2>Données collectées</h2>
          <p>
            Lors de la création d'un compte, nous enregistrons votre adresse e-mail et un
            mot de passe chiffré. Les données de profil (favoris, préférences) sont stockées
            pour personnaliser votre expérience.
          </p>

          <h2>Utilisation des données</h2>
          <p>
            Vos données sont utilisées uniquement pour le fonctionnement du service :
            authentification, sauvegarde des favoris et amélioration de l'expérience
            utilisateur. Nous ne vendons ni ne partageons vos données avec des tiers.
          </p>

          <h2>Cookies et stockage local</h2>
          <p>
            L'application peut utiliser le stockage local du navigateur (localStorage) pour
            conserver votre session et vos préférences. Aucun cookie de suivi publicitaire
            n'est utilisé.
          </p>

          <h2>Vos droits</h2>
          <p>
            Vous pouvez à tout moment demander l'accès, la rectification ou la suppression
            de vos données en nous contactant ou via la section « Mon compte ».
          </p>

          <h2>Modifications</h2>
          <p>
            Cette politique peut être mise à jour. La date de dernière modification sera
            indiquée en bas de page. Nous vous invitons à la consulter régulièrement.
          </p>

          <Link to="/" className="back-link">← Retour à l'accueil</Link>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default PrivacyPolicy
