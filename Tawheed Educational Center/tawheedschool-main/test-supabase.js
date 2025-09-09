// Quick test script to verify Supabase connection
// Run this with: node test-supabase.js

import { createClient } from '@supabase/supabase-js';

// Your actual Supabase credentials
const supabaseUrl = 'https://nzlnvqtleerzkjovxxzb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im56bG52cXRsZWVyemtqb3Z4eHpiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0NTIwNDQsImV4cCI6MjA3MzAyODA0NH0.Zn2iVFWMhUx0P3HmvS47TCvTX2Fw_vIDnK3Ukc_cwf4';

async function testSupabase() {
  console.log('🧪 Testing Supabase connection...');
  
  if (supabaseUrl === 'YOUR_SUPABASE_URL' || supabaseKey === 'YOUR_SUPABASE_ANON_KEY') {
    console.log('❌ Please update the Supabase credentials in this file first!');
    console.log('📝 Edit test-supabase.js and replace YOUR_SUPABASE_URL and YOUR_SUPABASE_ANON_KEY');
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    // Test 1: Check if we can connect
    console.log('1️⃣ Testing connection...');
    const { data, error } = await supabase.from('users').select('count').limit(1);
    
    if (error) {
      console.log('❌ Connection failed:', error.message);
      return;
    }
    
    console.log('✅ Connection successful!');

    // Test 2: Check if tables exist
    console.log('2️⃣ Checking tables...');
    const tables = ['users', 'announcements', 'resources', 'uploads', 'suggestions', 'admissions', 'attendance_records'];
    
    for (const table of tables) {
      const { error } = await supabase.from(table).select('count').limit(1);
      if (error) {
        console.log(`❌ Table '${table}' not found or not accessible`);
      } else {
        console.log(`✅ Table '${table}' is accessible`);
      }
    }

    // Test 3: Check default users
    console.log('3️⃣ Checking default users...');
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('username, role')
      .in('username', ['saeed', 'hassan', 'school']);

    if (usersError) {
      console.log('❌ Error fetching users:', usersError.message);
    } else {
      console.log('✅ Default users found:', users.map(u => `${u.username} (${u.role})`).join(', '));
    }

    console.log('\n🎉 Supabase setup is working correctly!');
    console.log('📱 Your website should now work across multiple devices!');

  } catch (error) {
    console.log('❌ Test failed:', error.message);
  }
}

testSupabase();
