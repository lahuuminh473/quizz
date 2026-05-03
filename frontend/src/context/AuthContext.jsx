import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => {
    const stored = localStorage.getItem('quiz_auth')
    return stored ? JSON.parse(stored) : null
  })

  const login = (data) => {
    // data: { token, username, role, userId }
    localStorage.setItem('quiz_auth', JSON.stringify(data))
    setAuth(data)
  }

  const logout = () => {
    localStorage.removeItem('quiz_auth')
    setAuth(null)
  }

  const isAdmin = auth?.role === 'ADMIN'
  const isUser = !!auth

  return (
    <AuthContext.Provider value={{ auth, login, logout, isAdmin, isUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
