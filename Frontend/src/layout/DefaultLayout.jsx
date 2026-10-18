import React, { useState } from 'react'
import AppSidebar from './AppSidebar'
import AppHeader from './AppHeader'
import AppContent from './AppContent'
import AppFooter from './AppFooter'

const DefaultLayout = () => {
  // 1. Buat state lokal untuk mengontrol sidebar (buka/tutup)
  const [sidebarShow, setSidebarShow] = useState(false)

  return (
    <div>
      {/* 2. Kirim state dan fungsi pengubahnya ke Sidebar */}
      <AppSidebar sidebarShow={sidebarShow} setSidebarShow={setSidebarShow} />
      <div className="wrapper d-flex flex-column min-vh-100">
        {/* 3. Kirim fungsi pengubahnya juga ke Header */}
        <AppHeader sidebarShow={sidebarShow} setSidebarShow={setSidebarShow} />
        <div className="body flex-grow-1 px-3">
          <AppContent />
        </div>

        <AppFooter />
      </div>
    </div>
  )
}

export default DefaultLayout