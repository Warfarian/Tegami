export interface JournalEntry {
  id: string
  title: string
  content: string
  mood: string
  moodIntensity: number // 1-5 scale
  tags: string[]
  timestamp: Date
  userId?: string
}

export interface MoodOption {
  value: string
  label: string
  emoji: string // Now represents Lucide icon name
  color: string
}

export const MOOD_OPTIONS: MoodOption[] = [
  { value: 'happy', label: 'Happy', emoji: 'Smile', color: 'bg-yellow-100 border-yellow-300' },
  { value: 'excited', label: 'Excited', emoji: 'Zap', color: 'bg-orange-100 border-orange-300' },
  { value: 'grateful', label: 'Grateful', emoji: 'Heart', color: 'bg-green-100 border-green-300' },
  { value: 'peaceful', label: 'Peaceful', emoji: 'Leaf', color: 'bg-blue-100 border-blue-300' },
  { value: 'content', label: 'Content', emoji: 'Check', color: 'bg-teal-100 border-teal-300' },
  { value: 'neutral', label: 'Neutral', emoji: 'Minus', color: 'bg-gray-100 border-gray-300' },
  { value: 'tired', label: 'Tired', emoji: 'Moon', color: 'bg-purple-100 border-purple-300' },
  { value: 'stressed', label: 'Stressed', emoji: 'AlertTriangle', color: 'bg-red-100 border-red-300' },
  { value: 'anxious', label: 'Anxious', emoji: 'Zap', color: 'bg-yellow-200 border-yellow-400' },
  { value: 'sad', label: 'Sad', emoji: 'CloudRain', color: 'bg-blue-200 border-blue-400' },
  { value: 'frustrated', label: 'Frustrated', emoji: 'X', color: 'bg-red-200 border-red-400' },
  { value: 'overwhelmed', label: 'Overwhelmed', emoji: 'Layers', color: 'bg-gray-200 border-gray-400' }
]

const JOURNAL_STORAGE_KEY = 'journal_entries'

// Mock storage for journal entries
let mockJournalEntries: JournalEntry[] = [
  {
    id: '1',
    title: 'A Beautiful Morning',
    content: 'Woke up to the sound of birds chirping outside my window. The sun was streaming through the curtains, and I felt this overwhelming sense of gratitude for this simple moment. Sometimes the smallest things bring the greatest joy.',
    mood: 'grateful',
    moodIntensity: 4,
    tags: ['morning', 'nature', 'gratitude'],
    timestamp: new Date(Date.now() - 86400000), // 1 day ago
    userId: 'current-user'
  },
  {
    id: '2',
    title: 'Work Challenges',
    content: 'Had a really tough day at work today. The project deadline is approaching and everything seems to be going wrong. Feeling overwhelmed but trying to take it one step at a time.',
    mood: 'stressed',
    moodIntensity: 3,
    tags: ['work', 'challenges', 'deadline'],
    timestamp: new Date(Date.now() - 172800000), // 2 days ago
    userId: 'current-user'
  }
]

export const getJournalEntries = (): JournalEntry[] => {
  try {
    const stored = localStorage.getItem(JOURNAL_STORAGE_KEY)
    if (stored) {
      const entries = JSON.parse(stored)
      return entries.map((entry: any) => ({
        ...entry,
        timestamp: new Date(entry.timestamp)
      })).sort((a: JournalEntry, b: JournalEntry) => b.timestamp.getTime() - a.timestamp.getTime())
    }
  } catch (error) {
    console.error('Error loading journal entries:', error)
  }
  return [...mockJournalEntries].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
}

export const addJournalEntry = (entry: Omit<JournalEntry, 'id' | 'timestamp'>): JournalEntry => {
  const newEntry: JournalEntry = {
    ...entry,
    id: Date.now().toString(),
    timestamp: new Date(),
    userId: 'current-user'
  }
  
  try {
    const existingEntries = getJournalEntries()
    const updatedEntries = [newEntry, ...existingEntries]
    localStorage.setItem(JOURNAL_STORAGE_KEY, JSON.stringify(updatedEntries))
  } catch (error) {
    console.error('Error saving journal entry:', error)
    mockJournalEntries.unshift(newEntry)
  }
  
  return newEntry
}

export const deleteJournalEntry = (id: string): void => {
  try {
    const existingEntries = getJournalEntries()
    const updatedEntries = existingEntries.filter(entry => entry.id !== id)
    localStorage.setItem(JOURNAL_STORAGE_KEY, JSON.stringify(updatedEntries))
  } catch (error) {
    console.error('Error deleting journal entry:', error)
    const index = mockJournalEntries.findIndex(entry => entry.id === id)
    if (index > -1) {
      mockJournalEntries.splice(index, 1)
    }
  }
}

export const getMoodStats = (): { mood: string; count: number; emoji: string }[] => {
  const entries = getJournalEntries()
  const moodCounts: Record<string, number> = {}
  
  entries.forEach(entry => {
    moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1
  })
  
  return Object.entries(moodCounts)
    .map(([mood, count]) => {
      const moodOption = MOOD_OPTIONS.find(option => option.value === mood)
      return {
        mood,
        count,
        emoji: moodOption?.emoji || 'Minus'
      }
    })
    .sort((a, b) => b.count - a.count)
}
