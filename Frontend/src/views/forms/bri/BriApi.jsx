import axios from 'axios';
import React,{useState, useEffect} from 'react'
import {
    CButton,CContainer, CCol, CRow
} from '@coreui/react'
import { CIcon } from '@coreui/icons-react'
import { apple } from '../../../assets/brand/apple';
import api from '../../../services/netcoreapi'; 

const briAPI = () => {

    const handleGetTokenBRI = async () => {
    try {
        const response = await axios.get('/api/bri/token'); 
        console.log('Response.data:', response.data);
        console.log('Access Token:', response.data.accessToken);
        alert('Berhasil mendapatkan Token BRIAPI!');
        } catch (error) {
            console.error('Gagal:', error);
        }
    };    

    const BriPaymentPage = () => {
        const [token, setToken] = useState('');
        const [loading, setLoading] = useState(false);

        // Fungsi untuk memicu pengambilan token BRI via Backend
        const handleFetchToken = async () => {
        setLoading(true);
        try {
            // Panggil endpoint backend
            const response = await axios.get('http://localhost:5000/api/get-bri-token');
        
            if (response.data.success) {
                setToken(response.data.accessToken);
                alert('Berhasil mendapatkan Access Token BRI!');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Gagal terhubung ke server backend.');
        } finally {
            setLoading(false);
        }
     };    
    };

    useEffect(() => {
    }, [])

    return (
        <div className="bg-body-tertiary min-vh-100 d-flex flex-row table-responsive pt-5">
            <CContainer>
                <CRow className="justify-content-center">
                    <CCol md={8} lg={6} xl={5}>                    
                        <CButton color="primary" className="w-100 " onClick={BriPaymentPage}>
                            <CIcon icon={apple} className="me-1" />
                            Test BRI Api
                        </CButton>
                    </CCol>
                </CRow>
            </CContainer>
        </div>
    )
}

export default briAPI