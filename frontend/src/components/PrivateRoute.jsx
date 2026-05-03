import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function RequireAuth({ children }) {
  const { auth } = useAuth()
  if (!auth) return <Navigate to="/login" replace />
  return children
}

export function RequireAdmin({ children }) {
  const { auth } = useAuth()
  if (!auth) return <Navigate to="/login" replace />
  if (auth.role !== 'ADMIN') return <Navigate to="/user" replace />
  return children
}

export function RequireUser({ children }) {
  const { auth } = useAuth()
  if (!auth) return <Navigate to="/login" replace />
  return children
}

export function RedirectIfAuth({ children }) {
  const { auth } = useAuth()
  if (auth) {
    return <Navigate to={auth.role === 'ADMIN' ? '/admin' : '/user'} replace />
  }
  return children
}
