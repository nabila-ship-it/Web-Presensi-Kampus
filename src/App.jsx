import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/auth/Login'
import DashboardLayout from './layouts/DashboardLayout'
import ProtectedRoute from './routes/ProtectedRoute'

// Mahasiswa Pages
import MahasiswaDashboard from './pages/mahasiswa/Dashboard'
import MahasiswaPresensi from './pages/mahasiswa/Presensi'
import MahasiswaRiwayat from './pages/mahasiswa/Riwayat'
import MahasiswaJadwal from './pages/mahasiswa/Jadwal'
import MahasiswaProfil from './pages/mahasiswa/Profil'

// Dosen Pages
import DosenDashboard from './pages/dosen/Dashboard'
import DosenKelas from './pages/dosen/Kelas'
import DosenRekap from './pages/dosen/Rekap'
import DosenProfil from './pages/dosen/Profil'

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard'
import AdminMahasiswa from './pages/admin/Mahasiswa'
import AdminDosen from './pages/admin/Dosen'
import AdminMataKuliah from './pages/admin/MataKuliah'
import AdminKelas from './pages/admin/Kelas'
import AdminJadwal from './pages/admin/Jadwal'
import AdminPresensi from './pages/admin/Presensi'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Route */}
        <Route path="/login" element={<Login />} />

        {/* Mahasiswa Protected Routes */}
        <Route
          path="/mahasiswa"
          element={
            <ProtectedRoute allowedRoles={['mahasiswa']}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<MahasiswaDashboard />} />
          <Route path="presensi" element={<MahasiswaPresensi />} />
          <Route path="riwayat" element={<MahasiswaRiwayat />} />
          <Route path="jadwal" element={<MahasiswaJadwal />} />
          <Route path="profil" element={<MahasiswaProfil />} />
        </Route>

        {/* Dosen Protected Routes */}
        <Route
          path="/dosen"
          element={
            <ProtectedRoute allowedRoles={['dosen']}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<DosenDashboard />} />
          <Route path="kelas" element={<DosenKelas />} />
          <Route path="rekap" element={<DosenRekap />} />
          <Route path="profil" element={<DosenProfil />} />
        </Route>

        {/* Admin Protected Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="mahasiswa" element={<AdminMahasiswa />} />
          <Route path="dosen" element={<AdminDosen />} />
          <Route path="matakuliah" element={<AdminMataKuliah />} />
          <Route path="kelas" element={<AdminKelas />} />
          <Route path="jadwal" element={<AdminJadwal />} />
          <Route path="presensi" element={<AdminPresensi />} />
        </Route>

        {/* Fallback Redirects */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
