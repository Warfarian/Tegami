import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import * as Tabs from '@radix-ui/react-tabs'
import { 
  MOOD_OPTIONS
} from '@/lib/journalData'
import { journalApi, type JournalEntry } from '@/lib/api'
import { useAuth } from '@/contexts/AuthContext'
import { PenTool, BookOpen, BarChart3, Trash2, Plus, Calendar, Tag, Smile, Zap, Heart, Leaf, Check, Minus, Moon, AlertTriangle, CloudRain, X, Layers, ArrowLeft } from 'lucide-react'

export default function Journal() {
  const { user } = useAuth()
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [activeTab, setActiveTab] = useState('write')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [selectedMood, setSelectedMood] = useState('')
  const [moodIntensity, setMoodIntensity] = useState(3)
  const [tags, setTags] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user) {
      loadJournalEntries()
    }
  }, [user])

  const loadJournalEntries = async () => {
    if (!user) return
    try {
      setLoading(true)
      const data = await journalApi.getByUserId(user.id)
      setEntries(data.map(entry => ({
        ...entry,
        timestamp: new Date(entry.created_at)
      })))
    } catch (error) {
      console.error('Error loading journal entries:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveEntry = async () => {
    if (!title.trim() || !content.trim() || !selectedMood || !user) return

    const tagArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
    
    try {
      setLoading(true)
      const newEntry = await journalApi.create({
        user_id: user.id,
        title: title.trim(),
        content: content.trim(),
        mood: selectedMood,
        mood_intensity: moodIntensity,
        tags: tagArray
      })

      setEntries(prev => [{
        ...newEntry,
        timestamp: new Date(newEntry.created_at)
      }, ...prev])
      
      // Reset form
      setTitle('')
      setContent('')
      setSelectedMood('')
      setMoodIntensity(3)
      setTags('')
      
      // Switch to entries tab to see the new entry
      setActiveTab('entries')
    } catch (error) {
      console.error('Error saving journal entry:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteEntry = async (id: string) => {
    try {
      setLoading(true)
      await journalApi.delete(id)
      setEntries(prev => prev.filter(entry => entry.id !== id))
    } catch (error) {
      console.error('Error deleting journal entry:', error)
    } finally {
      setLoading(false)
    }
  }

  const getMoodOption = (moodValue: string) => {
    return MOOD_OPTIONS.find(option => option.value === moodValue)
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  const getMoodStats = () => {
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

  const moodStats = getMoodStats()

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat relative" style={{backgroundImage: 'url(/books.JPG)'}}>
      <div className="absolute inset-0 bg-white bg-opacity-60"></div>
      <div className="letter-paper max-w-4xl w-full mx-4 relative z-10">
        <div className="mb-6 flex justify-between items-center">
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
        <h1 className="text-3xl font-script text-ink mb-6 text-center">Daily Journal</h1>
        
        <Tabs.Root value={activeTab} onValueChange={setActiveTab} className="w-full">
          <Tabs.List className="flex space-x-1 bg-ink-blue/5 p-1 rounded-lg mb-6">
            <Tabs.Trigger 
              value="write"
              className="flex items-center gap-2 px-4 py-2 rounded-md font-handwriting text-ink-blue data-[state=active]:bg-paper data-[state=active]:text-ink data-[state=active]:shadow-sm transition-all"
            >
              <PenTool className="w-4 h-4" />
Write Entry
            </Tabs.Trigger>
            <Tabs.Trigger 
              value="entries"
              className="flex items-center gap-2 px-4 py-2 rounded-md font-handwriting text-ink-blue data-[state=active]:bg-paper data-[state=active]:text-ink data-[state=active]:shadow-sm transition-all"
            >
              <BookOpen className="w-4 h-4" />
My Entries ({entries.length})
            </Tabs.Trigger>
            <Tabs.Trigger 
              value="stats"
              className="flex items-center gap-2 px-4 py-2 rounded-md font-handwriting text-ink-blue data-[state=active]:bg-paper data-[state=active]:text-ink data-[state=active]:shadow-sm transition-all"
            >
              <BarChart3 className="w-4 h-4" />
Mood Stats
            </Tabs.Trigger>
          </Tabs.List>

          {/* Write Entry Tab */}
          <Tabs.Content value="write" className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block font-handwriting text-ink mb-2">Entry Title</label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="What's on your mind today?"
                  className="font-handwriting"
                  maxLength={100}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-handwriting text-ink mb-2">How are you feeling?</label>
                  <Select value={selectedMood} onValueChange={setSelectedMood}>
                    <SelectTrigger className="font-handwriting">
                      <SelectValue placeholder="Select your mood..." />
                    </SelectTrigger>
                    <SelectContent>
                      {MOOD_OPTIONS.map((mood) => {
                        const IconComponent = {
                          Smile, Zap, Heart, Leaf, Check, Minus, Moon, AlertTriangle, CloudRain, X, Layers
                        }[mood.emoji] || Minus
                        return (
                          <SelectItem key={mood.value} value={mood.value}>
                            <div className="flex items-center gap-2">
                              <IconComponent className="w-4 h-4" />
                              <span>{mood.label}</span>
                            </div>
                          </SelectItem>
                        )
                      })}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block font-handwriting text-ink mb-2">
                    Intensity (1-5): {moodIntensity}
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={moodIntensity}
                    onChange={(e) => setMoodIntensity(Number(e.target.value))}
                    className="w-full h-2 bg-ink-blue/20 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs font-handwriting text-ink-blue mt-1">
                    <span>Low</span>
                    <span>High</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-handwriting text-ink mb-2">Tags (comma-separated)</label>
                <Input
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="work, family, goals, reflection..."
                  className="font-handwriting"
                />
              </div>

              <div>
                <label className="block font-handwriting text-ink mb-2">Your thoughts...</label>
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Dear journal, today I..."
                  className="min-h-[200px] font-handwriting resize-none"
                  rows={8}
                />
              </div>

              <Button 
                onClick={handleSaveEntry}
                disabled={!title.trim() || !content.trim() || !selectedMood || loading}
                className="w-full bg-ink hover:bg-ink-dark text-paper font-handwriting text-lg py-3"
              >
                <Plus className="w-4 h-4 mr-2" />
                {loading ? 'Saving...' : 'Save Journal Entry'}
              </Button>
            </div>
          </Tabs.Content>

          {/* Entries Tab */}
          <Tabs.Content value="entries" className="space-y-4">
            <h2 className="text-2xl font-script text-ink mb-4">Your Journal Entries</h2>
            {entries.length === 0 ? (
              <div className="text-center py-8">
                <p className="font-handwriting text-ink-blue text-lg mb-4">
                  No journal entries yet...
                </p>
                <p className="font-handwriting text-ink-light">
                  Start writing to capture your thoughts and feelings!
                </p>
                <Button 
                  onClick={() => setActiveTab('write')}
                  className="mt-4 font-handwriting"
                >
                  Write Your First Entry
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {entries.map((entry) => {
                  const moodOption = getMoodOption(entry.mood)
                  return (
                    <div key={entry.id} className={`envelope-card ${moodOption?.color || 'bg-gray-100 border-gray-300'}`}>
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-3">
                          {(() => {
                            const IconComponent = {
                              Smile, Zap, Heart, Leaf, Check, Minus, Moon, AlertTriangle, CloudRain, X, Layers
                            }[moodOption?.emoji || 'Minus'] || Minus
                            return <IconComponent className="w-6 h-6 text-ink-blue" />
                          })()}
                          <div>
                            <h3 className="font-handwriting text-ink font-semibold text-lg">{entry.title}</h3>
                            <div className="flex items-center gap-2 text-sm text-ink-blue/70">
                              <Calendar className="w-3 h-3" />
                              <span className="font-handwriting">{formatDate(entry.timestamp)}</span>
                              <span className="font-handwriting">• {moodOption?.label} ({entry.moodIntensity}/5)</span>
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteEntry(entry.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      <p className="font-handwriting text-ink leading-relaxed mb-3">
                        {entry.content}
                      </p>
                      
                      {entry.tags.length > 0 && (
                        <div className="flex items-center gap-2 flex-wrap">
                          <Tag className="w-3 h-3 text-ink-blue/50" />
                          {entry.tags.map((tag, index) => (
                            <span 
                              key={index}
                              className="px-2 py-1 bg-ink-blue/10 text-ink-blue rounded-full text-xs font-handwriting"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </Tabs.Content>

          {/* Stats Tab */}
          <Tabs.Content value="stats" className="space-y-6">
            <h2 className="text-2xl font-script text-ink mb-4">Mood Statistics</h2>
            {moodStats.length === 0 ? (
              <div className="text-center py-8">
                <p className="font-handwriting text-ink-blue">
                  No mood data yet. Start journaling to see your patterns!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {moodStats.map(({ mood, count, emoji }) => {
                    const moodOption = getMoodOption(mood)
                    return (
                      <div key={mood} className={`envelope-card ${moodOption?.color || 'bg-gray-100 border-gray-300'}`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {(() => {
                              const IconComponent = {
                                Smile, Zap, Heart, Leaf, Check, Minus, Moon, AlertTriangle, CloudRain, X, Layers
                              }[emoji] || Minus
                              return <IconComponent className="w-6 h-6 text-ink-blue" />
                            })()}
                            <div>
                              <h3 className="font-handwriting text-ink font-medium">
                                {moodOption?.label || mood}
                              </h3>
                              <p className="text-sm font-handwriting text-ink-blue">
                                {count} {count === 1 ? 'entry' : 'entries'}
                              </p>
                            </div>
                          </div>
                          <div className="text-2xl font-bold text-ink-blue">
                            {count}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
                
                <div className="envelope-card">
                  <h3 className="font-handwriting text-ink font-medium mb-3">Journal Summary</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-ink-blue">{entries.length}</div>
                      <div className="text-sm font-handwriting text-ink">Total Entries</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-ink-blue">{moodStats.length}</div>
                      <div className="text-sm font-handwriting text-ink">Different Moods</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-ink-blue flex justify-center">
                        {(() => {
                          const IconComponent = {
                            Smile, Zap, Heart, Leaf, Check, Minus, Moon, AlertTriangle, CloudRain, X, Layers
                          }[moodStats[0]?.emoji || 'Minus'] || Minus
                          return <IconComponent className="w-8 h-8" />
                        })()}
                      </div>
                      <div className="text-sm font-handwriting text-ink">Most Common</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-ink-blue">
                        {entries.length > 0 ? Math.round(entries.reduce((sum, entry) => sum + entry.moodIntensity, 0) / entries.length * 10) / 10 : 0}
                      </div>
                      <div className="text-sm font-handwriting text-ink">Avg Intensity</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Tabs.Content>
        </Tabs.Root>
      </div>
    </div>
  )
}