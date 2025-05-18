// auth.js

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// 👇 Reemplaza con tus datos reales
const supabaseUrl = 'https://bnljcfeqkmhjrdhrnvpt.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJubGpjZmVxa21oanJkaHJudnB0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc1MjQ4NjgsImV4cCI6MjA2MzEwMDg2OH0.JY9hfOD6AHYpNCXfGeF4yXbpMobVzHordN_mUtiZuWY';

// ✅ Esta es la forma correcta de crear el cliente Supabase
export const supabase = createClient(supabaseUrl, supabaseKey);

// Guardar sesión en localStorage automáticamente
supabase.auth.onAuthStateChange((event, session) => {
  if (session) {
    localStorage.setItem('user', JSON.stringify(session.user));
  } else {
    localStorage.removeItem('user');
  }
});