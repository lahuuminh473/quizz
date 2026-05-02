import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { userAPI, categoryAPI, questionAPI, quizAPI } from '../services/api'
import './Dashboard.css'

export default function Dashboard() {
  const [stats, setStats] = useState({ users: 0, categories: 0, questions: 0, quizzes: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.allSettled([
      userAPI.getAll(),
      categoryAPI.getAll(),
      questionAPI.getAll(),
      quizAPI.getAll()
    ]).then(([u, c, q, qz]) => {
      setStats({
        users: u.status === 'fulfilled' ? u.value.data.length : 0,
        categories: c.status === 'fulfilled' ? c.value.data.length : 0,
        questions: q.status === 'fulfilled' ? q.value.data.length : 0,
        quizzes: qz.status === 'fulfilled' ? qz.value.data.length : 0,
      })
      setLoading(false)
    })
  }, [])

  const cards = [
    { label: 'Users', value: stats.users, icon: '◈', to: '/users', color: '#6c63ff' },
    { label: 'Categories', value: stats.categories, icon: '◇', to: '/categories', color: '#ff6584' },
    { label: 'Questions', value: stats.questions, icon: '◆', to: '/questions', color: '#ffd166' },
    { label: 'Quizzes', value: stats.quizzes, icon: '▣', to: '/quizzes', color: '#43e97b' },
  ]

  return (
    <div className="dashboard">
      <div className="dashboard-hero">
        <div className="hero-badge">System Overview</div>
        <h1 className="hero-title">QuizzMaster<br /><span>Admin Dashboard</span></h1>
        <p className="hero-sub">Quản lý toàn bộ hệ thống thi trắc nghiệm</p>
        <Link to="/play" className="btn btn-primary btn-lg hero-cta">
          ▷ Bắt đầu làm bài
        </Link>
      </div>

      <div className="stat-grid">
        {cards.map(card => (
          <Link key={card.label} to={card.to} className="stat-card" style={{ '--card-color': card.color }}>
            <div className="stat-icon" style={{ color: card.color }}>{card.icon}</div>
            <div className="stat-value">{loading ? '—' : card.value}</div>
            <div className="stat-label">{card.label}</div>
          </Link>
        ))}
      </div>

      <div className="quick-actions">
        <h2 className="section-title">Quick Actions</h2>
        <div className="action-grid">
          {[
            { to: '/questions', label: 'Thêm câu hỏi mới', icon: '◆', desc: 'Tạo câu hỏi với nhiều độ khó' },
            { to: '/quizzes', label: 'Tạo bài thi', icon: '▣', desc: 'Cấu hình đề thi theo danh mục' },
            { to: '/play', label: 'Làm bài ngay', icon: '▷', desc: 'Chọn bài thi và bắt đầu', primary: true },
            { to: '/categories', label: 'Quản lý danh mục', icon: '◇', desc: 'Tổ chức câu hỏi theo chủ đề' },
          ].map(a => (
            <Link key={a.to} to={a.to} className={`action-card ${a.primary ? 'primary' : ''}`}>
              <span className="action-icon">{a.icon}</span>
              <div>
                <div className="action-label">{a.label}</div>
                <div className="action-desc">{a.desc}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
