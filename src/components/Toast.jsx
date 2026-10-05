import React, { useEffect } from 'react'
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react'

export default function Toast({ message, type = 'success', onClose, duration = 4000 }) {
  useEffect(() => {
    if (!message) return
    const timer = setTimeout(() => {
      onClose?.()
    }, duration)
    return () => clearTimeout(timer)
  }, [message, duration, onClose])

  if (!message) return null

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
      case 'error':
        return <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
      default:
        return <Info className="w-5 h-5 text-blue-500 shrink-0" />
    }
  }

  return (
    <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3 bg-white border border-slate-200 px-4 py-3 rounded-xl shadow-lg max-w-sm w-full animate-bounce-short">
      {getIcon()}
      <p className="text-sm font-medium text-slate-700 flex-1">{message}</p>
      <button
        onClick={onClose}
        className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}
