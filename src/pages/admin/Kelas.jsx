import React, { useState, useEffect } from 'react'
import { School, Plus, Edit2, Trash2 } from 'lucide-react'
import Modal from '../../components/Modal'
import Toast from '../../components/Toast'
import { getKelasList, saveKelas, deleteKelas } from '../../services/adminService'

export default function AdminKelas() {
  const [list, setList] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [toastMsg, setToastMsg] = useState('')

  const [formData, setFormData] = useState({
    id: '',
    nama_kelas: '',
    program_studi: 'Sistem Informasi',
    angkatan: '2024',
  })

  const loadData = () => {
    setList(getKelasList())
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleOpenAdd = () => {
    setFormData({ id: '', nama_kelas: '', program_studi: 'Sistem Informasi', angkatan: '2024' })
    setIsModalOpen(true)
  }

  const handleOpenEdit = (item) => {
    setFormData({ ...item })
    setIsModalOpen(true)
  }

  const handleDelete = (item) => {
    setDeleteTarget(item)
    setIsDeleteOpen(true)
  }

  const confirmDelete = () => {
    if (deleteTarget) {
      deleteKelas(deleteTarget.id)
      setToastMsg('Kelas berhasil dihapus.')
      loadData()
    }
    setIsDeleteOpen(false)
    setDeleteTarget(null)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    saveKelas(formData)
    setToastMsg(formData.id ? 'Data kelas diperbarui.' : 'Kelas baru ditambahkan.')
    setIsModalOpen(false)
    loadData()
  }

  return (
    <div className="space-y-6">
      <Toast message={toastMsg} onClose={() => setToastMsg('')} />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <School className="w-5 h-5 text-blue-600" />
            <span>Kelola Data Kelas</span>
          </h1>
          <p className="text-xs font-medium text-slate-500 mt-1">Daftar kelas mahasiswa aktif.</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/20 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Kelas</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-2xs">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase">
              <th className="py-3.5 px-5">Nama Kelas</th>
              <th className="py-3.5 px-5">Program Studi</th>
              <th className="py-3.5 px-5">Angkatan</th>
              <th className="py-3.5 px-5 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
            {list.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50">
                <td className="py-3.5 px-5 font-bold text-slate-900">{item.nama_kelas}</td>
                <td className="py-3.5 px-5">{item.program_studi}</td>
                <td className="py-3.5 px-5 font-bold">{item.angkatan}</td>
                <td className="py-3.5 px-5 text-right space-x-2">
                  <button onClick={() => handleOpenEdit(item)} className="p-1.5 bg-amber-50 text-amber-600 rounded-lg">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(item)} className="p-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Form Data Kelas">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Nama Kelas</label>
            <input
              type="text"
              required
              value={formData.nama_kelas}
              onChange={(e) => setFormData({ ...formData, nama_kelas: e.target.value })}
              placeholder="SI24A"
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Program Studi</label>
            <input
              type="text"
              required
              value={formData.program_studi}
              onChange={(e) => setFormData({ ...formData, program_studi: e.target.value })}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Angkatan</label>
            <input
              type="text"
              required
              value={formData.angkatan}
              onChange={(e) => setFormData({ ...formData, angkatan: e.target.value })}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
            />
          </div>
          <div className="pt-3 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 bg-slate-100 text-slate-600 font-bold text-xs rounded-xl"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white font-bold text-xs rounded-xl hover:bg-blue-700"
            >
              Simpan Data
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} title="Konfirmasi Hapus Kelas">
        <div className="space-y-4">
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs font-medium text-rose-800">
            <p>Yakin ingin menghapus kelas berikut?</p>
            <p className="font-bold mt-2">{deleteTarget?.nama_kelas} — {deleteTarget?.program_studi} ({deleteTarget?.angkatan})</p>
          </div>
          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button onClick={() => setIsDeleteOpen(false)} className="px-4 py-2 bg-slate-100 text-slate-600 font-bold text-xs rounded-xl hover:bg-slate-200">Batal</button>
            <button onClick={confirmDelete} className="px-4 py-2 bg-rose-600 text-white font-bold text-xs rounded-xl hover:bg-rose-700 shadow-md shadow-rose-500/20 flex items-center gap-2">
              <Trash2 className="w-3.5 h-3.5" /> Ya, Hapus
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
