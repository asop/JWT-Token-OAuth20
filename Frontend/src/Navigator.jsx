/**
 * Sidebar Navigation Configuration
 *
 * Defines the structure and content of the sidebar navigation menu.
 * Supports multiple navigation component types from CoreUI React:
 * - CNavItem: Single navigation link
 * - CNavGroup: Collapsible group of links
 * - CNavTitle: Section title/divider
 *
 * @module _nav
 */

import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilBug,
  cilCalculator,
  cilChartPie,
  cilDescription,
  cilExternalLink,
  cilLockLocked,
  cilNotes,
  cilPuzzle,
  cilSpeedometer,
  cilStar,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const NavigatorMenuItem = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    badge: {
      color: 'info',
      text: 'NEW',
    },
  },
  {
    component: CNavTitle,
    name: 'UI Elements',
  },
  {
    component: CNavItem,
    name: 'Karyawan',
    to: '/forms/karyawan',
    icon: <CIcon icon={cilChartPie} customClassName="nav-icon" />,
  },
    {
    component: CNavItem,
    name: 'Login',
    to: '/forms/login',
    icon: <CIcon icon={cilChartPie} customClassName="nav-icon" />,
  },
      {
    component: CNavItem,
    name: 'Register',
    to: '/register',
    icon: <CIcon icon={cilChartPie} customClassName="nav-icon" />,
  }]

export default NavigatorMenuItem
