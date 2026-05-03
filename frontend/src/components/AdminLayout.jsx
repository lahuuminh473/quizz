import React from 'react'
import { Outlet } from 'react-router-dom'
import AdminNavbar from '../pages/admin/AdminNavbar'
import '../pages/admin/AdminNavbar.css'

export default function AdminLayout() {
  return (
    <div className="app-layout">
      <AdminNavbar />
      <main className="app-main">
        <div className="app-content">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
