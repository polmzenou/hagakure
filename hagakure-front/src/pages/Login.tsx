import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authApi } from '../services/api'
import './Login.css'

function Login() {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    console.log('Form data:', formData)
    console.log('Is login:', isLogin)

    try {
      if (isLogin) {
        // Login
        const response = await authApi.login({
          email: formData.email,
          password: formData.password
        })
        
        // Stocker le token et les infos utilisateur
        localStorage.setItem('token', response.token)
        localStorage.setItem('user', JSON.stringify(response.user))
        
        // Rediriger vers la page d'accueil
        navigate('/')
        window.location.reload() // Pour mettre à jour le header
      } else {
        // Register
        if (formData.password !== formData.confirmPassword) {
          setError('Les mots de passe ne correspondent pas')
          setLoading(false)
          return
        }

        if (formData.password.length < 6) {
          setError('Le mot de passe doit contenir au moins 6 caractères')
          setLoading(false)
          return
        }

        console.log('Calling register API...')
        const response = await authApi.register({
          email: formData.email,
          password: formData.password
        })
        console.log('Register response:', response)

        // Stocker le token et les infos utilisateur
        localStorage.setItem('token', response.token)
        localStorage.setItem('user', JSON.stringify(response.user))
        
        // Rediriger vers la page d'accueil
        navigate('/')
        window.location.reload()
      }
    } catch (err: any) {
      console.error('Login/Register error:', err)
      setError(err.response?.data?.message || err.message || 'Une erreur est survenue')
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-background">
        <img src="/images/hero bg.png" alt="" className="login-bg-image" aria-hidden="true" />
        <div className="login-overlay"></div>
      </div>

      <div className="login-container">
        <div className="login-card">
          {/* Logo */}
          <div className="login-logo">
            <img src="/images/logo/Logo noir-rouge.png" alt="Hagakure" width="120" height="104" />
          </div>
          <p className="login-welcome-text">Bienvenue sur Hagakure</p>
          <p className="login-welcome-text-2">Se connecter pourra vous permettre de mettre en favoris les personnages, les événements, les batailles, etc.</p>

          {/* Tabs */}
          <div className="login-tabs">
            <button
              className={`login-tab ${isLogin ? 'active' : ''}`}
              onClick={() => {
                setIsLogin(true)
                setError('')
                setFormData({ email: '', password: '', confirmPassword: '' })
              }}
            >
              Se connecter
            </button>
            <button
              className={`login-tab ${!isLogin ? 'active' : ''}`}
              onClick={() => {
                setIsLogin(false)
                setError('')
                setFormData({ email: '', password: '', confirmPassword: '' })
              }}
            >
              S'inscrire
            </button>
          </div>

          {/* Form */}
          <form className="login-form" onSubmit={handleSubmit} aria-label={isLogin ? 'Formulaire de connexion' : 'Formulaire d\'inscription'}>
            {error && <div className="error-message" role="alert" aria-live="polite">{error}</div>}

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                aria-required="true"
                autoComplete="email"
                placeholder="votre@email.com"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Mot de passe</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                aria-required="true"
                autoComplete={isLogin ? 'current-password' : 'new-password'}
                placeholder="••••••••"
              />
            </div>

            {!isLogin && (
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required={!isLogin}
                  aria-required={!isLogin}
                  autoComplete="new-password"
                  placeholder="••••••••"
                />
              </div>
            )}

            <button
              type="submit"
              className="login-submit-btn"
              disabled={loading}
              aria-busy={loading}
            >
              {loading ? 'Chargement...' : (isLogin ? 'Se connecter' : 'Créer un compte')}
            </button>
          </form>

          {/* Back to home */}
          <div className="login-footer">
            <a href="/" className="back-home">
              ← Retour à l'accueil
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login

