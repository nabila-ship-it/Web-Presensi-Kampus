-- ============================================================
-- SCHEMAS & DATABASE FOR SISTEM PRESENSI KAMPUS
-- Supabase PostgreSQL Setup & RLS Policies
-- ============================================================

-- 1. EXTENSIONS & CLEANUP
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DROP TABLE IF EXISTS presensi CASCADE;
DROP TABLE IF EXISTS pertemuan CASCADE;
DROP TABLE IF EXISTS jadwal CASCADE;
DROP TABLE IF EXISTS mata_kuliah CASCADE;
DROP TABLE IF EXISTS mahasiswa CASCADE;
DROP TABLE IF EXISTS dosen CASCADE;
DROP TABLE IF EXISTS kelas CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- 2. TABLE DEFINITIONS

-- Table PROFILES (Linked with Supabase Auth users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nama VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  role VARCHAR(20) NOT NULL CHECK (role IN ('mahasiswa', 'dosen', 'admin')),
  foto_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table KELAS
CREATE TABLE kelas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nama_kelas VARCHAR(50) NOT NULL UNIQUE,
  program_studi VARCHAR(100) NOT NULL,
  angkatan VARCHAR(10) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table MAHASISWA
CREATE TABLE mahasiswa (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  nim VARCHAR(20) NOT NULL UNIQUE,
  kelas_id UUID REFERENCES kelas(id) ON DELETE SET NULL,
  program_studi VARCHAR(100) NOT NULL,
  angkatan VARCHAR(10) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table DOSEN
CREATE TABLE dosen (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  nip VARCHAR(30) NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table MATA KULIAH
CREATE TABLE mata_kuliah (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  kode VARCHAR(20) NOT NULL UNIQUE,
  nama VARCHAR(255) NOT NULL,
  sks INTEGER NOT NULL CHECK (sks > 0),
  semester INTEGER NOT NULL CHECK (semester > 0),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table JADWAL
CREATE TABLE jadwal (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mata_kuliah_id UUID NOT NULL REFERENCES mata_kuliah(id) ON DELETE CASCADE,
  dosen_id UUID NOT NULL REFERENCES dosen(id) ON DELETE CASCADE,
  kelas_id UUID NOT NULL REFERENCES kelas(id) ON DELETE CASCADE,
  hari VARCHAR(15) NOT NULL CHECK (hari IN ('Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu')),
  jam_mulai TIME NOT NULL,
  jam_selesai TIME NOT NULL,
  ruangan VARCHAR(50) NOT NULL,
  kategori VARCHAR(50) DEFAULT 'Kelas / Teori',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table PERTEMUAN
CREATE TABLE pertemuan (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  jadwal_id UUID NOT NULL REFERENCES jadwal(id) ON DELETE CASCADE,
  tanggal DATE NOT NULL DEFAULT CURRENT_DATE,
  pertemuan_ke INTEGER NOT NULL CHECK (pertemuan_ke > 0),
  status VARCHAR(20) NOT NULL DEFAULT 'aktif' CHECK (status IN ('aktif', 'selesai', 'dibatalkan')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table PRESENSI
CREATE TABLE presensi (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pertemuan_id UUID NOT NULL REFERENCES pertemuan(id) ON DELETE CASCADE,
  mahasiswa_id UUID NOT NULL REFERENCES mahasiswa(id) ON DELETE CASCADE,
  status VARCHAR(20) NOT NULL DEFAULT 'hadir' CHECK (status IN ('hadir', 'terlambat', 'izin', 'sakit', 'alpa')),
  waktu_presensi TIMESTAMPTZ DEFAULT NOW(),
  keterangan TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(pertemuan_id, mahasiswa_id)
);

-- 3. ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE kelas ENABLE ROW LEVEL SECURITY;
ALTER TABLE mahasiswa ENABLE ROW LEVEL SECURITY;
ALTER TABLE dosen ENABLE ROW LEVEL SECURITY;
ALTER TABLE mata_kuliah ENABLE ROW LEVEL SECURITY;
ALTER TABLE jadwal ENABLE ROW LEVEL SECURITY;
ALTER TABLE pertemuan ENABLE ROW LEVEL SECURITY;
ALTER TABLE presensi ENABLE ROW LEVEL SECURITY;

-- 4. RLS POLICIES

-- Helper function to get user role from profiles
CREATE OR REPLACE FUNCTION current_user_role()
RETURNS VARCHAR AS $$
  SELECT role FROM profiles WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Profiles Policies
CREATE POLICY "Public profiles are viewable by authenticated users" 
ON profiles FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can update their own profile" 
ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can insert/update/delete any profile" 
ON profiles FOR ALL USING (current_user_role() = 'admin');

-- Kelas Policies
CREATE POLICY "Authenticated users can view kelas" 
ON kelas FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage kelas" 
ON kelas FOR ALL USING (current_user_role() = 'admin');

-- Mahasiswa Policies
CREATE POLICY "Mahasiswa viewable by authenticated users" 
ON mahasiswa FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage mahasiswa" 
ON mahasiswa FOR ALL USING (current_user_role() = 'admin');

-- Dosen Policies
CREATE POLICY "Dosen viewable by authenticated users" 
ON dosen FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage dosen" 
ON dosen FOR ALL USING (current_user_role() = 'admin');

-- Mata Kuliah Policies
CREATE POLICY "Mata Kuliah viewable by authenticated users" 
ON mata_kuliah FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage mata_kuliah" 
ON mata_kuliah FOR ALL USING (current_user_role() = 'admin');

-- Jadwal Policies
CREATE POLICY "Jadwal viewable by authenticated users" 
ON jadwal FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage jadwal" 
ON jadwal FOR ALL USING (current_user_role() = 'admin');

-- Pertemuan Policies
CREATE POLICY "Pertemuan viewable by authenticated users" 
ON pertemuan FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Dosen can create/update pertemuan for their schedule" 
ON pertemuan FOR ALL USING (
  current_user_role() = 'admin' OR 
  EXISTS (
    SELECT 1 FROM jadwal j 
    JOIN dosen d ON j.dosen_id = d.id 
    WHERE j.id = pertemuan.jadwal_id AND d.profile_id = auth.uid()
  )
);

-- Presensi Policies
CREATE POLICY "Mahasiswa can view their own presensi" 
ON presensi FOR SELECT USING (
  current_user_role() = 'admin' OR
  EXISTS (
    SELECT 1 FROM mahasiswa m WHERE m.id = presensi.mahasiswa_id AND m.profile_id = auth.uid()
  ) OR
  EXISTS (
    SELECT 1 FROM pertemuan p 
    JOIN jadwal j ON p.jadwal_id = j.id 
    JOIN dosen d ON j.dosen_id = d.id 
    WHERE p.id = presensi.pertemuan_id AND d.profile_id = auth.uid()
  )
);

CREATE POLICY "Mahasiswa can create their own presensi" 
ON presensi FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM mahasiswa m WHERE m.id = presensi.mahasiswa_id AND m.profile_id = auth.uid()
  ) OR current_user_role() = 'admin'
);

CREATE POLICY "Dosen and Admin can update presensi status" 
ON presensi FOR UPDATE USING (
  current_user_role() = 'admin' OR 
  EXISTS (
    SELECT 1 FROM pertemuan p 
    JOIN jadwal j ON p.jadwal_id = j.id 
    JOIN dosen d ON j.dosen_id = d.id 
    WHERE p.id = presensi.pertemuan_id AND d.profile_id = auth.uid()
  )
);

-- 5. TRIGGER FOR NEW USER CREATION (Optional helper for Supabase auth sync)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, nama, email, role, foto_url)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'nama', 'Pengguna Baru'),
    new.email,
    COALESCE(new.raw_user_meta_data->>'role', 'mahasiswa'),
    COALESCE(new.raw_user_meta_data->>'foto_url', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Attach the trigger to auth.users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 6. PERFORMANCE INDEXES
CREATE INDEX idx_mahasiswa_profile ON mahasiswa(profile_id);
CREATE INDEX idx_mahasiswa_kelas ON mahasiswa(kelas_id);
CREATE INDEX idx_dosen_profile ON dosen(profile_id);
CREATE INDEX idx_jadwal_matkul ON jadwal(mata_kuliah_id);
CREATE INDEX idx_jadwal_dosen ON jadwal(dosen_id);
CREATE INDEX idx_jadwal_kelas ON jadwal(kelas_id);
CREATE INDEX idx_jadwal_hari ON jadwal(hari);
CREATE INDEX idx_pertemuan_jadwal ON pertemuan(jadwal_id);
CREATE INDEX idx_pertemuan_tanggal ON pertemuan(tanggal);
CREATE INDEX idx_presensi_pertemuan ON presensi(pertemuan_id);
CREATE INDEX idx_presensi_mahasiswa ON presensi(mahasiswa_id);
CREATE INDEX idx_presensi_status ON presensi(status);
