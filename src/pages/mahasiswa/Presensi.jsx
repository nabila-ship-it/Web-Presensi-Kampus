import React, { useState, useEffect } from 'react'
import { CalendarCheck, CheckCircle2, Clock, MapPin, User, BookOpen, AlertCircle, Calendar as CalendarIcon, Filter } from 'lucide-react'
import AttendanceBadge from '../../components/AttendanceBadge'
import Toast from '../../components/Toast'
import { getCurrentUser } from '../../services/authService'
import { getMahasiswaJadwal } from '../../services/jadwalService'
import { getMahasiswaAttendanceData, submitPresensiMahasiswa } from '../../services/presensiService'

export default function MahasiswaPresensi() {
  const user = getCurrentUser()
  const [jadwal, setJadwal] = useState([])
  const [selectedJadwalId, setSelectedJadwalId] = useState('')
  const [history, setHistory] = useState([])
  const [toastMsg, setToastMsg] = useState('')

  // Determine current day & date in Indonesian real-time
  const daysMap = {
    Sunday: 'Minggu',
    Monday: 'Senin',
    Tuesday: 'Selasa',
    Wednesday: 'Rabu',
    Thursday: 'Kamis',
    Friday: 'Jumat',
    Saturday: 'Sabtu',
  }
  const currentDayEn = new Date().toLocaleDateString('en-US', { weekday: 'long' })
  const todayHari = daysMap[currentDayEn] || 'Senin'

  const todayDateStr = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  // 'hari_ini' (filter today's day) or 'semua' (show all days)
  const [selectedHariFilter, setSelectedHariFilter] = useState('hari_ini')

  const loadData = () => {
    if (!user) return
    const jList = getMahasiswaJadwal(user.id)
    setJadwal(jList)

    // Filter list by selected day mode
    const todaySchedules = jList.filter((j) => j.hari.toLowerCase() === todayHari.toLowerCase())
    if (todaySchedules.length > 0) {
      setSelectedJadwalId(todaySchedules[0].id)
    } else if (jList.length > 0) {
      setSelectedJadwalId(jList[0].id)
    }

    const att = getMahasiswaAttendanceData(user.id)
    setHistory(att.history)
  }

  useEffect(() => {
    loadData()
  }, [])

  // Filter schedules based on real-time day mode
  const availableSchedules = jadwal.filter((j) => {
    if (selectedHariFilter === 'hari_ini') {
      return j.hari.toLowerCase() === todayHari.toLowerCase()
    }
    return true
  })

  const selectedClass = availableSchedules.find((j) => j.id === selectedJadwalId) || availableSchedules[0] || jadwal[0]

  const handleTakePresensi = () => {
    if (!selectedClass || !selectedClass.activePertemuanId) {
      setToastMsg('Tidak ada sesi presensi aktif untuk mata kuliah ini.')
      return
    }

    const res = submitPresensiMahasiswa(
      user.id,
      selectedClass.activePertemuanId,
      'hadir',
      'Presensi Mandiri Real-Time'
    )

    if (res.success) {
      setToastMsg('Presensi berhasil dicatat secara real-time!')
      loadData()
    } else {
      setToastMsg(res.message)
    }
  }

  return (
    <div className="space-y-6">
      <Toast message={toastMsg} onClose={() => setToastMsg('')} />

      {/* Page Header with Real-Time Date Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <CalendarCheck className="w-5 h-5 text-blue-600" />
            <span>Presensi Kuliah Real-Time</span>
          </h1>
          <p className="text-xs font-medium text-slate-500 mt-1">
            Sesi presensi aktif otomatis menyesuaikan dengan jadwal perkuliahan hari ini.
          </p>
        </div>

        {/* Real-time date pill */}
        <div className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 flex items-center gap-2 self-start sm:self-auto">
          <CalendarIcon className="w-4 h-4 text-blue-200" />
          <span>{todayDateStr}</span>
        </div>
      </div>

      {/* Real-time Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
          <Filter className="w-4 h-4 text-blue-600" />
          <span>Tampilkan Sesi:</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setSelectedHariFilter('hari_ini')
              const todayList = jadwal.filter((j) => j.hari.toLowerCase() === todayHari.toLowerCase())
              if (todayList.length > 0) setSelectedJadwalId(todayList[0].id)
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              selectedHariFilter === 'hari_ini'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Hari Ini ({todayHari})</span>
          </button>

          <button
            onClick={() => setSelectedHariFilter('semua')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedHariFilter === 'semua'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Semua Hari
          </button>
        </div>
      </div>

      {/* Main Form Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-5">
          {availableSchedules.length === 0 ? (
            <div className="p-8 text-center space-y-3">
              <AlertCircle className="w-10 h-10 text-amber-500 mx-auto" />
              <h3 className="text-sm font-bold text-slate-800">Tidak Ada Jadwal Presensi Hari Ini ({todayHari})</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Hari ini ({todayHari}) tidak ada jadwal perkuliahan yang terjadwal untuk Anda. Anda bisa melihat jadwal di hari lain.
              </p>
              <button
                onClick={() => setSelectedHariFilter('semua')}
                className="px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 font-bold text-xs rounded-xl transition-colors"
              >
                Tampilkan Semua Hari
              </button>
            </div>
          ) : (
            <>
              {/* Select Subject */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
                  Pilih Mata Kuliah ({selectedHariFilter === 'hari_ini' ? `Sesi Hari Ini - ${todayHari}` : 'Semua Sesi'})
                </label>
                <select
                  value={selectedJadwalId}
                  onChange={(e) => setSelectedJadwalId(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:border-blue-600 focus:outline-none transition-all"
                >
                  {availableSchedules.map((j) => (
                    <option key={j.id} value={j.id}>
                      {j.mataKuliah} ({j.kodeMk}) - {j.hari}, {j.jam}
                    </option>
                  ))}
                </select>
              </div>

              {/* Active Session Status Card */}
              {selectedClass && (
                <div className="bg-slate-50 rounded-xl border border-slate-200 p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-200/60 pb-3">
                    <span className="text-xs font-bold text-slate-700">Status Presensi ({selectedClass.hari})</span>
                    <AttendanceBadge status={selectedClass.statusPresensi} />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600">
                    <div className="flex items-center gap-2.5">
                      <BookOpen className="w-4 h-4 text-blue-600 shrink-0" />
                      <span>
                        <strong>Mata Kuliah:</strong> {selectedClass.mataKuliah}
                      </span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <User className="w-4 h-4 text-blue-600 shrink-0" />
                      <span>
                        <strong>Dosen:</strong> {selectedClass.dosen}
                      </span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Clock className="w-4 h-4 text-blue-600 shrink-0" />
                      <span>
                        <strong>Jam:</strong> {selectedClass.jam}
                      </span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
                      <span>
                        <strong>Ruangan:</strong> {selectedClass.ruangan}
                      </span>
                    </div>
                  </div>

                  {/* Attendance Button / Status State */}
                  <div className="pt-2">
                    {selectedClass.statusPresensi === 'belum_presensi' ? (
                      <button
                        onClick={handleTakePresensi}
                        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
                      >
                        <CalendarCheck className="w-4 h-4" />
                        <span>Ambil Presensi Sekarang ({todayHari})</span>
                      </button>
                    ) : selectedClass.statusPresensi === 'hadir' || selectedClass.statusPresensi === 'terlambat' ? (
                      <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 text-emerald-800 text-xs font-semibold">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                        <div>
                          <p>Sudah Presensi ({selectedClass.statusPresensi.toUpperCase()})</p>
                          <p className="text-[11px] text-emerald-600 font-normal">
                            Presensi Anda telah tersimpan secara real-time di sistem pada {todayDateStr}.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-3 text-amber-800 text-xs font-semibold">
                        <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
                        <span>Sesi presensi perkuliahan belum dibuka oleh dosen pengampu.</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Sidebar Info */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Ketentuan Presensi Real-Time</h3>
          <ul className="space-y-2.5 text-xs text-slate-600 list-disc list-inside">
            <li>Presensi disesuaikan real-time dengan hari & tanggal saat ini (<strong>{todayDateStr}</strong>).</li>
            <li>Presensi hanya dapat dilakukan pada jam sesi mata kuliah yang berlangsung.</li>
            <li>Mahasiswa tidak dapat melakukan presensi dua kali pada sesi yang sama.</li>
            <li>Keterlambatan lebih dari 15 menit akan ditandai otomatis sebagai "Terlambat".</li>
          </ul>
        </div>
      </div>

      {/* Riwayat Terakhir */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs">
        <h3 className="text-sm font-bold text-slate-900 mb-4">Riwayat Presensi Terakhir</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Tanggal</th>
                <th className="py-3 px-4">Mata Kuliah</th>
                <th className="py-3 px-4">Jam Presensi</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {history.slice(0, 5).map((row) => (
                <tr key={row.id} className="hover:bg-slate-50">
                  <td className="py-3 px-4">{row.tanggal}</td>
                  <td className="py-3 px-4 font-bold text-slate-900">{row.mataKuliah}</td>
                  <td className="py-3 px-4">{row.waktuPresensi}</td>
                  <td className="py-3 px-4">
                    <AttendanceBadge status={row.status} />
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
