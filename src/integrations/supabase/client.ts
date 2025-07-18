// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://oxhglrqrhbpjkpcoufww.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im94aGdscnFyaGJwamtwY291Znd3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIyNzUxNTgsImV4cCI6MjA2Nzg1MTE1OH0.tS9vJ2p5kWK6_E1lvMxB52TiM85DP_bHo3cpVlbY8pA";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});