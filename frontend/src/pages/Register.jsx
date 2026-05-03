import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { authAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import './Auth.css'

export default function Register() {
  const [form, setForm] = useState({ username: '', email: '', password: '', address: '' })
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await authAPI.register(form)
      login(res.data)
      showToast('Đăng ký thành công!')
      navigate('/user')
    } catch (err) {
      showToast(err.message, 'error')
    }
    setLoading(false)
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">⬡</div>
        <h1 className="auth-title">Tạo tài khoản</h1>
        <p className="auth-sub">Tham gia QuizzMaster ngay hôm nay</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Username *</label>
            <input className="form-input" required placeholder="Chọn username..." value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Email *</label>
            <input className="form-input" type="email" required placeholder="email@example.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Password *</label>
            <input className="form-input" type="password" required placeholder="Tối thiểu 6 ký tự..." value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Địa chỉ</label>
            <input className="form-input" placeholder="Địa chỉ (không bắt buộc)" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
          </div>
          <button type="submit" className="btn btn-primary btn-lg auth-btn" disabled={loading}>
            {loading ? 'Đang tạo tài khoản...' : '✓ Đăng ký'}
          </button>
        </form>

        <p className="auth-switch">
          Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
        </p>
      </div>
    </div>
  )
}
