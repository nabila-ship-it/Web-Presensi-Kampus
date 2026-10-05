import React, { useState, useEffect } from 'react'
import { FileSpreadsheet, PieChart as PieIcon, BarChart2, TrendingUp, Download } from 'lucide-react'
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
import { getMahasiswaList } from '../../services/adminService'

export default function DosenRekap() {
  const [rekapList, setRekapList] = useState([])

  useEffect(() => {
    const allMhs = getMahasiswaList()
    // Generate realistic statistics for class summary demo
    const formatted = allMhs.map((m, idx) => {
      const hadir = 12 - (idx % 3)
      const terlambat = idx % 2
      const izin = idx === 4 ? 1 : 0
      const sakit = idx === 3 ? 1 : 0
      const alpa = 0
      const total = 14
      const percent = Math.round(((hadir + terlambat) / total) * 100)

      return {
        id: m.id,
        nim: m.nim,
        nama: m.nama,
        hadir,
        terlambat,
        izin,
        sakit,
        alpa,
        percent,
      }
    })

    setRekapList(formatted)
  }, [])

  const handleExportExcel = () => {
    let csvContent = '\uFEFF' // UTF-8 BOM for Microsoft Excel
    csvContent += 'No,NIM,Nama Mahasiswa,Hadir,Terlambat,Izin,Sakit,Alpa,Persentase Kehadiran (%)\n'

    rekapList.forEach((item, index) => {
      const row = [
        index + 1,
        `"${item.nim}"`,
        `"${item.nama}"`,
        item.hadir,
        item.terlambat,
        item.izin,
        item.sakit,
        item.alpa,
        `"${item.percent}%"`,
      ].join(',')
      csvContent += row + '\n'
    })

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `Rekap_Presensi_Mahasiswa_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Chart dataset for Pie Chart (Overall Status Distribution)
  const pieData = [
    { name: 'Hadir', value: 48, color: '#10b981' },
    { name: 'Terlambat', value: 4, color: '#f59e0b' },
    { name: 'Izin', value: 2, color: '#3b82f6' },
    { name: 'Sakit', value: 1, color: '#6366f1' },
    { name: 'Alpa', value: 1, color: '#ef4444' },
  ]

  // Chart dataset for Bar Chart (Attendance per Student)
  const barData = rekapList.map((item) => ({
    nama: item.nama.split(' ')[0],
    Hadir: item.hadir,
    Terlambat: item.terlambat,
    Absen: item.izin + item.sakit + item.alpa,
  }))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-blue-600" />
            <span>Rekap Kehadiran Kelas</span>
          </h1>
          <p className="text-xs font-medium text-slate-500 mt-1">
            Laporan kumulatif dan statistik presensi seluruh mahasiswa.
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

      {/* Visual Analytics Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pie Chart */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs">
          <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
            <PieIcon className="w-4 h-4 text-blue-600" />
            <span>Persentase Kehadiran Kelas</span>
          </h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend iconSize={8} wrapperStyle={{ fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs">
          <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-blue-600" />
            <span>Grafik Kehadiran Per Mahasiswa</span>
          </h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <XAxis dataKey="nama" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="Hadir" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Terlambat" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Absen" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Summary Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <th className="py-3.5 px-5">NIM</th>
                <th className="py-3.5 px-5">Nama Mahasiswa</th>
                <th className="py-3.5 px-5 text-center">Hadir</th>
                <th className="py-3.5 px-5 text-center">Terlambat</th>
                <th className="py-3.5 px-5 text-center">Izin</th>
                <th className="py-3.5 px-5 text-center">Sakit</th>
                <th className="py-3.5 px-5 text-center">Alpa</th>
                <th className="py-3.5 px-5 text-center">% Kehadiran</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {rekapList.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50">
                  <td className="py-3.5 px-5 font-mono font-bold text-slate-900">{item.nim}</td>
                  <td className="py-3.5 px-5 font-bold text-slate-900">{item.nama}</td>
                  <td className="py-3.5 px-5 text-center font-bold text-emerald-600">{item.hadir}</td>
                  <td className="py-3.5 px-5 text-center font-bold text-amber-600">{item.terlambat}</td>
                  <td className="py-3.5 px-5 text-center font-bold text-blue-600">{item.izin}</td>
                  <td className="py-3.5 px-5 text-center font-bold text-indigo-600">{item.sakit}</td>
                  <td className="py-3.5 px-5 text-center font-bold text-rose-600">{item.alpa}</td>
                  <td className="py-3.5 px-5 text-center">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold ${
                        item.percent >= 80
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {item.percent}%
                    </span>
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
