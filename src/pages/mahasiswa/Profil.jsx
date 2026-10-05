import React, { useState, useEffect, useRef } from 'react'
import { User, Lock, Eye, EyeOff, CheckCircle2, AlertCircle, KeyRound, Mail, BookOpen, GraduationCap, Building, Hash, Camera } from 'lucide-react'
import { getCurrentUser, changeUserPassword, updateUserProfilePhoto } from '../../services/authService'
import Toast from '../../components/Toast'

export default function MahasiswaProfil() {
  const [user, setUser] = useState(null)
  const [mhsData, setMhsData] = useState(null)
  const [kelasNama, setKelasNama] = useState('')
  const fileInputRef = useRef(null)

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [toastMsg, setToastMsg] = useState('')
  const [toastType, setToastType] = useState('success')

  useEffect(() => {
    const currentUser = getCurrentUser()
    setUser(currentUser)

    if (currentUser) {
      const mahasiswas = JSON.parse(localStorage.getItem('sk_mahasiswa') || '[]')
      const kelass = JSON.parse(localStorage.getItem('sk_kelas') || '[]')
      const mhs = mahasiswas.find((m) => m.profile_id === currentUser.id)
      setMhsData(mhs)

      if (mhs) {
        const kls = kelass.find((k) => k.id === mhs.kelas_id)
        setKelasNama(kls?.nama_kelas || '-')
      }
    }
  }, [])

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      setToastType('error')
      setToastMsg('Ukuran file maksimal 5MB!')
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      const base64Url = reader.result
      const res = updateUserProfilePhoto(user.id, base64Url)
      if (res.success) {
        setUser((prev) => ({ ...prev, foto_url: base64Url }))
        setToastType('success')
        setToastMsg('Foto profil berhasil diperbarui! Foto baru telah disimpan.')
      }
    }
    reader.readAsDataURL(file)
  }

  const handleChangePassword = (e) => {
    e.preventDefault()

    // Verify current password
    const profiles = JSON.parse(localStorage.getItem('sk_profiles') || '[]')
    const myProfile = profiles.find((p) => p.id === user?.id)
    const expectedPw = myProfile?.password || 'password123'

    if (currentPassword !== expectedPw) {
      setToastType('error')
      setToastMsg('Kata sandi lama salah! Periksa kembali.')
      return
    }

    if (newPassword.length < 4) {
      setToastType('error')
      setToastMsg('Kata sandi baru minimal 4 karakter.')
      return
    }

    if (newPassword !== confirmPassword) {
      setToastType('error')
      setToastMsg('Konfirmasi kata sandi tidak cocok.')
      return
    }

    const result = changeUserPassword(user.id, newPassword)
    if (result.success) {
      setToastType('success')
      setToastMsg('Kata sandi berhasil diubah! Gunakan kata sandi baru saat login berikutnya.')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } else {
      setToastType('error')
      setToastMsg(result.message)
    }
  }

  const infoCards = [
    { label: 'NIM', value: mhsData?.nim || '-', icon: Hash, color: 'blue' },
    { label: 'Kelas', value: kelasNama, icon: Building, color: 'violet' },
    { label: 'Program Studi', value: mhsData?.program_studi || '-', icon: BookOpen, color: 'emerald' },
    { label: 'Angkatan', value: mhsData?.angkatan || '-', icon: GraduationCap, color: 'amber' },
  ]

  const colorMap = {
    blue: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200/60', icon: 'text-blue-500' },
    violet: { bg: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-200/60', icon: 'text-violet-500' },
    emerald: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200/60', icon: 'text-emerald-500' },
    amber: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200/60', icon: 'text-amber-500' },
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <Toast message={toastMsg} onClose={() => setToastMsg('')} type={toastType} duration={5000} />

      <div>
        <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <User className="w-5 h-5 text-blue-600" />
          <span>Profil Mahasiswa</span>
        </h1>
        <p className="text-xs font-medium text-slate-500 mt-1">
          Informasi identitas pribadi dan akademik Anda.
        </p>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-6">
        <div className="flex items-center gap-5 pb-6 border-b border-slate-100">
          <div className="relative group">
            <img
              src={user?.foto_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
              alt="Avatar"
              className="w-20 h-20 rounded-full object-cover ring-4 ring-blue-100 shadow-md"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 p-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-md transition-all group-hover:scale-110"
              title="Unggah Foto Profil Baru"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handlePhotoUpload}
              accept="image/*"
              className="hidden"
            />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">{user?.nama || 'Memuat...'}</h2>
            <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5" />
              {user?.email || '-'}
            </p>
            <span className="mt-2 inline-block px-2.5 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-md border border-emerald-200">
              Mahasiswa Aktif
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          {infoCards.map((card) => {
            const colors = colorMap[card.color]
            return (
              <div key={card.label} className={`p-4 ${colors.bg} rounded-xl border ${colors.border} space-y-1`}>
                <div className="flex items-center gap-1.5">
                  <card.icon className={`w-3.5 h-3.5 ${colors.icon}`} />
                  <span className="text-[10px] font-bold text-slate-400 uppercase">{card.label}</span>
                </div>
                <p className={`text-sm font-extrabold ${colors.text}`}>{card.value}</p>
              </div>
            )
          })}
        </div>
      </div>

      {/* Password Change Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-5">
        <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
          <div className="p-2 bg-amber-50 rounded-lg">
            <KeyRound className="w-4 h-4 text-amber-600" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Ubah Kata Sandi</h3>
            <p className="text-[11px] text-slate-500 font-medium">Perbarui kata sandi akun login Anda.</p>
          </div>
        </div>

        <form onSubmit={handleChangePassword} className="space-y-4">
          {/* Current Password */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Kata Sandi Saat Ini</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type={showCurrent ? 'text' : 'password'}
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Masukkan kata sandi saat ini"
                className="w-full pl-9 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:outline-none focus:border-blue-500 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Kata Sandi Baru</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showNew ? 'text' : 'password'}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min. 4 karakter"
                  className="w-full pl-9 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:outline-none focus:border-blue-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Konfirmasi Kata Sandi Baru</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showConfirm ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Ulangi kata sandi baru"
                  className="w-full pl-9 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:outline-none focus:border-blue-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Password Strength Indicator */}
          {newPassword && (
            <div className="flex items-center gap-2">
              <div className="flex gap-1 flex-1">
                {[1, 2, 3, 4].map((level) => (
                  <div
                    key={level}
                    className={`h-1.5 flex-1 rounded-full transition-colors ${
                      newPassword.length >= level * 2
                        ? level <= 1
                          ? 'bg-rose-400'
                          : level <= 2
                          ? 'bg-amber-400'
                          : level <= 3
                          ? 'bg-blue-400'
                          : 'bg-emerald-400'
                        : 'bg-slate-200'
                    }`}
                  />
                ))}
              </div>
              <span className="text-[10px] font-bold text-slate-500">
                {newPassword.length < 4
                  ? 'Lemah'
                  : newPassword.length < 6
                  ? 'Cukup'
                  : newPassword.length < 8
                  ? 'Kuat'
                  : 'Sangat Kuat'}
              </span>
            </div>
          )}

          {/* Match indicator */}
          {confirmPassword && (
            <div className={`flex items-center gap-1.5 text-[11px] font-bold ${
              newPassword === confirmPassword ? 'text-emerald-600' : 'text-rose-600'
            }`}>
              {newPassword === confirmPassword ? (
                <><CheckCircle2 className="w-3.5 h-3.5" /> Kata sandi cocok</>
              ) : (
                <><AlertCircle className="w-3.5 h-3.5" /> Kata sandi tidak cocok</>
              )}
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl shadow-md shadow-amber-500/20 hover:shadow-lg transition-all flex items-center gap-2"
            >
              <KeyRound className="w-4 h-4" />
              <span>Perbarui Kata Sandi</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
