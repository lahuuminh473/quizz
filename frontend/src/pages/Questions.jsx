import React, { useEffect, useState } from 'react'
import { questionAPI, categoryAPI } from '../services/api'
import { useToast } from '../context/ToastContext'
import ConfirmDialog from '../components/ConfirmDialog'

const DIFFICULTIES = ['Easy', 'Medium', 'Hard']

const diffBadge = d => {
  if (d === 'Easy') return 'badge-easy'
  if (d === 'Medium') return 'badge-medium'
  return 'badge-hard'
}

const emptyForm = () => ({
  content: '',
  difficulty: 'Easy',
  categoryId: '',
  answers: [
    { text: '', isCorrect: true },
    { text: '', isCorrect: false },
    { text: '', isCorrect: false },
    { text: '', isCorrect: false },
  ]
})

export default function Questions() {
  const [questions, setQuestions] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyForm())
  const [confirm, setConfirm] = useState(null)
  const [filterCat, setFilterCat] = useState('')
  const [filterDiff, setFilterDiff] = useState('')
  const { showToast } = useToast()

  const load = async () => {
    try {
      const [qRes, cRes] = await Promise.all([questionAPI.getAll(), categoryAPI.getAll()])
      setQuestions(qRes.data)
      setCategories(cRes.data)
    } catch (e) { showToast(e.message, 'error') }
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const openCreate = () => {
    const f = emptyForm()
    if (categories.length > 0) f.categoryId = categories[0].id
    setForm(f); setEditing(null); setModal(true)
  }

  const handleAnswerChange = (idx, field, value) => {
    const answers = form.answers.map((a, i) => {
      if (field === 'isCorrect') return { ...a, isCorrect: i === idx }
      return i === idx ? { ...a, [field]: value } : a
    })
    setForm({ ...form, answers })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.answers.some(a => !a.text.trim())) {
      showToast('Vui lòng điền đủ nội dung cho tất cả đáp án', 'error'); return
    }
    const payload = { ...form, categoryId: Number(form.categoryId) }
    try {
      if (editing) { await questionAPI.update(editing.id, payload); showToast('Cập nhật câu hỏi thành công') }
      else { await questionAPI.create(payload); showToast('Tạo câu hỏi thành công') }
      setModal(false); load()
    } catch (err) { showToast(err.message, 'error') }
  }

  const handleDelete = async () => {
    try {
      await questionAPI.delete(confirm.id)
      showToast('Xóa câu hỏi thành công')
      setConfirm(null); load()
    } catch (err) { showToast(err.message, 'error') }
  }

  const filtered = questions.filter(q =>
    (!filterCat || String(q.category?.id) === filterCat) &&
    (!filterDiff || q.difficulty === filterDiff)
  )

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="page-title">Questions</h1>
          <p className="page-subtitle">{filtered.length} / {questions.length} câu hỏi</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>+ Thêm Câu hỏi</button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
        <select className="form-select" style={{ width: 200 }} value={filterCat} onChange={e => setFilterCat(e.target.value)}>
          <option value="">Tất cả danh mục</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select className="form-select" style={{ width: 160 }} value={filterDiff} onChange={e => setFilterDiff(e.target.value)}>
          <option value="">Tất cả độ khó</option>
          {DIFFICULTIES.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="loading"><div className="spinner" /> Đang tải...</div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">◆</div>
          <div className="empty-state-text">Không có câu hỏi nào</div>
          <button className="btn btn-primary" onClick={openCreate}>Tạo câu hỏi đầu tiên</button>
        </div>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Nội dung câu hỏi</th>
                <th>Danh mục</th>
                <th>Độ khó</th>
                <th>Số đáp án</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(q => (
                <tr key={q.id}>
                  <td><span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', fontSize: 12 }}>{q.id}</span></td>
                  <td style={{ maxWidth: 380 }}>
                    <div style={{ fontWeight: 600, fontSize: 14, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{q.content}</div>
                  </td>
                  <td><span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>◇ {q.category?.name}</span></td>
                  <td><span className={`badge ${diffBadge(q.difficulty)}`}>{q.difficulty}</span></td>
                  <td><span style={{ fontFamily: 'var(--font-mono)', fontSize: 13 }}>{q.answers?.length || 0}</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button className="btn btn-danger btn-sm" onClick={() => setConfirm(q)}>Xóa</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modal && (
        <div className="modal-overlay" onClick={() => setModal(false)}>
          <div className="modal" style={{ maxWidth: 600 }} onClick={e => e.stopPropagation()}>
            <h2 className="modal-title">{editing ? 'Sửa Câu hỏi' : 'Thêm Câu hỏi mới'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Nội dung câu hỏi *</label>
                <textarea className="form-input" rows={3} required value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} placeholder="Nhập nội dung câu hỏi..." />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group">
                  <label className="form-label">Danh mục *</label>
                  <select className="form-select" required value={form.categoryId} onChange={e => setForm({ ...form, categoryId: e.target.value })}>
                    <option value="">Chọn danh mục</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Độ khó *</label>
                  <select className="form-select" value={form.difficulty} onChange={e => setForm({ ...form, difficulty: e.target.value })}>
                    {DIFFICULTIES.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Đáp án (chọn đáp án đúng)</label>
                {form.answers.map((a, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 10 }}>
                    <input
                      type="radio"
                      name="correct"
                      checked={a.isCorrect}
                      onChange={() => handleAnswerChange(i, 'isCorrect', true)}
                      style={{ accentColor: 'var(--accent)', width: 16, height: 16, flexShrink: 0 }}
                    />
                    <input
                      className="form-input"
                      style={{ flex: 1, margin: 0, borderColor: a.isCorrect ? 'var(--success)' : undefined }}
                      placeholder={`Đáp án ${String.fromCharCode(65 + i)}`}
                      value={a.text}
                      onChange={e => handleAnswerChange(i, 'text', e.target.value)}
                    />
                    {a.isCorrect && <span style={{ color: 'var(--success)', fontSize: 18, flexShrink: 0 }}>✓</span>}
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setModal(false)}>Hủy</button>
                <button type="submit" className="btn btn-primary">{editing ? 'Cập nhật' : 'Tạo câu hỏi'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={!!confirm}
        message={`Bạn có chắc muốn xóa câu hỏi này?`}
        onConfirm={handleDelete}
        onCancel={() => setConfirm(null)}
      />
    </div>
  )
}
