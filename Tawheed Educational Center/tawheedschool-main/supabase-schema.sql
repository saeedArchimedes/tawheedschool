-- Tawheed Educational Center Database Schema
-- Run this SQL in your Supabase SQL Editor

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) CHECK (role IN ('admin', 'teacher', 'smc')) NOT NULL,
  name VARCHAR(100) NOT NULL,
  is_first_login BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  added_by VARCHAR(50),
  attendance_history JSONB DEFAULT '[]'::jsonb
);

-- Create announcements table
CREATE TABLE IF NOT EXISTS announcements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  target VARCHAR(20) CHECK (target IN ('teachers', 'public', 'both')) NOT NULL,
  author VARCHAR(100) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_read BOOLEAN DEFAULT false
);

-- Create resources table
CREATE TABLE IF NOT EXISTS resources (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_url TEXT NOT NULL,
  file_type VARCHAR(20) CHECK (file_type IN ('pdf', 'image')) NOT NULL,
  category VARCHAR(20) CHECK (category IN ('resource', 'timetable')) NOT NULL,
  uploaded_by VARCHAR(100) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create uploads table
CREATE TABLE IF NOT EXISTS uploads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  file_url TEXT NOT NULL,
  file_type VARCHAR(20) CHECK (file_type IN ('lesson-plan', 'progress-report')) NOT NULL,
  teacher_id VARCHAR(50) NOT NULL,
  teacher_name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status VARCHAR(20) CHECK (status IN ('pending', 'marked')) DEFAULT 'pending',
  comments TEXT,
  grade VARCHAR(10)
);

-- Create suggestions table
CREATE TABLE IF NOT EXISTS suggestions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255),
  message TEXT NOT NULL,
  source VARCHAR(20) CHECK (source IN ('public', 'teacher')) DEFAULT 'public',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_read BOOLEAN DEFAULT false,
  reply TEXT,
  replied_at TIMESTAMP WITH TIME ZONE,
  replied_by VARCHAR(100)
);

-- Create admissions table
CREATE TABLE IF NOT EXISTS admissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_name VARCHAR(100) NOT NULL,
  parent_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  grade VARCHAR(20) NOT NULL,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status VARCHAR(20) CHECK (status IN ('pending', 'reviewed', 'accepted', 'rejected')) DEFAULT 'pending'
);

-- Create attendance_records table
CREATE TABLE IF NOT EXISTS attendance_records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  teacher_id VARCHAR(50) NOT NULL,
  teacher_name VARCHAR(100) NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  status VARCHAR(20) CHECK (status IN ('on-time', 'late')) NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default admin users
INSERT INTO users (username, password, role, name, is_first_login, added_by) VALUES
('saeed', 'Archimedes', 'admin', 'saeed', false, 'system'),
('hassan', 'Archimedes', 'admin', 'hassan', false, 'system'),
('school', 'sunnah', 'smc', 'SMC', false, 'system')
ON CONFLICT (username) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_announcements_target ON announcements(target);
CREATE INDEX IF NOT EXISTS idx_announcements_created_at ON announcements(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_resources_category ON resources(category);
CREATE INDEX IF NOT EXISTS idx_uploads_status ON uploads(status);
CREATE INDEX IF NOT EXISTS idx_attendance_teacher_date ON attendance_records(teacher_id, date);

-- Enable Row Level Security (RLS) for all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE uploads ENABLE ROW LEVEL SECURITY;
ALTER TABLE suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE admissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_records ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (allow all operations for now - you can make them more restrictive later)
CREATE POLICY "Allow all operations on users" ON users FOR ALL USING (true);
CREATE POLICY "Allow all operations on announcements" ON announcements FOR ALL USING (true);
CREATE POLICY "Allow all operations on resources" ON resources FOR ALL USING (true);
CREATE POLICY "Allow all operations on uploads" ON uploads FOR ALL USING (true);
CREATE POLICY "Allow all operations on suggestions" ON suggestions FOR ALL USING (true);
CREATE POLICY "Allow all operations on admissions" ON admissions FOR ALL USING (true);
CREATE POLICY "Allow all operations on attendance_records" ON attendance_records FOR ALL USING (true);

-- Enable real-time subscriptions for all tables
ALTER PUBLICATION supabase_realtime ADD TABLE users;
ALTER PUBLICATION supabase_realtime ADD TABLE announcements;
ALTER PUBLICATION supabase_realtime ADD TABLE resources;
ALTER PUBLICATION supabase_realtime ADD TABLE uploads;
ALTER PUBLICATION supabase_realtime ADD TABLE suggestions;
ALTER PUBLICATION supabase_realtime ADD TABLE admissions;
ALTER PUBLICATION supabase_realtime ADD TABLE attendance_records;
