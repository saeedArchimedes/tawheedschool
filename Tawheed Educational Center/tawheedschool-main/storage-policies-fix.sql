-- Fix for Supabase Storage Policies
-- Run this in your Supabase SQL Editor

-- First, delete any problematic policies
DROP POLICY IF EXISTS "Enable delete for users based on user_id" ON storage.objects;
DROP POLICY IF EXISTS "Enable insert for users based on user_id" ON storage.objects;

-- Create working policies
CREATE POLICY "Allow public read access" ON storage.objects 
FOR SELECT USING (bucket_id = 'files');

CREATE POLICY "Allow authenticated upload" ON storage.objects 
FOR INSERT WITH CHECK (bucket_id = 'files' AND auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated update" ON storage.objects 
FOR UPDATE USING (bucket_id = 'files' AND auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated delete" ON storage.objects 
FOR DELETE USING (bucket_id = 'files' AND auth.role() = 'authenticated');
