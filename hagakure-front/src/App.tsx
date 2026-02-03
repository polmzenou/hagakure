import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import ScrollToTop from './components/ScrollToTop'
import LandingPage from './components/LandingPage'
import Login from './pages/Login'
import Forbidden from './pages/Forbidden'
import NotFound from './pages/NotFound'
import Timeline from './pages/Timeline'
import Map from './pages/Map'
import ProtectedRoute from './components/ProtectedRoute'
import AuthenticatedRoute from './components/AuthenticatedRoute'
import SamouraiList from './pages/SamouraiList'
import SamouraiForm from './pages/SamouraiForm'
import SamouraiShow from './pages/SamouraiShow'
import WeaponList from './pages/WeaponList'
import WeaponForm from './pages/WeaponForm'
import WeaponShow from './pages/WeaponShow'
import ClanList from './pages/ClanList'
import ClanForm from './pages/ClanForm'
import ClanShow from './pages/ClanShow'
import StyleList from './pages/StyleList'
import StyleForm from './pages/StyleForm'
import StyleShow from './pages/StyleShow'
import BattleList from './pages/BattleList'
import BattleForm from './pages/BattleForm'
import BattleShow from './pages/BattleShow'
import MonCompte from './pages/MonCompte'
import UserList from './pages/UserList'
import LocationForm from './pages/LocationForm'
import LocationEdit from './pages/LocationEdit'
import EventForm from './pages/EventForm'
import EventEdit from './pages/EventEdit'
import PrivacyPolicy from './pages/PrivacyPolicy'
import Contact from './pages/Contact'
import About from './pages/About'

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forbidden" element={<Forbidden />} />
        <Route path="/timeline" element={<Timeline />} />
        <Route path="/map" element={<Map />} />
        <Route path="/politique-de-confidentialite" element={<PrivacyPolicy />} />
        <Route path="/nous-contacter" element={<Contact />} />
        <Route path="/a-propos" element={<About />} />
        <Route path="/account" element={<AuthenticatedRoute><MonCompte /></AuthenticatedRoute>} />
        <Route path="/users" element={<ProtectedRoute><UserList /></ProtectedRoute>} />
        <Route path="/locations/new" element={<ProtectedRoute><LocationForm /></ProtectedRoute>} />
        <Route path="/locations/:id/edit" element={<ProtectedRoute><LocationEdit /></ProtectedRoute>} />
        <Route path="/events/new" element={<ProtectedRoute><EventForm /></ProtectedRoute>} />
        <Route path="/events/:id/edit" element={<ProtectedRoute><EventEdit /></ProtectedRoute>} />

        {/* Samourai Routes */}
        <Route path="/samourais" element={<SamouraiList />} />
        <Route path="/samourais/new" element={<ProtectedRoute><SamouraiForm /></ProtectedRoute>} />
        <Route path="/samourais/:id" element={<SamouraiShow />} />
        <Route path="/samourais/:id/edit" element={<ProtectedRoute><SamouraiForm /></ProtectedRoute>} />
        
        {/* Weapon Routes */}
        <Route path="/weapons" element={<WeaponList />} />
        <Route path="/weapons/new" element={<ProtectedRoute><WeaponForm /></ProtectedRoute>} />
        <Route path="/weapons/:id" element={<WeaponShow />} />
        <Route path="/weapons/:id/edit" element={<ProtectedRoute><WeaponForm /></ProtectedRoute>} />
        
        {/* Clan Routes */}
        <Route path="/clans" element={<ClanList />} />
        <Route path="/clans/new" element={<ProtectedRoute><ClanForm /></ProtectedRoute>} />
        <Route path="/clans/:id" element={<ClanShow />} />
        <Route path="/clans/:id/edit" element={<ProtectedRoute><ClanForm /></ProtectedRoute>} />
        
        {/* Style Routes - ADMIN uniquement */}
        <Route path="/styles" element={<ProtectedRoute><StyleList /></ProtectedRoute>} />
        <Route path="/styles/new" element={<ProtectedRoute><StyleForm /></ProtectedRoute>} />
        <Route path="/styles/:id" element={<ProtectedRoute><StyleShow /></ProtectedRoute>} />
        <Route path="/styles/:id/edit" element={<ProtectedRoute><StyleForm /></ProtectedRoute>} />
        
        {/* Battle Routes */}
        <Route path="/battles" element={<BattleList />} />
        <Route path="/battles/new" element={<ProtectedRoute><BattleForm /></ProtectedRoute>} />
        <Route path="/battles/:id" element={<BattleShow />} />
        <Route path="/battles/:id/edit" element={<ProtectedRoute><BattleForm /></ProtectedRoute>} />
        
        {/* 404 - Catch all route (must be last) */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App