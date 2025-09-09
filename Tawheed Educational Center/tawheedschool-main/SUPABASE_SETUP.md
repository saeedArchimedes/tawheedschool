# Supabase Setup Guide for Tawheed Educational Center

## Step 1: Create Supabase Account & Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up for a free account
3. Click "New Project"
4. Choose your organization
5. Enter project details:
   - **Name**: `tawheed-educational-center`
   - **Database Password**: Choose a strong password (save it!)
   - **Region**: Choose closest to your users
6. Click "Create new project"
7. Wait 2-3 minutes for setup to complete

## Step 2: Get Your Project Credentials

1. Go to your project dashboard
2. Click on "Settings" in the left sidebar
3. Click on "API"
4. Copy these values:
   - **Project URL** (looks like: `https://your-project.supabase.co`)
   - **anon public key** (starts with `eyJ...`)

## Step 3: Update Your Code

1. Open `src/lib/supabase.ts`
2. Replace `YOUR_SUPABASE_URL` with your Project URL
3. Replace `YOUR_SUPABASE_ANON_KEY` with your anon public key

## Step 4: Create Database Tables

1. In your Supabase dashboard, click "SQL Editor" in the left sidebar
2. Click "New query"
3. Copy the entire content from `supabase-schema.sql` file
4. Paste it into the SQL editor
5. Click "Run" to execute the SQL

## Step 5: Test Your Setup

1. Go to "Table Editor" in your Supabase dashboard
2. You should see these tables:
   - `users` (with 3 default admin accounts)
   - `announcements`
   - `resources`
   - `uploads`
   - `suggestions`
   - `admissions`
   - `attendance_records`

## Step 6: Deploy to Vercel

1. Push your changes to GitHub
2. Vercel will automatically redeploy
3. Test your website - it should now work across multiple devices!

## Default Login Credentials

After setup, you can login with:
- **Admin**: `saeed` / `Archimedes`
- **Admin**: `hassan` / `Archimedes`
- **SMC**: `school` / `sunnah`

## Troubleshooting

### If you get connection errors:
1. Check your URL and API key in `supabase.ts`
2. Make sure your Supabase project is active
3. Check the browser console for error messages

### If tables don't appear:
1. Make sure you ran the SQL schema successfully
2. Check the SQL Editor for any error messages
3. Refresh your Supabase dashboard

### If real-time updates don't work:
1. Make sure you enabled real-time in the SQL schema
2. Check your internet connection
3. Verify your Supabase project is on the free tier

## Next Steps

Once setup is complete, your website will:
- ✅ Work across multiple devices
- ✅ Sync data in real-time
- ✅ Have proper user authentication
- ✅ Store all data in a professional database
- ✅ Support file uploads and downloads

## Support

If you need help:
1. Check the Supabase documentation: [https://supabase.com/docs](https://supabase.com/docs)
2. Join the Supabase Discord community
3. Check the GitHub issues for common problems
