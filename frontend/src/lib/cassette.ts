export interface Cassette {
  id: string
  title: string
  mood: string
  audioUrl: string
  createdAt: string
  expiresAt: string
}

export const CASSETTES_STORAGE_KEY = 'cassettes'


