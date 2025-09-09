# Configuration Guide

## Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
VITE_SUPABASE_URL=your_supabase_project_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

## Update Supabase Configuration

1. Open `src/lib/supabase.ts`
2. Replace the placeholder values:

```typescript
// Replace these with your actual Supabase project credentials
const supabaseUrl = 'YOUR_SUPABASE_URL'  // Replace with your project URL
const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY'  // Replace with your anon key
```

## Alternative: Use Environment Variables

If you want to use environment variables instead:

1. Create `.env.local` file with your Supabase credentials
2. Update `src/lib/supabase.ts`:

```typescript
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
```

## Getting Your Supabase Credentials

1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to Settings → API
4. Copy:
   - **Project URL** (looks like: `https://your-project.supabase.co`)
   - **anon public key** (starts with `eyJ...`)

## Security Note

- Never commit your `.env.local` file to version control
- The anon key is safe to use in frontend applications
- Row Level Security (RLS) is enabled on all tables for protection
