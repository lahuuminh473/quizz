import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ToastProvider } from './context/ToastContext'
import { AuthProvider } from './context/AuthContext'

// Guards & Layouts
import { RequireAdmin, RequireUser, RedirectIfAuth } from './components/PrivateRoute'
import AdminLayout from './components/AdminLayout'
import UserLayout from './components/UserLayout'

// Auth pages
import Login from './pages/Login'
import Register from './pages/Register'

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminUsers from './pages/admin/AdminUsers'
import AdminCategories from './pages/admin/AdminCategories'
import AdminQuestions from './pages/admin/AdminQuestions'
import AdminQuizzes from './pages/admin/AdminQuizzes'

// User pages
import UserHome from './pages/user/UserHome'
import UserPlay from './pages/user/UserPlay'
import UserHistory from './pages/user/UserHistory'

import './App.css'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />

            <Route path="/login" element={<RedirectIfAuth><Login /></RedirectIfAuth>} />
            <Route path="/register" element={<RedirectIfAuth><Register /></RedirectIfAuth>} />

            <Route path="/admin" element={<RequireAdmin><AdminLayout /></RequireAdmin>}>
              <Route index element={<AdminDashboard />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="categories" element={<AdminCategories />} />
              <Route path="questions" element={<AdminQuestions />} />
              <Route path="quizzes" element={<AdminQuizzes />} />
            </Route>

            <Route path="/user" element={<RequireUser><UserLayout /></RequireUser>}>
              <Route index element={<UserHome />} />
              <Route path="play" element={<UserPlay />} />
              <Route path="history" element={<UserHistory />} />
            </Route>

            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
