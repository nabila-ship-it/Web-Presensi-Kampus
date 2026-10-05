import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  CalendarCheck,
  CalendarDays,
  History,
  User,
  Users,
  UserCheck,
  BookOpen,
  School,
  FileSpreadsheet,
  LogOut,
  GraduationCap,
  X,
  Layers,
} from 'lucide-react'
import { logoutUser } from '../services/authService'

export default function Sidebar({ user, isOpen, onClose }) {
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logoutUser()
    navigate('/login')
  }

  const getRoleBadge = (role) => {
    switch (role) {
      case 'admin':
        return <span className="bg-purple-500/20 text-purple-300 text-[10px] font-semibold px-2 py-0.5 rounded-md border border-purple-500/30 uppercase tracking-wider">Admin</span>
      case 'dosen':
        return <span className="bg-blue-500/20 text-blue-300 text-[10px] font-semibold px-2 py-0.5 rounded-md border border-blue-500/30 uppercase tracking-wider">Dosen</span>
      default:
        return <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-semibold px-2 py-0.5 rounded-md border border-emerald-500/30 uppercase tracking-wider">Mahasiswa</span>
    }
  }

  const getNavItems = () => {
    const role = user?.role || 'mahasiswa'
    if (role === 'admin') {
      return [
        { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
        { label: 'Data Mahasiswa', path: '/admin/mahasiswa', icon: Users },
        { label: 'Data Dosen', path: '/admin/dosen', icon: UserCheck },
        { label: 'Data Mata Kuliah', path: '/admin/matakuliah', icon: BookOpen },
        { label: 'Data Kelas', path: '/admin/kelas', icon: School },
        { label: 'Data Jadwal', path: '/admin/jadwal', icon: CalendarDays },
        { label: 'Data Presensi', path: '/admin/presensi', icon: CalendarCheck },
      ]
    } else if (role === 'dosen') {
      return [
        { label: 'Dashboard', path: '/dosen/dashboard', icon: LayoutDashboard },
        { label: 'Jadwal & Kelas', path: '/dosen/kelas', icon: BookOpen },
        { label: 'Rekap Presensi', path: '/dosen/rekap', icon: FileSpreadsheet },
        { label: 'Profil Saya', path: '/dosen/profil', icon: User },
      ]
    } else {
      return [
        { label: 'Dashboard', path: '/mahasiswa/dashboard', icon: LayoutDashboard },
        { label: 'Presensi', path: '/mahasiswa/presensi', icon: CalendarCheck },
        { label: 'Jadwal Kuliah', path: '/mahasiswa/jadwal', icon: CalendarDays },
        { label: 'Riwayat Presensi', path: '/mahasiswa/riwayat', icon: History },
        { label: 'Profil Saya', path: '/mahasiswa/profil', icon: User },
      ]
    }
  }

  const navItems = getNavItems()

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* Sidebar Drawer */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-64 bg-slate-900 text-slate-100 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Brand Header */}
          <div className="flex items-center justify-between h-16 px-5 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <img src="/logo-uti.png" alt="Universitas Teknokrat Indonesia" className="w-10 h-10 object-contain bg-white rounded-xl p-1 shadow-md shrink-0" />
              <div>
                <h1 className="text-xs font-extrabold text-white leading-tight tracking-tight">
                  Presensi UTI
                </h1>
                <p className="text-[10px] font-semibold text-blue-400 leading-tight">Univ. Teknokrat Indonesia</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Profile Summary Card */}
          <div className="p-4 mx-3 my-4 bg-slate-800/60 rounded-xl border border-slate-700/50 flex items-center gap-3">
            <img
              src={
                user?.foto_url ||
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
              }
              alt="Avatar"
              className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-500/50"
            />
            <div className="overflow-hidden flex-1">
              <h2 className="text-xs font-bold text-white truncate">{user?.nama || 'User'}</h2>
              <div className="mt-0.5">{getRoleBadge(user?.role)}</div>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="px-3 space-y-1 mt-2">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-900/30'
                        : 'text-slate-400 hover:bg-slate-800/70 hover:text-slate-200'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              )
            })}
          </nav>
        </div>

        {/* Bottom Logout Section */}
        <div className="p-3 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-950/40 hover:text-rose-300 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Keluar Aplikasi</span>
          </button>
        </div>
      </aside>
    </>
  )
}
