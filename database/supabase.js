"server-only"
import { createClient } from "@supabase/supabase-js"
import dotenv from 'dotenv';
dotenv.config({ path: ('./.env') });
// // For server components
// export function createServerSupabaseClient() {
//   const supabaseUrl = process.env.SUPABASE_URL
//   const supabaseKey = process.env.SUPABASE_ANON_KEY

//   if (!supabaseUrl || !supabaseKey) {
//     throw new Error("Missing Supabase environment variables")
//   }

//   return createClient(supabaseUrl, supabaseKey)
// }

// // For client components (singleton pattern)
// let clientSupabaseInstance: ReturnType<typeof createClient> | null = null

export function createSupabaseClient() {

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Missing Supabase environment variables")
  }

  return createClient(supabaseUrl, supabaseKey)
}