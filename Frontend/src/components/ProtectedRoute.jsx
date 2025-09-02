import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function ProtectedRoute({ roles = [], children }){
  const { user } = useAuth()
  const loc = useLocation()
  if(!user) return <Navigate to="/login" replace state={{from: loc.pathname}} />
  if(roles.length && !roles.includes(user.role)) return <Navigate to="/" replace />
  return children
}
