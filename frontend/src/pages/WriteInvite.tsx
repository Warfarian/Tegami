import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'

import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { lettersApi, penpalsApi, type Letter as APILetter } from '@/lib/api'
import { useAuth } from '@/contexts/AuthContext'
import { ArrowLeft, Send, Eye, Lock, Filter, Edit, Plus } from 'lucide-react'
import ReactCountryFlag from 'react-country-flag'

// Popular interests for checkbox selection
const popularInterests = [
  'Reading', 'Travel', 'Music', 'Art', 'Photography', 'Cooking', 'Sports', 
  'Movies', 'Gaming', 'Nature', 'Writing', 'Dancing', 'Languages', 'History',
  'Science', 'Technology', 'Fashion', 'Fitness', 'Gardening', 'Crafts'
]

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

const countries = Object.keys(countryCodeMap)
const ageRanges = [
  '18-22', '23-27', '28-32', '33-37', '38-42', '43-47', '48-52', '53-62', '63-72', '73-79', '80+'
]
const genderOptions = ['Male', 'Female', 'Transgender', 'Other', 'Rather not say']

interface Letter {
  id: string
  content: string
  country: string
  age: string
  gender: string
  interests: string[]
  timestamp: Date
  author?: string
  userId?: string // Store the user_id for efficient reply handling
}

export default function WriteInvite() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [mode, setMode] = useState<'browse' | 'write'>('browse')
  const [editMode, setEditMode] = useState<'create' | 'edit'>('create')
  const [existingLetter, setExistingLetter] = useState<APILetter | null>(null)
  const [formData, setFormData] = useState<Omit<Letter, 'id' | 'timestamp' | 'author'>>({
    content: '',
    country: '',
    age: '',
    gender: '',
    interests: []
  })
  const [showPreview, setShowPreview] = useState(false)
  const [letters, setLetters] = useState<Letter[]>([])
  const [loading, setLoading] = useState(true)
  
  // Filter states
  const [searchFilters, setSearchFilters] = useState({
    country: 'all',
    age: 'all',
    gender: 'all',
    interests: [] as string[]
  })
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    loadLetters()
    if (user) {
      loadUserLetter()
    }
  }, [user])

  const loadUserLetter = async () => {
    if (!user) return
    try {
      const userLetter = await lettersApi.getUserLetter(user.id)
      setExistingLetter(userLetter)
    } catch (error) {
      console.error('Error loading user letter:', error)
    }
  }

  const loadLetters = async () => {
    try {
      setLoading(true)
      const apiLetters = await lettersApi.getAll()
      // Convert API letters to frontend format
      const convertedLetters: Letter[] = apiLetters.map(letter => ({
        id: letter.id,
        content: letter.content,
        country: letter.country,
        age: letter.age_range,
        gender: 'Other', // Default until backend supports gender
        interests: letter.writing_style ? letter.writing_style.split(', ').filter(Boolean) : [], // Parse interests from writing_style
        timestamp: new Date(letter.created_at),
        author: letter.author_name,
        userId: letter.user_id // Store user_id for efficient reply handling
      }))
      setLetters(convertedLetters)
    } catch (error) {
      console.error('Error loading letters:', error)
      // Fallback to empty array
      setLetters([])
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      alert('Please log in to write a letter')
      return
    }
    if (isValid) {
      try {
        let savedLetter: APILetter
        
        if (editMode === 'edit' && existingLetter) {
          // Update existing letter
          savedLetter = await lettersApi.update(existingLetter.id, {
            user_id: user.id,
            content: formData.content,
            country: formData.country,
            age_range: formData.age,
            writing_style: formData.interests.join(', ')
          })
          setExistingLetter(savedLetter)
        } else {
          // Create new letter
          savedLetter = await lettersApi.create({
            user_id: user.id,
            content: formData.content,
            country: formData.country,
            age_range: formData.age,
            writing_style: formData.interests.join(', ')
          })
          setExistingLetter(savedLetter)
        }
        
        // Add/update in local state
        const convertedLetter: Letter = {
          id: savedLetter.id,
          content: savedLetter.content,
          country: savedLetter.country,
          age: savedLetter.age_range,
          gender: formData.gender,
          interests: formData.interests,
          timestamp: new Date(savedLetter.created_at),
          author: savedLetter.author_name
        }
        
        if (editMode === 'edit') {
          setLetters(prevLetters => 
            prevLetters.map(letter => 
              letter.id === savedLetter.id ? convertedLetter : letter
            )
          )
        } else {
          setLetters(prevLetters => [convertedLetter, ...prevLetters])
        }
        
        setFormData({ content: '', country: '', age: '', gender: '', interests: [] })
        setShowPreview(false)
        setMode('browse')
        setEditMode('create')
      } catch (error) {
        console.error('Error saving letter:', error)
        alert('Failed to save letter. Please try again.')
      }
    }
  }

  const handleWriteClick = () => {
    if (!user) {
      alert('Please log in to write a letter')
      return
    }
    setMode('write')
    setEditMode('create')
    setFormData({ content: '', country: '', age: '', gender: '', interests: [] })
  }

  const handleEditClick = () => {
    if (!user || !existingLetter) return
    
    setMode('write')
    setEditMode('edit')
    setFormData({
      content: existingLetter.content,
      country: existingLetter.country,
      age: existingLetter.age_range,
      gender: 'Other', // Default
      interests: existingLetter.writing_style ? existingLetter.writing_style.split(', ').filter(Boolean) : []
    })
  }

  const handleReplyClick = async (letter: Letter) => {
    if (!user) {
      alert('Please log in to reply to letters')
      return
    }
    
    if (!letter.userId) {
      alert('Unable to reply to this letter. Please try again.')
      return
    }
    
    try {
      // Create penpal connection request
      await penpalsApi.createConnection(user.id, letter.userId)
      
      alert('Connection request sent! Wait for the other person to accept.')
    } catch (error) {
      console.error('Error creating penpal connection:', error)
      if (error.message.includes('already exists') || error.message.includes('409')) {
        alert('You already sent a request to this person or are already connected.')
      } else {
        alert('Failed to send connection request. Please try again.')
      }
    }
  }

  const isOwnLetter = (letter: Letter): boolean => {
    return user ? letter.userId === user.id : false
  }

  const handleInterestToggle = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }))
  }

  const getCountryCode = (countryName: string): string => {
    return countryCodeMap[countryName] || 'UN' // UN for unknown countries
  }

  // Filter letters based on search criteria
  const filteredLetters = letters.filter(letter => {
    if (searchFilters.country && searchFilters.country !== 'all' && letter.country !== searchFilters.country) return false
    if (searchFilters.age && searchFilters.age !== 'all' && letter.age !== searchFilters.age) return false
    if (searchFilters.gender && searchFilters.gender !== 'all' && letter.gender !== searchFilters.gender) return false
    if (searchFilters.interests.length > 0) {
      const hasMatchingInterest = searchFilters.interests.some(interest => 
        letter.interests.includes(interest)
      )
      if (!hasMatchingInterest) return false
    }
    return true
  })

  const characterCount = formData.content.length
  const isValid = formData.content.trim() && formData.country && formData.age && formData.gender && formData.interests.length > 0 && characterCount <= 500

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
              <h1 className="text-3xl font-script text-ink mb-6 text-center">
                {editMode === 'edit' ? 'Edit Your Letter' : 'Write Your Letter'}
              </h1>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-handwriting text-ink-blue mb-2">Country</label>
                    <Select value={formData.country} onValueChange={(value) => setFormData(prev => ({ ...prev, country: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        {countries.map(country => (
                          <SelectItem key={country} value={country}>
                            <div className="flex items-center gap-2">
                              <ReactCountryFlag 
                                countryCode={getCountryCode(country)} 
                                svg 
                                style={{ width: '1.2em', height: '0.9em' }}
                              />
                              {country}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                    <label className="block text-sm font-handwriting text-ink-blue mb-2">Gender</label>
                    <Select value={formData.gender} onValueChange={(value) => setFormData(prev => ({ ...prev, gender: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        {genderOptions.map(gender => (
                          <SelectItem key={gender} value={gender}>{gender}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-handwriting text-ink-blue mb-3">Interests (select up to 5)</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto border rounded-md p-3">
                    {popularInterests.map(interest => (
                      <label key={interest} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.interests.includes(interest)}
                          onChange={() => handleInterestToggle(interest)}
                          disabled={!formData.interests.includes(interest) && formData.interests.length >= 5}
                          className="rounded border-ink-blue/30"
                        />
                        <span className="text-sm font-handwriting text-ink">{interest}</span>
                      </label>
                    ))}
                  </div>
                  <p className="text-xs text-ink-blue/60 mt-1 font-handwriting">
                    Selected: {formData.interests.length}/5
                  </p>
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
                    {editMode === 'edit' ? 'Update Letter' : 'Send Letter'}
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
                      <span className="px-3 py-1 bg-ink-blue/10 text-ink-blue rounded-full text-sm font-handwriting flex items-center gap-1">
                        <ReactCountryFlag 
                          countryCode={getCountryCode(formData.country)} 
                          svg 
                          style={{ width: '1em', height: '0.75em' }}
                        />
                        {formData.country}
                      </span>
                    )}
                    {formData.age && (
                      <span className="px-3 py-1 bg-ink-blue/10 text-ink-blue rounded-full text-sm font-handwriting">
                        🎂 {formData.age}
                      </span>
                    )}
                    {formData.gender && (
                      <span className="px-3 py-1 bg-ink-blue/10 text-ink-blue rounded-full text-sm font-handwriting">
                        👤 {formData.gender}
                      </span>
                    )}
                    {formData.interests.map(interest => (
                      <span key={interest} className="px-2 py-1 bg-ink-blue/10 text-ink-blue rounded-full text-xs font-handwriting">
                        {interest}
                      </span>
                    ))}
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
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            {existingLetter ? (
              <Button 
                onClick={handleEditClick}
                className="envelope-card hover:rotate-1 transition-transform duration-300 text-lg py-6 px-8"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Your Letter
              </Button>
            ) : (
              <Button 
                onClick={handleWriteClick}
                className="envelope-card hover:rotate-1 transition-transform duration-300 text-lg py-6 px-8"
              >
                {!user && <Lock className="w-4 h-4 mr-2" />}
                <Plus className="w-4 h-4 mr-2" />
                Write Your Letter
              </Button>
            )}
            
            <Button 
              onClick={() => setShowFilters(!showFilters)}
              variant="outline"
              className="envelope-card hover:-rotate-1 transition-transform duration-300 text-lg py-6 px-8"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filter Letters
            </Button>
            
            <Button 
              asChild
              variant="outline"
              className="envelope-card hover:-rotate-1 transition-transform duration-300 text-lg py-6 px-8"
            >
              <Link to="/">Back Home</Link>
            </Button>
          </div>

          {/* Show user's existing letter status */}
          {user && existingLetter && (
            <div className="letter-paper mb-8 max-w-md mx-auto">
              <h3 className="text-lg font-script text-ink mb-2">Your Letter Status</h3>
              <p className="font-handwriting text-ink-blue text-sm">
                You have an active invite letter. Click "Edit Your Letter" to modify it.
              </p>
              <p className="font-handwriting text-ink-light text-xs mt-1">
                Created: {new Date(existingLetter.created_at).toLocaleDateString()}
              </p>
            </div>
          )}

          {/* Search Filters */}
          {showFilters && (
            <div className="letter-paper mb-8">
              <h3 className="text-xl font-script text-ink mb-4">Filter Letters</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-handwriting text-ink-blue mb-2">Country</label>
                  <Select value={searchFilters.country} onValueChange={(value) => setSearchFilters(prev => ({ ...prev, country: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Any country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Any country</SelectItem>
                      {countries.map(country => (
                        <SelectItem key={country} value={country}>
                          <div className="flex items-center gap-2">
                            <ReactCountryFlag 
                              countryCode={getCountryCode(country)} 
                              svg 
                              style={{ width: '1.2em', height: '0.9em' }}
                            />
                            {country}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-handwriting text-ink-blue mb-2">Age Range</label>
                  <Select value={searchFilters.age} onValueChange={(value) => setSearchFilters(prev => ({ ...prev, age: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Any age" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Any age</SelectItem>
                      {ageRanges.map(age => (
                        <SelectItem key={age} value={age}>{age}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-handwriting text-ink-blue mb-2">Gender</label>
                  <Select value={searchFilters.gender} onValueChange={(value) => setSearchFilters(prev => ({ ...prev, gender: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Any gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Any gender</SelectItem>
                      {genderOptions.map(gender => (
                        <SelectItem key={gender} value={gender}>{gender}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-handwriting text-ink-blue mb-2">Interests</label>
                  <div className="max-h-32 overflow-y-auto border rounded-md p-2">
                    {popularInterests.slice(0, 10).map(interest => (
                      <label key={interest} className="flex items-center space-x-2 cursor-pointer text-sm">
                        <input
                          type="checkbox"
                          checked={searchFilters.interests.includes(interest)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSearchFilters(prev => ({ ...prev, interests: [...prev.interests, interest] }))
                            } else {
                              setSearchFilters(prev => ({ ...prev, interests: prev.interests.filter(i => i !== interest) }))
                            }
                          }}
                          className="rounded border-ink-blue/30"
                        />
                        <span className="font-handwriting text-ink">{interest}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              
              <Button 
                onClick={() => setSearchFilters({ country: 'all', age: 'all', gender: 'all', interests: [] })}
                variant="outline"
                className="mt-4"
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>

        {loading ? (
          <div className="text-center py-8">
            <p className="font-handwriting text-ink-blue">Loading letters...</p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2">
            {filteredLetters.map((letter) => (
              <div key={letter.id} className="letter-card hover:rotate-1 transition-transform duration-300">
                {/* Tags at the top - interests, age group, and gender */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {/* Age group tag */}
                  {letter.age && (
                    <span className="px-2 py-1 bg-ink-blue/10 text-ink-blue rounded-full text-xs font-handwriting">
                      🎂 {letter.age}
                    </span>
                  )}
                  {/* Gender tag */}
                  {letter.gender && (
                    <span className="px-2 py-1 bg-ink-blue/10 text-ink-blue rounded-full text-xs font-handwriting">
                      👤 {letter.gender}
                    </span>
                  )}
                  {/* Interests tags */}
                  {letter.interests.map(interest => (
                    <span key={interest} className="px-2 py-1 bg-ink-blue/10 text-ink-blue rounded-full text-xs font-handwriting">
                      {interest}
                    </span>
                  ))}
                </div>
                
                {/* Letter Header */}
                <div className="letter-header mb-6">
                  <div className="flex justify-between items-start mb-2">
                    <div className="letter-address">
                      <div className="text-sm font-handwriting text-ink-blue/70 mb-1 flex items-center gap-2">
                        From: A Friend in 
                        <ReactCountryFlag 
                          countryCode={getCountryCode(letter.country)} 
                          svg 
                          style={{ width: '1.2em', height: '0.9em' }}
                          title={letter.country}
                        />
                        {letter.country}
                      </div>
                      <div className="text-xs font-handwriting text-ink-blue/50">
                        {letter.timestamp.toLocaleDateString()}
                      </div>
                    </div>
                    <div className="relative">
                      <div className="postage-stamp">
                        <div className="stamp-inner">
                          <div className="text-xs font-handwriting text-white">{letter.age}</div>
                        </div>
                      </div>
                      <ReactCountryFlag 
                        countryCode={getCountryCode(letter.country)} 
                        svg 
                        style={{ width: '1.5em', height: '1.1em' }}
                        title={letter.country}
                        className="absolute -top-2 -right-2 border border-ink-blue/20 rounded bg-white/90 p-0.5"
                      />
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
                      <p className="font-script text-ink text-lg">A Friend</p>
                    </div>
                    {isOwnLetter(letter) ? (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={handleEditClick}
                        className="letter-reply-btn hover:rotate-1 transition-transform duration-300"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                    ) : (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleReplyClick(letter)}
                        className="letter-reply-btn hover:rotate-1 transition-transform duration-300"
                      >
                        {!user && <Lock className="w-4 h-4 mr-2" />}
                        📝 Reply
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && filteredLetters.length === 0 && (
          <div className="text-center py-8">
            <p className="font-handwriting text-ink-blue">No letters match your filters. Try adjusting your search criteria.</p>
          </div>
        )}
      </div>
    </div>
  )
}