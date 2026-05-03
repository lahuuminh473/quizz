import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import './AdminNavbar.css'

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: '⬡' },
  { to: '/admin/users', label: 'Users', icon: '◈' },
  { to: '/admin/categories', label: 'Categories', icon: '◇' },
  { to: '/admin/questions', label: 'Questions', icon: '◆' },
  { to: '/admin/quizzes', label: 'Quizzes', icon: '▣' },
]

export default function AdminNavbar() {
  const [collapsed, setCollapsed] = useState(false)
  const { auth, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className={`navbar ${collapsed ? 'collapsed' : ''}`}>
      <div className="navbar-logo">
        <span className="logo-icon">⬡</span>
        {!collapsed && <div>
          <span className="logo-text">QuizzMaster</span>
          <div className="logo-sub">Admin Panel</div>
        </div>}
      </div>

      <div className="navbar-items">
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/admin'}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            title={collapsed ? item.label : ''}
          >
            <span className="nav-icon">{item.icon}</span>
            {!collapsed && <span className="nav-label">{item.label}</span>}
          </NavLink>
        ))}
      </div>

      <div className="navbar-footer">
        {!collapsed && (
          <div className="nav-user">
            <span className="nav-user-name">{auth?.username}</span>
            <span className="nav-user-role">ADMIN</span>
          </div>
        )}
        <button className="btn btn-danger btn-sm" onClick={handleLogout} title="Đăng xuất">
          {collapsed ? '⇦' : '⇦ Đăng xuất'}
        </button>
      </div>

      <button className="navbar-toggle" onClick={() => setCollapsed(!collapsed)}>
        {collapsed ? '→' : '←'}
      </button>
    </nav>
  )
}
