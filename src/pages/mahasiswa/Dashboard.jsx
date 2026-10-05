import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CalendarCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  Calendar,
  ArrowRight,
  TrendingUp,
} from 'lucide-react'
import StatCard from '../../components/StatCard'
import AttendanceBadge from '../../components/AttendanceBadge'
import Toast from '../../components/Toast'
import { getCurrentUser } from '../../services/authService'
import { getMahasiswaAttendanceData, submitPresensiMahasiswa } from '../../services/presensiService'
import { getMahasiswaJadwal } from '../../services/jadwalService'

export default function MahasiswaDashboard() {
  const user = getCurrentUser()
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [jadwal, setJadwal] = useState([])
  const [toastMsg, setToastMsg] = useState('')

  const refreshData = () => {
    if (!user) return
    const attData = getMahasiswaAttendanceData(user.id)
    const jdwData = getMahasiswaJadwal(user.id)
    setData(attData)
    setJadwal(jdwData)
  }

  useEffect(() => {
    refreshData()
  }, [])

  const handleTakePresensi = (pertemuanId) => {
    if (!pertemuanId) return
    const res = submitPresensiMahasiswa(user.id, pertemuanId, 'hadir', 'Presensi Mandiri via Dashboard')
    if (res.success) {
      setToastMsg('Presensi berhasil dicatat!')
      refreshData()
    } else {
      setToastMsg(res.message)
    }
  }

  const todaySession = jadwal.find((j) => j.statusPresensi === 'belum_presensi')

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      <Toast message={toastMsg} onClose={() => setToastMsg('')} />

      {/* Welcome Banner Header */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-blue-300 uppercase tracking-widest bg-blue-500/20 px-3 py-1 rounded-full border border-blue-400/30">
              Dashboard Mahasiswa
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold mt-2 tracking-tight">
              Selamat datang, {user?.nama || 'Dwi Cahyo Kuncoro'}!
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              Semangat kuliah dan jangan lupa lakukan presensi tepat waktu hari ini.
            </p>
          </div>
          <button
            onClick={() => navigate('/mahasiswa/presensi')}
            className="self-start md:self-auto px-5 py-2.5 bg-blue-500 hover:bg-blue-400 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-500/30 flex items-center gap-2 transition-all"
          >
            <CalendarCheck className="w-4 h-4" />
            <span>Halaman Presensi</span>
          </button>
        </div>
      </div>

      {/* Statistical Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Persentase Kehadiran"
          value={`${data?.stats?.percentHadir || 92}%`}
          subtext={`${data?.stats?.totalHadir || 11} dari ${data?.stats?.totalPertemuan || 12} pertemuan`}
          icon={TrendingUp}
          color="emerald"
        />
        <StatCard
          title="Hadir Tepat Waktu"
          value={data?.stats?.totalHadir || 11}
          subtext="pertemuan"
          icon={CheckCircle2}
          color="blue"
        />
        <StatCard
          title="Terlambat"
          value={data?.stats?.totalTerlambat || 1}
          subtext="pertemuan"
          icon={Clock}
          color="amber"
        />
        <StatCard
          title="Tidak Hadir"
          value={(data?.stats?.totalIzin || 0) + (data?.stats?.totalSakit || 0) + (data?.stats?.totalAlpa || 0)}
          subtext="Izin / Sakit / Alpa"
          icon={XCircle}
          color="rose"
        />
      </div>

      {/* Main Grid: Active Session & Today's Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sesi Presensi Hari Ini */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <CalendarCheck className="w-4 h-4 text-blue-600" />
              <span>Sesi Presensi Hari Ini</span>
            </h2>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
          </div>

          {todaySession ? (
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200/70 rounded-xl p-5 space-y-4">
              <div>
                <span className="text-[11px] font-bold text-blue-700 bg-blue-100 px-2.5 py-0.5 rounded-md uppercase">
                  {todaySession.kodeMk}
                </span>
                <h3 className="text-base font-extrabold text-slate-900 mt-2">
                  {todaySession.mataKuliah}
                </h3>
                <p className="text-xs font-semibold text-slate-600 mt-0.5">
                  Dosen: {todaySession.dosen}
                </p>
              </div>

              <div className="space-y-1.5 text-xs text-slate-600 font-medium">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span>{todaySession.jam}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span>{todaySession.ruangan}</span>
                </div>
              </div>

              <button
                onClick={() => handleTakePresensi(todaySession.activePertemuanId)}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
              >
                <span>Presensi Sekarang</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="bg-slate-50 border border-dashed border-slate-200 rounded-xl p-8 text-center space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
              <h3 className="text-sm font-bold text-slate-800">Semua Presensi Selesai!</h3>
              <p className="text-xs text-slate-500">
                Tidak ada sesi presensi aktif yang memerlukan tindakan Anda saat ini.
              </p>
            </div>
          )}
        </div>

        {/* Jadwal Kuliah Hari Ini */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-600" />
              <span>Jadwal Kuliah Hari Ini</span>
            </h2>
            <button
              onClick={() => navigate('/mahasiswa/jadwal')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700"
            >
              Lihat Semua →
            </button>
          </div>

          <div className="space-y-3">
            {jadwal.map((j) => (
              <div
                key={j.id}
                className="flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100/80 rounded-xl border border-slate-200/60 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="px-3 py-2 bg-white rounded-lg border border-slate-200 text-center min-w-[90px]">
                    <span className="block text-xs font-bold text-slate-800">{j.jamMulai}</span>
                    <span className="block text-[10px] text-slate-400">{j.jamSelesai}</span>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{j.mataKuliah}</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {j.ruangan} • {j.dosen}
                    </p>
                  </div>
                </div>
                <div>
                  <AttendanceBadge status={j.statusPresensi} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
