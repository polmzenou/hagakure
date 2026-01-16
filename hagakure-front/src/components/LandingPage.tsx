import { useEffect, useState } from 'react';
import "./LandingPage.css";
import Header from "./Header";
import Footer from "./Footer";
import { Link } from 'react-router-dom';
import { samouraiApi, clanApi, battleApi, weaponApi } from '../services/api';

const LandingPage = () => {
  const [stats, setStats] = useState({
    samourais: 0,
    clans: 0,
    batailles: 0,
    armes: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [samourais, clans, batailles, armes] = await Promise.all([
          samouraiApi.getAll(),
          clanApi.getAll(),
          battleApi.getAll(),
          weaponApi.getAll()
        ]);

        setStats({
          samourais: samourais.length,
          clans: clans.length,
          batailles: batailles.length,
          armes: armes.length
        });
      } catch (error) {
        console.error('Erreur lors de la récupération des statistiques:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="landing-page">
      {/* Image de fond commune pour header + hero */}
      <div className="shared-background">
        <img
          src="/images/hero bg.png"
          alt="Background"
          className="shared-bg-image"
        />
        <div className="shared-overlay"></div>
      </div>

      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section id="accueil" className="hero-section">
        <div className="hero-content">
          {/* Cercle rouge avec texte vertical */}
          <div className="hero-circle">
            <img
              src="/images/logo/Logo blanc-rouge.png"
              alt="Hagakure"
              className="hero-logo"
              style={{ width: "350px", height: "300px" }}
            />
          </div>

          {/* Titre et sous-titre */}
          <div className="hero-text">
            <h1 className="hero-main-title">
              L'encyclopédie interactive du Japon féodal
            </h1>
            <p className="hero-subtitle">「葉隠・日本の魂を探る」</p>
          </div>
        </div>
      </section>

      {/* Sections wrapper with shared watermark */}
      <div className="beige-sections-wrapper">
        <div className="japanese-watermark">完百科事典</div>
        
        {/* Encyclopedia Section */}
        <section id="decouvrir" className="encyclopedia-section">
          <div className="container">
            <h2 className="section-title-jp">「完全な百科事典」</h2>
            <h2 className="section-title-main">Une encyclopédie complète</h2>
            <p className="section-subtitle-main">
              Plongez dans une base de données exhaustive sur le Japon féodal
            </p>
            
            {/* Stats Cards */}
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-number">{stats.samourais}</div>
                <div className="stat-label">Samourais</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">{stats.clans}</div>
                <div className="stat-label">Clans</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">{stats.batailles}</div>
                <div className="stat-label">Batailles</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">{stats.armes}</div>
                <div className="stat-label">Armes</div>
              </div>
            </div>
          </div>
        </section>

        {/* About Hagakure Section */}
        <section id="about-hagakure" className="about-hagakure-section">
          <div className="container">
            <div className="about-decorative-line"></div>
            <h2 className="about-title">Qu'est-ce que Hagakure peut proposer ?</h2>
            <div className="about-text-content">
              <p>
                Hagakure offre une expérience immersive au cœur du Japon féodal grâce à une base de données riche et 
                documentée. Découvrez des fiches détaillées sur les plus grands samouraïs, les clans influents, les armes 
                emblématiques et les batailles qui ont marqué l'histoire. Grâce à une navigation intuitive et une 
                présentation soignée, Hagakure rend l'exploration de cette époque à la fois captivante et accessible.
              </p>
              <p>
                Au-delà des simples informations, Hagakure propose une expérience interactive, une carte du Japon géolocalisé, 
                des événements majeurs, ainsi que de nombreux outils permettant de comprendre les liens, les influences et les 
                conflits de cette époque. Hagakure se veut une référence complète et une interface élégante inspirée des estampes 
                japonaises. Une véritable encyclopédie vivante, accessible et pensée pour tous les curieux.
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* What is Hagakure Section - Dark Background */}
      <section id="what-hagakure" className="what-hagakure-section">
        <div className="japanese-watermark-history">葉隠</div>
        <div className="container">
          <h2 className="history-title-jp">「葉隠」</h2>
          <h2 className="history-title">Qu'est-ce que Hagakure ?</h2>
          <div className="history-text">
            <p>
              Hagakure est un projet dédié à la présentation et à la compréhension du Japon féodal à 
              travers une approche moderne et interactive. Son nom inspiré du célèbre ouvrage de Yamamoto Tsunetomo du 
              XVIIIe siècle, symbolise l'esprit du bushido et l'histoire profonde des samouraïs. Cette 
              plateforme propose un voyage fascinant à travers les personnages, les événements et les 
              cadres, les récits, les figures et les événements qui ont forgé l'ère des samouraïs. En 
              rassemblant ces éléments, le projet affirme sa volonté d'exposer l'essence du bushido et 
              de perpétuer cette mémoire historique de la manière la plus accessible pour tous.
            </p>
          </div>
        </div>
      </section>

      {/* Explore History Section - Beige Background */}
      <section id="explore-history" className="explore-history-section-beige">
        <div className="japanese-watermark-explore">歴史を探る</div>
        <div className="container">
          <h2 className="explore-title-jp">「歴史と風景」</h2>
          <h2 className="explore-title">Explorez l'Histoire</h2>
          <p className="explore-subtitle">
            Naviguez à travers le temps et l'espace du Japon féodal
          </p>

          <div className="explore-cards-grid">
            <div className="explore-card">
              <div className="explore-card-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
              </div>
              <h3 className="explore-card-title">Découvrez l'Histoire du Japon féodal</h3>
              <p className="explore-card-description">
                Accédez à la frise chronologique pour visualiser les événements marquants du Japon féodal
              </p>
              <Link to="/timeline" className="explore-card-link">Timeline<span className="arrow">→</span></Link>
              
            </div>

            <div className="explore-card">
              <div className="explore-card-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
              </div>
              <h3 className="explore-card-title">Explorez l'Histoire du Japon féodal</h3>
              <p className="explore-card-description">
                Accédez à la map pour visualiser les événements marquants du Japon féodal
              </p>
              <Link to="/map" className="explore-card-link">Map<span className="arrow">→</span></Link>
            </div>
          </div>
        </div>
      </section>
      

      {/* Footer */}
      <footer className="footer">
        <Footer />
      </footer>
    </div>
  );
};

export default LandingPage;
