import { useState, useEffect } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import * as Tabs from '@radix-ui/react-tabs'
import { 
  getPenpals, 
  getInboxLetters, 
  getOutboxLetters, 
  sendLetterToPenpal,
  type Penpal,
  type PenpalLetter 
} from '@/lib/mockData'
import { useAuth } from '@/contexts/AuthContext'
import { Inbox, Send, Users, PenTool, Clock, CheckCircle, ArrowLeft, LogOut } from 'lucide-react'

export default function Dashboard() {
  const { user, signOut, loading } = useAuth()
  const [penpals, setPenpals] = useState<Penpal[]>([])
  const [inboxLetters, setInboxLetters] = useState<PenpalLetter[]>([])
  const [outboxLetters, setOutboxLetters] = useState<PenpalLetter[]>([])
  const [selectedPenpal, setSelectedPenpal] = useState<string>('')
  const [letterContent, setLetterContent] = useState('')
  const [activeTab, setActiveTab] = useState('inbox')

  useEffect(() => {
    setPenpals(getPenpals())
    setInboxLetters(getInboxLetters())
    setOutboxLetters(getOutboxLetters())
  }, [])

  const handleSendLetter = () => {
    if (letterContent.trim() && selectedPenpal) {
      const newLetter = sendLetterToPenpal(letterContent, selectedPenpal)
      setOutboxLetters(prev => [newLetter, ...prev])
      setLetterContent('')
      setSelectedPenpal('')
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'in-transit':
        return <Clock className="w-4 h-4 text-amber-500" />
      case 'delivered':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      default:
        return null
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'in-transit':
        return 'In Transit'
      case 'delivered':
        return 'Delivered'
      default:
        return status
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center letter-writing-background">
        <div className="letter-paper max-w-md w-full mx-4">
          <p className="font-handwriting text-ink-blue text-center">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="min-h-screen py-8 px-4 letter-writing-background">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <Button 
            asChild
            variant="ghost" 
            className="font-handwriting text-ink-blue hover:text-ink"
          >
            <Link to="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back Home
            </Link>
          </Button>
          
          <div className="flex items-center gap-4">
            <span className="font-handwriting text-ink-blue">
              Welcome, {user.email}
            </span>
            <Button 
              variant="ghost"
              onClick={handleSignOut}
              className="font-handwriting text-ink-blue hover:text-ink"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>

        <div className="letter-paper">
          <h1 className="text-4xl font-script text-ink mb-8 text-center">Your Dashboard</h1>
          
          <Tabs.Root value={activeTab} onValueChange={setActiveTab} className="w-full">
            <Tabs.List className="flex space-x-1 bg-ink-blue/5 p-1 rounded-lg mb-6">
              <Tabs.Trigger 
                value="inbox"
                className="flex items-center gap-2 px-4 py-2 rounded-md font-handwriting text-ink-blue data-[state=active]:bg-paper data-[state=active]:text-ink data-[state=active]:shadow-sm transition-all"
              >
                <Inbox className="w-4 h-4" />
                📥 Inbox
              </Tabs.Trigger>
              <Tabs.Trigger 
                value="outbox"
                className="flex items-center gap-2 px-4 py-2 rounded-md font-handwriting text-ink-blue data-[state=active]:bg-paper data-[state=active]:text-ink data-[state=active]:shadow-sm transition-all"
              >
                <Send className="w-4 h-4" />
                📤 Outbox
              </Tabs.Trigger>
              <Tabs.Trigger 
                value="penpals"
                className="flex items-center gap-2 px-4 py-2 rounded-md font-handwriting text-ink-blue data-[state=active]:bg-paper data-[state=active]:text-ink data-[state=active]:shadow-sm transition-all"
              >
                <Users className="w-4 h-4" />
                👥 Penpals
              </Tabs.Trigger>
              <Tabs.Trigger 
                value="write"
                className="flex items-center gap-2 px-4 py-2 rounded-md font-handwriting text-ink-blue data-[state=active]:bg-paper data-[state=active]:text-ink data-[state=active]:shadow-sm transition-all"
              >
                <PenTool className="w-4 h-4" />
                ✍️ Write Letter
              </Tabs.Trigger>
            </Tabs.List>

            {/* Inbox Tab */}
            <Tabs.Content value="inbox" className="space-y-4">
              <h2 className="text-2xl font-script text-ink mb-4">Incoming Letters</h2>
              {inboxLetters.length === 0 ? (
                <div className="text-center py-8">
                  <p className="font-handwriting text-ink-blue">No letters yet. Start writing to your penpals!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {inboxLetters.map((letter) => (
                    <div key={letter.id} className="envelope-card">
                      <div className="flex justify-between items-start mb-3">
                        <span className="font-handwriting text-ink font-medium">From: {letter.fromUser}</span>
                        <span className="text-xs text-ink-blue/60 font-handwriting">
                          {letter.timestamp.toLocaleDateString()} at {letter.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="font-handwriting text-ink leading-relaxed">
                        {letter.content}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </Tabs.Content>

            {/* Outbox Tab */}
            <Tabs.Content value="outbox" className="space-y-4">
              <h2 className="text-2xl font-script text-ink mb-4">Sent Letters</h2>
              {outboxLetters.length === 0 ? (
                <div className="text-center py-8">
                  <p className="font-handwriting text-ink-blue">No sent letters yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {outboxLetters.map((letter) => (
                    <div key={letter.id} className="envelope-card">
                      <div className="flex justify-between items-start mb-3">
                        <span className="font-handwriting text-ink font-medium">To: {letter.toUser}</span>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(letter.status)}
                          <span className="text-xs text-ink-blue/60 font-handwriting">
                            {getStatusText(letter.status)}
                          </span>
                        </div>
                      </div>
                      <p className="font-handwriting text-ink leading-relaxed">
                        {letter.content}
                      </p>
                      <div className="mt-2 text-xs text-ink-blue/60 font-handwriting">
                        Sent: {letter.timestamp.toLocaleDateString()} at {letter.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Tabs.Content>

            {/* Penpals Tab */}
            <Tabs.Content value="penpals" className="space-y-4">
              <h2 className="text-2xl font-script text-ink mb-4">Your Penpals</h2>
              {penpals.length === 0 ? (
                <div className="text-center py-8">
                  <p className="font-handwriting text-ink-blue mb-4">No penpals yet.</p>
                  <Button asChild className="envelope-card hover:rotate-1 transition-transform duration-300">
                    <Link to="/write-invite">Find Penpals</Link>
                  </Button>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {penpals.map((penpal) => (
                    <div key={penpal.id} className="envelope-card">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-handwriting text-ink font-medium text-lg">{penpal.name}</h3>
                        <Button 
                          size="sm"
                          onClick={() => {
                            setSelectedPenpal(penpal.name)
                            setActiveTab('write')
                          }}
                          className="hover:rotate-1 transition-transform duration-300"
                        >
                          Write Letter
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className="px-2 py-1 bg-ink-blue/10 text-ink-blue rounded-full text-xs font-handwriting">
                          📍 {penpal.country}
                        </span>
                        <span className="px-2 py-1 bg-ink-blue/10 text-ink-blue rounded-full text-xs font-handwriting">
                          🎂 {penpal.age}
                        </span>
                        <span className="px-2 py-1 bg-ink-blue/10 text-ink-blue rounded-full text-xs font-handwriting">
                          ✍️ {penpal.writingStyle}
                        </span>
                      </div>
                      <p className="text-xs text-ink-blue/60 font-handwriting">
                        Connected: {penpal.connectedAt.toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </Tabs.Content>

            {/* Write Letter Tab */}
            <Tabs.Content value="write" className="space-y-6">
              <h2 className="text-2xl font-script text-ink mb-4">Write a Letter</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-handwriting text-ink-blue mb-2">Choose Penpal</label>
                  <Select value={selectedPenpal} onValueChange={setSelectedPenpal}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a penpal" />
                    </SelectTrigger>
                    <SelectContent>
                      {penpals.map(penpal => (
                        <SelectItem key={penpal.id} value={penpal.name}>{penpal.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-handwriting text-ink-blue mb-2">Your Letter</label>
                  <Textarea
                    value={letterContent}
                    onChange={(e) => setLetterContent(e.target.value)}
                    placeholder="Dear friend..."
                    className="min-h-[200px] font-handwriting text-ink resize-none"
                    rows={8}
                  />
                </div>

                <Button 
                  onClick={handleSendLetter}
                  disabled={!letterContent.trim() || !selectedPenpal}
                  className="envelope-card hover:-rotate-1 transition-transform duration-300"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Send Letter (2-minute delivery)
                </Button>
              </div>
            </Tabs.Content>
          </Tabs.Root>
        </div>
      </div>
    </div>
  )
}