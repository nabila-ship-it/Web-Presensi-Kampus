import { initLocalStorageData } from '../lib/mockData'

initLocalStorageData()

export const getMahasiswaAttendanceData = (profileId) => {
  const profiles = JSON.parse(localStorage.getItem('sk_profiles') || '[]')
  const mahasiswas = JSON.parse(localStorage.getItem('sk_mahasiswa') || '[]')
  const presensis = JSON.parse(localStorage.getItem('sk_presensi') || '[]')
  const pertemuans = JSON.parse(localStorage.getItem('sk_pertemuan') || '[]')
  const jadwals = JSON.parse(localStorage.getItem('sk_jadwal') || '[]')
  const mataKuliahs = JSON.parse(localStorage.getItem('sk_mata_kuliah') || '[]')
  const dosens = JSON.parse(localStorage.getItem('sk_dosen') || '[]')

  // Find student profile
  const mhs = mahasiswas.find((m) => m.profile_id === profileId) || mahasiswas[0]

  // Filter attendance records for this student
  const studentRecords = presensis.filter((p) => p.mahasiswa_id === mhs.id)

  const formattedHistory = studentRecords.map((rec) => {
    const ptm = pertemuans.find((p) => p.id === rec.pertemuan_id) || {}
    const jdw = jadwals.find((j) => j.id === ptm.jadwal_id) || {}
    const mk = mataKuliahs.find((m) => m.id === jdw.mata_kuliah_id) || {}
    const dsn = dosens.find((d) => d.id === jdw.dosen_id) || {}
    const dsnProfile = profiles.find((pr) => pr.id === dsn.profile_id) || {}

    return {
      id: rec.id,
      pertemuan_id: rec.pertemuan_id,
      tanggal: ptm.tanggal || '2026-10-05',
      mataKuliah: mk.nama || 'Mata Kuliah',
      kodeMk: mk.kode || 'MK',
      sks: mk.sks || 3,
      dosen: dsnProfile.nama || 'Dosen Pengampu',
      pertemuanKe: ptm.pertemuan_ke || 1,
      status: rec.status,
      waktuPresensi: rec.waktu_presensi ? new Date(rec.waktu_presensi).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : '-',
      ruangan: jdw.ruangan || 'Lab 1',
      jam: `${jdw.jam_mulai || '08:00'} - ${jdw.jam_selesai || '09:40'}`,
    }
  })

  // Calculate statistics
  const totalHadir = studentRecords.filter((r) => r.status === 'hadir').length
  const totalTerlambat = studentRecords.filter((r) => r.status === 'terlambat').length
  const totalIzin = studentRecords.filter((r) => r.status === 'izin').length
  const totalSakit = studentRecords.filter((r) => r.status === 'sakit').length
  const totalAlpa = studentRecords.filter((r) => r.status === 'alpa').length
  const totalPertemuan = studentRecords.length || 1

  const percentHadir = Math.round(((totalHadir + totalTerlambat) / totalPertemuan) * 100)

  return {
    mahasiswa: mhs,
    history: formattedHistory,
    stats: {
      totalHadir,
      totalTerlambat,
      totalIzin,
      totalSakit,
      totalAlpa,
      totalPertemuan,
      percentHadir,
    },
  }
}

export const submitPresensiMahasiswa = (profileId, pertemuanId, status = 'hadir', keterangan = 'Presensi Mandiri') => {
  const mahasiswas = JSON.parse(localStorage.getItem('sk_mahasiswa') || '[]')
  const presensis = JSON.parse(localStorage.getItem('sk_presensi') || '[]')

  const mhs = mahasiswas.find((m) => m.profile_id === profileId) || mahasiswas[0]

  // Check if student already submitted attendance for this meeting
  const existing = presensis.find((p) => p.pertemuan_id === pertemuanId && p.mahasiswa_id === mhs.id)
  if (existing) {
    return { success: false, message: 'Anda sudah melakukan presensi pada sesi ini.' }
  }

  const newRecord = {
    id: `prs-${Date.now()}`,
    pertemuan_id: pertemuanId,
    mahasiswa_id: mhs.id,
    status: status,
    waktu_presensi: new Date().toISOString(),
    keterangan: keterangan,
    created_at: new Date().toISOString(),
  }

  presensis.push(newRecord)
  localStorage.setItem('sk_presensi', JSON.stringify(presensis))

  return { success: true, message: 'Presensi berhasil dicatat!', record: newRecord }
}

export const updatePresensiStatus = (presensiId, newStatus) => {
  const presensis = JSON.parse(localStorage.getItem('sk_presensi') || '[]')
  const index = presensis.findIndex((p) => p.id === presensiId)
  if (index !== -1) {
    presensis[index].status = newStatus
    localStorage.setItem('sk_presensi', JSON.stringify(presensis))
    return { success: true, message: 'Status presensi berhasil diperbarui.' }
  }
  return { success: false, message: 'Presensi tidak ditemukan.' }
}
