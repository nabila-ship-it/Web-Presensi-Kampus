import React, { useState, useEffect } from 'react'
import { UserCheck, Plus, Edit2, Trash2, Search, Mail, Lock, KeyRound } from 'lucide-react'
import Modal from '../../components/Modal'
import Toast from '../../components/Toast'
import { getDosenList, saveDosen, deleteDosen } from '../../services/adminService'
import { changeUserPassword } from '../../services/authService'

export default function AdminDosen() {
  const [list, setList] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isResetPwOpen, setIsResetPwOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [resetPwTarget, setResetPwTarget] = useState(null)
  const [resetPwValue, setResetPwValue] = useState('password123')
  const [toastMsg, setToastMsg] = useState('')

  const [formData, setFormData] = useState({ id: '', nip: '', nama: '', email: '', password: 'password123' })

  const loadData = () => {
    setList(getDosenList())
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleOpenAdd = () => {
    setFormData({ id: '', nip: '', nama: '', email: '', password: 'password123' })
    setIsModalOpen(true)
  }

  const handleOpenEdit = (item) => {
    setFormData({ id: item.id, nip: item.nip, nama: item.nama, email: item.email, password: '' })
    setIsModalOpen(true)
  }

  const handleDelete = (item) => {
    setDeleteTarget(item)
    setIsDeleteOpen(true)
  }

  const confirmDelete = () => {
    if (deleteTarget) {
      deleteDosen(deleteTarget.id)
      setToastMsg('Data & akun login dosen berhasil dihapus.')
      loadData()
    }
    setIsDeleteOpen(false)
    setDeleteTarget(null)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    saveDosen(formData)
    setToastMsg(
      formData.id
        ? 'Data dosen berhasil diperbarui.'
        : `Akun Dosen ${formData.nama} berhasil didaftarkan! Email: ${formData.email} | Password: ${formData.password || 'password123'}`
    )
    setIsModalOpen(false)
    loadData()
  }

  const handleOpenResetPw = (item) => {
    setResetPwTarget(item)
    setResetPwValue('password123')
    setIsResetPwOpen(true)
  }

  const handleResetPassword = (e) => {
    e.preventDefault()
    if (resetPwTarget) {
      const result = changeUserPassword(resetPwTarget.profile_id, resetPwValue)
      if (result.success) {
        setToastMsg(`Password ${resetPwTarget.nama} berhasil direset ke: ${resetPwValue}`)
      } else {
        setToastMsg(result.message)
      }
      setIsResetPwOpen(false)
    }
  }

  const filtered = list.filter(
    (d) =>
      d.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.nip.includes(searchTerm) ||
      d.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <Toast message={toastMsg} onClose={() => setToastMsg('')} duration={6000} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-blue-600" />
            <span>Pendaftaran & Kelola Data Dosen</span>
          </h1>
          <p className="text-xs font-medium text-slate-500 mt-1">
            Daftarkan akun login khusus dosen pengampu perkuliahan.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/20 transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Daftarkan Dosen Baru</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari NIP, Nama, atau Email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none font-medium"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <th className="py-3.5 px-5">NIP</th>
                <th className="py-3.5 px-5">Nama Dosen & Gelar</th>
                <th className="py-3.5 px-5">Email Akun Login</th>
                <th className="py-3.5 px-5 text-right">Aksi Admin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50">
                  <td className="py-3.5 px-5 font-mono font-bold text-slate-900">{item.nip}</td>
                  <td className="py-3.5 px-5 font-bold text-slate-900">{item.nama}</td>
                  <td className="py-3.5 px-5 font-medium text-blue-600 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{item.email}</span>
                  </td>
                  <td className="py-3.5 px-5 text-right space-x-2">
                    <button
                      onClick={() => handleOpenResetPw(item)}
                      className="p-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                      title="Reset Password Dosen"
                    >
                      <KeyRound className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleOpenEdit(item)}
                      className="p-1.5 bg-amber-50 text-amber-600 hover:bg-amber-100 rounded-lg transition-colors"
                      title="Edit Dosen"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(item)}
                      className="p-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg transition-colors"
                      title="Hapus Dosen"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={formData.id ? 'Edit Data Dosen' : 'Form Pendaftaran Akun Dosen Baru'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">NIP Dosen</label>
            <input
              type="text"
              required
              value={formData.nip}
              onChange={(e) => setFormData({ ...formData, nip: e.target.value })}
              placeholder="Contoh: 198503152010121001"
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Nama Dosen & Gelar</label>
            <input
              type="text"
              required
              value={formData.nama}
              onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
              placeholder="Contoh: Dr. Andi Pratama, S.Kom., M.Kom."
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Email Akun Login</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="dosen@kampus.ac.id"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Kata Sandi Login (Password)</label>
              <input
                type="text"
                required={!formData.id}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="password123"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:outline-none font-mono"
              />
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
              Daftarkan Dosen
            </button>
          </div>
        </form>
      </Modal>

      {/* Reset Password Modal */}
      <Modal
        isOpen={isResetPwOpen}
        onClose={() => setIsResetPwOpen(false)}
        title={`Reset Password: ${resetPwTarget?.nama || ''}`}
      >
        <form onSubmit={handleResetPassword} className="space-y-4">
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs font-medium text-amber-800">
            <p>Anda akan mereset kata sandi untuk akun:</p>
            <p className="font-bold mt-1">{resetPwTarget?.nama} ({resetPwTarget?.nip})</p>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Kata Sandi Baru</label>
            <input
              type="text"
              required
              value={resetPwValue}
              onChange={(e) => setResetPwValue(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:outline-none font-mono"
            />
          </div>
          <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsResetPwOpen(false)}
              className="px-4 py-2 bg-slate-100 text-slate-600 font-bold text-xs rounded-xl hover:bg-slate-200"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-amber-500 text-white font-bold text-xs rounded-xl hover:bg-amber-600 shadow-md shadow-amber-500/20 flex items-center gap-2"
            >
              <KeyRound className="w-3.5 h-3.5" />
              Reset Password
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        title="Konfirmasi Hapus Dosen"
      >
        <div className="space-y-4">
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs font-medium text-rose-800">
            <p>Yakin ingin menghapus data dosen berikut? Akun login juga akan dihapus dan <strong>tidak bisa dikembalikan</strong>.</p>
            <p className="font-bold mt-2">{deleteTarget?.nama} ({deleteTarget?.nip})</p>
          </div>
          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              onClick={() => setIsDeleteOpen(false)}
              className="px-4 py-2 bg-slate-100 text-slate-600 font-bold text-xs rounded-xl hover:bg-slate-200"
            >
              Batal
            </button>
            <button
              onClick={confirmDelete}
              className="px-4 py-2 bg-rose-600 text-white font-bold text-xs rounded-xl hover:bg-rose-700 shadow-md shadow-rose-500/20 flex items-center gap-2"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Ya, Hapus
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
