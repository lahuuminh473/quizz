import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { authAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import './Auth.css'

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' })
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await authAPI.login(form)
      login(res.data)
      showToast(`Chào mừng, ${res.data.username}!`)
      if (res.data.role === 'ADMIN') navigate('/admin')
      else navigate('/user')
    } catch (err) {
      showToast(err.message, 'error')
    }
    setLoading(false)
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">⬡</div>
        <h1 className="auth-title">QuizzMaster</h1>
        <p className="auth-sub">Đăng nhập để tiếp tục</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Username</label>
            <input
              className="form-input"
              required
              placeholder="Nhập username..."
              value={form.username}
              onChange={e => setForm({ ...form, username: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              className="form-input"
              type="password"
              required
              placeholder="Nhập mật khẩu..."
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
            />
          </div>
          <button type="submit" className="btn btn-primary btn-lg auth-btn" disabled={loading}>
            {loading ? 'Đang đăng nhập...' : '→ Đăng nhập'}
          </button>
        </form>

        <p className="auth-switch">
          Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
        </p>
      </div>
    </div>
  )
}
