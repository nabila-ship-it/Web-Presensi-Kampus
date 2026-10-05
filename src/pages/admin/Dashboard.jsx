import React from 'react'
import { Users, UserCheck, BookOpen, School, CalendarCheck, TrendingUp, Activity } from 'lucide-react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts'
import StatCard from '../../components/StatCard'

export default function AdminDashboard() {
  const attendanceMonthlyData = [
    { bulan: 'Agu', Hadir: 450, Terlambat: 30, Izin: 15, Sakit: 10, Alpa: 5 },
    { bulan: 'Sep', Hadir: 520, Terlambat: 40, Izin: 20, Sakit: 12, Alpa: 8 },
    { bulan: 'Okt', Hadir: 610, Terlambat: 25, Izin: 10, Sakit: 8, Alpa: 2 },
  ]

  const roleDistributionData = [
    { name: 'Mahasiswa', value: 124, color: '#3b82f6' },
    { name: 'Dosen', value: 18, color: '#10b981' },
    { name: 'Staff/Admin', value: 5, color: '#8b5cf6' },
  ]

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-blue-950 rounded-2xl p-6 sm:p-8 text-white shadow-xl">
        <span className="text-xs font-bold text-purple-300 uppercase tracking-widest bg-purple-500/20 px-3 py-1 rounded-full border border-purple-400/30">
          Dashboard Administrator
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold mt-2 tracking-tight">
          Selamat datang, Admin!
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-1">
          Kelola seluruh data sistem presensi kampus secara lengkap.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <StatCard title="Total Mahasiswa" value="124" icon={Users} color="blue" />
        <StatCard title="Total Dosen" value="18" icon={UserCheck} color="emerald" />
        <StatCard title="Total Matkul" value="24" icon={BookOpen} color="amber" />
        <StatCard title="Total Kelas" value="8" icon={School} color="purple" />
        <StatCard title="Total Presensi" value="645" icon={CalendarCheck} color="indigo" />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attendance Trends Bar Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs">
          <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-600" />
            <span>Statistik Kehadiran Kampus (Bulanan)</span>
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attendanceMonthlyData}>
                <XAxis dataKey="bulan" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="Hadir" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Terlambat" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Izin" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Alpa" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* User Distribution Pie Chart */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs">
          <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
            <Activity className="w-4 h-4 text-purple-600" />
            <span>Distribusi Pengguna Kampus</span>
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={roleDistributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {roleDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend iconSize={8} wrapperStyle={{ fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}
