import React from 'react'
import { CSidebar, CSidebarBrand, CSidebarNav, CSidebarToggler, 
  CSidebarHeader, CCloseButton,
  CNavGroup, CNavItem,CNavTitle,
  CNavGroupItems,
  CBadge

} from '@coreui/react'
import { AppSidebarNav } from './AppSidebarNav' // Opsional untuk navigasi menu
import { logo } from '../assets/brand/logo'
import { apple } from '../assets/brand/apple'
import { sygnet } from '../assets/brand/sygnet'
import CIcon from '@coreui/icons-react'
import SimpleBar from 'simplebar-react'
import 'simplebar-react/dist/simplebar.min.css'
import {
  cilCloud, cilDevices, cilHeadphones, cilScreenDesktop, 
} from '@coreui/icons'

const AppSidebar = ({ sidebarShow, setSidebarShow }) => {
  return (
    <CSidebar
      className="border-end" 
      colorScheme="auto" 
      position="fixed" 
      unfoldable={false}
      visible={sidebarShow} // <-- Sinkronkan dengan state lokal
      onVisibleChange={(visible) => setSidebarShow(visible)}    
    >
      <CSidebarHeader className="border-bottom">
        <CSidebarBrand to="/">
          <CIcon customClassName="sidebar-brand-full" icon={logo} height={32} />
          <CIcon customClassName="sidebar-brand-narrow" icon={sygnet} height={32} />
        </CSidebarBrand>
        <CCloseButton className="" onClick={(visible) => setSidebarShow(!visible)}/>
      </CSidebarHeader>

      <SimpleBar style={{ height: 'calc(100vh - 60px)' }}>
        <CSidebarNav>
            <CNavItem href="/dashboard">
              <CIcon icon={cilScreenDesktop} height={24} />&nbsp;
              Katalog
            </CNavItem>
           <CNavItem href="/login">
              <CIcon icon={apple} height={24} />&nbsp;
              Login
            </CNavItem>
            <CNavItem href="/buku">
              <CIcon icon={cilCloud} height={24} />&nbsp;
              Buku
            </CNavItem>
            <CNavItem href="/pengarang">
              <CIcon icon={cilHeadphones} height={24} />&nbsp;
              Pengarang
            </CNavItem>
            <CNavItem href="/penerbit">
              <CIcon icon={cilDevices} height={24} />&nbsp;
              Penerbit
            </CNavItem>                
      </CSidebarNav>
      </SimpleBar>
      <AppSidebarNav items={navigation} />
      <CSidebarToggler className="d-none d-lg-flex" />   

    </CSidebar>
  )
}

export default React.memo(AppSidebar)