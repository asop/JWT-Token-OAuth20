import React, { Suspense, useState, useEffect } from 'react'
import { HashRouter, Route, Routes } from 'react-router-dom'

import { CSpinner, useColorModes } from '@coreui/react'

// -------------------------------------------------------------
import { BrowserRouter, Navigate, useLocation } from 'react-router-dom'
import api from './services/netcoreapi'; 
//import Dashboard from './views/dashboard/Dashboard';

// -------------------------------------------------------------
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))
const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const Login     = React.lazy(() => import('./views/forms/login/Login'))
const Sukses    = React.lazy(() => import('./views/forms/login/Sukses'))
const BriApi    = React.lazy(() => import('./views/forms/bri/BriApi'))

const App = () => {
  const { isColorModeSet, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')
    //const location    = useLocation()
  const [loading, setLoading]                 = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [url, setUrl]                         = useState("");

  useEffect(() => {
    if( isLoginFromMial()==true ) 
    {
      window.history.replaceState({}, document.title, window.location.pathname);
      navigate('/dashboard/Dashboard', { replace: true }); 
      //window.location.href = '/dashboard/Dashboard';
    }else{TokenExpirationChecker();}

    const urlParams = new URLSearchParams(window.location.href.split('?')[1])
    const theme = urlParams.get('theme') && urlParams.get('theme').match(/^[A-Za-z0-9\s]+/)[0]
    if (theme) {
        setColorMode(theme)
    }

    if (isColorModeSet()) {
        return
    }

    setColorMode(storedTheme)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

const isLoginFromMial = async () => {
    console.log("isAuthenticated:"+isAuthenticated);
    const urlParams = new URLSearchParams(window.location.search);
    const uidParams = urlParams.get('uid');
    const token = urlParams.get('token');
    if (token) {
        localStorage.setItem('jwt_token', token);
        localStorage.setItem('coreUIuid', uidParams);
        setIsAuthenticated(true);
        return true;
    } else{
      return false;
    }
}

const TokenExpirationChecker = async () =>  {
    const token = localStorage.getItem('jwt_token');    
    if (!token) {
        setIsAuthenticated(false);
        setLoading(false);
        return;
    }
    try {
        const respon = await api.get('/auth/verify'); 
        if (respon.data.status || respon.data.Status) {
            setIsAuthenticated(true);
        } else {
            setIsAuthenticated(false);
            throw new Error('Token tidak ditemukan dari respons server.');
        }
    } catch (error) {
        setIsAuthenticated(false);
    } finally {
        setLoading(false);
    }
}

  return (
    <HashRouter>
          <Suspense
            fallback={
              <div className="pt-3 text-center">
                <CSpinner color="primary" variant="grow" />
              </div>
            }
          >

        <Routes>
          <Route exact path="/forms/login" 
            element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />} />
          
          <Route exact path="/dashboard/Dashboard" element={<Dashboard />} />
          <Route path="/forms/sukses" element={<Sukses />} />

          <Route path="*" 
            element={isAuthenticated ? <DefaultLayout /> : <Navigate to="/forms/login" replace />} 
          />
        </Routes>
      </Suspense>
    </HashRouter>
  )
}

export default App
