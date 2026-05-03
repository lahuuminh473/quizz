import React, { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { quizAPI } from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import '../Play.css'

const PHASE = { LOADING: 'loading', PLAYING: 'playing', RESULT: 'result' }

export default function UserPlay() {
  const [searchParams] = useSearchParams()
  const quizId = searchParams.get('quizId')
  const navigate = useNavigate()
  const { auth } = useAuth()
  const { showToast } = useToast()

  const [phase, setPhase] = useState(PHASE.LOADING)
  const [quiz, setQuiz] = useState(null)
  const [variant, setVariant] = useState(null)
  const [answers, setAnswers] = useState({})
  const [current, setCurrent] = useState(0)
  const [startTime] = useState(new Date().toISOString())
  const [timeLeft, setTimeLeft] = useState(null)
  const [result, setResult] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!quizId) { navigate('/user'); return }
    Promise.all([quizAPI.getById(quizId), quizAPI.play(quizId)])
      .then(([qRes, vRes]) => {
        setQuiz(qRes.data)
        setVariant(vRes.data)
        setTimeLeft(qRes.data.duration * 60)
        setPhase(PHASE.PLAYING)
      })
      .catch(e => { showToast(e.message, 'error'); navigate('/user') })
  }, [quizId])

  useEffect(() => {
    if (phase !== PHASE.PLAYING || timeLeft === null) return
    if (timeLeft <= 0) { handleSubmit(); return }
    const t = setTimeout(() => setTimeLeft(p => p - 1), 1000)
    return () => clearTimeout(t)
  }, [phase, timeLeft])

  const handleAnswer = (questionId, answerId) => setAnswers(p => ({ ...p, [questionId]: answerId }))

  const handleSubmit = async () => {
    if (submitting) return
    setSubmitting(true)
    const payload = {
      userId: auth.userId,
      quizVariantId: variant.id,
      startTime,
      endTime: new Date().toISOString(),
      anserInputList: Object.entries(answers).map(([qId, aId]) => ({
        questionId: Number(qId), answerId: Number(aId)
      }))
    }
    try {
      const res = await quizAPI.submit(payload)
      setResult(res.data)
      setPhase(PHASE.RESULT)
    } catch (err) { showToast(err.message, 'error') }
    setSubmitting(false)
  }

  const formatTime = s => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

  if (phase === PHASE.LOADING) return <div className="loading"><div className="spinner" /> Đang tải đề thi...</div>

  if (phase === PHASE.PLAYING && variant) {
    const questions = variant.questions || []
    const q = questions[current]
    const answered = Object.keys(answers).length
    const progress = (answered / questions.length) * 100

    return (
      <div className="play-quiz">
        <div className="play-header">
          <div className="play-progress-info">
            <span className="play-title">{quiz?.title}</span>
            <span className="play-counter">{answered}/{questions.length} đã trả lời</span>
          </div>
          <div className={`play-timer ${timeLeft < 60 ? 'urgent' : ''}`}>
            ⏱ {formatTime(timeLeft ?? 0)}
          </div>
        </div>

        <div className="play-progress-bar">
          <div className="play-progress-fill" style={{ width: `${progress}%` }} />
        </div>

        <div className="play-nav">
          {questions.map((qu, i) => (
            <button key={qu.id} className={`play-nav-btn ${i === current ? 'active' : ''} ${answers[qu.id] ? 'answered' : ''}`} onClick={() => setCurrent(i)}>{i + 1}</button>
          ))}
        </div>

        {q && (
          <div className="play-question-card">
            <div className="play-q-meta">
              <span className="play-q-num">Câu {current + 1}/{questions.length}</span>
              {q.difficulty && <span className={`badge badge-${q.difficulty.toLowerCase()}`}>{q.difficulty}</span>}
              {q.category && <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>◇ {q.category.name}</span>}
            </div>
            <h2 className="play-q-content">{q.content}</h2>
            {q.imageUrl && (
              <img src={q.imageUrl} alt="question" style={{ maxWidth: '100%', maxHeight: 280, objectFit: 'contain', borderRadius: 8, marginBottom: 20, border: '1px solid var(--border)' }} onError={e => e.target.style.display = 'none'} />
            )}
            <div className="play-answers">
              {q.answers?.map((a, i) => (
                <button key={a.id} className={`play-answer ${answers[q.id] === a.id ? 'selected' : ''}`} onClick={() => handleAnswer(q.id, a.id)}>
                  <span className="answer-letter">{String.fromCharCode(65 + i)}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1 }}>
                    <span className="answer-text">{a.text}</span>
                    {a.imageUrl && <img src={a.imageUrl} alt="" style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 6, flexShrink: 0 }} onError={e => e.target.style.display = 'none'} />}
                  </div>
                </button>
              ))}
            </div>

            <div className="play-q-actions">
              <button className="btn btn-secondary" onClick={() => setCurrent(Math.max(0, current - 1))} disabled={current === 0}>← Câu trước</button>
              {current < questions.length - 1
                ? <button className="btn btn-primary" onClick={() => setCurrent(current + 1)}>Câu tiếp →</button>
                : <button className="btn btn-primary" onClick={handleSubmit} disabled={submitting}>{submitting ? 'Đang nộp...' : '✓ Nộp bài'}</button>
              }
            </div>
          </div>
        )}
        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <button className="btn btn-danger" onClick={handleSubmit} disabled={submitting}>Nộp bài sớm</button>
        </div>
      </div>
    )
  }

  if (phase === PHASE.RESULT && result) {
    const pct = Math.round((result.correctCount / result.total) * 100)
    const passed = result.score >= 5
    return (
      <div className="play-result">
        <div className="result-card">
          <div className="result-icon">{passed ? '🏆' : '📝'}</div>
          <h1 className="result-title">{passed ? 'Chúc mừng!' : 'Hãy cố gắng hơn!'}</h1>
          <div className="result-score">{result.score}<span>/10</span></div>
          <div className="result-stats">
            <div className="result-stat"><div className="result-stat-value" style={{ color: 'var(--success)' }}>{result.correctCount}</div><div className="result-stat-label">Đúng</div></div>
            <div className="result-stat"><div className="result-stat-value" style={{ color: 'var(--error)' }}>{result.total - result.correctCount}</div><div className="result-stat-label">Sai</div></div>
            <div className="result-stat"><div className="result-stat-value">{result.total}</div><div className="result-stat-label">Tổng</div></div>
            <div className="result-stat"><div className="result-stat-value" style={{ color: 'var(--accent)' }}>{pct}%</div><div className="result-stat-label">Tỉ lệ</div></div>
          </div>
          <div className="result-bar-wrap">
            <div className="result-bar">
              <div className="result-bar-fill" style={{ width: `${pct}%`, background: passed ? 'var(--success)' : 'var(--error)' }} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 32 }}>
            <button className="btn btn-secondary btn-lg" onClick={() => navigate('/user')}>← Về trang chủ</button>
            <button className="btn btn-primary btn-lg" onClick={() => navigate('/user/history')}>Xem lịch sử ◎</button>
          </div>
        </div>
      </div>
    )
  }

  return null
}
