import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { BookOpen, Users, CheckCircle2, Save, Search, Download } from 'lucide-react'
import AttendanceBadge from '../../components/AttendanceBadge'
import Toast from '../../components/Toast'
import { getMahasiswaList } from '../../services/adminService'
import { updatePresensiStatus } from '../../services/presensiService'
import { getDosenJadwal } from '../../services/jadwalService'
import { getCurrentUser } from '../../services/authService'

export default function DosenKelas() {
  const [searchParams] = useSearchParams()
  const user = getCurrentUser()
  const scheduleId = searchParams.get('id')

  const [schedules, setSchedules] = useState([])
  const [selectedJadwalId, setSelectedJadwalId] = useState(scheduleId || '')
  const [students, setStudents] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [toastMsg, setToastMsg] = useState('')

  const loadData = () => {
    if (!user) return
    const jData = getDosenJadwal(user.id)
    setSchedules(jData)

    if (jData.length > 0 && !selectedJadwalId) {
      setSelectedJadwalId(jData[0].id)
    }

    const allMhs = getMahasiswaList()
    // Map default attendance status for class list demo
    const formatted = allMhs.map((m, idx) => ({
      ...m,
      no: idx + 1,
      presensiId: `prs-demo-${m.id}`,
      status: idx === 3 ? 'terlambat' : idx === 4 ? 'izin' : 'hadir',
      waktuPresensi: idx === 4 ? '-' : `08:${10 + idx}`,
    }))
    setStudents(formatted)
  }

  useEffect(() => {
    loadData()
  }, [])

  const selectedClass = schedules.find((s) => s.id === selectedJadwalId) || schedules[0]

  const handleStatusChange = (studentId, newStatus) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === studentId ? { ...s, status: newStatus } : s))
    )
    setToastMsg(`Status presensi mahasiswa berhasil diperbarui menjadi ${newStatus.toUpperCase()}`)
  }

  const handleExportExcel = () => {
    let csvContent = '\uFEFF' // UTF-8 BOM for Microsoft Excel
    csvContent += `Mata Kuliah: ${selectedClass?.mataKuliah || '-'}\n`
    csvContent += `Kelas: ${selectedClass?.kelas || '-'}\n`
    csvContent += `Hari & Jam: ${selectedClass?.hari || '-'}, ${selectedClass?.jam || '-'}\n`
    csvContent += `Ruangan: ${selectedClass?.ruangan || '-'}\n\n`
    csvContent += 'No,NIM,Nama Mahasiswa,Program Studi,Status Presensi,Waktu Presensi\n'

    filteredStudents.forEach((s, index) => {
      const row = [
        index + 1,
        `"${s.nim}"`,
        `"${s.nama}"`,
        `"${s.program_studi || 'Sistem Informasi'}"`,
        `"${s.status.toUpperCase()}"`,
        `"${s.waktuPresensi}"`,
      ].join(',')
      csvContent += row + '\n'
    })

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `Presensi_${(selectedClass?.mataKuliah || 'Kelas').replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const filteredStudents = students.filter(
    (s) =>
      s.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.nim.includes(searchTerm)
  )

  return (
    <div className="space-y-6">
      <Toast message={toastMsg} onClose={() => setToastMsg('')} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-600" />
            <span>Daftar Presensi Kelas Mahasiswa</span>
          </h1>
          <p className="text-xs font-medium text-slate-500 mt-1">
            Kelola status kehadiran mahasiswa secara akurat.
          </p>
        </div>

        <button
          onClick={handleExportExcel}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-500/20 transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <Download className="w-4 h-4" />
          <span>Export Excel (.csv)</span>
        </button>
      </div>

      {/* Subject Filter Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex-1 min-w-[240px]">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
            Pilih Jadwal Mengajar
          </label>
          <select
            value={selectedJadwalId}
            onChange={(e) => setSelectedJadwalId(e.target.value)}
            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none"
          >
            {schedules.map((s) => (
              <option key={s.id} value={s.id}>
                {s.mataKuliah} - Kelas {s.kelas} ({s.hari}, {s.jam})
              </option>
            ))}
          </select>
        </div>

        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari NIM atau Nama..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none font-medium"
          />
        </div>
      </div>

      {/* Selected Class Info */}
      {selectedClass && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 p-5 rounded-2xl flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">{selectedClass.mataKuliah}</h3>
            <p className="text-xs font-semibold text-slate-600 mt-0.5">
              Kelas {selectedClass.kelas} • Ruang {selectedClass.ruangan} • SKS: {selectedClass.sks}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-3 py-1.5 bg-white text-blue-800 font-bold text-xs rounded-xl shadow-2xs border border-blue-200">
              Total Mahasiswa: {filteredStudents.length}
            </span>
          </div>
        </div>
      )}

      {/* Students Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <th className="py-3.5 px-5">No</th>
                <th className="py-3.5 px-5">NIM</th>
                <th className="py-3.5 px-5">Nama Mahasiswa</th>
                <th className="py-3.5 px-5">Waktu Presensi</th>
                <th className="py-3.5 px-5">Status Kehadiran</th>
                <th className="py-3.5 px-5 text-right">Ubah Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredStudents.map((s, idx) => (
                <tr key={s.id} className="hover:bg-slate-50/80">
                  <td className="py-3.5 px-5 font-bold text-slate-400">{idx + 1}</td>
                  <td className="py-3.5 px-5 font-mono font-bold text-slate-900">{s.nim}</td>
                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-3">
                      <img
                        src={s.foto_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                        alt="Avatar"
                        className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-200"
                      />
                      <span className="font-bold text-slate-900">{s.nama}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-5 font-mono">{s.waktuPresensi}</td>
                  <td className="py-3.5 px-5">
                    <AttendanceBadge status={s.status} />
                  </td>
                  <td className="py-3.5 px-5 text-right">
                    <select
                      value={s.status}
                      onChange={(e) => handleStatusChange(s.id, e.target.value)}
                      className="px-2.5 py-1 bg-slate-100 border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none cursor-pointer"
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
