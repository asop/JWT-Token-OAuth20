import React,{useState, useEffect} from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CWidgetStatsF,
} from '@coreui/react'
import { CIcon } from '@coreui/icons-react'
import { cilUser, cilChartPie, cilBasket, cilSpeedometer } from '@coreui/icons'

const Dashboard = () => {
  const [currUser, setCurrUser] = useState("");
  useEffect(() => {
    const uid = localStorage.getItem('coreUIuid');
    if(uid){
      setCurrUser(uid);
    }
  }, []);
  //localStorage.setItem('coreUIuid', username);
  return (
    <>
      {/* Judul Halaman */}
      <div className="mb-4">
        <h4>Dashboard Utama</h4>
        <p className="text-muted">Hai <strong>{currUser}</strong>, Selamat datang kembali di panel administrasi Anda.</p>
      </div>

      {/* Baris Widget Statistik Singkat */}
      <CRow className="mb-4">
        <CCol sm={6} lg={3}>
          <CWidgetStatsF
            className="mb-3"
            icon={<CIcon icon={cilUser} height={24} />}
            title="Total Pengguna"
            value="1,248"
            color="primary"
          />
        </CCol>
        <CCol sm={6} lg={3}>
          <CWidgetStatsF
            className="mb-3"
            icon={<CIcon icon={cilBasket} height={24} />}
            title="Pesanan Baru"
            value="345"
            color="info"
          />
        </CCol>
        <CCol sm={6} lg={3}>
          <CWidgetStatsF
            className="mb-3"
            icon={<CIcon icon={cilChartPie} height={24} />}
            title="Konversi"
            value="42.3%"
            color="warning"
          />
        </CCol>
        <CCol sm={6} lg={3}>
          <CWidgetStatsF
            className="mb-3"
            icon={<CIcon icon={cilSpeedometer} height={24} />}
            title="Performa Server"
            value="98.5%"
            color="success"
          />
        </CCol>
      </CRow>

      {/* Kartu Konten Utama */}
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Informasi Sistem</strong>
            </CCardHeader>
            <CCardBody>
              <p>
                Frontend React Anda yang dipadukan dengan template **CoreUI** sudah berhasil dikonfigurasi dan berjalan dengan baik. Anda sekarang bisa mulai membuat form, tabel, atau menghubungkannya dengan backend .NET Core Anda.
              </p>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default Dashboard