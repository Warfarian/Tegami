import { useState, useEffect } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import * as Tabs from '@radix-ui/react-tabs'
import { penpalsApi, lettersApi } from '@/lib/api'
import { useAuth } from '@/contexts/AuthContext'
import { Inbox, Send, Users, PenTool, Clock, CheckCircle, ArrowLeft, LogOut, BookOpen, Mic } from 'lucide-react'
import ReactCountryFlag from 'react-country-flag'

// Country code mapping for flags
const countryCodeMap: { [key: string]: string } = {
  'Afghanistan': 'AF', 'Albania': 'AL', 'Algeria': 'DZ', 'Andorra': 'AD', 'Angola': 'AO',
  'Antigua and Barbuda': 'AG', 'Argentina': 'AR', 'Armenia': 'AM', 'Australia': 'AU', 'Austria': 'AT',
  'Azerbaijan': 'AZ', 'Bahamas': 'BS', 'Bahrain': 'BH', 'Bangladesh': 'BD', 'Barbados': 'BB',
  'Belarus': 'BY', 'Belgium': 'BE', 'Belize': 'BZ', 'Benin': 'BJ', 'Bhutan': 'BT',
  'Bolivia': 'BO', 'Bosnia and Herzegovina': 'BA', 'Botswana': 'BW', 'Brazil': 'BR', 'Brunei': 'BN',
  'Bulgaria': 'BG', 'Burkina Faso': 'BF', 'Burundi': 'BI', 'Cambodia': 'KH', 'Cameroon': 'CM',
  'Canada': 'CA', 'Cape Verde': 'CV', 'Central African Republic': 'CF', 'Chad': 'TD', 'Chile': 'CL',
  'China': 'CN', 'Colombia': 'CO', 'Comoros': 'KM', 'Congo': 'CG', 'Costa Rica': 'CR',
  'Croatia': 'HR', 'Cuba': 'CU', 'Cyprus': 'CY', 'Czech Republic': 'CZ', 'Denmark': 'DK',
  'Djibouti': 'DJ', 'Dominica': 'DM', 'Dominican Republic': 'DO', 'Ecuador': 'EC', 'Egypt': 'EG',
  'El Salvador': 'SV', 'Equatorial Guinea': 'GQ', 'Eritrea': 'ER', 'Estonia': 'EE', 'Eswatini': 'SZ',
  'Ethiopia': 'ET', 'Fiji': 'FJ', 'Finland': 'FI', 'France': 'FR', 'Gabon': 'GA',
  'Gambia': 'GM', 'Georgia': 'GE', 'Germany': 'DE', 'Ghana': 'GH', 'Greece': 'GR',
  'Grenada': 'GD', 'Guatemala': 'GT', 'Guinea': 'GN', 'Guinea-Bissau': 'GW', 'Guyana': 'GY',
  'Haiti': 'HT', 'Honduras': 'HN', 'Hungary': 'HU', 'Iceland': 'IS', 'India': 'IN',
  'Indonesia': 'ID', 'Iran': 'IR', 'Iraq': 'IQ', 'Ireland': 'IE', 'Israel': 'IL',
  'Italy': 'IT', 'Jamaica': 'JM', 'Japan': 'JP', 'Jordan': 'JO', 'Kazakhstan': 'KZ',
  'Kenya': 'KE', 'Kiribati': 'KI', 'Kuwait': 'KW', 'Kyrgyzstan': 'KG', 'Laos': 'LA',
  'Latvia': 'LV', 'Lebanon': 'LB', 'Lesotho': 'LS', 'Liberia': 'LR', 'Libya': 'LY',
  'Liechtenstein': 'LI', 'Lithuania': 'LT', 'Luxembourg': 'LU', 'Madagascar': 'MG', 'Malawi': 'MW',
  'Malaysia': 'MY', 'Maldives': 'MV', 'Mali': 'ML', 'Malta': 'MT', 'Marshall Islands': 'MH',
  'Mauritania': 'MR', 'Mauritius': 'MU', 'Mexico': 'MX', 'Micronesia': 'FM', 'Moldova': 'MD',
  'Monaco': 'MC', 'Mongolia': 'MN', 'Montenegro': 'ME', 'Morocco': 'MA', 'Mozambique': 'MZ',
  'Myanmar': 'MM', 'Namibia': 'NA', 'Nauru': 'NR', 'Nepal': 'NP', 'Netherlands': 'NL',
  'New Zealand': 'NZ', 'Nicaragua': 'NI', 'Niger': 'NE', 'Nigeria': 'NG', 'North Korea': 'KP',
  'North Macedonia': 'MK', 'Norway': 'NO', 'Oman': 'OM', 'Pakistan': 'PK', 'Palau': 'PW',
  'Palestine': 'PS', 'Panama': 'PA', 'Papua New Guinea': 'PG', 'Paraguay': 'PY', 'Peru': 'PE',
  'Philippines': 'PH', 'Poland': 'PL', 'Portugal': 'PT', 'Qatar': 'QA', 'Romania': 'RO',
  'Russia': 'RU', 'Rwanda': 'RW', 'Saint Kitts and Nevis': 'KN', 'Saint Lucia': 'LC', 'Saint Vincent and the Grenadines': 'VC',
  'Samoa': 'WS', 'San Marino': 'SM', 'Sao Tome and Principe': 'ST', 'Saudi Arabia': 'SA', 'Senegal': 'SN',
  'Serbia': 'RS', 'Seychelles': 'SC', 'Sierra Leone': 'SL', 'Singapore': 'SG', 'Slovakia': 'SK',
  'Slovenia': 'SI', 'Solomon Islands': 'SB', 'Somalia': 'SO', 'South Africa': 'ZA', 'South Korea': 'KR',
  'South Sudan': 'SS', 'Spain': 'ES', 'Sri Lanka': 'LK', 'Sudan': 'SD', 'Suriname': 'SR',
  'Sweden': 'SE', 'Switzerland': 'CH', 'Syria': 'SY', 'Taiwan': 'TW', 'Tajikistan': 'TJ',
  'Tanzania': 'TZ', 'Thailand': 'TH', 'Timor-Leste': 'TL', 'Togo': 'TG', 'Tonga': 'TO',
  'Trinidad and Tobago': 'TT', 'Tunisia': 'TN', 'Turkey': 'TR', 'Turkmenistan': 'TM', 'Tuvalu': 'TV',
  'Uganda': 'UG', 'Ukraine': 'UA', 'United Arab Emirates': 'AE', 'United Kingdom': 'GB', 'United States': 'US',
  'Uruguay': 'UY', 'Uzbekistan': 'UZ', 'Vanuatu': 'VU', 'Vatican City': 'VA', 'Venezuela': 'VE',
  'Vietnam': 'VN', 'Yemen': 'YE', 'Zambia': 'ZM', 'Zimbabwe': 'ZW'
}

interface EnhancedPenpal {
  id: string
  name: string
  country: string
  age: string
  writingStyle: string
  connectedAt: Date
  userId: string // Store the actual user ID for sending letters
  nickname?: string // User-defined nickname
}

interface EnhancedPenpalLetter {
  id: string
  content: string
  fromUser: string
  toUser: string
  timestamp: Date
  status: 'in-transit' | 'delivered' | 'read'
}

export default function Dashboard() {
  const { user, signOut, loading } = useAuth()
  const [penpals, setPenpals] = useState<EnhancedPenpal[]>([])
  const [inboxLetters, setInboxLetters] = useState<EnhancedPenpalLetter[]>([])
  const [outboxLetters, setOutboxLetters] = useState<EnhancedPenpalLetter[]>([])
  const [selectedPenpal, setSelectedPenpal] = useState<string>('')
  const [letterContent, setLetterContent] = useState('')
  const [activeTab, setActiveTab] = useState('inbox')
  const [dashboardLoading, setDashboardLoading] = useState(true)
  const [showNewConnectionMessage, setShowNewConnectionMessage] = useState(false)
  const [pendingRequests, setPendingRequests] = useState<EnhancedPenpal[]>([])
  const [selectedRequest, setSelectedRequest] = useState<{ request: any; letter: any } | null>(null)
  const [showRequestDetails, setShowRequestDetails] = useState(false)
  const [editingNickname, setEditingNickname] = useState<string | null>(null)
  const [nicknameInput, setNicknameInput] = useState('')

  useEffect(() => {
    if (user) {
      loadDashboardData()
    }
    
    // Check for new connection parameter
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.get('newConnection') === 'true') {
      setShowNewConnectionMessage(true)
      // Clear the URL parameter
      window.history.replaceState({}, '', '/dashboard')
      // Hide message after 5 seconds
      setTimeout(() => setShowNewConnectionMessage(false), 5000)
    }
  }, [user])

  const getCountryCode = (countryName: string): string => {
    return countryCodeMap[countryName] || 'UN' // UN for unknown countries
  }

  const loadDashboardData = async () => {
    if (!user) return
    try {
      setDashboardLoading(true)
      const [penpalsData, inboxData, outboxData, requestsData] = await Promise.all([
        penpalsApi.getByUserId(user.id),
        penpalsApi.getLetters(user.id, 'inbox'),
        penpalsApi.getLetters(user.id, 'outbox'),
        penpalsApi.getRequests(user.id)
      ])
      
      // Enhanced penpal mapping with proper user data
      const enhancedPenpals: EnhancedPenpal[] = penpalsData.map(p => {
        const isUser1 = p.user1_id === user.id
        const otherUser = isUser1 ? p.user2 : p.user1
        const otherUserId = isUser1 ? p.user2_id : p.user1_id
        
        return {
          id: p.id,
          name: otherUser?.full_name || `Friend from ${otherUser?.country || 'Unknown'}`,
          country: otherUser?.country || 'Unknown',
          age: '25-30', // Default for now - could be added to user profiles
          writingStyle: otherUser?.writing_style || 'Friendly',
          connectedAt: new Date(p.connected_at),
          userId: otherUserId,
          nickname: undefined // Could be loaded from local storage or backend
        }
      })
      
      setPenpals(enhancedPenpals)
      
      // Enhanced pending requests with user details from their invite letters
      const enhancedRequests = await Promise.all(requestsData.map(async r => {
        try {
          const userLetter = await lettersApi.getUserLetter(r.user1_id)
          return {
            id: r.id,
            name: userLetter?.author_name || 'A new friend',
            country: userLetter?.country || 'Unknown',
            age: userLetter?.age_range || 'N/A',
            writingStyle: userLetter?.writing_style || 'N/A',
            connectedAt: new Date(r.connected_at),
            userId: r.user1_id
          }
        } catch (error) {
          return {
            id: r.id,
            name: 'A new friend',
            country: 'Unknown',
            age: 'N/A',
            writingStyle: 'N/A',
            connectedAt: new Date(r.connected_at),
            userId: r.user1_id
          }
        }
      }))
      
      setPendingRequests(enhancedRequests)
      
      // Enhanced inbox letters with user name mapping
      const enhancedInboxLetters: EnhancedPenpalLetter[] = inboxData.map(l => {
        const senderPenpal = enhancedPenpals.find(p => p.userId === l.from_user_id)
        return {
          id: l.id,
          content: l.content,
          fromUser: senderPenpal?.name || 'Unknown Penpal',
          toUser: 'You',
          timestamp: new Date(l.created_at),
          status: l.status as 'in-transit' | 'delivered' | 'read'
        }
      })
      
      setInboxLetters(enhancedInboxLetters)
      
      // Enhanced outbox letters with user name mapping
      const enhancedOutboxLetters: EnhancedPenpalLetter[] = outboxData.map(l => {
        const recipientPenpal = enhancedPenpals.find(p => p.userId === l.to_user_id)
        return {
          id: l.id,
          content: l.content,
          fromUser: 'You',
          toUser: recipientPenpal?.name || 'Unknown Penpal',
          timestamp: new Date(l.created_at),
          status: l.status as 'in-transit' | 'delivered' | 'read'
        }
      })
      
      setOutboxLetters(enhancedOutboxLetters)
    } catch (error) {
      console.error('Error loading dashboard data:', error)
      // Set empty arrays on error
      setPenpals([])
      setInboxLetters([])
      setOutboxLetters([])
    } finally {
      setDashboardLoading(false)
    }
  }

  const handleAcceptRequest = async (requestId: string) => {
    if (!user) return
    
    try {
      await penpalsApi.acceptRequest(requestId, user.id)
      // Reload dashboard data to reflect changes
      loadDashboardData()
      setShowRequestDetails(false)
      setSelectedRequest(null)
      alert('Connection request accepted! You can now exchange letters.')
    } catch (error) {
      console.error('Error accepting request:', error)
      alert('Failed to accept request. Please try again.')
    }
  }

  const handleViewRequest = async (requestId: string) => {
    try {
      const userLetter = await lettersApi.getUserLetter(pendingRequests.find(r => r.id === requestId)?.userId || '')
      const request = pendingRequests.find(r => r.id === requestId)
      setSelectedRequest({ request, letter: userLetter })
      setShowRequestDetails(true)
    } catch (error) {
      console.error('Error fetching request details:', error)
      alert('Failed to load request details.')
    }
  }

  const handleNicknameEdit = (penpalId: string, currentName: string) => {
    setEditingNickname(penpalId)
    const penpal = penpals.find(p => p.id === penpalId)
    setNicknameInput(penpal?.nickname || currentName)
  }

  const handleNicknameSave = (penpalId: string) => {
    setPenpals(prev => prev.map(p => 
      p.id === penpalId 
        ? { ...p, nickname: nicknameInput.trim() || undefined }
        : p
    ))
    setEditingNickname(null)
    setNicknameInput('')
  }

  const handleNicknameCancel = () => {
    setEditingNickname(null)
    setNicknameInput('')
  }

  const getDisplayName = (penpal: EnhancedPenpal) => {
    if (penpal.nickname) {
      return `${penpal.nickname} (${penpal.country} friend)`
    }
    return `${penpal.name} (${penpal.country} friend)`
  }

  const handleSendLetter = async () => {
    if (!letterContent.trim() || !selectedPenpal || !user) return
    
    try {
      // Find the penpal to get their user ID
      const penpal = penpals.find(p => getDisplayName(p) === selectedPenpal)
      if (!penpal) return
      
      const newLetter = await penpalsApi.sendLetter({
        from_user_id: user.id,
        to_user_id: penpal.userId,
        content: letterContent
      })
      
      const enhancedLetter: EnhancedPenpalLetter = {
        id: newLetter.id,
        content: newLetter.content,
        fromUser: 'You',
        toUser: selectedPenpal,
        timestamp: new Date(newLetter.created_at),
        status: newLetter.status as 'in-transit' | 'delivered' | 'read'
      }
      
      setOutboxLetters(prev => [enhancedLetter, ...prev])
      setLetterContent('')
      setSelectedPenpal('')
      
      // Show success message
      alert('Letter sent successfully! It will be delivered in 2 minutes.')
    } catch (error) {
      console.error('Error sending letter:', error)
      alert('Failed to send letter. Please try again.')
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
            <div className="flex items-center gap-2">
              <Button 
                asChild
                variant="ghost"
                size="sm"
                className="font-handwriting text-ink-blue hover:text-ink"
              >
                <Link to="/journal">
                  <BookOpen className="w-4 h-4 mr-1" />
                  Journal
                </Link>
              </Button>
              <Button 
                asChild
                variant="ghost"
                size="sm"
                className="font-handwriting text-ink-blue hover:text-ink"
              >
                <Link to="/cassette">
                  <Mic className="w-4 h-4 mr-1" />
                  Voice Vents
                </Link>
              </Button>
            </div>
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
          
          {/* New Connection Success Message */}
          {showNewConnectionMessage && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="font-handwriting text-green-800 text-center">
                🎉 New penpal connection created! You can now exchange letters.
              </p>
            </div>
          )}
          
          {/* Quick Navigation Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Button 
              asChild
              variant="outline"
              className="envelope-card hover:rotate-1 transition-transform duration-300 h-auto p-6"
            >
              <Link to="/journal" className="flex flex-col items-center text-center space-y-3">
                <BookOpen className="w-8 h-8 text-ink-blue" />
                <div>
                  <h3 className="font-script text-ink text-xl mb-1">Daily Journal</h3>
                  <p className="font-handwriting text-ink-blue text-sm">
                    Capture your thoughts and track your moods
                  </p>
                </div>
              </Link>
            </Button>
            
            <Button 
              asChild
              variant="outline"
              className="envelope-card hover:-rotate-1 transition-transform duration-300 h-auto p-6"
            >
              <Link to="/cassette" className="flex flex-col items-center text-center space-y-3">
                <Mic className="w-8 h-8 text-ink-blue" />
                <div>
                  <h3 className="font-script text-ink text-xl mb-1">Voice Vents</h3>
                  <p className="font-handwriting text-ink-blue text-sm">
                    Record anonymous audio memories
                  </p>
                </div>
              </Link>
            </Button>
          </div>
          
          {dashboardLoading ? (
            <div className="text-center py-8">
              <p className="font-handwriting text-ink-blue">Loading your penpal data...</p>
            </div>
          ) : (
            <Tabs.Root value={activeTab} onValueChange={setActiveTab} className="w-full">
              <Tabs.List className="flex space-x-1 bg-ink-blue/5 p-1 rounded-lg mb-6">
                <Tabs.Trigger 
                  value="inbox"
                  className="flex items-center gap-2 px-4 py-2 rounded-md font-handwriting text-ink-blue data-[state=active]:bg-paper data-[state=active]:text-ink data-[state=active]:shadow-sm transition-all"
                >
                  <Inbox className="w-4 h-4" />
                  Inbox ({inboxLetters.length})
                </Tabs.Trigger>
                <Tabs.Trigger 
                  value="outbox"
                  className="flex items-center gap-2 px-4 py-2 rounded-md font-handwriting text-ink-blue data-[state=active]:bg-paper data-[state=active]:text-ink data-[state=active]:shadow-sm transition-all"
                >
                  <Send className="w-4 h-4" />
                  Outbox ({outboxLetters.length})
                </Tabs.Trigger>
                <Tabs.Trigger 
                  value="penpals"
                  className="flex items-center gap-2 px-4 py-2 rounded-md font-handwriting text-ink-blue data-[state=active]:bg-paper data-[state=active]:text-ink data-[state=active]:shadow-sm transition-all"
                >
                  <Users className="w-4 h-4" />
                  Penpals ({penpals.length})
                </Tabs.Trigger>
                <Tabs.Trigger 
                  value="requests"
                  className="flex items-center gap-2 px-4 py-2 rounded-md font-handwriting text-ink-blue data-[state=active]:bg-paper data-[state=active]:text-ink data-[state=active]:shadow-sm transition-all"
                >
                  <Clock className="w-4 h-4" />
                  Requests ({pendingRequests.length})
                </Tabs.Trigger>
                <Tabs.Trigger 
                  value="write"
                  className="flex items-center gap-2 px-4 py-2 rounded-md font-handwriting text-ink-blue data-[state=active]:bg-paper data-[state=active]:text-ink data-[state=active]:shadow-sm transition-all"
                >
                  <PenTool className="w-4 h-4" />
                  Write Letter
                </Tabs.Trigger>
              </Tabs.List>

              {/* Inbox Tab */}
              <Tabs.Content value="inbox" className="space-y-4">
                <h2 className="text-2xl font-script text-ink mb-4">Incoming Letters</h2>
                {inboxLetters.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="font-handwriting text-ink-blue mb-4">No letters yet. Start writing to your penpals!</p>
                    {penpals.length === 0 && (
                      <Button asChild className="envelope-card hover:rotate-1 transition-transform duration-300">
                        <Link to="/write-invite">Find Penpals</Link>
                      </Button>
                    )}
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
                          <div className="flex-1">
                            {editingNickname === penpal.id ? (
                              <div className="flex items-center gap-2">
                                <input
                                  type="text"
                                  value={nicknameInput}
                                  onChange={(e) => setNicknameInput(e.target.value)}
                                  className="font-handwriting text-ink font-medium text-lg bg-transparent border-b border-ink-blue focus:outline-none focus:border-ink"
                                  placeholder="Enter nickname..."
                                  autoFocus
                                />
                                <button
                                  onClick={() => handleNicknameSave(penpal.id)}
                                  className="text-green-600 hover:text-green-800 text-sm"
                                >
                                  ✓
                                </button>
                                <button
                                  onClick={handleNicknameCancel}
                                  className="text-red-600 hover:text-red-800 text-sm"
                                >
                                  ✕
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                <h3 className="font-handwriting text-ink font-medium text-lg">
                                  {getDisplayName(penpal)}
                                </h3>
                                <button
                                  onClick={() => handleNicknameEdit(penpal.id, penpal.name)}
                                  className="text-ink-blue hover:text-ink text-sm opacity-60 hover:opacity-100"
                                  title="Edit nickname"
                                >
                                  ✏️
                                </button>
                              </div>
                            )}
                          </div>
                          <Button 
                            size="sm"
                            onClick={() => {
                              setSelectedPenpal(getDisplayName(penpal))
                              setActiveTab('write')
                            }}
                            className="hover:rotate-1 transition-transform duration-300"
                          >
                            Write Letter
                          </Button>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-3">
                          <span className="px-2 py-1 bg-ink-blue/10 text-ink-blue rounded-full text-xs font-handwriting flex items-center gap-1">
                            <ReactCountryFlag 
                              countryCode={getCountryCode(penpal.country)} 
                              svg 
                              style={{ width: '1em', height: '0.75em' }}
                            />
                            {penpal.country}
                          </span>
                          <span className="px-2 py-1 bg-ink-blue/10 text-ink-blue rounded-full text-xs font-handwriting">
                            {penpal.age}
                          </span>
                          <span className="px-2 py-1 bg-ink-blue/10 text-ink-blue rounded-full text-xs font-handwriting">
                            {penpal.writingStyle}
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

              {/* Requests Tab */}
              <Tabs.Content value="requests" className="space-y-4">
                <h2 className="text-2xl font-script text-ink mb-4">Connection Requests</h2>
                {pendingRequests.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="font-handwriting text-ink-blue">No pending requests.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingRequests.map((request) => (
                      <div key={request.id} className="envelope-card">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-handwriting text-ink font-medium text-lg flex items-center gap-2">
                              <ReactCountryFlag 
                                countryCode={getCountryCode(request.country)} 
                                svg 
                                style={{ width: '1.2em', height: '0.9em' }}
                              />
                              {request.name} from {request.country}
                            </h3>
                            <p className="font-handwriting text-ink-blue text-sm">wants to be your penpal!</p>
                            <div className="flex flex-wrap gap-1 mt-2">
                              <span className="px-2 py-1 bg-ink-blue/10 text-ink-blue rounded-full text-xs font-handwriting">
                                {request.age}
                              </span>
                              <span className="px-2 py-1 bg-ink-blue/10 text-ink-blue rounded-full text-xs font-handwriting">
                                {request.writingStyle}
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              size="sm"
                              variant="outline"
                              onClick={() => handleViewRequest(request.id)}
                              className="hover:rotate-1 transition-transform duration-300"
                            >
                              View More
                            </Button>
                            <Button 
                              size="sm"
                              onClick={() => handleAcceptRequest(request.id)}
                              className="hover:rotate-1 transition-transform duration-300"
                            >
                              Accept
                            </Button>
                          </div>
                        </div>
                        <p className="text-xs text-ink-blue/60 font-handwriting">
                          Received: {request.connectedAt.toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </Tabs.Content>

              {/* Request Details Modal */}
              {showRequestDetails && selectedRequest && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                  <div className="letter-paper max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                    <div className="flex justify-between items-start mb-6">
                      <h2 className="text-2xl font-script text-ink">Connection Request Details</h2>
                      <Button 
                        variant="ghost"
                        onClick={() => setShowRequestDetails(false)}
                        className="text-ink-blue hover:text-ink"
                      >
                        ✕
                      </Button>
                    </div>
                    
                    {selectedRequest.letter ? (
                      <div className="space-y-6">
                        {/* Letter content display */}
                        <div className="letter-header">
                          <div className="flex justify-between items-start mb-4">
                            <div className="letter-address">
                              <div className="text-sm font-handwriting text-ink-blue/70 mb-1 flex items-center gap-2">
                                From: A Friend in 
                                <ReactCountryFlag 
                                  countryCode={getCountryCode(selectedRequest.letter.country)} 
                                  svg 
                                  style={{ width: '1.2em', height: '0.9em' }}
                                  title={selectedRequest.letter.country}
                                />
                                {selectedRequest.letter.country}
                              </div>
                              <div className="text-xs font-handwriting text-ink-blue/50">
                                {new Date(selectedRequest.letter.created_at).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap gap-2 mb-4">
                            <span className="px-2 py-1 bg-ink-blue/10 text-ink-blue rounded-full text-xs font-handwriting">
                              🎂 {selectedRequest.letter.age_range}
                            </span>
                            {selectedRequest.letter.writing_style && selectedRequest.letter.writing_style.split(', ').map((interest: string) => (
                              <span key={interest} className="px-2 py-1 bg-ink-blue/10 text-ink-blue rounded-full text-xs font-handwriting">
                                {interest}
                              </span>
                            ))}
                          </div>
                          
                          <div className="letter-greeting mt-4 mb-4">
                            <p className="font-handwriting text-ink text-lg">Dear Future Penpal,</p>
                          </div>
                        </div>
                        
                        <div className="letter-content mb-6">
                          <p className="font-handwriting text-ink leading-relaxed text-base letter-text">
                            {selectedRequest.letter.content}
                          </p>
                        </div>
                        
                        <div className="letter-footer">
                          <div className="flex justify-between items-end">
                            <div className="letter-signature">
                              <p className="font-handwriting text-ink text-sm mb-1">Warmly,</p>
                              <p className="font-script text-ink text-lg">{selectedRequest.letter.author_name}</p>
                            </div>
                            <div className="flex gap-2">
                              <Button 
                                variant="outline"
                                onClick={() => setShowRequestDetails(false)}
                                className="hover:rotate-1 transition-transform duration-300"
                              >
                                Close
                              </Button>
                              <Button 
                                onClick={() => handleAcceptRequest(selectedRequest.request.id)}
                                className="hover:-rotate-1 transition-transform duration-300"
                              >
                                Accept Request
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="font-handwriting text-ink-blue mb-4">This user hasn't written an invite letter yet.</p>
                        <div className="flex gap-2 justify-center">
                          <Button 
                            variant="outline"
                            onClick={() => setShowRequestDetails(false)}
                            className="hover:rotate-1 transition-transform duration-300"
                          >
                            Close
                          </Button>
                          <Button 
                            onClick={() => handleAcceptRequest(selectedRequest.request.id)}
                            className="hover:-rotate-1 transition-transform duration-300"
                          >
                            Accept Request
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Write Letter Tab */}
              <Tabs.Content value="write" className="space-y-6">
                <h2 className="text-2xl font-script text-ink mb-4">Write a Letter</h2>
                
                {penpals.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="font-handwriting text-ink-blue mb-4">You need penpals to write letters!</p>
                    <Button asChild className="envelope-card hover:rotate-1 transition-transform duration-300">
                      <Link to="/write-invite">Find Penpals</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-handwriting text-ink-blue mb-2">Choose Penpal</label>
                      <Select value={selectedPenpal} onValueChange={setSelectedPenpal}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a penpal" />
                        </SelectTrigger>
                        <SelectContent>
                          {penpals.map(penpal => (
                            <SelectItem key={penpal.id} value={getDisplayName(penpal)}>
                              <div className="flex items-center gap-2">
                                <ReactCountryFlag 
                                  countryCode={getCountryCode(penpal.country)} 
                                  svg 
                                  style={{ width: '1em', height: '0.75em' }}
                                />
                                {getDisplayName(penpal)}
                              </div>
                            </SelectItem>
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
                )}
              </Tabs.Content>
            </Tabs.Root>
          )}
        </div>
      </div>
    </div>
  )
}