// Initial seed dataset matching multi-class academic reference schedule

export const INITIAL_PROFILES = [
  {
    id: 'user-mhs-1',
    nama: 'Nabila',
    email: 'mahasiswa@kampus.ac.id',
    role: 'mahasiswa',
    foto_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    created_at: '2026-01-10T08:00:00Z',
  },
  {
    id: 'user-mhs-2',
    nama: 'Ahmad Fauzi',
    email: 'ahmad@kampus.ac.id',
    role: 'mahasiswa',
    foto_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    created_at: '2026-01-10T08:00:00Z',
  },
  {
    id: 'user-mhs-3',
    nama: 'Siti Nurhaliza',
    email: 'siti@kampus.ac.id',
    role: 'mahasiswa',
    foto_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    created_at: '2026-01-10T08:00:00Z',
  },
  {
    id: 'user-mhs-4',
    nama: 'Raka Pratama',
    email: 'raka@kampus.ac.id',
    role: 'mahasiswa',
    foto_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    created_at: '2026-01-10T08:00:00Z',
  },
  {
    id: 'user-mhs-5',
    nama: 'Dewi Lestari',
    email: 'dewi@kampus.ac.id',
    role: 'mahasiswa',
    foto_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    created_at: '2026-01-10T08:00:00Z',
  },
  {
    id: 'user-dsn-1',
    nama: 'Dr. Rusliyawati, S.Kom., M.T.I',
    email: 'rusliyawati@kampus.ac.id',
    role: 'dosen',
    foto_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    created_at: '2026-01-05T08:00:00Z',
  },
  {
    id: 'user-dsn-2',
    nama: 'Budi Santoso, S.Kom',
    email: 'budi.dosen@kampus.ac.id',
    role: 'dosen',
    foto_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    created_at: '2026-01-05T08:00:00Z',
  },
  {
    id: 'user-dsn-3',
    nama: 'Fadila Shely Amalia, S.Kom',
    email: 'fadila@kampus.ac.id',
    role: 'dosen',
    foto_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150',
    created_at: '2026-01-05T08:00:00Z',
  },
  {
    id: 'user-dsn-4',
    nama: 'Dr. Zaenal Abidin, S.Si., S.Kom., M.T.',
    email: 'zaenal@kampus.ac.id',
    role: 'dosen',
    foto_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    created_at: '2026-01-05T08:00:00Z',
  },
  {
    id: 'user-dsn-5',
    nama: 'Faruk Ulum, S.T., M.T.I',
    email: 'faruk@kampus.ac.id',
    role: 'dosen',
    foto_url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150',
    created_at: '2026-01-05T08:00:00Z',
  },
  {
    id: 'user-dsn-6',
    nama: 'Dr. Ediyan Redy Susanto',
    email: 'ediyan@kampus.ac.id',
    role: 'dosen',
    foto_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    created_at: '2026-01-05T08:00:00Z',
  },
  {
    id: 'user-dsn-7',
    nama: 'Susilah, S.Kom., M.Kom.',
    email: 'susilah@kampus.ac.id',
    role: 'dosen',
    foto_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
    created_at: '2026-01-05T08:00:00Z',
  },
  {
    id: 'user-dsn-8',
    nama: 'Cintiya Bella, S.M., M.SM.',
    email: 'cintiya@kampus.ac.id',
    role: 'dosen',
    foto_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    created_at: '2026-01-05T08:00:00Z',
  },
  {
    id: 'user-adm-1',
    nama: 'Administrator Kampus',
    email: 'admin@kampus.ac.id',
    role: 'admin',
    foto_url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150',
    created_at: '2026-01-01T08:00:00Z',
  }
]

export const INITIAL_KELAS = [
  { id: 'kls-1', nama_kelas: 'SI24A', program_studi: 'Sistem Informasi', angkatan: '2024' },
  { id: 'kls-2', nama_kelas: 'SI23AB', program_studi: 'Sistem Informasi', angkatan: '2023' },
  { id: 'kls-3', nama_kelas: 'SI23B', program_studi: 'Sistem Informasi', angkatan: '2023' },
  { id: 'kls-4', nama_kelas: 'SI23CDX', program_studi: 'Sistem Informasi', angkatan: '2023' },
]

export const INITIAL_MAHASISWA = [
  { id: 'mhs-1', profile_id: 'user-mhs-1', nim: '24311149', kelas_id: 'kls-1', program_studi: 'Sistem Informasi', angkatan: '2024' },
  { id: 'mhs-2', profile_id: 'user-mhs-2', nim: '22312120', kelas_id: 'kls-1', program_studi: 'Sistem Informasi', angkatan: '2024' },
  { id: 'mhs-3', profile_id: 'user-mhs-3', nim: '22312121', kelas_id: 'kls-1', program_studi: 'Sistem Informasi', angkatan: '2024' },
  { id: 'mhs-4', profile_id: 'user-mhs-4', nim: '22312122', kelas_id: 'kls-1', program_studi: 'Sistem Informasi', angkatan: '2024' },
  { id: 'mhs-5', profile_id: 'user-mhs-5', nim: '22312123', kelas_id: 'kls-1', program_studi: 'Sistem Informasi', angkatan: '2024' },
]

export const INITIAL_DOSEN = [
  { id: 'dsn-1', profile_id: 'user-dsn-1', nip: '198503152010121001' },
  { id: 'dsn-2', profile_id: 'user-dsn-2', nip: '198807222015041002' },
  { id: 'dsn-3', profile_id: 'user-dsn-3', nip: '199011052018032003' },
  { id: 'dsn-4', profile_id: 'user-dsn-4', nip: '198204122008011004' },
  { id: 'dsn-5', profile_id: 'user-dsn-5', nip: '198706142014021005' },
  { id: 'dsn-6', profile_id: 'user-dsn-6', nip: '198309252009031006' },
  { id: 'dsn-7', profile_id: 'user-dsn-7', nip: '199102182019042007' },
  { id: 'dsn-8', profile_id: 'user-dsn-8', nip: '199308102020012008' },
]

export const INITIAL_MATA_KULIAH = [
  { id: 'mk-1', kode: 'ERP', nama: 'Enterprise Resource Planning', sks: 2, semester: 5 },
  { id: 'mk-2', kode: 'MPSI', nama: 'Manajemen Proyek Sistem Informasi', sks: 3, semester: 5 },
  { id: 'mk-3', kode: 'PW', nama: 'Pemograman Web', sks: 2, semester: 5 },
  { id: 'mk-4', kode: 'ASI', nama: 'Audit Sistem Informasi', sks: 3, semester: 5 },
  { id: 'mk-5', kode: 'JRK', nama: 'Jaringan Komputer', sks: 2, semester: 5 },
  { id: 'mk-6', kode: 'PSI', nama: 'Pengembangan Sistem Informasi', sks: 3, semester: 5 },
  { id: 'mk-7', kode: 'TISI', nama: 'Testing dan Implementasi Sistem Informasi', sks: 3, semester: 5 },
  { id: 'mk-8', kode: 'VD', nama: 'Visualisasi Data', sks: 2, semester: 5 },
  { id: 'mk-9', kode: 'TCP', nama: 'Tecnopreneurship', sks: 2, semester: 5 },
]

export const INITIAL_JADWAL = [
  // SENIN
  { id: 'jdw-1', mata_kuliah_id: 'mk-1', dosen_id: 'dsn-1', kelas_id: 'kls-1', hari: 'Senin', jam_mulai: '09:00', jam_selesai: '11:00', ruangan: 'Online', kategori: 'Online / Zoom' },
  { id: 'jdw-2', mata_kuliah_id: 'mk-2', dosen_id: 'dsn-1', kelas_id: 'kls-2', hari: 'Senin', jam_mulai: '11:00', jam_selesai: '13:00', ruangan: 'Online', kategori: 'Online / Zoom' },
  { id: 'jdw-3', mata_kuliah_id: 'mk-3', dosen_id: 'dsn-2', kelas_id: 'kls-1', hari: 'Senin', jam_mulai: '13:00', jam_selesai: '15:00', ruangan: 'LAB 4 GSG', kategori: 'Praktikum / Lab' },
  { id: 'jdw-4', mata_kuliah_id: 'mk-4', dosen_id: 'dsn-5', kelas_id: 'kls-3', hari: 'Senin', jam_mulai: '15:00', jam_selesai: '17:00', ruangan: '302 B', kategori: 'Kelas / Teori' },

  // SELASA
  { id: 'jdw-5', mata_kuliah_id: 'mk-1', dosen_id: 'dsn-1', kelas_id: 'kls-1', hari: 'Selasa', jam_mulai: '09:00', jam_selesai: '11:00', ruangan: 'LAB 1 ICT B', kategori: 'Praktikum / Lab' },
  { id: 'jdw-6', mata_kuliah_id: 'mk-5', dosen_id: 'dsn-3', kelas_id: 'kls-1', hari: 'Selasa', jam_mulai: '13:00', jam_selesai: '15:00', ruangan: 'LAB 1 ICT B', kategori: 'Praktikum / Lab' },
  { id: 'jdw-7', mata_kuliah_id: 'mk-6', dosen_id: 'dsn-6', kelas_id: 'kls-4', hari: 'Selasa', jam_mulai: '17:00', jam_selesai: '19:00', ruangan: 'LAB 5 GSG', kategori: 'Praktikum / Lab' },
  { id: 'jdw-8', mata_kuliah_id: 'mk-7', dosen_id: 'dsn-7', kelas_id: 'kls-4', hari: 'Selasa', jam_mulai: '19:00', jam_selesai: '21:00', ruangan: 'Online', kategori: 'Online / Zoom' },

  // RABU
  { id: 'jdw-9', mata_kuliah_id: 'mk-5', dosen_id: 'dsn-3', kelas_id: 'kls-1', hari: 'Rabu', jam_mulai: '13:00', jam_selesai: '15:00', ruangan: '301 ICT B', kategori: 'Kelas / Teori' },

  // KAMIS
  { id: 'jdw-10', mata_kuliah_id: 'mk-3', dosen_id: 'dsn-2', kelas_id: 'kls-1', hari: 'Kamis', jam_mulai: '13:00', jam_selesai: '15:00', ruangan: 'LAB 4 GSG', kategori: 'Praktikum / Lab' },
  { id: 'jdw-11', mata_kuliah_id: 'mk-8', dosen_id: 'dsn-4', kelas_id: 'kls-1', hari: 'Kamis', jam_mulai: '15:00', jam_selesai: '17:00', ruangan: 'LAB 4 GSG', kategori: 'Praktikum / Lab' },
  { id: 'jdw-12', mata_kuliah_id: 'mk-6', dosen_id: 'dsn-6', kelas_id: 'kls-4', hari: 'Kamis', jam_mulai: '17:00', jam_selesai: '19:00', ruangan: 'Online', kategori: 'Online / Zoom' },

  // JUMAT
  { id: 'jdw-13', mata_kuliah_id: 'mk-8', dosen_id: 'dsn-4', kelas_id: 'kls-1', hari: 'Jumat', jam_mulai: '09:00', jam_selesai: '11:00', ruangan: '301B', kategori: 'Kelas / Teori' },
  { id: 'jdw-14', mata_kuliah_id: 'mk-2', dosen_id: 'dsn-1', kelas_id: 'kls-2', hari: 'Jumat', jam_mulai: '13:00', jam_selesai: '15:00', ruangan: 'LAB 2A', kategori: 'Praktikum / Lab' },
  { id: 'jdw-15', mata_kuliah_id: 'mk-9', dosen_id: 'dsn-8', kelas_id: 'kls-4', hari: 'Jumat', jam_mulai: '17:00', jam_selesai: '19:00', ruangan: '301 ICT B', kategori: 'Kelas / Teori' },
]

export const INITIAL_PERTEMUAN = [
  { id: 'ptm-1', jadwal_id: 'jdw-1', tanggal: '2026-10-05', pertemuan_ke: 8, status: 'aktif' },
  { id: 'ptm-2', jadwal_id: 'jdw-3', tanggal: '2026-10-05', pertemuan_ke: 8, status: 'aktif' },
  { id: 'ptm-3', jadwal_id: 'jdw-1', tanggal: '2026-09-28', pertemuan_ke: 7, status: 'selesai' },
  { id: 'ptm-4', jadwal_id: 'jdw-3', tanggal: '2026-09-28', pertemuan_ke: 7, status: 'selesai' },
]

export const INITIAL_PRESENSI = [
  { id: 'prs-1', pertemuan_id: 'ptm-3', mahasiswa_id: 'mhs-1', status: 'hadir', waktu_presensi: '2026-09-28T08:05:00Z', keterangan: 'Presensi via Web' },
  { id: 'prs-2', pertemuan_id: 'ptm-3', mahasiswa_id: 'mhs-2', status: 'hadir', waktu_presensi: '2026-09-28T08:03:00Z', keterangan: 'Presensi via Web' },
  { id: 'prs-3', pertemuan_id: 'ptm-3', mahasiswa_id: 'mhs-3', status: 'hadir', waktu_presensi: '2026-09-28T08:07:00Z', keterangan: 'Presensi via Web' },
  { id: 'prs-4', pertemuan_id: 'ptm-3', mahasiswa_id: 'mhs-4', status: 'terlambat', waktu_presensi: '2026-09-28T08:25:00Z', keterangan: 'Macet' },
  { id: 'prs-5', pertemuan_id: 'ptm-3', mahasiswa_id: 'mhs-5', status: 'izin', waktu_presensi: '2026-09-28T08:00:00Z', keterangan: 'Lomba Kampus' },

  { id: 'prs-6', pertemuan_id: 'ptm-1', mahasiswa_id: 'mhs-2', status: 'hadir', waktu_presensi: '2026-10-05T08:03:00Z', keterangan: 'Tepat Waktu' },
  { id: 'prs-7', pertemuan_id: 'ptm-1', mahasiswa_id: 'mhs-3', status: 'hadir', waktu_presensi: '2026-10-05T08:05:00Z', keterangan: 'Tepat Waktu' },
  { id: 'prs-8', pertemuan_id: 'ptm-1', mahasiswa_id: 'mhs-4', status: 'terlambat', waktu_presensi: '2026-10-05T08:18:00Z', keterangan: 'Terlambat 18 menit' },
]

// Helper function to initialize localStorage data or refresh dataset
export const initLocalStorageData = (forceReset = false) => {
  // Always update dataset if existing dataset is old seed (less than 15 items)
  let needsUpdate = forceReset
  try {
    const currentJadwals = JSON.parse(localStorage.getItem('sk_jadwal') || '[]')
    if (currentJadwals.length < 10) {
      needsUpdate = true
    }
  } catch (e) {
    needsUpdate = true
  }

  if (needsUpdate || !localStorage.getItem('sk_profiles')) {
    localStorage.setItem('sk_profiles', JSON.stringify(INITIAL_PROFILES))
  }
  if (needsUpdate || !localStorage.getItem('sk_kelas')) {
    localStorage.setItem('sk_kelas', JSON.stringify(INITIAL_KELAS))
  }
  if (needsUpdate || !localStorage.getItem('sk_mahasiswa')) {
    localStorage.setItem('sk_mahasiswa', JSON.stringify(INITIAL_MAHASISWA))
  }
  if (needsUpdate || !localStorage.getItem('sk_dosen')) {
    localStorage.setItem('sk_dosen', JSON.stringify(INITIAL_DOSEN))
  }
  if (needsUpdate || !localStorage.getItem('sk_mata_kuliah')) {
    localStorage.setItem('sk_mata_kuliah', JSON.stringify(INITIAL_MATA_KULIAH))
  }
  if (needsUpdate || !localStorage.getItem('sk_jadwal')) {
    localStorage.setItem('sk_jadwal', JSON.stringify(INITIAL_JADWAL))
  }
  if (needsUpdate || !localStorage.getItem('sk_pertemuan')) {
    localStorage.setItem('sk_pertemuan', JSON.stringify(INITIAL_PERTEMUAN))
  }
  if (needsUpdate || !localStorage.getItem('sk_presensi')) {
    localStorage.setItem('sk_presensi', JSON.stringify(INITIAL_PRESENSI))
  }

  // Clean up any corrupted empty string ID records
  ;['sk_mata_kuliah', 'sk_kelas', 'sk_jadwal', 'sk_mahasiswa', 'sk_dosen'].forEach((key) => {
    try {
      const data = JSON.parse(localStorage.getItem(key) || '[]')
      const clean = data.filter((item) => item && item.id !== '')
      if (clean.length !== data.length) {
        localStorage.setItem(key, JSON.stringify(clean))
      }
    } catch (e) {}
  })
}
