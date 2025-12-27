import { createClient } from '@supabase/supabase-js';

// Replace these with your actual values from the Supabase Dashboard
// Settings > API > Project URL & anon public Key
const supabaseUrl = 'https://nltethfhuhcrakuejqhc.supabase.co/';
const supabaseKey = 'sb_publishable_Q_C11LrF2Oy4A1eLrfbq9Q_xNFQ2zq1';

export const supabase = createClient(supabaseUrl, supabaseKey);