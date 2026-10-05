import React, { useState, useEffect } from 'react'
import { CalendarDays, Clock, MapPin, User, BookOpen, Video, Laptop, Plus, Trash2, Edit2 } from 'lucide-react'
import Modal from '../../components/Modal'
import Toast from '../../components/Toast'
import { getCurrentUser } from '../../services/authService'
import { getMahasiswaJadwal } from '../../services/jadwalService'
import { saveJadwal, deleteJadwal, getMataKuliahList, getDosenList, getKelasList } from '../../services/adminService'

export default function MahasiswaJadwal() {
  const user = getCurrentUser()
  const [jadwal, setJadwal] = useState([])
  const [selectedHari, setSelectedHari] = useState('semua')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [toastMsg, setToastMsg] = useState('')

  const [mataKuliahs, setMataKuliahs] = useState([])
  const [dosens, setDosens] = useState([])
  const [kelass, setKelass] = useState([])

  const [formData, setFormData] = useState({
    id: '',
    mata_kuliah_id: '',
    dosen_id: '',
    kelas_id: '',
    hari: 'Senin',
    jam_mulai: '08:00',
    jam_selesai: '09:40',
    ruangan: 'Ruang Lab 1',
    kategori: 'Kelas / Teori',
  })

  const loadData = () => {
    if (!user) return
    const data = getMahasiswaJadwal(user.id)
    setJadwal(data)

    const mkList = getMataKuliahList()
    const dList = getDosenList()
    const kList = getKelasList()

    setMataKuliahs(mkList)
    setDosens(dList)
    setKelass(kList)

    if (mkList.length > 0 && !formData.mata_kuliah_id) {
      setFormData((prev) => ({
        ...prev,
        mata_kuliah_id: mkList[0].id,
        dosen_id: dList[0]?.id || '',
        kelas_id: kList[0]?.id || '',
      }))
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleOpenAdd = () => {
    const mahasiswas = JSON.parse(localStorage.getItem('sk_mahasiswa') || '[]')
    const mhs = mahasiswas.find((m) => String(m.profile_id) === String(user?.id))

    setFormData({
      id: '',
      mata_kuliah_id: mataKuliahs[0]?.id || '',
      dosen_id: dosens[0]?.id || '',
      kelas_id: mhs?.kelas_id || kelass[0]?.id || '',
      hari: 'Senin',
      jam_mulai: '08:00',
      jam_selesai: '09:40',
      ruangan: 'Ruang Lab 1',
      kategori: 'Kelas / Teori',
    })
    setIsModalOpen(true)
  }

  const handleOpenEdit = (item) => {
    setFormData({
      id: item.id,
      mata_kuliah_id: item.mata_kuliah_id,
      dosen_id: item.dosen_id,
      kelas_id: item.kelas_id,
      hari: item.hari,
      jam_mulai: item.jam_mulai,
      jam_selesai: item.jam_selesai,
      ruangan: item.ruangan,
      kategori: item.kategori || 'Kelas / Teori',
    })
    setIsModalOpen(true)
  }

  const handleDeleteClick = (item) => {
    setDeleteTarget(item)
    setIsDeleteOpen(true)
  }

  const confirmDelete = () => {
    if (deleteTarget) {
      deleteJadwal(deleteTarget.id)
      setToastMsg('Jadwal perkuliahan berhasil dihapus.')
      setIsDeleteOpen(false)
      setDeleteTarget(null)
      loadData()
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    saveJadwal(formData)
    setToastMsg(formData.id ? 'Data jadwal berhasil diperbarui.' : 'Jadwal perkuliahan baru berhasil ditambahkan!')
    setIsModalOpen(false)
    loadData()
  }

  const filteredJadwal = jadwal.filter((j) => {
    if (selectedHari === 'semua') return true
    return j.hari.toLowerCase() === selectedHari.toLowerCase()
  })

  const listHari = ['Semua', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat']

  const getKategoriBadge = (kat) => {
    switch (kat) {
      case 'Online / Zoom':
      case 'Online':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <Video className="w-3 h-3 text-blue-600" />
            Online / Zoom
          </span>
        )
      case 'Praktikum / Lab':
      case 'Praktikum':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
            <Laptop className="w-3 h-3 text-purple-600" />
            Praktikum / Lab
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <BookOpen className="w-3 h-3 text-emerald-600" />
            Kelas / Teori
          </span>
        )
    }
  }

  return (
    <div className="space-y-6">
      <Toast message={toastMsg} onClose={() => setToastMsg('')} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-blue-600" />
            <span>Jadwal Kuliah Mahasiswa</span>
          </h1>
          <p className="text-xs font-medium text-slate-500 mt-1">
            Daftar jadwal perkuliahan semester ini beserta keterangan kelas (Online / Teori / Praktikum).
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/20 transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Jadwal</span>
        </button>
      </div>

      {/* Filter Tabs by Day */}
      <div className="flex flex-wrap items-center gap-2 bg-white p-2 rounded-2xl border border-slate-200/80 shadow-2xs">
        {listHari.map((hari) => (
          <button
            key={hari}
            onClick={() => setSelectedHari(hari.toLowerCase())}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedHari === hari.toLowerCase()
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {hari}
          </button>
        ))}
      </div>

      {/* Schedule Cards Grid */}
      {filteredJadwal.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-10 text-center space-y-2">
          <CalendarDays className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-700">Belum Ada Jadwal</h3>
          <p className="text-xs text-slate-500">Tidak ada jadwal perkuliahan untuk hari/filter yang dipilih.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredJadwal.map((j) => (
            <div
              key={j.id}
              className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="px-2.5 py-1 bg-blue-50 text-blue-700 text-[10px] font-bold rounded-lg border border-blue-200/60 uppercase">
                      {j.hari}
                    </span>
                    {getKategoriBadge(j.kategori)}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(j)}
                      className="p-1.5 bg-amber-50 text-amber-600 hover:bg-amber-100 rounded-lg transition-colors"
                      title="Edit Jadwal"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(j)}
                      className="p-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg transition-colors"
                      title="Hapus Jadwal"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h3 className="text-base font-bold text-slate-900">{j.mataKuliah}</h3>
                <p className="text-xs font-mono text-slate-400 mt-0.5">
                  {j.kodeMk} • Kelas {j.kelas} • {j.sks} SKS
                </p>

                <div className="mt-4 space-y-2 text-xs text-slate-600 font-medium">
                  <div className="flex items-center gap-2.5">
                    <Clock className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>{j.jam}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>{j.ruangan}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <User className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>{j.dosen}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Schedule Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={formData.id ? 'Edit Jadwal Perkuliahan' : 'Tambah Jadwal Perkuliahan'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Mata Kuliah</label>
            <select
              value={formData.mata_kuliah_id}
              onChange={(e) => setFormData({ ...formData, mata_kuliah_id: e.target.value })}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:outline-none"
            >
              {mataKuliahs.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.nama} ({m.kode}) - {m.sks} SKS
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Dosen Pengampu</label>
              <select
                value={formData.dosen_id}
                onChange={(e) => setFormData({ ...formData, dosen_id: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:outline-none"
              >
                {dosens.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.nama}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Kelas</label>
              <select
                value={formData.kelas_id}
                onChange={(e) => setFormData({ ...formData, kelas_id: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:outline-none"
              >
                {kelass.map((k) => (
                  <option key={k.id} value={k.id}>
                    {k.nama_kelas}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Hari</label>
              <select
                value={formData.hari}
                onChange={(e) => setFormData({ ...formData, hari: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:outline-none"
              >
                {['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'].map((h) => (
                  <option key={h} value={h}>
                    {h}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Jam Mulai</label>
              <input
                type="text"
                required
                value={formData.jam_mulai}
                onChange={(e) => setFormData({ ...formData, jam_mulai: e.target.value })}
                placeholder="08:00"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Jam Selesai</label>
              <input
                type="text"
                required
                value={formData.jam_selesai}
                onChange={(e) => setFormData({ ...formData, jam_selesai: e.target.value })}
                placeholder="09:40"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Tempat / Ruangan</label>
              <input
                type="text"
                required
                value={formData.ruangan}
                onChange={(e) => setFormData({ ...formData, ruangan: e.target.value })}
                placeholder="Contoh: Ruang Lab 1 / Zoom Meeting"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Keterangan Perkuliahan</label>
              <select
                value={formData.kategori}
                onChange={(e) => setFormData({ ...formData, kategori: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:outline-none"
              >
                <option value="Kelas / Teori">Kelas / Teori</option>
                <option value="Online / Zoom">Online / Zoom</option>
                <option value="Praktikum / Lab">Praktikum / Lab</option>
              </select>
            </div>
          </div>

          <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 bg-slate-100 text-slate-600 font-bold text-xs rounded-xl hover:bg-slate-200"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white font-bold text-xs rounded-xl hover:bg-blue-700 shadow-md shadow-blue-500/20"
            >
              Simpan Jadwal
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} title="Konfirmasi Hapus Jadwal">
        <div className="space-y-4">
          <p className="text-sm text-slate-600 font-medium">
            Apakah Anda yakin ingin menghapus jadwal perkuliahan{' '}
            <strong className="text-slate-900 font-bold">{deleteTarget?.mataKuliah}</strong> ({deleteTarget?.hari}, {deleteTarget?.jam})?
          </p>
          <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-xs text-rose-700 font-medium">
            Tindakan ini tidak dapat dibatalkan.
          </div>

          <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsDeleteOpen(false)}
              className="px-4 py-2 bg-slate-100 text-slate-600 font-bold text-xs rounded-xl hover:bg-slate-200"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={confirmDelete}
              className="px-4 py-2 bg-rose-600 text-white font-bold text-xs rounded-xl hover:bg-rose-700 shadow-md shadow-rose-500/20"
            >
              Ya, Hapus Data
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
