import React from 'react'

export default function ConfirmDialog({ isOpen, message, onConfirm, onCancel }) {
  if (!isOpen) return null
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal" style={{ maxWidth: 380 }} onClick={e => e.stopPropagation()}>
        <div className="modal-title" style={{ fontSize: 18 }}>⚠ Xác nhận</div>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 24, fontSize: 14 }}>{message}</p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button className="btn btn-secondary" onClick={onCancel}>Hủy</button>
          <button className="btn btn-danger" onClick={onConfirm}>Xác nhận xóa</button>
        </div>
      </div>
    </div>
  )
}
