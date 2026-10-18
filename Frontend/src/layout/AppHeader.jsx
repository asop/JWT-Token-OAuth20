import React from 'react'
import { CHeader, CContainer, CHeaderNav, CHeaderToggler } from '@coreui/react'
import { CIcon } from '@coreui/icons-react'
import {
  cilMenu, cibApache, cilBug, cilCalculator, cilChartLine, cilChartPie, cilCloud, cilDescription, 
  cilDevices, cilExternalLink, cilHd, cilHeadphones, cilLockLocked, cilNotes,
  cilObjectGroup, cilPuzzle, cilScreenDesktop, cilShieldAlt, cilSpeedometer, cilStar,
  cilEducation,
  cilAccountLogout,
  cilUser,
} from '@coreui/icons'


// Terima props setSidebarShow dan sidebarShow dari parent
const AppHeader = ({ sidebarShow, setSidebarShow }) => {
  const onLogout =()=>{
    if (!window.confirm('LOGOUT, apakah Anda yakin?')) return;
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('coreUIuid');
    window.location.href = '/login';
  }

  return (
    <CHeader position="sticky" className="mb-4">
      <CContainer fluid>
        {/* Tombol Toggler Menu */}
        <CHeaderToggler
          onClick={() => setSidebarShow(!sidebarShow)}
          style={{ marginInlineStart: '-14px' }}
        >
          <CIcon icon={cilMenu} size="lg" />
        </CHeaderToggler>

        <span className="fw-bold ms-2">Dashboard Admin Panel</span>

        <CHeaderNav className="ms-auto">
          <div className="ms-2">
             <CIcon icon={cilDevices} height={24} />
          </div>
          <div className="ms-2">
             <CIcon icon={cilUser} height={24} style={{cursor:"pointer"}}/>
          </div>
          <div className="ms-2">
             &nbsp;
          </div>
          <button 
            className="btn btn-sm btn-outline-danger"
            onClick={() => {onLogout()}}
          >
            Logout
          </button>
        </CHeaderNav>
      </CContainer>
    </CHeader>
  )
}

export default React.memo(AppHeader)