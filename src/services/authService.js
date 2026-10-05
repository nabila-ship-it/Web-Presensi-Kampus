import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { initLocalStorageData } from '../lib/mockData'

initLocalStorageData()

export const loginUser = async (identifier, password) => {
  const cleanId = identifier.trim()

  // If Supabase is properly configured, try Supabase Auth first
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email: cleanId, password })
      if (!error && data.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single()

        const sessionUser = {
          id: data.user.id,
          email: data.user.email,
          nama: profile?.nama || data.user.email.split('@')[0],
          role: profile?.role || 'mahasiswa',
          foto_url: profile?.foto_url,
        }

        localStorage.setItem('sk_session', JSON.stringify(sessionUser))
        return { success: true, user: sessionUser }
      }
    } catch (err) {
      console.warn('Supabase Auth error, checking mock authentication:', err.message)
    }
  }

  // Fallback to demo/mock authentication (Supports NIM, NIP, or Email)
  const profiles = JSON.parse(localStorage.getItem('sk_profiles') || '[]')
  const mahasiswas = JSON.parse(localStorage.getItem('sk_mahasiswa') || '[]')
  const dosens = JSON.parse(localStorage.getItem('sk_dosen') || '[]')

  let userProfile = null

  // 1. Check if identifier matches Mahasiswa NIM (NPM)
  const mhs = mahasiswas.find((m) => m.nim.toLowerCase() === cleanId.toLowerCase())
  if (mhs) {
    userProfile = profiles.find((p) => p.id === mhs.profile_id)
  }

  // 2. Check if identifier matches Dosen NIP
  if (!userProfile) {
    const dsn = dosens.find((d) => d.nip.toLowerCase() === cleanId.toLowerCase())
    if (dsn) {
      userProfile = profiles.find((p) => p.id === dsn.profile_id)
    }
  }

  // 3. Check if identifier matches Email
  if (!userProfile) {
    userProfile = profiles.find((p) => p.email.toLowerCase() === cleanId.toLowerCase())
  }

  if (userProfile) {
    const expectedPassword = userProfile.password || (userProfile.role === 'admin' ? 'admin123' : 'password123')
    if (password === expectedPassword || (password.length >= 6 && !userProfile.password)) {
      localStorage.setItem('sk_session', JSON.stringify(userProfile))
      return { success: true, user: userProfile }
    } else {
      return { success: false, message: 'Kata sandi (password) yang Anda masukkan salah.' }
    }
  }

  return {
    success: false,
    message: 'NIM / NIP / Email atau password tidak ditemukan. Periksa kembali input Anda.',
  }
}

export const changeUserPassword = (profileId, newPassword) => {
  if (!newPassword || newPassword.length < 4) {
    return { success: false, message: 'Kata sandi minimal 4 karakter.' }
  }

  const profiles = JSON.parse(localStorage.getItem('sk_profiles') || '[]')
  const index = profiles.findIndex((p) => p.id === profileId)

  if (index !== -1) {
    profiles[index].password = newPassword
    localStorage.setItem('sk_profiles', JSON.stringify(profiles))

    // Update current session if the current user changed their own password
    const currentSession = getCurrentUser()
    if (currentSession && currentSession.id === profileId) {
      currentSession.password = newPassword
      localStorage.setItem('sk_session', JSON.stringify(currentSession))
    }

    return { success: true, message: 'Kata sandi berhasil diperbarui!' }
  }

  return { success: false, message: 'Pengguna tidak ditemukan.' }
}

export const getCurrentUser = () => {
  const sessionStr = localStorage.getItem('sk_session')
  if (!sessionStr) return null
  try {
    return JSON.parse(sessionStr)
  } catch {
    return null
  }
}

export const logoutUser = async () => {
  if (isSupabaseConfigured()) {
    try {
      await supabase.auth.signOut()
    } catch (err) {
      console.warn('Supabase logout error:', err)
    }
  }
  localStorage.removeItem('sk_session')
}

export const updateUserProfilePhoto = (profileId, photoUrl) => {
  const profiles = JSON.parse(localStorage.getItem('sk_profiles') || '[]')
  const index = profiles.findIndex((p) => String(p.id) === String(profileId))

  if (index !== -1) {
    profiles[index].foto_url = photoUrl
    localStorage.setItem('sk_profiles', JSON.stringify(profiles))

    const currentSession = getCurrentUser()
    if (currentSession && String(currentSession.id) === String(profileId)) {
      currentSession.foto_url = photoUrl
      localStorage.setItem('sk_session', JSON.stringify(currentSession))
    }

    return { success: true, message: 'Foto profil berhasil diperbarui!' }
  }

  return { success: false, message: 'Pengguna tidak ditemukan.' }
}
