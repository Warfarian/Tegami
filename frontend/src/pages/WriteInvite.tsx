import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { getLetters, addLetter, countries, ageRanges, writingStyles, type Letter } from '@/lib/mockData'
import { useAuth } from '@/contexts/AuthContext'
import { ArrowLeft, Send, Eye, Lock } from 'lucide-react'

export default function WriteInvite() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [mode, setMode] = useState<'browse' | 'write'>('browse')
  const [formData, setFormData] = useState<Omit<Letter, 'id' | 'timestamp' | 'author'>>({
    content: '',
    country: '',
    age: '',
    writingStyle: ''
  })
  const [showPreview, setShowPreview] = useState(false)
  const [letters, setLetters] = useState<Letter[]>(getLetters())

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      alert('Please log in to write a letter')
      return
    }
    if (isValid) {
      const newLetter = addLetter(formData)
      setLetters(prevLetters => [newLetter, ...prevLetters])
      setFormData({ content: '', country: '', age: '', writingStyle: '' })
      setShowPreview(false)
      setMode('browse')
    }
  }

  const handleWriteClick = () => {
    if (!user) {
      alert('Please log in to write a letter')
      return
    }
    setMode('write')
  }

  const handleReplyClick = () => {
    if (!user) {
      alert('Please log in to reply to letters')
      return
    }
    // Future: implement reply functionality
    alert('Reply functionality coming soon!')
  }

  const characterCount = formData.content.length
  const isValid = formData.content.trim() && formData.country && formData.age && formData.writingStyle && characterCount <= 500

  if (mode === 'write') {
    return (
      <div className="min-h-screen py-8 px-4 letter-writing-background">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <Button 
              variant="ghost" 
              onClick={() => setMode('browse')}
              className="font-handwriting text-ink-blue hover:text-ink"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Browse
            </Button>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Writing Form */}
            <div className="letter-paper">
              <h1 className="text-3xl font-script text-ink mb-6 text-center">Write Your Letter</h1>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-handwriting text-ink-blue mb-2">Country</label>
                    <Input
                      value={formData.country}
                      onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
                      placeholder="Enter your country"
                      className="font-handwriting"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-handwriting text-ink-blue mb-2">Age Range</label>
                    <Select value={formData.age} onValueChange={(value) => setFormData(prev => ({ ...prev, age: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select age" />
                      </SelectTrigger>
                      <SelectContent>
                        {ageRanges.map(age => (
                          <SelectItem key={age} value={age}>{age}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-handwriting text-ink-blue mb-2">Writing Style</label>
                    <Select value={formData.writingStyle} onValueChange={(value) => setFormData(prev => ({ ...prev, writingStyle: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select style" />
                      </SelectTrigger>
                      <SelectContent>
                        {writingStyles.map(style => (
                          <SelectItem key={style} value={style}>{style}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-handwriting text-ink-blue">Your Letter</label>
                    <span className={`text-sm font-handwriting ${characterCount > 500 ? 'text-stamp-red' : 'text-ink-blue/60'}`}>
                      {characterCount}/500
                    </span>
                  </div>
                  <Textarea
                    value={formData.content}
                    onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Dear future penpal..."
                    className="min-h-[200px] font-handwriting text-ink resize-none"
                    maxLength={500}
                  />
                </div>

                <div className="flex gap-4">
                  <Button 
                    type="button"
                    variant="outline"
                    onClick={() => setShowPreview(!showPreview)}
                    className="envelope-card hover:rotate-1 transition-transform duration-300"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    {showPreview ? 'Hide' : 'Show'} Preview
                  </Button>
                  
                  <Button 
                    type="submit"
                    disabled={!isValid}
                    className="envelope-card hover:-rotate-1 transition-transform duration-300"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Send Letter
                  </Button>
                </div>
              </form>
            </div>

            {/* Preview Pane */}
            {showPreview && (
              <div className="letter-paper">
                <h2 className="text-2xl font-script text-ink mb-4 text-center">Preview</h2>
                
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {formData.country && (
                      <span className="px-3 py-1 bg-ink-blue/10 text-ink-blue rounded-full text-sm font-handwriting">
                        📍 {formData.country}
                      </span>
                    )}
                    {formData.age && (
                      <span className="px-3 py-1 bg-ink-blue/10 text-ink-blue rounded-full text-sm font-handwriting">
                        🎂 {formData.age}
                      </span>
                    )}
                    {formData.writingStyle && (
                      <span className="px-3 py-1 bg-ink-blue/10 text-ink-blue rounded-full text-sm font-handwriting">
                        ✍️ {formData.writingStyle}
                      </span>
                    )}
                  </div>
                  
                  <div className="border-l-4 border-ink-blue/20 pl-4">
                    <p className="font-handwriting text-ink leading-relaxed whitespace-pre-wrap">
                      {formData.content || "Your letter will appear here..."}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8 px-4 letter-writing-background">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-script text-ink mb-4">Penpal Letters</h1>
          <p className="text-lg font-handwriting text-ink-blue mb-6">
            Browse heartfelt letters from people around the world
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={handleWriteClick}
              className="envelope-card hover:rotate-1 transition-transform duration-300 text-lg py-6 px-8"
            >
              {!user && <Lock className="w-4 h-4 mr-2" />}
              Write Your Letter
            </Button>
            
            <Button 
              asChild
              variant="outline"
              className="envelope-card hover:-rotate-1 transition-transform duration-300 text-lg py-6 px-8"
            >
              <Link to="/">Back Home</Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2">
          {letters.map((letter) => (
            <div key={letter.id} className="letter-card hover:rotate-1 transition-transform duration-300">
              {/* Letter Header */}
              <div className="letter-header mb-6">
                <div className="flex justify-between items-start mb-2">
                  <div className="letter-address">
                    <div className="text-sm font-handwriting text-ink-blue/70 mb-1">
                      From: A Friend in {letter.country}
                    </div>
                    <div className="text-xs font-handwriting text-ink-blue/50">
                      {letter.timestamp.toLocaleDateString()}
                    </div>
                  </div>
                  <div className="postage-stamp">
                    <div className="stamp-inner">
                      <div className="text-xs font-handwriting text-white">{letter.age}</div>
                    </div>
                  </div>
                </div>
                
                {/* Letter greeting */}
                <div className="letter-greeting mt-4 mb-4">
                  <p className="font-handwriting text-ink text-lg">Dear Future Penpal,</p>
                </div>
              </div>
              
              {/* Letter content */}
              <div className="letter-content mb-6">
                <p className="font-handwriting text-ink leading-relaxed text-base letter-text">
                  {letter.content}
                </p>
              </div>
              
              {/* Letter footer */}
              <div className="letter-footer">
                <div className="flex justify-between items-end">
                  <div className="letter-signature">
                    <p className="font-handwriting text-ink text-sm mb-1">Warmly,</p>
                    <p className="font-script text-ink text-lg">A {letter.writingStyle} Writer</p>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={handleReplyClick}
                    className="letter-reply-btn hover:rotate-1 transition-transform duration-300"
                  >
                    {!user && <Lock className="w-4 h-4 mr-2" />}
                    📝 Reply
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}