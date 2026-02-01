import { Navigate } from 'react-router-dom'
import { authApi } from '../services/api'

interface AuthenticatedRouteProps {
  children: React.ReactNode
}

function AuthenticatedRoute({ children }: AuthenticatedRouteProps) {
  if (!authApi.isAuthenticated()) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

export default AuthenticatedRoute
