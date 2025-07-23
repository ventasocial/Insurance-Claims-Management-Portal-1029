// Versión simulada para desarrollo local
// En un entorno de producción, esto se reemplazaría con credenciales reales

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://example.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

// Objeto mock para desarrollo local cuando no hay credenciales reales
export const supabase = {
  from: (table) => ({
    select: (columns) => Promise.resolve({ data: [], error: null }),
    insert: (data) => Promise.resolve({ data, error: null }),
    update: (data) => Promise.resolve({ data, error: null }),
    delete: () => Promise.resolve({ data: null, error: null }),
    eq: () => ({
      select: () => Promise.resolve({ data: [], error: null }),
      delete: () => Promise.resolve({ data: null, error: null })
    })
  }),
  auth: {
    signUp: () => Promise.resolve({ data: null, error: null }),
    signIn: () => Promise.resolve({ data: null, error: null }),
    signOut: () => Promise.resolve({ error: null })
  }
};

// Log para desarrollo
console.log('Usando cliente Supabase simulado para desarrollo');