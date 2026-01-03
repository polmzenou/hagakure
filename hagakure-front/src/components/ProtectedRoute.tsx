import { Navigate } from 'react-router-dom'
import { isAdmin } from '../utils/permissions'

interface ProtectedRouteProps {
  children: React.ReactNode
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
  if (!isAdmin()) {
    return <Navigate to="/forbidden" replace />
  }

  return <>{children}</>
}

export default ProtectedRoute

