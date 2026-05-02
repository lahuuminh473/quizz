import React, { useEffect, useState } from 'react'
import { categoryAPI } from '../services/api'
import { useToast } from '../context/ToastContext'
import ConfirmDialog from '../components/ConfirmDialog'

export default function Categories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ name: '', description: '' })
  const [confirm, setConfirm] = useState(null)
  const { showToast } = useToast()

  const load = async () => {
    try {
      const res = await categoryAPI.getAll()
      setCategories(res.data)
    } catch (e) { showToast(e.message, 'error') }
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const openCreate = () => { setForm({ name: '', description: '' }); setEditing(null); setModal(true) }
  const openEdit = (c) => { setForm({ name: c.name, description: c.description || '' }); setEditing(c); setModal(true) }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editing) { await categoryAPI.update(editing.id, form); showToast('Cập nhật danh mục thành công') }
      else { await categoryAPI.create(form); showToast('Tạo danh mục thành công') }
      setModal(false); load()
    } catch (err) { showToast(err.message, 'error') }
  }

  const handleDelete = async () => {
    try {
      await categoryAPI.delete(confirm.id)
      showToast('Xóa danh mục thành công')
      setConfirm(null); load()
    } catch (err) { showToast(err.message, 'error') }
  }

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="page-title">Categories</h1>
          <p className="page-subtitle">{categories.length} danh mục câu hỏi</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>+ Thêm Danh mục</button>
      </div>

      {loading ? (
        <div className="loading"><div className="spinner" /> Đang tải...</div>
      ) : categories.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">◇</div>
          <div className="empty-state-text">Chưa có danh mục nào</div>
          <button className="btn btn-primary" onClick={openCreate}>Tạo danh mục đầu tiên</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {categories.map(c => (
            <div key={c.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)' }}>#{c.id}</span>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button className="btn btn-secondary btn-sm" onClick={() => openEdit(c)}>Sửa</button>
                  <button className="btn btn-danger btn-sm" onClick={() => setConfirm(c)}>Xóa</button>
                </div>
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>◇ {c.name}</h3>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{c.description || 'Không có mô tả'}</p>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <div className="modal-overlay" onClick={() => setModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2 className="modal-title">{editing ? 'Sửa Danh mục' : 'Thêm Danh mục mới'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Tên danh mục *</label>
                <input className="form-input" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Ví dụ: Toán học, Lịch sử..." />
              </div>
              <div className="form-group">
                <label className="form-label">Mô tả</label>
                <textarea className="form-input" rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Mô tả về danh mục này..." />
              </div>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
                <button type="button" className="btn btn-secondary" onClick={() => setModal(false)}>Hủy</button>
                <button type="submit" className="btn btn-primary">{editing ? 'Cập nhật' : 'Tạo'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={!!confirm}
        message={`Bạn có chắc muốn xóa danh mục "${confirm?.name}"?`}
        onConfirm={handleDelete}
        onCancel={() => setConfirm(null)}
      />
    </div>
  )
}
