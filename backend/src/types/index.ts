export interface Profile {
  id: string
  email: string
  full_name?: string
  country?: string
  age_range?: string
  writing_style?: string
  created_at: string
  updated_at: string
}

export interface Letter {
  id: string
  user_id: string
  content: string
  country: string
  age_range: string
  writing_style: string
  author_name: string
  created_at: string
}

export interface Penpal {
  id: string
  user1_id: string
  user2_id: string
  status: 'pending' | 'accepted' | 'declined'
  connected_at: string
}

export interface PenpalLetter {
  id: string
  from_user_id: string
  to_user_id: string
  content: string
  status: 'in-transit' | 'delivered' | 'read'
  delivery_time?: string
  created_at: string
}

export interface JournalEntry {
  id: string
  user_id: string
  title: string
  content: string
  mood: string
  mood_intensity: number
  tags: string[]
  created_at: string
}

export interface AudioMemory {
  id: string
  user_id: string
  title: string
  description?: string
  audio_url?: string
  duration?: number
  created_at: string
}