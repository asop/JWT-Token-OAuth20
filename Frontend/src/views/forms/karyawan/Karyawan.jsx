import { useState, useEffect } from 'react';
import {
  CButton,
  CCard, CCardBody, CCardHeader, CCardTitle, CCardText,
  CPlaceholder,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CForm, CFormInput, CFormLabel, CFormTextarea, CInputGroup, CFormSelect, 
  CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow, CRow, CCol,
  CDropdown, CDropdownItem, CDropdownMenu, CDropdownToggle,
  CFormText
} from '@coreui/react'
import { cilAlignCenter } from '@coreui/icons';
import api from '../../../services/netcoreapi';
import { useNavigate } from 'react-router-dom';

const KaryawanDashboard = () => {
//export default function KaryawanDashboard(){
  const [karyawanList, setKaryawanList] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);

  // State untuk Modal & Form (Tambah / Edit)
  const [visible, setVisible]           = useState(false);
  //const [isModalOpen, setIsModalOpen]   = useState(false);
  const [isEditing, setIsEditing]       = useState(false);
  
  // State form input karyawan
  const [currentId, setCurrentId]       = useState(null);
  const [nip, setNIP]                   = useState('');
  const [nama, setNama]                 = useState('');
  const [alamat, setAlamat]             = useState('');
  const [kelamin, setKelamin]           = useState('');
  const [telpon, setTelpon]             = useState('');
  const [email, setEmail]               = useState('');
  const [tglLahir, setTglLahir]         = useState('');
  const [keterangan, setKeterangan]     = useState('');
  const [atad, setAtad]                 = useState([]);
  const navigate                        = useNavigate();

  // Base URL API Backend
  const API_URL = '/karyawan';
  
  const fetchKaryawan = async () => {
    setLoading(true);
    try {
      //const response = await fetch(API_URL);
      const response = await api.get(API_URL);
      if ( response.status !=200 && response.statusText != 'OK'){
        //console.error('Gagal mengambil data dari server.');
        //console.debug(response);
        setError('Gagal mengambil data dari server.');
        return false;
      }
      //if (!response.ok) throw new Error('Gagal mengambil data dari server.');
      setAtad(response.data);
      const data = await response.data;
      setKaryawanList(data);
      setError(null);
    } catch (exception) {
      if (exception) {
        const statusCode = exception.status; // Mendapatkan angka kode (misal: 401, 404, 500)
        const errorMessage = exception.statusText || "Terjadi gangguan koneksi";

        //console.error(`Gagal! Kode Error: ${statusCode}`, errorMessage);

        if (statusCode === 401) {
          //console.error('Sesi habis atau token tidak valid (Unauthorized).');
          setError(statusCode+' Sesi habis atau token tidak valid (Unauthorized).');
          navigate('/forms/login');
        } else if (statusCode === 403) {
          //console.error('Anda tidak memiliki hak akses ke halaman ini (Forbidden).');
          setError(statusCode+' Anda tidak memiliki hak akses ke halaman ini (Forbidden).');
        } else if (statusCode === 404) {
          //console.error('Data tidak ditemukan.');
          setError(statusCode+' Data tidak ditemukan.');
        } else {
          //console.error("Error server lain:", statusCode);
          setError(statusCode+" Error server lain:", statusCode);
        }
        
      } else if (exception.request) {
        // Error terjadi karena server .NET Core mati / tidak bisa dijangkau sama sekali (Network Error)
        //console.error("Gagal terhubung ke server. Pastikan backend .NET Core sudah menyala.");
        setError("Gagal terhubung ke server. Pastikan backend .NET Core sudah menyala.");
      } else {
        //console.error('Gagal terhubung ke API backend: '+exception);
        setError('Gagal terhubung ke API backend.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKaryawan();
  }, []);

  // Buka modal untuk Tambah Data Baru
  const handleOpenAddModal = () => {
    setIsEditing(false);
    setCurrentId(null);
    setNIP('');
    setNama('');
    setAlamat('');
    setKelamin('');
    setTelpon('');
    setEmail('');    
    setTglLahir('');
    setKeterangan('');
    setVisible(true);
  };

  // Buka modal untuk Edit Data (Load data lama ke form)
  const handleOpenEditModal = (karyawan) => {
    setIsEditing(true);
    setCurrentId(karyawan.id || karyawan.Id); // Menyesuaikan case property C# (CamelCase / PascalCase)
    setNIP(karyawan.nip || karyawan.Nip || '');
    setNama(karyawan.nama || karyawan.Nama || '');
    setAlamat(karyawan.alamat || karyawan.Alamat || '');
    setKelamin(karyawan.kelamin || karyawan.Kelamin || '');
    setTelpon(karyawan.telpon || karyawan.Telpon || '');
    setEmail(karyawan.email || karyawan.Email || '');
    
    if( karyawan.tglLahir && karyawan.tglLahir != '' ){
      setTglLahir(karyawan.tglLahir.substring(0, 10));
    }else{
      setTglLahir(karyawan.tglLahir);
    }
    setKeterangan(karyawan.keterangan || karyawan.Keterangan || '');
    setVisible(true);
    
  };

  // 2. CREATE & UPDATE: Simpan data (POST / PUT)
  const handleSubmitForm = async (e) => {
    e.preventDefault();
    const payload = {
      nip,
      nama,
      alamat,
      kelamin,
      telpon,
      email,
      tglLahir,
      keterangan
    };
    setLoading(true);
    try {
      const formattedPayload = {
        ...payload,
        // Mengonversi input tanggal menjadi format ISO standar yang disukai C#
        tglLahir: payload.tglLahir ? new Date(payload.tglLahir).toISOString() : null
      };

      let response;
      if (isEditing) {
          //console.log(payload);
          response = await api.put(`${API_URL}/${currentId}`, {id:currentId, ...formattedPayload });
      } else {
          response = await api.post(API_URL, formattedPayload);
      }
      //console.log(response);
      /*if (response.status != 201 && response.statusText != "Created") 
      {
          throw new Error('Gagal menyimpan data.');
      }*/
      // Tutup modal dan refresh data tabel
      setVisible(false);
      fetchKaryawan();
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan saat menyimpan data.');
    }finally{
      setLoading(false);
    }
  };

  const Test = () => {
    alert("Test Function.");
  }
  // 3. DELETE: Hapus data (DELETE)
  const handleDelete = async (hId) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus data karyawan ini?')) return;

    try {
      //const response = await fetch(`${API_URL}/${id}`
      const response = await api.delete(`${API_URL}/${hId}`, {id:currentId});
      console.log(response);
      //if (!response.ok) throw new Error('Gagal menghapus data.');
      // Refresh data setelah hapus
      fetchKaryawan();
    } catch (err) {
      console.error(err);
      alert('Gagal menghapus data karyawan.');
    }
  };

  return (
    <>
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {loading ? (
          <div className="p-8 text-center text-gray-500 italic">
            <center>
            <CCard as={CTable} style={{ width: '80%', aligment:'center' }}>
                  <svg
                    className="card-img-top"
                    width="100%"
                    height="25"
                    xmlns="http://www.w3.org/2000/svg"
                    role="img"
                    aria-label="Placeholder"
                    preserveAspectRatio="xMidYMid slice"
                    focusable="false"
                  >
                    <title>Placeholder</title>
                    <rect width="100%" height="100%" fill="#50504f"></rect>
                  </svg>              
                  <CCardBody >
                    <CPlaceholder as={CTable} animation="glow" xs={12}>
                      <CPlaceholder as={CTableBody} animation="glow" xs={12}>
                        <CPlaceholder as={CTableRow} xs={12} disabled color="secondary"/>
                        <CPlaceholder as={CTableRow} xs={12} disabled color="secondary"/>
                        <CPlaceholder as={CTableRow} xs={12} disabled/>
                      <CPlaceholder as={CTableRow} xs={12} disabled/>
                      </CPlaceholder>
                    </CPlaceholder>
                  </CCardBody>
            </CCard> 
            </center>   
          </div>
      ):(
      <CRow><CCol>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Data Karyawan</strong> <small>...</small>
          </CCardHeader>
          <CCardBody>
            <div className="mb-1">
            {error ? (
              <div>
                <CButton className="btn btn-success disabled" disabled color="secondary" >+ Tambah</CButton>&nbsp;
                <CButton disabled color="secondary">Eksport</CButton>&nbsp;
                <CButton className="btn btn-primary disabled" disabled color="secondary" >Print</CButton>&nbsp;
              </div>
            ) : (
              <div>
                <CButton className="btn btn-success" color="primary" onClick={() => handleOpenAddModal()}>+ Tambah</CButton>&nbsp;
                <CButton color="primary">Eksport</CButton>&nbsp;
                <CButton className="btn btn-primary" color="primary">Print</CButton>&nbsp;
              </div>
            )}      
            </div>
            <div className="table-responsive">
              <CTable hover className="align-middle mb-0 border">
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell scope="col">NIP</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Nama</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Alamat</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Kelamin</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Telpon</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Email</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Lahir</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Desc</CTableHeaderCell>
                    <CTableHeaderCell scope="col">ACT</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                 {karyawanList.length > 0 ? (
                  karyawanList.map((item) => {
                    const idVal = item.id || item.Id;
                    const nipVal = item.nip || item.Nip;
                    const namaVal = item.nama || item.Nama;
                    const alamatVal = item.alamat || item.Alamat;
                    const kelaminVal = item.kelamin || item.Kelamin;
                    const telponVal = item.telpon || item.Telpon;
                    const emailVal = item.email || item.Email;
                    let tglLahirVal = item.tglLahir || item.tglLahir;
                    if(tglLahirVal && !tglLahirVal==''){
                        tglLahirVal = tglLahirVal.substring(0, 10);
                    }
                    const ketVal = item.keterangan || item.Keterangan;
                    return (                      
                        <CTableRow key={idVal}>
                          <CTableHeaderCell scope="row">{nipVal}</CTableHeaderCell>
                          <CTableDataCell>{namaVal}</CTableDataCell>
                          <CTableDataCell>{alamatVal}</CTableDataCell>
                          <CTableDataCell>{kelaminVal}</CTableDataCell>
                          <CTableDataCell>{telponVal}</CTableDataCell>
                          <CTableDataCell>{emailVal}</CTableDataCell>
                          <CTableDataCell>{tglLahirVal}</CTableDataCell>
                          <CTableDataCell>{ketVal}</CTableDataCell>
                          <CTableDataCell>
                              <CDropdown>
                                <CDropdownToggle></CDropdownToggle>
                                <CDropdownMenu>
                                  <CDropdownItem onClick={() => handleOpenEditModal(item)} className="btn btn-success">Edit</CDropdownItem>
                                  <CDropdownItem onClick={() => handleDelete(idVal)} color="danger">Delete</CDropdownItem>
                                </CDropdownMenu>
                              </CDropdown>
                          </CTableDataCell>
                        </CTableRow>
                    );
                  })
                ) : (
                  <CTableRow>
                    <CTableDataCell colSpan={9}>Belum ada data karyawan yang tersedia.</CTableDataCell>
                  </CTableRow>
                )}             
                </CTableBody>
              </CTable>
              </div>       
          </CCardBody>
        </CCard>
        </CCol>
      </CRow>
      )}

      {visible && (
      <div className="table-responsive">
      <CModal backdrop="static" visible={visible} onClose={() => setVisible(false)} >
        <CForm className="row g-3" onSubmit={(e)=>handleSubmitForm(e)}>
        <CModalHeader>
          <CModalTitle>{isEditing ? 'Edit Data Karyawan' : 'Tambah Karyawan Baru'}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CRow>
            <CCol xs={12}> 
                <div className="mb-1">
                  <CFormInput type="text" id="edNip" placeholder="NIP" 
                    value={nip} onChange={(e) => {setNIP(e.target.value);}}/>
                </div>         
                <div className="mb-1">
                  <CFormInput type="text" id="edNama" placeholder="Nama" 
                  value={nama} onChange={(e) => setNama(e.target.value)}/>
                </div>
                <div className="mb-1">
                  <CFormInput type="text" id="edAlamat" placeholder="Alamat Lengkap" 
                    value={alamat} onChange={(e) => setAlamat(e.target.value)} />
                </div>                        
                <div className="mb-1">
                  <CFormInput type="email" id="edEmail" placeholder="Email"
                    value={email} onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="mb-1">
                  <CInputGroup className="mb-3">
                    <CFormSelect id="edKelamin" placeholder="Kelamin" 
                      value={kelamin} onChange={(e) => setKelamin(e.target.value)}
                    >
                      <option>Jenis Kelamin</option>
                      <option value="Pria">Pria</option>
                      <option value="Wanita">Wanita</option>
                    </CFormSelect>
                  </CInputGroup>
                </div>
                <div className="mb-1">
                  <CFormInput type="text" id="edTelpon" placeholder="Telpon"
                    value={telpon} onChange={(e) => setTelpon(e.target.value)}
                  />
                </div>    
                <div className="mb-1">
                   <CInputGroup className="mb-3">
                    <CButton type="button" color="secondary" variant="outline" disabled>
                      Tanggal Lahir
                    </CButton>
                    <CFormInput type="date" id="edTglLahir" placeholder="Tanggal Lahir"
                      value={tglLahir} onChange={(e) => setTglLahir(e.target.value)}
                    />
                  </CInputGroup>
                </div>            
                <div className="mb-1">
                  <CFormTextarea id="exampleFormControlTextarea1" rows={2} placeholder="Keterangan"
                    value={keterangan} onChange={(e) => setKeterangan(e.target.value)}
                  ></CFormTextarea>
                </div>
            </CCol>
          </CRow>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisible(false)}>
            Batal
          </CButton>
          <CButton type="submit" color="primary">Simpan</CButton>
        </CModalFooter>
        </CForm>
      </CModal>       
      </div>
      )} 
    </>
  );  
}

/*const LiveDemo = () => {
  const [visible, setVisible] = useState(false)
  return (
    <>
      <CButton color="primary" onClick={() => setVisible(!visible)}>
        Launch demo modal
      </CButton>
      
      <CButton color="primary" onClick={() => TestClick()}>
        TestClick
      </CButton>

      <CModal visible={visible} onClose={() => setVisible(false)}>
        <CModalHeader>
          <CModalTitle>Modal title</CModalTitle>
        </CModalHeader>
        <CModalBody>Woohoo, you&#39;re reading this text in a modal!
          <CRow>
            <CCol xs={12}> 
              <CForm>
                <div className="mb-3">
                  <CFormInput
                    type="text"
                    id="edNip"
                    placeholder="NIP"
                  />
                </div>         
                <div className="mb-3">
                  <CFormInput
                    type="text"
                    id="edNama"
                    placeholder="Nama Lengkap"
                  />
                </div>                        
                <div className="mb-3">
                  <CFormLabel htmlFor="edEmail">Email address</CFormLabel>
                  <CFormInput
                    type="email"
                    id="edEmail"
                    placeholder="name@example.com"
                  />
                </div>
                <div className="mb-3">
                  <CFormLabel htmlFor="exampleFormControlTextarea1">Example textarea</CFormLabel>
                  <CFormTextarea id="exampleFormControlTextarea1" rows={3}></CFormTextarea>
                </div>
              </CForm>
            </CCol>
          </CRow>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisible(false)}>
            Close
          </CButton>
          <CButton color="primary">Save changes</CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}*/

export default KaryawanDashboard