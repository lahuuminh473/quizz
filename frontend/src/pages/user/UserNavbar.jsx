import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import './UserNavbar.css'

const navItems = [
  { to: '/user', label: 'Trang chủ', icon: '⬡' },
  { to: '/user/play', label: 'Làm bài thi', icon: '▷' },
  { to: '/user/history', label: 'Lịch sử', icon: '◎' },
]

export default function UserNavbar() {
  const { auth, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="user-header">
      <div className="user-header-inner">
        <NavLink to="/user" className="user-logo">
          <span>⬡</span> QuizzMaster
        </NavLink>
        <nav className="user-nav">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/user'}
              className={({ isActive }) => `user-nav-item ${isActive ? 'active' : ''}`}
            >
              {item.icon} {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="user-header-right">
          <span className="user-welcome">Xin chào, <strong>{auth?.username}</strong></span>
          <button className="btn btn-secondary btn-sm" onClick={handleLogout}>Đăng xuất</button>
        </div>
      </div>
    </header>
  )
}
