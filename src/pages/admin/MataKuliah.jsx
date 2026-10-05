import React, { useState, useEffect } from 'react'
import { BookOpen, Plus, Edit2, Trash2 } from 'lucide-react'
import Modal from '../../components/Modal'
import Toast from '../../components/Toast'
import { getMataKuliahList, saveMataKuliah, deleteMataKuliah } from '../../services/adminService'

export default function AdminMataKuliah() {
  const [list, setList] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [toastMsg, setToastMsg] = useState('')

  const [formData, setFormData] = useState({ id: '', kode: '', nama: '', sks: 3, semester: 5 })

  const loadData = () => {
    setList(getMataKuliahList())
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleOpenAdd = () => {
    setFormData({ id: '', kode: '', nama: '', sks: 3, semester: 5 })
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
      deleteMataKuliah(deleteTarget.id)
      setToastMsg('Mata kuliah berhasil dihapus.')
      loadData()
    }
    setIsDeleteOpen(false)
    setDeleteTarget(null)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    saveMataKuliah(formData)
    setToastMsg(formData.id ? 'Data mata kuliah diperbarui.' : 'Mata kuliah baru ditambahkan.')
    setIsModalOpen(false)
    loadData()
  }

  return (
    <div className="space-y-6">
      <Toast message={toastMsg} onClose={() => setToastMsg('')} />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-600" />
            <span>Kelola Data Mata Kuliah</span>
          </h1>
          <p className="text-xs font-medium text-slate-500 mt-1">Daftar mata kuliah kurikulum.</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/20 transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Matkul</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-2xs">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase">
              <th className="py-3.5 px-5">Kode</th>
              <th className="py-3.5 px-5">Nama Mata Kuliah</th>
              <th className="py-3.5 px-5 text-center">SKS</th>
              <th className="py-3.5 px-5 text-center">Semester</th>
              <th className="py-3.5 px-5 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
            {list.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50">
                <td className="py-3.5 px-5 font-mono font-bold text-blue-600">{item.kode}</td>
                <td className="py-3.5 px-5 font-bold text-slate-900">{item.nama}</td>
                <td className="py-3.5 px-5 text-center font-bold">{item.sks} SKS</td>
                <td className="py-3.5 px-5 text-center">Semester {item.semester}</td>
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

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Form Data Mata Kuliah">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Kode MK</label>
            <input
              type="text"
              required
              value={formData.kode}
              onChange={(e) => setFormData({ ...formData, kode: e.target.value })}
              placeholder="TIF201"
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Nama Mata Kuliah</label>
            <input
              type="text"
              required
              value={formData.nama}
              onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
              placeholder="Pemrograman Web"
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">SKS</label>
              <input
                type="number"
                min="1"
                required
                value={formData.sks}
                onChange={(e) => setFormData({ ...formData, sks: parseInt(e.target.value) || 1 })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Semester</label>
              <input
                type="number"
                min="1"
                required
                value={formData.semester}
                onChange={(e) => setFormData({ ...formData, semester: parseInt(e.target.value) || 1 })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
              />
            </div>
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
      <Modal isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} title="Konfirmasi Hapus Mata Kuliah">
        <div className="space-y-4">
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs font-medium text-rose-800">
            <p>Yakin ingin menghapus mata kuliah berikut?</p>
            <p className="font-bold mt-2">{deleteTarget?.kode} — {deleteTarget?.nama}</p>
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
