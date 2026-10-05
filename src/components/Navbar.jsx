import React from 'react'
import { Menu, Search, Bell, Calendar } from 'lucide-react'

export default function Navbar({ user, onOpenSidebar }) {
  // Format current date in Indonesian format
  const todayFormatted = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-4 lg:px-8 h-16 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3 flex-1 max-w-md">
        <button
          onClick={onOpenSidebar}
          className="lg:hidden p-2 rounded-xl text-slate-500 hover:text-slate-700 hover:bg-slate-100"
          aria-label="Buka menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search */}
        <div className="relative w-full hidden sm:block">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari mata kuliah, jadwal, atau menu..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-100/80 border border-transparent rounded-xl focus:bg-white focus:border-blue-500 focus:outline-none transition-all placeholder:text-slate-400 font-medium"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        {/* Date Display Badge */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-100 text-slate-600 rounded-xl text-xs font-semibold">
          <Calendar className="w-3.5 h-3.5 text-blue-600" />
          <span>{todayFormatted}</span>
        </div>

        {/* Notification Icon */}
        <button className="relative p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-600 rounded-full ring-2 ring-white"></span>
        </button>

        <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>

        {/* User Badge */}
        <div className="flex items-center gap-3">
          <img
            src={
              user?.foto_url ||
              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
            }
            alt="Profile Avatar"
            className="w-9 h-9 rounded-full object-cover ring-2 ring-slate-200"
          />
          <div className="hidden lg:block text-left">
            <h4 className="text-xs font-bold text-slate-900 leading-tight">{user?.nama}</h4>
            <p className="text-[11px] font-medium text-slate-500 capitalize">{user?.role}</p>
          </div>
        </div>
      </div>
    </header>
  )
}
