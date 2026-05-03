import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

export async function submitContactForm(data) {
  if (!supabase) {
    console.warn('Supabase not configured. Contact form data:', data)
    return { success: true, message: 'Message received (demo mode - Supabase not configured)' }
  }

  const { error } = await supabase
    .from('contacts')
    .insert([
      {
        name: data.name,
        email: data.email,
        subject: data.subject,
        message: data.message,
        created_at: new Date().toISOString(),
      },
    ])

  if (error) {
    console.error('Supabase error:', error)
    throw new Error('Failed to send message. Please try again.')
  }

  return { success: true, message: 'Message sent successfully!' }
}
