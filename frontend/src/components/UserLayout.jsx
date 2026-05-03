import React from 'react'
import { Outlet } from 'react-router-dom'
import UserNavbar from '../pages/user/UserNavbar'
import './UserLayout.css'

export default function UserLayout() {
  return (
    <div className="user-layout">
      <UserNavbar />
      <main className="user-main">
        <div className="user-content">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
