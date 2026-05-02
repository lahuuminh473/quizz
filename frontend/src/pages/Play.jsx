import React, { useEffect, useState } from 'react'
import { quizAPI, userAPI } from '../services/api'
import { useToast } from '../context/ToastContext'
import './Play.css'

const PHASE = { SELECT: 'select', PLAYING: 'playing', RESULT: 'result' }

export default function Play() {
  const [phase, setPhase] = useState(PHASE.SELECT)
  const [quizzes, setQuizzes] = useState([])
  const [users, setUsers] = useState([])
  const [selectedQuiz, setSelectedQuiz] = useState('')
  const [selectedUser, setSelectedUser] = useState('')
  const [loading, setLoading] = useState(true)
  const [variant, setVariant] = useState(null)
  const [answers, setAnswers] = useState({}) // questionId -> answerId
  const [current, setCurrent] = useState(0)
  const [startTime, setStartTime] = useState(null)
  const [timeLeft, setTimeLeft] = useState(null)
  const [result, setResult] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const { showToast } = useToast()

  useEffect(() => {
    Promise.all([quizAPI.getAll(), userAPI.getAll()])
      .then(([qz, u]) => {
        setQuizzes(qz.data)
        setUsers(u.data)
        if (qz.data.length) setSelectedQuiz(qz.data[0].id)
        if (u.data.length) setSelectedUser(u.data[0].id)
      })
      .catch(e => showToast(e.message, 'error'))
      .finally(() => setLoading(false))
  }, [])

  // Timer
  useEffect(() => {
    if (phase !== PHASE.PLAYING || !variant) return
    const duration = (quizzes.find(q => q.id === Number(selectedQuiz))?.duration || 30) * 60
    setTimeLeft(duration)
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { clearInterval(interval); handleSubmit(); return 0 }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [phase, variant])

  const handleStart = async () => {
    if (!selectedQuiz || !selectedUser) { showToast('Vui lòng chọn quiz và user', 'error'); return }
    try {
      const res = await quizAPI.play(selectedQuiz)
      setVariant(res.data)
      setAnswers({})
      setCurrent(0)
      setStartTime(new Date().toISOString())
      setPhase(PHASE.PLAYING)
    } catch (err) {
      showToast(err.message, 'error')
    }
  }

  const handleAnswer = (questionId, answerId) => {
    setAnswers(prev => ({ ...prev, [questionId]: answerId }))
  }

  const handleSubmit = async () => {
    if (submitting) return
    setSubmitting(true)
    const payload = {
      userId: Number(selectedUser),
      quizVariantId: variant.id,
      startTime,
      endTime: new Date().toISOString(),
      anserInputList: Object.entries(answers).map(([qId, aId]) => ({
        questionId: Number(qId),
        answerId: Number(aId)
      }))
    }
    try {
      const res = await quizAPI.submit(payload)
      setResult(res.data)
      setPhase(PHASE.RESULT)
    } catch (err) {
      showToast(err.message, 'error')
    }
    setSubmitting(false)
  }

  const formatTime = (s) => {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`
  }

  const answered = Object.keys(answers).length

  // --- SELECT PHASE ---
  if (phase === PHASE.SELECT) {
    return (
      <div className="play-select">
        <div className="play-select-card">
          <div className="play-select-icon">▷</div>
          <h1 className="play-select-title">Bắt đầu làm bài</h1>
          <p className="play-select-sub">Chọn bài thi và thông tin để bắt đầu</p>

          {loading ? (
            <div className="loading"><div className="spinner" /> Đang tải...</div>
          ) : (
            <>
              <div className="form-group">
                <label className="form-label">Chọn bài thi</label>
                <select className="form-select" value={selectedQuiz} onChange={e => setSelectedQuiz(e.target.value)}>
                  {quizzes.map(q => (
                    <option key={q.id} value={q.id}>{q.title} ({q.duration} phút · {q.totalQuest} câu)</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Thí sinh</label>
                <select className="form-select" value={selectedUser} onChange={e => setSelectedUser(e.target.value)}>
                  {users.map(u => <option key={u.id} value={u.id}>{u.username}</option>)}
                </select>
              </div>

              {selectedQuiz && (
                <div className="quiz-info-preview">
                  {(() => {
                    const q = quizzes.find(qz => String(qz.id) === String(selectedQuiz))
                    if (!q) return null
                    return (
                      <>
                        <div className="quiz-info-item"><span>⏱ Thời gian</span><strong>{q.duration} phút</strong></div>
                        <div className="quiz-info-item"><span>◆ Số câu</span><strong>{q.totalQuest} câu</strong></div>
                      </>
                    )
                  })()}
                </div>
              )}

              <button className="btn btn-primary btn-lg play-start-btn" onClick={handleStart}>
                ▷ Bắt đầu làm bài
              </button>
            </>
          )}
        </div>
      </div>
    )
  }

  // --- PLAYING PHASE ---
  if (phase === PHASE.PLAYING && variant) {
    const questions = variant.questions || []
    const q = questions[current]
    const progress = (answered / questions.length) * 100

    return (
      <div className="play-quiz">
        {/* Header */}
        <div className="play-header">
          <div className="play-progress-info">
            <span className="play-title">{quizzes.find(qz => String(qz.id) === String(selectedQuiz))?.title}</span>
            <span className="play-counter">{answered}/{questions.length} đã trả lời</span>
          </div>
          <div className={`play-timer ${timeLeft < 60 ? 'urgent' : ''}`}>
            ⏱ {formatTime(timeLeft ?? 0)}
          </div>
        </div>

        {/* Progress bar */}
        <div className="play-progress-bar">
          <div className="play-progress-fill" style={{ width: `${progress}%` }} />
        </div>

        {/* Question nav */}
        <div className="play-nav">
          {questions.map((qu, i) => (
            <button
              key={qu.id}
              className={`play-nav-btn ${i === current ? 'active' : ''} ${answers[qu.id] ? 'answered' : ''}`}
              onClick={() => setCurrent(i)}
            >
              {i + 1}
            </button>
          ))}
        </div>

        {/* Question */}
        {q && (
          <div className="play-question-card">
            <div className="play-q-meta">
              <span className="play-q-num">Câu {current + 1}/{questions.length}</span>
              {q.difficulty && (
                <span className={`badge badge-${q.difficulty.toLowerCase()}`}>{q.difficulty}</span>
              )}
              {q.category && <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>◇ {q.category.name}</span>}
            </div>
            <h2 className="play-q-content">{q.content}</h2>
            <div className="play-answers">
              {q.answers?.map((a, i) => (
                <button
                  key={a.id}
                  className={`play-answer ${answers[q.id] === a.id ? 'selected' : ''}`}
                  onClick={() => handleAnswer(q.id, a.id)}
                >
                  <span className="answer-letter">{String.fromCharCode(65 + i)}</span>
                  <span className="answer-text">{a.text}</span>
                </button>
              ))}
            </div>

            <div className="play-q-actions">
              <button className="btn btn-secondary" onClick={() => setCurrent(Math.max(0, current - 1))} disabled={current === 0}>← Câu trước</button>
              {current < questions.length - 1 ? (
                <button className="btn btn-primary" onClick={() => setCurrent(current + 1)}>Câu tiếp →</button>
              ) : (
                <button className="btn btn-primary" onClick={handleSubmit} disabled={submitting}>
                  {submitting ? 'Đang nộp...' : '✓ Nộp bài'}
                </button>
              )}
            </div>
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <button className="btn btn-danger" onClick={handleSubmit} disabled={submitting}>
            Nộp bài sớm
          </button>
        </div>
      </div>
    )
  }

  // --- RESULT PHASE ---
  if (phase === PHASE.RESULT && result) {
    const pct = Math.round((result.correctCount / result.total) * 100)
    const passed = result.score >= 5

    return (
      <div className="play-result">
        <div className="result-card">
          <div className={`result-icon ${passed ? 'pass' : 'fail'}`}>{passed ? '🏆' : '📝'}</div>
          <h1 className="result-title">{passed ? 'Chúc mừng!' : 'Hãy cố gắng hơn!'}</h1>
          <div className="result-score">{result.score}<span>/10</span></div>

          <div className="result-stats">
            <div className="result-stat">
              <div className="result-stat-value" style={{ color: 'var(--success)' }}>{result.correctCount}</div>
              <div className="result-stat-label">Câu đúng</div>
            </div>
            <div className="result-stat">
              <div className="result-stat-value" style={{ color: 'var(--error)' }}>{result.total - result.correctCount}</div>
              <div className="result-stat-label">Câu sai</div>
            </div>
            <div className="result-stat">
              <div className="result-stat-value">{result.total}</div>
              <div className="result-stat-label">Tổng câu</div>
            </div>
            <div className="result-stat">
              <div className="result-stat-value" style={{ color: 'var(--accent)' }}>{pct}%</div>
              <div className="result-stat-label">Tỉ lệ đúng</div>
            </div>
          </div>

          <div className="result-bar-wrap">
            <div className="result-bar">
              <div className="result-bar-fill" style={{ width: `${pct}%`, background: passed ? 'var(--success)' : 'var(--error)' }} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 32 }}>
            <button className="btn btn-secondary btn-lg" onClick={() => setPhase(PHASE.SELECT)}>← Chọn bài khác</button>
            <button className="btn btn-primary btn-lg" onClick={() => { setPhase(PHASE.SELECT); setTimeout(handleStart, 100) }}>
              Làm lại bài này
            </button>
          </div>
        </div>
      </div>
    )
  }

  return null
}
