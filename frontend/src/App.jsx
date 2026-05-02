import React from 'react'
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom'
import { ToastProvider } from './context/ToastContext'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import Users from './pages/Users'
import Categories from './pages/Categories'
import Questions from './pages/Questions'
import Quizzes from './pages/Quizzes'
import Play from './pages/Play'
import './App.css'

function Layout() {
  return (
    <div className="app-layout">
      <Navbar />
      <main className="app-main">
        <div className="app-content">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/users" element={<Users />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/questions" element={<Questions />} />
            <Route path="/quizzes" element={<Quizzes />} />
            <Route path="/play" element={<Play />} />
          </Route>
        </Routes>
      </ToastProvider>
    </BrowserRouter>
  )
}
