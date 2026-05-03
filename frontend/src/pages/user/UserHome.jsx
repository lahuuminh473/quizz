import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { quizAPI } from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import './UserHome.css'

export default function UserHome() {
  const [quizzes, setQuizzes] = useState([])
  const [loading, setLoading] = useState(true)
  const { auth } = useAuth()
  const { showToast } = useToast()

  useEffect(() => {
    quizAPI.getAll()
      .then(res => setQuizzes(res.data))
      .catch(e => showToast(e.message, 'error'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="user-home">
      <div className="user-hero">
        <h1>Xin chào, <span>{auth?.username}</span> 👋</h1>
        <p>Chọn một bài thi bên dưới để bắt đầu</p>
      </div>

      {loading ? (
        <div className="loading"><div className="spinner" /> Đang tải...</div>
      ) : quizzes.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">▣</div>
          <div className="empty-state-text">Chưa có bài thi nào được tạo</div>
        </div>
      ) : (
        <div className="quiz-grid">
          {quizzes.map(q => (
            <div key={q.id} className="quiz-card">
              <div className="quiz-card-header">
                <span className="quiz-card-icon">▣</span>
                <div className="quiz-card-meta">
                  <span>⏱ {q.duration} phút</span>
                  <span>◆ {q.totalQuest} câu</span>
                </div>
              </div>
              <h3 className="quiz-card-title">{q.title}</h3>
              {q.quizRuleResponses?.length > 0 && (
                <div className="quiz-card-rules">
                  {q.quizRuleResponses.map((r, i) => (
                    <span key={i} className="quiz-rule-tag">{r.difficulty} × {r.numQuestions}</span>
                  ))}
                </div>
              )}
              <Link to={`/user/play?quizId=${q.id}`} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 'auto' }}>
                ▷ Bắt đầu thi
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
