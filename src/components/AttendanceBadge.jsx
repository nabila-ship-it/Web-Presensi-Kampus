import React from 'react'

export default function AttendanceBadge({ status }) {
  const getBadgeStyle = () => {
    switch (status?.toLowerCase()) {
      case 'hadir':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200'
      case 'terlambat':
        return 'bg-amber-50 text-amber-700 border-amber-200'
      case 'izin':
        return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'sakit':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200'
      case 'alpa':
        return 'bg-rose-50 text-rose-700 border-rose-200'
      case 'belum_presensi':
      case 'belum presensi':
        return 'bg-slate-100 text-slate-700 border-slate-200'
      default:
        return 'bg-slate-50 text-slate-600 border-slate-200'
    }
  }

  const getLabel = () => {
    switch (status?.toLowerCase()) {
      case 'hadir':
        return 'Hadir'
      case 'terlambat':
        return 'Terlambat'
      case 'izin':
        return 'Izin'
      case 'sakit':
        return 'Sakit'
      case 'alpa':
        return 'Alpa'
      case 'belum_presensi':
      case 'belum presensi':
        return 'Belum Presensi'
      default:
        return status || 'Belum Presensi'
    }
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full border shadow-2xs transition-colors ${getBadgeStyle()}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
      {getLabel()}
    </span>
  )
}
