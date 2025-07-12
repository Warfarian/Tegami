export interface Letter {
  id: string
  content: string
  country: string
  age: string
  writingStyle: string
  timestamp: Date
  author?: string
}

export interface PenpalLetter {
  id: string
  content: string
  fromUser: string
  toUser: string
  timestamp: Date
  status: 'in-transit' | 'delivered' | 'read'
  deliveryTime?: Date
}

export interface Penpal {
  id: string
  name: string
  country: string
  age: string
  writingStyle: string
  connectedAt: Date
}

// Mock storage for letters
let mockLetters: Letter[] = [
  {
    id: '1',
    content: 'Hello there! I\'m looking for a thoughtful penpal to share stories about life, books, and dreams. I love rainy afternoons with tea and good conversations.',
    country: 'Japan',
    age: '25-30',
    writingStyle: 'Thoughtful',
    timestamp: new Date('2024-01-15'),
    author: 'Anonymous'
  },
  {
    id: '2', 
    content: 'Seeking a creative soul to exchange letters about art, music, and the beauty in everyday moments. I believe in the magic of handwritten words.',
    country: 'France',
    age: '20-25',
    writingStyle: 'Poetic',
    timestamp: new Date('2024-01-14'),
    author: 'Anonymous'
  },
  {
    id: '3',
    content: 'Adventure seeker here! Would love to share tales of travels, hiking experiences, and outdoor photography. Let\'s inspire each other to explore!',
    country: 'Canada',
    age: '30-35',
    writingStyle: 'Adventurous',
    timestamp: new Date('2024-01-13'),
    author: 'Anonymous'
  }
]

// Mock storage for penpal letters
let mockPenpalLetters: PenpalLetter[] = [
  {
    id: 'pl1',
    content: 'Thank you for accepting my penpal request! I\'m excited to share stories with you. How has your week been?',
    fromUser: 'Yuki from Japan',
    toUser: 'current-user',
    timestamp: new Date(Date.now() - 3600000), // 1 hour ago
    status: 'delivered'
  },
  {
    id: 'pl2',
    content: 'I hope this letter finds you well! I wanted to tell you about the beautiful cherry blossoms I saw today...',
    fromUser: 'current-user',
    toUser: 'Yuki from Japan',
    timestamp: new Date(Date.now() - 7200000), // 2 hours ago
    status: 'delivered'
  }
]

// Mock storage for penpals
let mockPenpals: Penpal[] = [
  {
    id: 'p1',
    name: 'Yuki from Japan',
    country: 'Japan',
    age: '25-30',
    writingStyle: 'Thoughtful',
    connectedAt: new Date(Date.now() - 86400000) // 1 day ago
  },
  {
    id: 'p2',
    name: 'Marie from France',
    country: 'France',
    age: '20-25',
    writingStyle: 'Poetic',
    connectedAt: new Date(Date.now() - 172800000) // 2 days ago
  }
]

export const getLetters = (): Letter[] => {
  return [...mockLetters].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
}

export const addLetter = (letter: Omit<Letter, 'id' | 'timestamp'>): Letter => {
  const newLetter: Letter = {
    ...letter,
    id: Date.now().toString(),
    timestamp: new Date(),
    author: 'Anonymous'
  }
  mockLetters.push(newLetter)
  return newLetter
}

export const getPenpals = (): Penpal[] => {
  return [...mockPenpals].sort((a, b) => b.connectedAt.getTime() - a.connectedAt.getTime())
}

export const getInboxLetters = (): PenpalLetter[] => {
  return mockPenpalLetters
    .filter(letter => letter.toUser === 'current-user')
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
}

export const getOutboxLetters = (): PenpalLetter[] => {
  return mockPenpalLetters
    .filter(letter => letter.fromUser === 'current-user')
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
}

export const sendLetterToPenpal = (content: string, toPenpal: string): PenpalLetter => {
  const newLetter: PenpalLetter = {
    id: `pl${Date.now()}`,
    content,
    fromUser: 'current-user',
    toUser: toPenpal,
    timestamp: new Date(),
    status: 'in-transit',
    deliveryTime: new Date(Date.now() + 120000) // 2 minutes delay
  }
  
  mockPenpalLetters.push(newLetter)
  
  // Simulate delivery after 2 minutes
  setTimeout(() => {
    const letter = mockPenpalLetters.find(l => l.id === newLetter.id)
    if (letter) {
      letter.status = 'delivered'
    }
  }, 120000)
  
  return newLetter
}

export const countries = [
  'United States', 'Canada', 'United Kingdom', 'Australia', 'Germany', 
  'France', 'Japan', 'South Korea', 'Brazil', 'Mexico', 'Italy', 'Spain',
  'Netherlands', 'Sweden', 'Norway', 'Denmark', 'Finland', 'Switzerland',
  'Austria', 'Belgium', 'Portugal', 'Ireland', 'New Zealand', 'Singapore'
]

export const ageRanges = [
  '18-22', '23-27', '28-32', '33-37', '38-42', '43-47', '48-52', '53-62', '63-72', '73-79', '80+'
]

export const writingStyles = [
  'Thoughtful', 'Poetic', 'Humorous', 'Adventurous', 'Philosophical', 
  'Creative', 'Casual', 'Deep', 'Inspiring', 'Nostalgic'
]
