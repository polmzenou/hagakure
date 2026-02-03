import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import './StaticPage.css'

function About() {
  return (
    <div className="app">
      <Header />
      <div className="static-page-container">
        <div className="static-page-content">
          <h1>À propos</h1>
          <p>
            <strong>Hagakure</strong> est une encyclopédie interactive dédiée à l'histoire
            du Japon féodal et à ses acteurs : samouraïs, clans, batailles, armes et
            styles de combat. Le projet s'inspire de l'œuvre éponyme (« Dans l'ombre des
            feuilles ») et vise à rendre cette période accessible à tous.
          </p>

          <h2>Contenu</h2>
          <p>
            L'application propose une timeline des événements historiques, des fiches
            détaillées sur les guerriers et les clans, une carte des lieux importants,
            ainsi qu'un espace personnel pour sauvegarder vos favoris.
          </p>

          <h2>Public</h2>
          <p>
            Hagakure s'adresse aux passionnés d'histoire japonaise, aux étudiants et au
            grand public curieux. Le contenu est en français et régulièrement enrichi.
          </p>

          <h2>Technique</h2>
          <p>
            Ce site a été développé dans le cadre d'un projet full-stack (Symfony, React).
            Les données sont servies via une API REST et l'interface est responsive.
          </p>

          <Link to="/" className="back-link">← Retour à l'accueil</Link>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default About
