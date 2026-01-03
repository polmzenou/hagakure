import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import SamouraiList from './pages/Samourai/SamouraiList'
import SamouraiForm from './pages/Samourai/SamouraiForm'
import ClanList from './pages/Clan/ClanList'
import ClanForm from './pages/Clan/ClanForm'
import BattleList from './pages/Battle/BattleList'
import BattleForm from './pages/Battle/BattleForm'
import WeaponList from './pages/Weapon/WeaponList'
import WeaponForm from './pages/Weapon/WeaponForm'
import StyleList from './pages/Style/StyleList'
import StyleForm from './pages/Style/StyleForm'
import LocationList from './pages/Location/LocationList'
import LocationForm from './pages/Location/LocationForm'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      
      <Route path="/samourais" element={<SamouraiList />} />
      <Route path="/samourais/new" element={<SamouraiForm />} />
      <Route path="/samourais/:id/edit" element={<SamouraiForm />} />
      
      <Route path="/clans" element={<ClanList />} />
      <Route path="/clans/new" element={<ClanForm />} />
      <Route path="/clans/:id/edit" element={<ClanForm />} />
      
      <Route path="/battles" element={<BattleList />} />
      <Route path="/battles/new" element={<BattleForm />} />
      <Route path="/battles/:id/edit" element={<BattleForm />} />
      
      <Route path="/weapons" element={<WeaponList />} />
      <Route path="/weapons/new" element={<WeaponForm />} />
      <Route path="/weapons/:id/edit" element={<WeaponForm />} />
      
      <Route path="/styles" element={<StyleList />} />
      <Route path="/styles/new" element={<StyleForm />} />
      <Route path="/styles/:id/edit" element={<StyleForm />} />
      
      <Route path="/locations" element={<LocationList />} />
      <Route path="/locations/new" element={<LocationForm />} />
      <Route path="/locations/:id/edit" element={<LocationForm />} />
    </Routes>
  )
}

export default App
