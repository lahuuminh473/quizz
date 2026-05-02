import React, { useEffect, useState } from 'react'
import { quizAPI, quizVariantAPI, categoryAPI, userAPI } from '../services/api'
import { useToast } from '../context/ToastContext'
import ConfirmDialog from '../components/ConfirmDialog'

const DIFFICULTIES = ['Easy', 'Medium', 'Hard']

const emptyRule = () => ({ categoryId: '', difficulty: 'Easy', numQuestions: 5 })

export default function Quizzes() {
  const [quizzes, setQuizzes] = useState([])
  const [categories, setCategories] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [variantModal, setVariantModal] = useState(null) // quiz
  const [variantCount, setVariantCount] = useState(1)
  const [confirm, setConfirm] = useState(null)
  const [form, setForm] = useState({ title: '', duration: 30, userId: '', quizRuleRequests: [emptyRule()] })
  const { showToast } = useToast()

  const load = async () => {
    try {
      const [qzRes, cRes, uRes] = await Promise.all([quizAPI.getAll(), categoryAPI.getAll(), userAPI.getAll()])
      setQuizzes(qzRes.data)
      setCategories(cRes.data)
      setUsers(uRes.data)
    } catch (e) { showToast(e.message, 'error') }
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const openCreate = () => {
    setForm({ title: '', duration: 30, userId: users[0]?.id || '', quizRuleRequests: [emptyRule()] })
    setModal(true)
  }

  const addRule = () => setForm({ ...form, quizRuleRequests: [...form.quizRuleRequests, emptyRule()] })
  const removeRule = (i) => setForm({ ...form, quizRuleRequests: form.quizRuleRequests.filter((_, idx) => idx !== i) })
  const updateRule = (i, field, value) => {
    const rules = form.quizRuleRequests.map((r, idx) => idx === i ? { ...r, [field]: value } : r)
    setForm({ ...form, quizRuleRequests: rules })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const payload = {
      ...form,
      userId: Number(form.userId),
      quizRuleRequests: form.quizRuleRequests.map(r => ({
        ...r,
        categoryId: Number(r.categoryId),
        numQuestions: Number(r.numQuestions)
      }))
    }
    try {
      await quizAPI.create(payload)
      showToast('Tạo quiz thành công')
      setModal(false); load()
    } catch (err) { showToast(err.message, 'error') }
  }

  const handleCreateVariants = async () => {
    try {
      await quizVariantAPI.create({ quizId: variantModal.id, numberOfVariants: variantCount })
      showToast(`Tạo ${variantCount} đề thành công`)
      setVariantModal(null)
    } catch (err) { showToast(err.message, 'error') }
  }

  const handleDelete = async () => {
    try {
      await quizAPI.delete(confirm.id)
      showToast('Xóa quiz thành công')
      setConfirm(null); load()
    } catch (err) { showToast(err.message, 'error') }
  }

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="page-title">Quizzes</h1>
          <p className="page-subtitle">{quizzes.length} bài thi trong hệ thống</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>+ Tạo Quiz</button>
      </div>

      {loading ? (
        <div className="loading"><div className="spinner" /> Đang tải...</div>
      ) : quizzes.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">▣</div>
          <div className="empty-state-text">Chưa có quiz nào</div>
          <button className="btn btn-primary" onClick={openCreate}>Tạo quiz đầu tiên</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 16 }}>
          {quizzes.map(q => (
            <div key={q.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)' }}>#{q.id}</span>
                  <h3 style={{ fontSize: 16, fontWeight: 700 }}>▣ {q.title}</h3>
                </div>
                <div style={{ display: 'flex', gap: 20, fontSize: 13, color: 'var(--text-secondary)' }}>
                  <span>⏱ {q.duration} phút</span>
                  <span>◆ {q.totalQuest} câu hỏi</span>
                  <span>◈ {q.user?.username || 'N/A'}</span>
                </div>
                {q.quizRuleResponses?.length > 0 && (
                  <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
                    {q.quizRuleResponses.map((r, i) => (
                      <span key={i} style={{
                        fontSize: 11,
                        padding: '3px 8px',
                        background: 'var(--bg-elevated)',
                        border: '1px solid var(--border)',
                        borderRadius: 99,
                        fontFamily: 'var(--font-mono)',
                        color: 'var(--text-secondary)'
                      }}>
                        {r.difficulty} × {r.numQuestions}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div style={{ display: 'flex', gap: 8, marginLeft: 16 }}>
                <button className="btn btn-secondary btn-sm" onClick={() => setVariantModal(q)}>Tạo đề</button>
                <button className="btn btn-danger btn-sm" onClick={() => setConfirm(q)}>Xóa</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Quiz Modal */}
      {modal && (
        <div className="modal-overlay" onClick={() => setModal(false)}>
          <div className="modal" style={{ maxWidth: 600 }} onClick={e => e.stopPropagation()}>
            <h2 className="modal-title">Tạo Quiz mới</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Tiêu đề *</label>
                <input className="form-input" required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Tên bài thi..." />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group">
                  <label className="form-label">Thời gian (phút) *</label>
                  <input className="form-input" type="number" min={1} required value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Người tạo *</label>
                  <select className="form-select" required value={form.userId} onChange={e => setForm({ ...form, userId: e.target.value })}>
                    <option value="">Chọn user</option>
                    {users.map(u => <option key={u.id} value={u.id}>{u.username}</option>)}
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <label className="form-label" style={{ margin: 0 }}>Quy tắc câu hỏi</label>
                  <button type="button" className="btn btn-secondary btn-sm" onClick={addRule}>+ Thêm quy tắc</button>
                </div>
                {form.quizRuleRequests.map((r, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto auto', gap: 8, marginBottom: 8, alignItems: 'center' }}>
                    <select className="form-select" required value={r.categoryId} onChange={e => updateRule(i, 'categoryId', e.target.value)}>
                      <option value="">Danh mục</option>
                      {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                    <select className="form-select" value={r.difficulty} onChange={e => updateRule(i, 'difficulty', e.target.value)}>
                      {DIFFICULTIES.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                    <input className="form-input" type="number" min={1} style={{ width: 70 }} value={r.numQuestions} onChange={e => updateRule(i, 'numQuestions', e.target.value)} title="Số câu" />
                    {form.quizRuleRequests.length > 1 && (
                      <button type="button" className="btn btn-danger btn-sm" onClick={() => removeRule(i)}>×</button>
                    )}
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setModal(false)}>Hủy</button>
                <button type="submit" className="btn btn-primary">Tạo Quiz</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Variants Modal */}
      {variantModal && (
        <div className="modal-overlay" onClick={() => setVariantModal(null)}>
          <div className="modal" style={{ maxWidth: 400 }} onClick={e => e.stopPropagation()}>
            <h2 className="modal-title">Tạo đề thi</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 20 }}>
              Quiz: <strong style={{ color: 'var(--text-primary)' }}>{variantModal.title}</strong>
            </p>
            <div className="form-group">
              <label className="form-label">Số lượng đề</label>
              <input className="form-input" type="number" min={1} max={10} value={variantCount} onChange={e => setVariantCount(Number(e.target.value))} />
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button className="btn btn-secondary" onClick={() => setVariantModal(null)}>Hủy</button>
              <button className="btn btn-primary" onClick={handleCreateVariants}>Tạo {variantCount} đề</button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={!!confirm}
        message={`Bạn có chắc muốn xóa quiz "${confirm?.title}"?`}
        onConfirm={handleDelete}
        onCancel={() => setConfirm(null)}
      />
    </div>
  )
}
