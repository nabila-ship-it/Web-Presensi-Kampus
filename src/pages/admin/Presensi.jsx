import React, { useState, useEffect } from 'react'
import { CalendarCheck, Search, Filter } from 'lucide-react'
import AttendanceBadge from '../../components/AttendanceBadge'
import Toast from '../../components/Toast'
import { getMahasiswaList } from '../../services/adminService'

export default function AdminPresensi() {
  const [presensiList, setPresensiList] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('semua')
  const [toastMsg, setToastMsg] = useState('')

  useEffect(() => {
    const allMhs = getMahasiswaList()
    const formatted = allMhs.map((m, idx) => ({
      id: `prs-adm-${m.id}`,
      nim: m.nim,
      nama: m.nama,
      kelas: m.kelas,
      mataKuliah: idx % 2 === 0 ? 'Pemrograman Web' : 'Basis Data',
      tanggal: '2026-10-05',
      waktuPresensi: `08:${10 + idx}`,
      status: idx === 3 ? 'terlambat' : idx === 4 ? 'izin' : 'hadir',
    }))
    setPresensiList(formatted)
  }, [])

  const handleStatusChange = (id, newStatus) => {
    setPresensiList((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p))
    )
    setToastMsg('Status presensi mahasiswa berhasil diubah.')
  }

  const filtered = presensiList.filter((item) => {
    const matchSearch =
      item.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.nim.includes(searchTerm) ||
      item.mataKuliah.toLowerCase().includes(searchTerm.toLowerCase())
    const matchStatus =
      filterStatus === 'semua' || item.status.toLowerCase() === filterStatus.toLowerCase()
    return matchSearch && matchStatus
  })

  return (
    <div className="space-y-6">
      <Toast message={toastMsg} onClose={() => setToastMsg('')} />

      <div>
        <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <CalendarCheck className="w-5 h-5 text-blue-600" />
          <span>Kelola & Audit Presensi Kampus</span>
        </h1>
        <p className="text-xs font-medium text-slate-500 mt-1">
          Monitor dan koreksi rekam presensi mahasiswa seluruh mata kuliah.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari NIM, Nama, atau Mata Kuliah..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none font-medium"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-blue-600" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
          >
            <option value="semua">Semua Status</option>
            <option value="hadir">Hadir</option>
            <option value="terlambat">Terlambat</option>
            <option value="izin">Izin</option>
            <option value="sakit">Sakit</option>
            <option value="alpa">Alpa</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase">
                <th className="py-3.5 px-5">Tanggal</th>
                <th className="py-3.5 px-5">NIM</th>
                <th className="py-3.5 px-5">Nama Mahasiswa</th>
                <th className="py-3.5 px-5">Kelas</th>
                <th className="py-3.5 px-5">Mata Kuliah</th>
                <th className="py-3.5 px-5">Waktu</th>
                <th className="py-3.5 px-5">Status</th>
                <th className="py-3.5 px-5 text-right">Aksi Admin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50">
                  <td className="py-3.5 px-5 font-semibold">{item.tanggal}</td>
                  <td className="py-3.5 px-5 font-mono font-bold text-slate-900">{item.nim}</td>
                  <td className="py-3.5 px-5 font-bold text-slate-900">{item.nama}</td>
                  <td className="py-3.5 px-5 font-bold">{item.kelas}</td>
                  <td className="py-3.5 px-5">{item.mataKuliah}</td>
                  <td className="py-3.5 px-5 font-mono">{item.waktuPresensi}</td>
                  <td className="py-3.5 px-5">
                    <AttendanceBadge status={item.status} />
                  </td>
                  <td className="py-3.5 px-5 text-right">
                    <select
                      value={item.status}
                      onChange={(e) => handleStatusChange(item.id, e.target.value)}
                      className="px-2.5 py-1 bg-slate-100 border border-slate-300 rounded-lg text-xs font-semibold cursor-pointer"
                    >
                      <option value="hadir">Hadir</option>
                      <option value="terlambat">Terlambat</option>
                      <option value="izin">Izin</option>
                      <option value="sakit">Sakit</option>
                      <option value="alpa">Alpa</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
