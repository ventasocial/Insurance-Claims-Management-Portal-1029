import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://ilxkpraopddgaojipwiz.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlseGtwcmFvcGRkZ2Fvamlwd2l6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMyNDEyMzksImV4cCI6MjA2ODgxNzIzOX0.iS0Zrdt7LcuGIuL4YNEM6bS6A1taIzbUh5N-UaYk-QE'

if(SUPABASE_URL == 'https://<PROJECT-ID>.supabase.co' || SUPABASE_ANON_KEY == '<ANON_KEY>' ){
  throw new Error('Missing Supabase variables');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
})

export default supabase;