import { useState, useEffect, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Play, Pause, Trash2, ArrowLeft } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { audioApi, type AudioMemory } from '../lib/api'
import CassetteTape from '../components/CassetteTape'

export default function CassetteWall() {
  const { user } = useAuth()
  const [audioMemories, setAudioMemories] = useState<AudioMemory[]>([])
  const [playingId, setPlayingId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const audioRefs = useRef<Record<string, HTMLAudioElement>>({})

  useEffect(() => {
    if (user) {
      loadAudioMemories()
    } else {
      setLoading(false)
    }
  }, [user])

  const navigate = useNavigate()

  const loadAudioMemories = async () => {
    if (!user) return
    
    try {
      setLoading(true)
      const memories = await audioApi.getByUserId(user.id)
      setAudioMemories(memories)
    } catch (error) {
      console.error('Error loading audio memories:', error)
      setAudioMemories([])
    } finally {
      setLoading(false)
    }
  }

  const handlePlayPause = (memory: AudioMemory) => {
    if (!memory.audio_url) return
    
    const audio = audioRefs.current[memory.id]
    
    if (!audio) {
      // Create new audio element
      const newAudio = new Audio(memory.audio_url)
      audioRefs.current[memory.id] = newAudio
      
      newAudio.onended = () => {
        setPlayingId(null)
      }
      
      newAudio.play()
      setPlayingId(memory.id)
    } else {
      if (playingId === memory.id) {
        audio.pause()
        setPlayingId(null)
      } else {
        // Stop any currently playing audio
        Object.values(audioRefs.current).forEach(a => a.pause())
        audio.currentTime = 0
        audio.play()
        setPlayingId(memory.id)
      }
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this audio memory?')) {
      try {
        await audioApi.delete(id)
        setAudioMemories(prev => prev.filter(m => m.id !== id))
        
        // Clean up audio reference
        if (audioRefs.current[id]) {
          audioRefs.current[id].pause()
          delete audioRefs.current[id]
        }
        
        if (playingId === id) {
          setPlayingId(null)
        }
      } catch (error) {
        console.error('Error deleting audio memory:', error)
        alert('Failed to delete audio memory. Please try again.')
      }
    }
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

  const formatDuration = (duration?: number) => {
    if (!duration) return ''
    const minutes = Math.floor(duration / 60)
    const seconds = duration % 60
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <div className="min-h-screen p-4 pt-12 bg-cover bg-center bg-no-repeat relative" style={{backgroundImage: 'url(/cassette.jpg)'}}>
      <div className="absolute inset-0 bg-white bg-opacity-80"></div>
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="mb-6">
          <Button 
            asChild
            variant="ghost" 
            className="font-handwriting text-ink-blue hover:text-ink"
          >
            <Link to={user ? "/dashboard" : "/"}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              {user ? "Back to Dashboard" : "Back Home"}
            </Link>
          </Button>
        </div>
        <div className="text-center mb-12">
          <h1 className="text-4xl font-script text-ink mb-4">Audio Memories 📼</h1>
          <p className="font-handwriting text-ink-blue text-lg">
            Your personal collection of audio memories
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

        {loading ? (
          <div className="text-center py-12">
            <div className="letter-paper max-w-md mx-auto">
              <p className="font-handwriting text-ink-blue text-lg">
                Loading your audio memories...
              </p>
            </div>
          </div>
        ) : audioMemories.length === 0 ? (
          <div className="text-center py-12">
            <div className="letter-paper max-w-md mx-auto">
              <p className="font-handwriting text-ink-blue text-lg mb-4">
                No audio memories yet...
              </p>
              <p className="font-handwriting text-ink-light">
                Record your first memory to get started!
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {audioMemories.map((memory) => (
              <div
                key={memory.id}
                className="letter-paper p-6 bg-gradient-to-br from-white to-gray-50 border-gray-200"
              >
                {/* Cassette Visual */}
                <div className="mb-4 flex justify-center">
                  <CassetteTape 
                    audioSrc={memory.audio_url}
                    isPlaying={playingId === memory.id}
                    onPlay={() => handlePlayPause(memory)}
                    onPause={() => handlePlayPause(memory)}
                    onStop={() => {
                      if (audioRefs.current[memory.id]) {
                        audioRefs.current[memory.id].pause()
                        audioRefs.current[memory.id].currentTime = 0
                      }
                      setPlayingId(null)
                    }}
                    size="medium"
                    title={memory.title}
                  />
                </div>

                {/* Memory Info */}
                <div className="text-center mb-4">
                  <h3 className="font-handwriting text-ink text-lg font-semibold mb-1">
                    {memory.title}
                  </h3>
                  {memory.description && (
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <span className="font-handwriting text-ink-blue italic">
                        "{memory.description}"
                      </span>
                    </div>
                  )}
                  <div className="flex items-center justify-center gap-2 text-xs font-handwriting text-ink-light">
                    <span>{formatCreatedAt(memory.created_at)}</span>
                    {memory.duration && (
                      <>
                        <span>•</span>
                        <span>{formatDuration(memory.duration)}</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Controls */}
                <div className="flex justify-center gap-2">
                  <Button
                    onClick={() => handlePlayPause(memory)}
                    size="sm"
                    className="flex items-center gap-1"
                    disabled={!memory.audio_url}
                  >
                    {playingId === memory.id ? (
                      <Pause className="w-4 h-4" />
                    ) : (
                      <Play className="w-4 h-4" />
                    )}
                    {playingId === memory.id ? 'Pause' : 'Play'}
                  </Button>
                  <Button
                    onClick={() => handleDelete(memory.id)}
                    size="sm"
                    variant="outline"
                    className="flex items-center gap-1 text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}