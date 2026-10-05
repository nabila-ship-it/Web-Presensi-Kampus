import { initLocalStorageData } from '../lib/mockData'

initLocalStorageData()

// --- MAHASISWA CRUD ---
export const getMahasiswaList = () => {
  const profiles = JSON.parse(localStorage.getItem('sk_profiles') || '[]')
  const mahasiswas = JSON.parse(localStorage.getItem('sk_mahasiswa') || '[]')
  const kelass = JSON.parse(localStorage.getItem('sk_kelas') || '[]')

  return mahasiswas.map((m) => {
    const prof = profiles.find((p) => p.id === m.profile_id) || {}
    const kls = kelass.find((k) => k.id === m.kelas_id) || {}
    return {
      id: m.id,
      profile_id: m.profile_id,
      nim: m.nim,
      nama: prof.nama || 'Tanpa Nama',
      email: prof.email || '-',
      kelas: kls.nama_kelas || 'Belum set',
      kelas_id: m.kelas_id,
      program_studi: m.program_studi,
      angkatan: m.angkatan,
      foto_url: prof.foto_url,
    }
  })
}

export const saveMahasiswa = (data) => {
  const profiles = JSON.parse(localStorage.getItem('sk_profiles') || '[]')
  const mahasiswas = JSON.parse(localStorage.getItem('sk_mahasiswa') || '[]')

  if (data.id) {
    // Edit
    const mIdx = mahasiswas.findIndex((m) => m.id === data.id)
    if (mIdx !== -1) {
      mahasiswas[mIdx] = {
        ...mahasiswas[mIdx],
        nim: data.nim,
        kelas_id: data.kelas_id,
        program_studi: data.program_studi,
        angkatan: data.angkatan,
      }
      const pIdx = profiles.findIndex((p) => p.id === mahasiswas[mIdx].profile_id)
      if (pIdx !== -1) {
        profiles[pIdx].nama = data.nama
        profiles[pIdx].email = data.email
      }
    }
  } else {
    // Add new
    const newProfileId = `user-mhs-${Date.now()}`
    const newMhsId = `mhs-${Date.now()}`

    profiles.push({
      id: newProfileId,
      nama: data.nama,
      email: data.email,
      password: data.password || 'password123',
      role: 'mahasiswa',
      foto_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      created_at: new Date().toISOString(),
    })

    mahasiswas.push({
      id: newMhsId,
      profile_id: newProfileId,
      nim: data.nim,
      kelas_id: data.kelas_id,
      program_studi: data.program_studi || 'Sistem Informasi',
      angkatan: data.angkatan || '2024',
    })
  }

  localStorage.setItem('sk_profiles', JSON.stringify(profiles))
  localStorage.setItem('sk_mahasiswa', JSON.stringify(mahasiswas))
  return { success: true }
}

export const deleteMahasiswa = (id) => {
  let mahasiswas = JSON.parse(localStorage.getItem('sk_mahasiswa') || '[]')
  let profiles = JSON.parse(localStorage.getItem('sk_profiles') || '[]')

  const target = mahasiswas.find((m) => m.id === id)
  if (target) {
    mahasiswas = mahasiswas.filter((m) => m.id !== id)
    profiles = profiles.filter((p) => p.id !== target.profile_id)

    localStorage.setItem('sk_mahasiswa', JSON.stringify(mahasiswas))
    localStorage.setItem('sk_profiles', JSON.stringify(profiles))
  }
  return { success: true }
}

// --- DOSEN CRUD ---
export const getDosenList = () => {
  const profiles = JSON.parse(localStorage.getItem('sk_profiles') || '[]')
  const dosens = JSON.parse(localStorage.getItem('sk_dosen') || '[]')

  return dosens.map((d) => {
    const prof = profiles.find((p) => p.id === d.profile_id) || {}
    return {
      id: d.id,
      profile_id: d.profile_id,
      nip: d.nip,
      nama: prof.nama || 'Tanpa Nama',
      email: prof.email || '-',
      foto_url: prof.foto_url,
    }
  })
}

export const saveDosen = (data) => {
  const profiles = JSON.parse(localStorage.getItem('sk_profiles') || '[]')
  const dosens = JSON.parse(localStorage.getItem('sk_dosen') || '[]')

  if (data.id) {
    const dIdx = dosens.findIndex((d) => d.id === data.id)
    if (dIdx !== -1) {
      dosens[dIdx].nip = data.nip
      const pIdx = profiles.findIndex((p) => p.id === dosens[dIdx].profile_id)
      if (pIdx !== -1) {
        profiles[pIdx].nama = data.nama
        profiles[pIdx].email = data.email
      }
    }
  } else {
    const newProfileId = `user-dsn-${Date.now()}`
    const newDsnId = `dsn-${Date.now()}`

    profiles.push({
      id: newProfileId,
      nama: data.nama,
      email: data.email,
      password: data.password || 'password123',
      role: 'dosen',
      foto_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
      created_at: new Date().toISOString(),
    })

    dosens.push({
      id: newDsnId,
      profile_id: newProfileId,
      nip: data.nip,
    })
  }

  localStorage.setItem('sk_profiles', JSON.stringify(profiles))
  localStorage.setItem('sk_dosen', JSON.stringify(dosens))
  return { success: true }
}

export const deleteDosen = (id) => {
  let dosens = JSON.parse(localStorage.getItem('sk_dosen') || '[]')
  let profiles = JSON.parse(localStorage.getItem('sk_profiles') || '[]')

  const target = dosens.find((d) => d.id === id)
  if (target) {
    dosens = dosens.filter((d) => d.id !== id)
    profiles = profiles.filter((p) => p.id !== target.profile_id)

    localStorage.setItem('sk_dosen', JSON.stringify(dosens))
    localStorage.setItem('sk_profiles', JSON.stringify(profiles))
  }
  return { success: true }
}

// --- MATA KULIAH CRUD ---
export const getMataKuliahList = () => {
  return JSON.parse(localStorage.getItem('sk_mata_kuliah') || '[]').filter((m) => m && m.id !== '')
}

export const saveMataKuliah = (data) => {
  let mkList = JSON.parse(localStorage.getItem('sk_mata_kuliah') || '[]').filter((m) => m && m.id !== '')

  if (data.id) {
    const idx = mkList.findIndex((m) => String(m.id) === String(data.id))
    if (idx !== -1) {
      mkList[idx] = {
        id: data.id,
        kode: data.kode,
        nama: data.nama,
        sks: Number(data.sks),
        semester: Number(data.semester),
      }
    }
  } else {
    mkList.push({
      id: `mk-${Date.now()}`,
      kode: data.kode,
      nama: data.nama,
      sks: Number(data.sks),
      semester: Number(data.semester),
    })
  }

  localStorage.setItem('sk_mata_kuliah', JSON.stringify(mkList))
  return { success: true }
}

export const deleteMataKuliah = (id) => {
  let mkList = JSON.parse(localStorage.getItem('sk_mata_kuliah') || '[]')
  mkList = mkList.filter((m) => String(m.id) !== String(id))
  localStorage.setItem('sk_mata_kuliah', JSON.stringify(mkList))
  return { success: true }
}

// --- KELAS CRUD ---
export const getKelasList = () => {
  return JSON.parse(localStorage.getItem('sk_kelas') || '[]').filter((k) => k && k.id !== '')
}

export const saveKelas = (data) => {
  let kelass = JSON.parse(localStorage.getItem('sk_kelas') || '[]').filter((k) => k && k.id !== '')
  if (data.id) {
    const idx = kelass.findIndex((k) => String(k.id) === String(data.id))
    if (idx !== -1) {
      kelass[idx] = {
        id: data.id,
        nama_kelas: data.nama_kelas,
        program_studi: data.program_studi,
        angkatan: data.angkatan,
      }
    }
  } else {
    kelass.push({
      id: `kls-${Date.now()}`,
      nama_kelas: data.nama_kelas,
      program_studi: data.program_studi,
      angkatan: data.angkatan,
    })
  }
  localStorage.setItem('sk_kelas', JSON.stringify(kelass))
  return { success: true }
}

export const deleteKelas = (id) => {
  let kelass = JSON.parse(localStorage.getItem('sk_kelas') || '[]')
  kelass = kelass.filter((k) => String(k.id) !== String(id))
  localStorage.setItem('sk_kelas', JSON.stringify(kelass))
  return { success: true }
}

// --- JADWAL CRUD ---
export const getJadwalList = () => {
  const jadwals = JSON.parse(localStorage.getItem('sk_jadwal') || '[]').filter((j) => j && j.id !== '')
  const mataKuliahs = JSON.parse(localStorage.getItem('sk_mata_kuliah') || '[]')
  const dosens = getDosenList()
  const kelass = getKelasList()

  return jadwals.map((j) => {
    const mk = mataKuliahs.find((m) => String(m.id) === String(j.mata_kuliah_id)) || {}
    const dsn = dosens.find((d) => String(d.id) === String(j.dosen_id)) || {}
    const kls = kelass.find((k) => String(k.id) === String(j.kelas_id)) || {}

    return {
      id: j.id,
      mata_kuliah_id: j.mata_kuliah_id,
      dosen_id: j.dosen_id,
      kelas_id: j.kelas_id,
      mataKuliah: mk.nama || 'Mata Kuliah',
      dosen: dsn.nama || 'Dosen',
      kelas: kls.nama_kelas || 'Kelas',
      hari: j.hari,
      jam_mulai: j.jam_mulai,
      jam_selesai: j.jam_selesai,
      jam: `${j.jam_mulai} - ${j.jam_selesai}`,
      ruangan: j.ruangan,
      kategori: j.kategori || 'Kelas / Teori',
    }
  })
}

export const saveJadwal = (data) => {
  let jadwals = JSON.parse(localStorage.getItem('sk_jadwal') || '[]').filter((j) => j && j.id !== '')
  if (data.id) {
    const idx = jadwals.findIndex((j) => String(j.id) === String(data.id))
    if (idx !== -1) {
      jadwals[idx] = {
        id: data.id,
        mata_kuliah_id: data.mata_kuliah_id,
        dosen_id: data.dosen_id,
        kelas_id: data.kelas_id,
        hari: data.hari,
        jam_mulai: data.jam_mulai,
        jam_selesai: data.jam_selesai,
        ruangan: data.ruangan,
        kategori: data.kategori || 'Kelas / Teori',
      }
    }
  } else {
    jadwals.push({
      id: `jdw-${Date.now()}`,
      mata_kuliah_id: data.mata_kuliah_id,
      dosen_id: data.dosen_id,
      kelas_id: data.kelas_id,
      hari: data.hari,
      jam_mulai: data.jam_mulai,
      jam_selesai: data.jam_selesai,
      ruangan: data.ruangan,
      kategori: data.kategori || 'Kelas / Teori',
    })
  }
  localStorage.setItem('sk_jadwal', JSON.stringify(jadwals))
  return { success: true }
}

export const deleteJadwal = (id) => {
  let jadwals = JSON.parse(localStorage.getItem('sk_jadwal') || '[]')
  jadwals = jadwals.filter((j) => String(j.id) !== String(id))
  localStorage.setItem('sk_jadwal', JSON.stringify(jadwals))
  return { success: true }
}
