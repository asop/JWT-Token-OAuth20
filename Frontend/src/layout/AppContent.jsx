import React, { Suspense } from 'react'
import { CContainer, CSpinner } from '@coreui/react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Dashboard from '../views/dashboard/Dashboard'

const AppContent = () => {
  return (
    <CContainer className="px-4">
      <Suspense fallback={<CSpinner color="primary" />}>
        <div className="container-lg px-4 responsive">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/" element={<Navigate to="dashboard" replace />} />
          </Routes>
        </div>
      </Suspense>
    </CContainer>
  )
}

export default React.memo(AppContent)