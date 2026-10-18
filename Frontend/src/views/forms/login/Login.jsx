import { Link } from 'react-router-dom'
import {
  CButton,
  CCard, CCardBody,
  CTable, CTableBody, CTableRow, CCol,CRow,
  CContainer,CSpinner,
  CForm, CFormCheck, CFormInput, CFormLabel, CInputGroup, CInputGroupText,
  CTooltip,CPlaceholder,
  CAlert, // <-- Tambahkan CAlert untuk menampilkan pesan gagal tanpa merusak form
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { apple } from '../../../assets/brand/apple'
import { google } from '../../../assets/brand/google'
import { logo } from '../../../assets/brand/logo'
import { eye } from '../../../assets/icons/eye'
//import { cilSync } from '@coreui/icons';

import React, { useState, useEffect } from 'react';
import api from '../../../services/netcoreapi'; 
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername]         = useState('');
  const [password, setPassword]         = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [onConnecting, setConnection]   = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate                        = useNavigate();
  const [rememberMe, setRememberMe]     = useState(false);

  const handleRemember = ()=>{
    const storageA = localStorage.getItem('remembereda');
    const storageB = localStorage.getItem('rememberedb');
    if (storageA && storageB) {
        setUsername(storageA);
        setPassword(storageB);
        setRememberMe(true);
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage(''); setConnection(true);

    if (rememberMe) {
        localStorage.setItem('remembereda', username);
        localStorage.setItem('rememberedb', password);
    } else {
        localStorage.removeItem('remembereda');
        localStorage.removeItem('rememberedb');
    }

    try {
      const response = await api.post('/auth/login', { username, passkey: password });      
      const token = response.data.token || response.data.Token;
      if (token) {
          localStorage.setItem('coreUIuid', username);
          localStorage.setItem('jwt_token', token);
          setConnection(false);
          window.location.href = '/dashboard/dashboard'; 
      } else {
          setConnection(false);
          setErrorMessage('Token tidak ditemukan dari respons server.');
          return;  
          //throw new Error('Token tidak ditemukan dari respons server.');
      }
    } catch (error) {
      const statusCode = error.status; 
      const errorMsg   = (statusCode==401)? "Autentikasi tidak valid.": error.message || 'Terjadi gangguan koneksi.';
      setErrorMessage(errorMsg);
      setConnection(false);
      navigate('/forms/login');
    }
  };

  const loginWithGoogleMail = async()=>{
    if (rememberMe) {
        localStorage.setItem('remembereda', username);
        localStorage.setItem('rememberedb', password);
    } else {
        localStorage.removeItem('remembereda');
        localStorage.removeItem('rememberedb');
    }        
    const uri = api.baseURL;
    window.location.href = `${api.baseURL}/auth/login-google`;
    return;
  }

   const Test = async () => {
     try {
      const response = await api.post('/auth/login', { username, password });      
      const token = response.data.token || response.data.Token;
      if (token) {
        console.log("Login Sukses:", response.data);
      } else {
        throw new Error('Token tidak ditemukan dari respons server.');
      }

    } catch (error) {
        const statusCode = error.response.status; // Mendapatkan angka kode (misal: 401, 404, 500)
        const errorMessage = error.response.data?.message || "Terjadi kesalahan pada server";

        if (statusCode === 401) {
          console.error(statusCode+' Sesi habis atau token tidak valid (Unauthorized).');
        } else if (statusCode === 403) {
          console.error(statusCode+' Anda tidak memiliki hak akses ke halaman ini (Forbidden).');
        } else if (statusCode === 404) {
          console.error(statusCode+' Data tidak ditemukan.');
        } else {
          console.error(statusCode+" Error server lain:", statusCode);
        }  
        navigate('/forms/login');
    }
  };


  useEffect(() => {
    handleRemember();
  }, [])

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row table-responsive pt-5" 
    >
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8} lg={6} xl={5}>
            <div className="d-flex flex-column gap-4">
              <CCard className="p-4">
                <CCardBody className="d-flex flex-column gap-4">
                  <h2 className={`h5 text-center ${onConnecting ? 'd-none' : ''}`}>Login to your account</h2>
                  
                  {onConnecting ?(
                    <div className="d-flex align-items-center gap-2 py-2">
                        <CSpinner component="span" size="smax" aria-hidden="true" />
                        <div disabled>Menghubungkan ke server...</div>
                    </div>
                  ):(
                  <>    
                  {errorMessage ? (
                    <CAlert color="danger" className="py-2 mb-0">
                      {errorMessage}
                    </CAlert>
                  ): null}

                  <CRow className="gy-2">
                    <CCol xs={12} >
                      <CButton type="button" variant="outline" className="w-100"
                      onClick={loginWithGoogleMail}>
                        <CIcon icon={google} className="me-1" />
                        Continue with Google
                      </CButton>
                    </CCol>
                  </CRow>
                  <div className="position-relative">
                    <hr />
                    <div className="position-absolute top-50 start-50 translate-middle bg-body px-2 text-body-tertiary text-uppercase small">
                      or
                    </div>
                  </div>

                  <CForm className="row gy-3" onSubmit={(e)=>handleLogin(e)} target="forms/login">
                    <CCol xs={12}>
                      <CFormLabel htmlFor="edUser">Username</CFormLabel>
                      <CFormInput
                        id="edUser"
                        type="text"
                        placeholder="Username"
                        value={username}
                        autoComplete="username"
                        onChange={(e) => {setUsername(e.target.value); setErrorMessage('')}}
                      />
                    </CCol>
                    <CCol xs={12}>
                      <div className="d-flex justify-content-between">
                        <CFormLabel htmlFor="password">Password</CFormLabel>
                      </div>
                      <CInputGroup>
                        <CFormInput
                          id="password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Your password"
                          autoComplete="current-password"
                          value={password}
                          onChange={(e) => {setPassword(e.target.value); setErrorMessage('')}}
                        />
                        <CInputGroupText>
                          <CTooltip content="Show password">
                            <CButton
                              type="button"
                              color="link"
                              className="p-0 link-secondary"
                              aria-label={showPassword ? "Hide password" : "Show password"}
                              onClick={(e)=>setShowPassword(!showPassword)}
                            >
                              <CIcon icon={eye} size="sm" />
                            </CButton>
                          </CTooltip>
                        </CInputGroupText>
                      </CInputGroup>
                    </CCol>
                    <CCol xs={12}>
                      <CFormCheck id="rememberMe" label="Remember me on this device" 
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      />
                    </CCol>
                    <CCol xs={12}>
                      <CButton color="primary" type="submit" className="w-100">
                        <CIcon icon={apple} className="me-1" />
                        Sign in
                      </CButton>
                    </CCol>
                  </CForm>
                  
                  <div className={`text-center text-body-secondary ${onConnecting ? 'd-none' : ''}`}>
                    Need an account? <Link to="/authentication/register">Sign up</Link>
                  </div>
                  
                  </>
                  )}
                </CCardBody>
              </CCard>

            </div>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login