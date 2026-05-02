import React, { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import './Navbar.css'

const navItems = [
  { to: '/', label: 'Dashboard', icon: '⬡' },
  { to: '/users', label: 'Users', icon: '◈' },
  { to: '/categories', label: 'Categories', icon: '◇' },
  { to: '/questions', label: 'Questions', icon: '◆' },
  { to: '/quizzes', label: 'Quizzes', icon: '▣' },
  { to: '/play', label: 'Play Quiz', icon: '▷', highlight: true },
]

export default function Navbar() {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <nav className={`navbar ${collapsed ? 'collapsed' : ''}`}>
      <div className="navbar-logo">
        <span className="logo-icon">⬡</span>
        {!collapsed && <span className="logo-text">QuizzMaster</span>}
      </div>

      <div className="navbar-items">
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `nav-item ${isActive ? 'active' : ''} ${item.highlight ? 'highlight' : ''}`
            }
            title={collapsed ? item.label : ''}
          >
            <span className="nav-icon">{item.icon}</span>
            {!collapsed && <span className="nav-label">{item.label}</span>}
          </NavLink>
        ))}
      </div>

      <button className="navbar-toggle" onClick={() => setCollapsed(!collapsed)}>
        {collapsed ? '→' : '←'}
      </button>
    </nav>
  )
}
