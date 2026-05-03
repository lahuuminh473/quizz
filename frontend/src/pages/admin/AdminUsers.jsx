import React, { useEffect, useState } from 'react'
import { userAPI } from '../../services/api'
import { useToast } from '../../context/ToastContext'
import ConfirmDialog from '../../components/ConfirmDialog'

const ROLES = ['USER', 'ADMIN']

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ username: '', email: '', password: '', address: '', role: 'USER' })
  const [confirm, setConfirm] = useState(null)
  const { showToast } = useToast()

  const load = async () => {
    try {
      const res = await userAPI.getAll()
      setUsers(res.data)
    } catch (e) { showToast(e.message, 'error') }
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const openCreate = () => {
    setForm({ username: '', email: '', password: '', address: '', role: 'USER' })
    setEditing(null)
    setModal(true)
  }

  const openEdit = (u) => {
    setForm({ username: u.username, email: u.email, password: '', address: u.address || '', role: u.role })
    setEditing(u)
    setModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editing) {
        await userAPI.update(editing.id, form)
        showToast('Cập nhật user thành công')
      } else {
        await userAPI.create(form)
        showToast('Tạo user thành công')
      }
      setModal(false)
      load()
    } catch (err) { showToast(err.message, 'error') }
  }

  const handleDelete = async () => {
    try {
      await userAPI.delete(confirm.id)
      showToast('Xóa user thành công')
      setConfirm(null)
      load()
    } catch (err) { showToast(err.message, 'error') }
  }

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="page-title">Users</h1>
          <p className="page-subtitle">{users.length} người dùng trong hệ thống</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>+ Thêm User</button>
      </div>

      {loading ? (
        <div className="loading"><div className="spinner" /> Đang tải...</div>
      ) : users.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">◈</div>
          <div className="empty-state-text">Chưa có user nào</div>
          <button className="btn btn-primary" onClick={openCreate}>Tạo user đầu tiên</button>
        </div>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>ID</th><th>Username</th><th>Email</th><th>Address</th><th>Role</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td><span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', fontSize: 12 }}>#{u.id}</span></td>
                  <td style={{ fontWeight: 600 }}>{u.username}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{u.email}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{u.address || '—'}</td>
                  <td>
                    <span className={`badge ${u.role === 'ADMIN' ? 'badge-hard' : 'badge-easy'}`}>{u.role}</span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button className="btn btn-secondary btn-sm" onClick={() => openEdit(u)}>Sửa</button>
                      <button className="btn btn-danger btn-sm" onClick={() => setConfirm(u)}>Xóa</button>
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
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2 className="modal-title">{editing ? 'Sửa User' : 'Thêm User mới'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Username *</label>
                <input className="form-input" required value={form.username}
                  onChange={e => setForm({ ...form, username: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Email *</label>
                <input className="form-input" type="email" required value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Password {editing ? '(để trống = giữ nguyên)' : '*'}</label>
                <input className="form-input" type="password" required={!editing} value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Address</label>
                <input className="form-input" value={form.address}
                  onChange={e => setForm({ ...form, address: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Role</label>
                <select className="form-select" value={form.role}
                  onChange={e => setForm({ ...form, role: e.target.value })}>
                  {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
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
        message={`Bạn có chắc muốn xóa user "${confirm?.username}"?`}
        onConfirm={handleDelete}
        onCancel={() => setConfirm(null)}
      />
    </div>
  )
}
