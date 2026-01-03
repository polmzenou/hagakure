import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import LandingPage from './components/LandingPage'
import Login from './pages/Login'
import Forbidden from './pages/Forbidden'
import Timeline from './pages/Timeline'
import ProtectedRoute from './components/ProtectedRoute'
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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forbidden" element={<Forbidden />} />
        <Route path="/timeline" element={<Timeline />} />
        <Route path="/account" element={<ProtectedRoute><MonCompte /></ProtectedRoute>} />
        
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
        
        {/* Style Routes */}
        <Route path="/styles" element={<StyleList />} />
        <Route path="/styles/new" element={<ProtectedRoute><StyleForm /></ProtectedRoute>} />
        <Route path="/styles/:id" element={<StyleShow />} />
        <Route path="/styles/:id/edit" element={<ProtectedRoute><StyleForm /></ProtectedRoute>} />
        
        {/* Battle Routes */}
        <Route path="/battles" element={<BattleList />} />
        <Route path="/battles/new" element={<ProtectedRoute><BattleForm /></ProtectedRoute>} />
        <Route path="/battles/:id" element={<BattleShow />} />
        <Route path="/battles/:id/edit" element={<ProtectedRoute><BattleForm /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App