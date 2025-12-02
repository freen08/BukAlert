import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://fiewmaftcszgzvzvzjum.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZpZXdtYWZ0Y3N6Z3p2enZ6anVtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ2ODA0MjYsImV4cCI6MjA4MDI1NjQyNn0.OrpsxDP-X1qYo-vAt3N2Kn6V3_lNOMcpbgDXVMjwSp8'

export const supabase = createClient(supabaseUrl, supabaseKey)

export type User = {
  id: string
  email: string
  full_name: string
}

export type EmergencyTeam = {
  id: string
  name: string
  type: 'mdrrm' | 'police' | 'fire'
  hotline: string
  latitude: number
  longitude: number
  address: string
}

export type Bookmark = {
  id: string
  user_id: string
  team_id: string
  created_at: string
}

export type CallHistory = {
  id: string
  user_id: string
  team_id: string
  call_type: 'video' | 'voice'
  timestamp: string
  duration?: number
}
