import React from 'react'
import { Navigate } from 'react-router-dom'
import { getCurrentUser } from '../services/authService'

export default function ProtectedRoute({ children, allowedRoles }) {
  const user = getCurrentUser()

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to respective dashboard if trying to access unauthorized route
    if (user.role === 'mahasiswa') return <Navigate to="/mahasiswa/dashboard" replace />
    if (user.role === 'dosen') return <Navigate to="/dosen/dashboard" replace />
    if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />
    return <Navigate to="/login" replace />
  }

  return children
}
