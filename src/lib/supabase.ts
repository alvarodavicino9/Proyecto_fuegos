// Cliente de Supabase (base de datos + autenticación del panel admin).
//
// Las credenciales salen de variables de entorno (ver .env.example). Si no
// están configuradas, `isSupabaseConfigured` queda en false y toda la app
// sigue funcionando con los datos estáticos de /src/data como respaldo
// (ver hooks/useMenu.ts y hooks/useSiteSettings.ts). Así el sitio nunca se
// rompe, incluso antes de crear el proyecto de Supabase.
//
// Nota: el cliente se usa sin el genérico `Database` de supabase-js a
// propósito. Los tipos de fila reales (ver src/types/db.ts) se aplican a
// mano en cada hook/página, que es más simple de mantener que sincronizar
// el schema completo con los tipos internos de supabase-js.

import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

// Cuando no hay credenciales, igual exportamos un cliente "apuntando a
// nada" para que el resto del código no tenga que hacer null-checks en
// todos lados; simplemente sus llamadas van a fallar y los hooks van a
// caer al fallback estático.
export const supabase: SupabaseClient = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-anon-key',
)
