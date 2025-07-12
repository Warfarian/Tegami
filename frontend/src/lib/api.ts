import { supabase } from './supabase'

const API_BASE_URL = 'http://localhost:3001/api'

// Types matching backend
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
  user1?: { full_name: string; country: string; writing_style: string }
  user2?: { full_name: string; country: string; writing_style: string }
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
  timestamp?: Date // For frontend compatibility
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

// Helper to get auth headers
const getAuthHeaders = async () => {
  const { data: { session } } = await supabase.auth.getSession()
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${session?.access_token}`
  }
}

// Letters API
export const lettersApi = {
  getAll: async (): Promise<Letter[]> => {
    const response = await fetch(`${API_BASE_URL}/letters`)
    if (!response.ok) throw new Error('Failed to fetch letters')
    return response.json()
  },

  getUserLetter: async (userId: string): Promise<Letter | null> => {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE_URL}/letters/user/${userId}`, { headers })
    if (response.status === 404) return null
    if (!response.ok) throw new Error('Failed to fetch user letter')
    return response.json()
  },

  create: async (letter: Omit<Letter, 'id' | 'created_at' | 'author_name'>): Promise<Letter> => {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE_URL}/letters`, {
      method: 'POST',
      headers,
      body: JSON.stringify(letter)
    })
    if (!response.ok) throw new Error('Failed to create letter')
    return response.json()
  },

  update: async (id: string, letter: Omit<Letter, 'id' | 'created_at' | 'author_name'>): Promise<Letter> => {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE_URL}/letters/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(letter)
    })
    if (!response.ok) throw new Error('Failed to update letter')
    return response.json()
  }
}

// Journal API
export const journalApi = {
  getByUserId: async (userId: string): Promise<JournalEntry[]> => {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE_URL}/journal/${userId}`, { headers })
    if (!response.ok) throw new Error('Failed to fetch journal entries')
    return response.json()
  },

  create: async (entry: Omit<JournalEntry, 'id' | 'created_at'>): Promise<JournalEntry> => {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE_URL}/journal`, {
      method: 'POST',
      headers,
      body: JSON.stringify(entry)
    })
    if (!response.ok) throw new Error('Failed to create journal entry')
    return response.json()
  },

  delete: async (id: string): Promise<void> => {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE_URL}/journal/${id}`, {
      method: 'DELETE',
      headers
    })
    if (!response.ok) throw new Error('Failed to delete journal entry')
  }
}

// Penpals API
export const penpalsApi = {
  getByUserId: async (userId: string): Promise<Penpal[]> => {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE_URL}/penpals/${userId}`, { headers })
    if (!response.ok) throw new Error('Failed to fetch penpals')
    return response.json()
  },

  createConnection: async (user1_id: string, user2_id: string): Promise<Penpal> => {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE_URL}/penpals`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ user1_id, user2_id })
    })
    if (!response.ok) {
      if (response.status === 409) {
        throw new Error('Penpal connection already exists')
      }
      throw new Error('Failed to create penpal connection')
    }
    return response.json()
  },

  getLetters: async (userId: string, type?: 'inbox' | 'outbox'): Promise<PenpalLetter[]> => {
    const headers = await getAuthHeaders()
    const url = type ? `${API_BASE_URL}/penpals/${userId}/letters?type=${type}` : `${API_BASE_URL}/penpals/${userId}/letters`
    const response = await fetch(url, { headers })
    if (!response.ok) throw new Error('Failed to fetch penpal letters')
    return response.json()
  },

  sendLetter: async (letter: Omit<PenpalLetter, 'id' | 'created_at' | 'status' | 'delivery_time'>): Promise<PenpalLetter> => {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE_URL}/penpals/letters`, {
      method: 'POST',
      headers,
      body: JSON.stringify(letter)
    })
    if (!response.ok) throw new Error('Failed to send letter')
    return response.json()
  },

  acceptRequest: async (requestId: string, userId: string): Promise<Penpal> => {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE_URL}/penpals/${requestId}/accept`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ userId })
    })
    if (!response.ok) throw new Error('Failed to accept penpal request')
    return response.json()
  },

  getRequests: async (userId: string): Promise<Penpal[]> => {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE_URL}/penpals/${userId}/requests`, { headers })
    if (!response.ok) throw new Error('Failed to fetch penpal requests')
    return response.json()
  },

  getRequestWithLetter: async (requestId: string): Promise<{ request: Penpal; letter: Letter | null }> => {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE_URL}/penpals/request/${requestId}/details`, { headers })
    if (!response.ok) throw new Error('Failed to fetch request details')
    return response.json()
  }
}

// Users API
export const usersApi = {
  getProfileById: async (userId: string): Promise<{ full_name: string; country: string } | null> => {
    const { data, error } = await supabase
      .from('profiles')
      .select('full_name, country')
      .eq('id', userId)
      .single()
    
    if (error) {
      console.error('Error fetching profile:', error)
      return null
    }
    return data
  }
}

// Audio API
export const audioApi = {
  getByUserId: async (userId: string): Promise<AudioMemory[]> => {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE_URL}/audio/${userId}`, { headers })
    if (!response.ok) throw new Error('Failed to fetch audio memories')
    return response.json()
  },

  create: async (memory: Omit<AudioMemory, 'id' | 'created_at'>): Promise<AudioMemory> => {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE_URL}/audio`, {
      method: 'POST',
      headers,
      body: JSON.stringify(memory)
    })
    if (!response.ok) throw new Error('Failed to create audio memory')
    return response.json()
  },

  delete: async (id: string): Promise<void> => {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE_URL}/audio/${id}`, {
      method: 'DELETE',
      headers
    })
    if (!response.ok) throw new Error('Failed to delete audio memory')
  }
}