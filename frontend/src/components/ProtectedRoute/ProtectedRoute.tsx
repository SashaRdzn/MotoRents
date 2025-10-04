import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import type { RootState } from '@/app/store/store'
import type { ReactElement } from 'react'

type Props = {
  children: ReactElement
  requireAdmin?: boolean
}

const ProtectedRoute = ({ children, requireAdmin = false }: Props) => {
  const isAuth = useSelector((s: RootState) => s.auth.isAuthenticated)
  const role = useSelector((s: RootState) => s.auth.user?.role)
  if (!isAuth) return <Navigate to="/auth/login" replace />
  if (requireAdmin && role !== 'admin') return <Navigate to="/" replace />
  return children
}

export default ProtectedRoute


