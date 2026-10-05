import { initLocalStorageData } from '../lib/mockData'

initLocalStorageData()

export const getMahasiswaJadwal = (profileId) => {
  const profiles = JSON.parse(localStorage.getItem('sk_profiles') || '[]')
  const mahasiswas = JSON.parse(localStorage.getItem('sk_mahasiswa') || '[]')
  const jadwals = JSON.parse(localStorage.getItem('sk_jadwal') || '[]').filter((j) => j && j.id !== '')
  const mataKuliahs = JSON.parse(localStorage.getItem('sk_mata_kuliah') || '[]')
  const kelass = JSON.parse(localStorage.getItem('sk_kelas') || '[]')
  const dosens = JSON.parse(localStorage.getItem('sk_dosen') || '[]')
  const pertemuans = JSON.parse(localStorage.getItem('sk_pertemuan') || '[]')
  const presensis = JSON.parse(localStorage.getItem('sk_presensi') || '[]')

  const mhs = mahasiswas.find((m) => String(m.profile_id) === String(profileId)) || mahasiswas[0]

  // Return ALL schedules so student can view, select, and manage any course schedule across all classes/angkatans
  const formattedJadwal = jadwals.map((jdw) => {
    const mk = mataKuliahs.find((m) => String(m.id) === String(jdw.mata_kuliah_id)) || {}
    const dsn = dosens.find((d) => String(d.id) === String(jdw.dosen_id)) || {}
    const dsnProfile = profiles.find((pr) => String(pr.id) === String(dsn.profile_id)) || {}
    const kls = kelass.find((k) => String(k.id) === String(jdw.kelas_id)) || {}

    // Active meeting today
    const activePtm = pertemuans.find((p) => String(p.jadwal_id) === String(jdw.id) && p.status === 'aktif')
    
    // Student attendance record for this active meeting
    let myPresensi = null
    if (activePtm && mhs) {
      myPresensi = presensis.find((p) => String(p.pertemuan_id) === String(activePtm.id) && String(p.mahasiswa_id) === String(mhs.id))
    }

    return {
      id: jdw.id,
      mata_kuliah_id: jdw.mata_kuliah_id,
      dosen_id: jdw.dosen_id,
      kelas_id: jdw.kelas_id,
      mataKuliah: mk.nama || 'Mata Kuliah',
      kodeMk: mk.kode || 'MK-001',
      sks: mk.sks || 3,
      dosen: dsnProfile.nama || 'Dosen Pengampu',
      kelas: kls.nama_kelas || 'SI24A',
      hari: jdw.hari,
      jamMulai: jdw.jam_mulai,
      jamSelesai: jdw.jam_selesai,
      jam: `${jdw.jam_mulai} - ${jdw.jam_selesai}`,
      ruangan: jdw.ruangan,
      kategori: jdw.kategori || 'Kelas / Teori',
      activePertemuanId: activePtm?.id || null,
      pertemuanKe: activePtm?.pertemuan_ke || 8,
      statusPresensi: myPresensi ? myPresensi.status : activePtm ? 'belum_presensi' : 'tidak_ada_sesi',
      waktuPresensi: myPresensi?.waktu_presensi || null,
    }
  })

  return formattedJadwal
}

export const getDosenJadwal = (profileId) => {
  const profiles = JSON.parse(localStorage.getItem('sk_profiles') || '[]')
  const dosens = JSON.parse(localStorage.getItem('sk_dosen') || '[]')
  const jadwals = JSON.parse(localStorage.getItem('sk_jadwal') || '[]').filter((j) => j && j.id !== '')
  const mataKuliahs = JSON.parse(localStorage.getItem('sk_mata_kuliah') || '[]')
  const kelass = JSON.parse(localStorage.getItem('sk_kelas') || '[]')
  const mahasiswas = JSON.parse(localStorage.getItem('sk_mahasiswa') || '[]')

  const dsn = dosens.find((d) => String(d.profile_id) === String(profileId)) || dosens[0]
  const dsnProfile = profiles.find((p) => String(p.id) === String(dsn.profile_id)) || {}

  return jadwals.map((jdw) => {
    const mk = mataKuliahs.find((m) => String(m.id) === String(jdw.mata_kuliah_id)) || {}
    const kls = kelass.find((k) => String(k.id) === String(jdw.kelas_id)) || {}
    const totalMhs = mahasiswas.filter((m) => String(m.kelas_id) === String(jdw.kelas_id)).length

    return {
      id: jdw.id,
      mata_kuliah_id: jdw.mata_kuliah_id,
      dosen_id: jdw.dosen_id,
      kelas_id: jdw.kelas_id,
      mataKuliah: mk.nama || 'Mata Kuliah',
      kodeMk: mk.kode,
      sks: mk.sks,
      kelas: kls.nama_kelas || 'Kelas',
      kelasId: kls.id,
      dosenNama: dsnProfile.nama,
      hari: jdw.hari,
      jamMulai: jdw.jam_mulai,
      jamSelesai: jdw.jam_selesai,
      jam: `${jdw.jam_mulai} - ${jdw.jam_selesai}`,
      ruangan: jdw.ruangan,
      totalMahasiswa: totalMhs || 32,
    }
  })
}
