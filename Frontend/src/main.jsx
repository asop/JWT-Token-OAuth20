import React from 'react'
import { createRoot } from 'react-dom/client'

import App from './App'
import '@coreui/coreui/dist/css/coreui.min.css' // CSS Utama CoreUI

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
