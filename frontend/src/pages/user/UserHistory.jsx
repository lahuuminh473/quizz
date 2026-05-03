import React, { useEffect, useState } from 'react'
import { historyAPI } from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import './History.css'

export default function UserHistory() {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [detail, setDetail] = useState(null)
  const [detailLoading, setDetailLoading] = useState(false)
  const { auth } = useAuth()
  const { showToast } = useToast()

  useEffect(() => {
    historyAPI.getUserHistory(auth.userId)
      .then(res => setHistory(res.data))
      .catch(e => showToast(e.message, 'error'))
      .finally(() => setLoading(false))
  }, [])

  const openDetail = async (id) => {
    setDetailLoading(true)
    try {
      const res = await historyAPI.getAttemptDetail(id)
      setDetail(res.data)
    } catch (e) { showToast(e.message, 'error') }
    setDetailLoading(false)
  }

  const formatDate = (dt) => {
    if (!dt) return '—'
    return new Date(dt).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' })
  }

  const formatDuration = (start, end) => {
    if (!start || !end) return '—'
    const diff = Math.round((new Date(end) - new Date(start)) / 1000)
    const m = Math.floor(diff / 60), s = diff % 60
    return `${m}p ${s}s`
  }

  return (
    <div className="history-page">
      <div className="page-header">
        <h1 className="page-title">◎ Lịch sử làm bài</h1>
        <p className="page-subtitle">{history.length} lần thi</p>
      </div>

      {loading ? (
        <div className="loading"><div className="spinner" /> Đang tải...</div>
      ) : history.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">◎</div>
          <div className="empty-state-text">Bạn chưa làm bài thi nào</div>
        </div>
      ) : (
        <div className="history-list">
          {history.map(h => {
            const pct = Math.round((h.correctCount / h.totalQuest) * 100)
            const passed = h.score >= 5
            return (
              <div key={h.id} className="history-card">
                <div className="history-card-left">
                  <div className={`history-score ${passed ? 'pass' : 'fail'}`}>{h.score}<span>/10</span></div>
                </div>
                <div className="history-card-body">
                  <h3 className="history-quiz-title">{h.quizTitle}</h3>
                  <div className="history-meta">
                    <span>Đề {h.variantCode}</span>
                    <span>✓ {h.correctCount}/{h.totalQuest} câu</span>
                    <span>{pct}%</span>
                    <span>⏱ {formatDuration(h.startTime, h.endTime)}</span>
                    <span>{formatDate(h.startTime)}</span>
                  </div>
                  <div className="history-bar">
                    <div className="history-bar-fill" style={{ width: `${pct}%`, background: passed ? 'var(--success)' : 'var(--error)' }} />
                  </div>
                </div>
                <button className="btn btn-secondary btn-sm history-detail-btn" onClick={() => openDetail(h.id)}>
                  Xem chi tiết
                </button>
              </div>
            )
          })}
        </div>
      )}

      {/* Detail Modal */}
      {(detail || detailLoading) && (
        <div className="modal-overlay" onClick={() => setDetail(null)}>
          <div className="modal" style={{ maxWidth: 680 }} onClick={e => e.stopPropagation()}>
            {detailLoading ? (
              <div className="loading"><div className="spinner" /> Đang tải chi tiết...</div>
            ) : detail && (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                  <h2 className="modal-title" style={{ margin: 0 }}>Chi tiết: {detail.quizTitle}</h2>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 20, fontWeight: 800, color: detail.score >= 5 ? 'var(--success)' : 'var(--error)' }}>{detail.score}/10</span>
                    <button className="btn btn-secondary btn-sm" onClick={() => setDetail(null)}>✕</button>
                  </div>
                </div>

                <div className="detail-stats">
                  <span>Đúng: <strong style={{ color: 'var(--success)' }}>{detail.correctCount}</strong></span>
                  <span>Sai: <strong style={{ color: 'var(--error)' }}>{detail.totalQuest - detail.correctCount}</strong></span>
                  <span>Tổng: <strong>{detail.totalQuest}</strong></span>
                </div>

                <div className="detail-answers">
                  {detail.answerDetails?.map((d, i) => (
                    <div key={i} className={`detail-answer-item ${d.correct ? 'correct' : 'wrong'}`}>
                      <div className="detail-q-header">
                        <span className="detail-q-num">Câu {i + 1}</span>
                        <span className={`badge ${d.correct ? 'badge-easy' : 'badge-hard'}`}>{d.correct ? '✓ Đúng' : '✕ Sai'}</span>
                      </div>
                      <p className="detail-q-content">{d.questionContent}</p>
                      {d.questionImageUrl && (
                        <img src={d.questionImageUrl} alt="" style={{ maxWidth: '100%', maxHeight: 160, objectFit: 'contain', borderRadius: 6, marginBottom: 8 }} onError={e => e.target.style.display = 'none'} />
                      )}
                      <div className="detail-answer-row">
                        <span className="detail-answer-label your">Bạn chọn:</span>
                        <span className={`detail-answer-text ${d.correct ? 'correct-text' : 'wrong-text'}`}>
                          {d.selectedAnswerText || '(Không trả lời)'}
                          {d.selectedAnswerImageUrl && <img src={d.selectedAnswerImageUrl} alt="" style={{ width: 28, height: 28, objectFit: 'cover', borderRadius: 4, marginLeft: 8, verticalAlign: 'middle' }} onError={e => e.target.style.display = 'none'} />}
                        </span>
                      </div>
                      {!d.correct && (
                        <div className="detail-answer-row">
                          <span className="detail-answer-label correct">Đáp án đúng:</span>
                          <span className="detail-answer-text correct-text">
                            {d.correctAnswerText}
                            {d.correctAnswerImageUrl && <img src={d.correctAnswerImageUrl} alt="" style={{ width: 28, height: 28, objectFit: 'cover', borderRadius: 4, marginLeft: 8, verticalAlign: 'middle' }} onError={e => e.target.style.display = 'none'} />}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
