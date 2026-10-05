import React, { useState, useEffect } from 'react'
import { History, Filter, CheckCircle2, Clock, FileText, AlertCircle, TrendingUp } from 'lucide-react'
import AttendanceBadge from '../../components/AttendanceBadge'
import StatCard from '../../components/StatCard'
import { getCurrentUser } from '../../services/authService'
import { getMahasiswaAttendanceData } from '../../services/presensiService'

export default function MahasiswaRiwayat() {
  const user = getCurrentUser()
  const [history, setHistory] = useState([])
  const [stats, setStats] = useState(null)

  // Filters
  const [filterMk, setFilterMk] = useState('semua')
  const [filterStatus, setFilterStatus] = useState('semua')

  useEffect(() => {
    if (!user) return
    const att = getMahasiswaAttendanceData(user.id)
    setHistory(att.history)
    setStats(att.stats)
  }, [])

  const filteredHistory = history.filter((item) => {
    const matchMk = filterMk === 'semua' || item.mataKuliah.toLowerCase().includes(filterMk.toLowerCase())
    const matchStatus = filterStatus === 'semua' || item.status.toLowerCase() === filterStatus.toLowerCase()
    return matchMk && matchStatus
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <History className="w-5 h-5 text-blue-600" />
          <span>Riwayat Presensi</span>
        </h1>
        <p className="text-xs font-medium text-slate-500 mt-1">
          Daftar rekam kehadiran perkuliahan Anda beserta ringkasan statistik.
        </p>
      </div>

      {/* Stats Summary Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200 text-center">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Total Hadir</span>
          <p className="text-xl font-extrabold text-emerald-600 mt-1">{stats?.totalHadir || 0}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 text-center">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Terlambat</span>
          <p className="text-xl font-extrabold text-amber-600 mt-1">{stats?.totalTerlambat || 0}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 text-center">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Izin</span>
          <p className="text-xl font-extrabold text-blue-600 mt-1">{stats?.totalIzin || 0}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 text-center">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Sakit</span>
          <p className="text-xl font-extrabold text-indigo-600 mt-1">{stats?.totalSakit || 0}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 text-center col-span-2 lg:col-span-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Persentase</span>
          <p className="text-xl font-extrabold text-blue-600 mt-1">{stats?.percentHadir || 0}%</p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
          <Filter className="w-4 h-4 text-blue-600" />
          <span>Filter Data:</span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Filter Mata Kuliah */}
          <select
            value={filterMk}
            onChange={(e) => setFilterMk(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:bg-white focus:outline-none"
          >
            <option value="semua">Semua Mata Kuliah</option>
            <option value="Pemrograman Web">Pemrograman Web</option>
            <option value="Basis Data">Basis Data</option>
            <option value="Sistem Informasi">Sistem Informasi</option>
          </select>

          {/* Filter Status */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:bg-white focus:outline-none"
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

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <th className="py-3.5 px-5">Tanggal</th>
                <th className="py-3.5 px-5">Mata Kuliah</th>
                <th className="py-3.5 px-5">Dosen</th>
                <th className="py-3.5 px-5 text-center">Pertemuan Ke</th>
                <th className="py-3.5 px-5">Waktu Presensi</th>
                <th className="py-3.5 px-5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredHistory.length > 0 ? (
                filteredHistory.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-5 font-semibold text-slate-900">{row.tanggal}</td>
                    <td className="py-3.5 px-5">
                      <span className="font-bold text-slate-900 block">{row.mataKuliah}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{row.kodeMk}</span>
                    </td>
                    <td className="py-3.5 px-5">{row.dosen}</td>
                    <td className="py-3.5 px-5 text-center font-bold">{row.pertemuanKe}</td>
                    <td className="py-3.5 px-5">{row.waktuPresensi}</td>
                    <td className="py-3.5 px-5">
                      <AttendanceBadge status={row.status} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-slate-400">
                    Tidak ada data riwayat presensi yang sesuai filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
