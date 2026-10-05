import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { BookOpen, Users, School, Calendar, ArrowRight, Clock, CheckCircle2 } from 'lucide-react'
import StatCard from '../../components/StatCard'
import { getCurrentUser } from '../../services/authService'
import { getDosenJadwal } from '../../services/jadwalService'

export default function DosenDashboard() {
  const user = getCurrentUser()
  const navigate = useNavigate()
  const [schedules, setSchedules] = useState([])

  useEffect(() => {
    if (!user) return
    const data = getDosenJadwal(user.id)
    setSchedules(data)
  }, [])

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-slate-900 to-indigo-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl">
        <span className="text-xs font-bold text-blue-300 uppercase tracking-widest bg-blue-500/20 px-3 py-1 rounded-full border border-blue-400/30">
          Dashboard Dosen
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold mt-2 tracking-tight">
          Selamat datang, {user?.nama || 'Dr. Andi Pratama, S.Kom., M.Kom.'}!
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-1">
          Kelola kehadiran mahasiswa dan jadwal mengajar Anda dengan mudah.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Mata Kuliah" value={schedules.length || 2} subtext="Semester Ini" icon={BookOpen} color="blue" />
        <StatCard title="Total Kelas" value="3" subtext="SI24A, SI24B, IF24A" icon={School} color="emerald" />
        <StatCard title="Total Mahasiswa" value="32" subtext="Dalam Semua Kelas" icon={Users} color="purple" />
        <StatCard title="Presensi Hari Ini" value="28 / 32" subtext="Mahasiswa Hadir" icon={CheckCircle2} color="amber" />
      </div>

      {/* Class List Section */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-600" />
            <span>Mata Kuliah Yang Diajar</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {schedules.map((item) => (
            <div
              key={item.id}
              className="bg-slate-50 rounded-xl border border-slate-200 p-5 space-y-4 hover:border-blue-300 transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded-md">
                  Kelas {item.kelas}
                </span>
                <span className="text-xs font-mono text-slate-400">{item.kodeMk}</span>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900">{item.mataKuliah}</h3>
                <div className="mt-2 space-y-1 text-xs text-slate-600 font-medium">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{item.hari}, {item.jam}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{item.ruangan}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => navigate(`/dosen/kelas?id=${item.id}`)}
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2"
              >
                <span>Lihat Kelas & Presensi</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
