import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Play, Pause, Trash2 } from 'lucide-react'
import { CASSETTES_STORAGE_KEY, type Cassette } from '../lib/cassette'
import CassetteTape from '../components/CassetteTape'

export default function CassetteWall() {
  const [cassettes, setCassettes] = useState<Cassette[]>([])
  const [playingId, setPlayingId] = useState<string | null>(null)
  const audioRefs = useRef<Record<string, HTMLAudioElement>>({})

  useEffect(() => {
    loadCassettes()
    // Check for expired cassettes every minute
    const interval = setInterval(loadCassettes, 60000)
    return () => clearInterval(interval)
  }, [])

  const navigate = useNavigate()

  const loadCassettes = () => {
    const stored = JSON.parse(localStorage.getItem(CASSETTES_STORAGE_KEY) || '[]')
    const now = new Date()
    
    // Filter out expired cassettes
    const validCassettes = stored.filter((cassette: Cassette) => {
      return new Date(cassette.expiresAt) > now
    })
    
    // Update localStorage if any cassettes were removed
    if (validCassettes.length !== stored.length) {
      localStorage.setItem(CASSETTES_STORAGE_KEY, JSON.stringify(validCassettes))
    }
    
    setCassettes(validCassettes.reverse()) // Show newest first
  }
  const handlePlayPause = (cassette: Cassette) => {
    const audio = audioRefs.current[cassette.id]
    
    if (!audio) {
      // Create new audio element
      const newAudio = new Audio(cassette.audioUrl)
      audioRefs.current[cassette.id] = newAudio
      
      newAudio.onended = () => {
        setPlayingId(null)
      }
      
      newAudio.play()
      setPlayingId(cassette.id)
    } else {
      if (playingId === cassette.id) {
        audio.pause()
        setPlayingId(null)
      } else {
        // Stop any currently playing audio
        Object.values(audioRefs.current).forEach(a => a.pause())
        audio.currentTime = 0
        audio.play()
        setPlayingId(cassette.id)
      }
    }
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this vent?')) {
      const updated = cassettes.filter(c => c.id !== id)
      setCassettes(updated)
      localStorage.setItem(CASSETTES_STORAGE_KEY, JSON.stringify(updated))
      
      // Clean up audio reference
      if (audioRefs.current[id]) {
        audioRefs.current[id].pause()
        delete audioRefs.current[id]
      }
      
      if (playingId === id) {
        setPlayingId(null)
      }
    }
  }

  const getTimeRemaining = (expiresAt: string) => {
    const now = new Date()
    const expires = new Date(expiresAt)
    const diff = expires.getTime() - now.getTime()
    
    if (diff <= 0) return 'Expired'
    
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    
    if (hours > 0) {
      return `${hours}h ${minutes}m left`
    }
    return `${minutes}m left`
  }

  const formatCreatedAt = (createdAt: string) => {
    const date = new Date(createdAt)
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  return (
    <div className="min-h-screen p-4 pt-12 bg-cover bg-center bg-no-repeat relative" style={{backgroundImage: 'url(/cassette.jpg)'}}>
      <div className="absolute inset-0 bg-white bg-opacity-80"></div>
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-script text-ink mb-4">Audio Memories 📼</h1>
          <p className="font-handwriting text-ink-blue text-lg">
            Anonymous audio recordings that disappear after 24 hours
          </p>
          <div className="mt-4">
            <Button
              onClick={() => navigate('/record')}
              className="bg-ink hover:bg-ink-dark text-paper px-8 py-3 font-handwriting text-lg shadow-lg hover:shadow-xl transition-all"
            >
              Record New Memory 🎙️
            </Button>
            
            {/* Decorative elements */}
            <div className="mt-8 flex justify-center items-center gap-4 opacity-30">
              <div className="w-16 h-0.5 bg-ink"></div>
              <span className="text-ink text-2xl">🎵</span>
              <div className="w-16 h-0.5 bg-ink"></div>
            </div>
          </div>
        </div>

        {cassettes.length === 0 ? (
          <div className="text-center py-12">
            <div className="letter-paper max-w-md mx-auto">
              <p className="font-handwriting text-ink-blue text-lg mb-4">
                No audio memories yet...
              </p>
              <p className="font-handwriting text-ink-light">
                Be the first to share what's on your mind!
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {cassettes.map((cassette) => (
              <div
                key={cassette.id}
                className="letter-paper p-6 bg-gradient-to-br from-white to-gray-50 border-gray-200"
              >
                {/* Cassette Visual */}
                <div className="mb-4 flex justify-center">
                  <CassetteTape 
                    audioSrc={cassette.audioUrl}
                    isPlaying={playingId === cassette.id}
                    onPlay={() => handlePlayPause(cassette)}
                    onPause={() => handlePlayPause(cassette)}
                    onStop={() => {
                      if (audioRefs.current[cassette.id]) {
                        audioRefs.current[cassette.id].pause()
                        audioRefs.current[cassette.id].currentTime = 0
                      }
                      setPlayingId(null)
                    }}
                    size="medium"
                    title={cassette.title}
                  />
                </div>

                {/* Cassette Info */}
                <div className="text-center mb-4">
                  <h3 className="font-handwriting text-ink text-lg font-semibold mb-1">
                    {cassette.title}
                  </h3>
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="font-handwriting text-ink-blue italic">
                      "{cassette.mood}"
                    </span>
                  </div>
                  <p className="text-xs font-handwriting text-ink-light">
                    {formatCreatedAt(cassette.createdAt)}
                  </p>
                </div>

                {/* Controls */}
                <div className="flex justify-center gap-2 mb-3">
                  <Button
                    onClick={() => handlePlayPause(cassette)}
                    size="sm"
                    className="flex items-center gap-1"
                  >
                    {playingId === cassette.id ? (
                      <Pause className="w-4 h-4" />
                    ) : (
                      <Play className="w-4 h-4" />
                    )}
                    {playingId === cassette.id ? 'Pause' : 'Play'}
                  </Button>
                  <Button
                    onClick={() => handleDelete(cassette.id)}
                    size="sm"
                    variant="outline"
                    className="flex items-center gap-1 text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                {/* Expiry Timer */}
                <div className="text-center">
                  <p className="text-xs font-handwriting text-ink-light">
                    ⏰ {getTimeRemaining(cassette.expiresAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}