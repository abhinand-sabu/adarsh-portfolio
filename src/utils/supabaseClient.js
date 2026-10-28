import { createClient } from '@supabase/supabase-js';

/**
 * Resolve environment variables across Vite (client/browser) and Node.js (SSR/testing).
 */
function getEnv(key) {
  try {
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[key]) {
      return import.meta.env[key];
    }
  } catch {
    // import.meta.env not available
  }
  try {
    if (typeof process !== 'undefined' && process.env && process.env[key]) {
      return process.env[key];
    }
  } catch {
    // process.env not available
  }
  return '';
}

export const SUPABASE_URL = getEnv('VITE_SUPABASE_URL') || 'https://ylnwdzlqmkfbleqyospr.supabase.co';
export const SUPABASE_ANON_KEY = getEnv('VITE_SUPABASE_ANON_KEY') || 'sb_publishable_JlSkE1vEJtH1rEd97tahMQ_-2FLcH1p';
export const STORAGE_BUCKET = 'portfolio-media';

const hasValidCredentials = Boolean(
  SUPABASE_URL &&
  SUPABASE_ANON_KEY &&
  SUPABASE_URL.startsWith('http') &&
  !SUPABASE_URL.includes('your-project') &&
  !SUPABASE_ANON_KEY.includes('your-')
);

let client = null;
if (hasValidCredentials) {
  try {
    client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  } catch {
    client = null;
  }
}

export const supabase = client;
export const isSupabaseConfigured = Boolean(client && hasValidCredentials);

