import { useState, useRef } from 'react'
import { useReactMediaRecorder } from 'react-media-recorder'
import { AudioVisualizer, LiveAudioVisualizer } from 'react-audio-visualize'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Mic, Square, Play, Pause, RotateCcw } from 'lucide-react'
import { CASSETTES_STORAGE_KEY, type Cassette } from '../lib/cassette'
import CassetteTape from '../components/CassetteTape'

export default function RecordCassette() {
  const [selectedMood, setSelectedMood] = useState<string>('')
  const [isPlaying, setIsPlaying] = useState(false)
  const [recordingTitle, setRecordingTitle] = useState('')
  const audioRef = useRef<HTMLAudioElement>(null)
  const [blob, setBlob] = useState<Blob | null>(null)

  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)

  const {
    status,
    startRecording,
    stopRecording,
    mediaBlobUrl,
    clearBlobUrl
  } = useReactMediaRecorder({
    audio: true,
    onStart: (stream) => {
      const recorder = new MediaRecorder(stream)
      setMediaRecorder(recorder)
    },
    onStop: (blobUrl, blob) => {
      setBlob(blob)
      setMediaRecorder(null)
    }
  })

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleSaveVent = () => {
    if (!selectedMood || !mediaBlobUrl || !recordingTitle.trim()) {
      alert('Please select a mood, add a title, and record your vent first!')
      return
    }

    // Create cassette object
    const cassette: Cassette = {
      id: Date.now().toString(),
      title: recordingTitle,
      mood: selectedMood,
      audioUrl: mediaBlobUrl,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
    }

    // Save to localStorage (in real app, would save to Supabase)
    const existingCassettes = JSON.parse(localStorage.getItem(CASSETTES_STORAGE_KEY) || '[]')
    existingCassettes.push(cassette)
    localStorage.setItem(CASSETTES_STORAGE_KEY, JSON.stringify(existingCassettes))

    // Reset form
    setSelectedMood('')
    setRecordingTitle('')
    clearBlobUrl()
    setBlob(null)
    setIsPlaying(false)

    alert('Audio memory saved! It will be available on the wall for 24 hours.')
  }

  const handleReset = () => {
    clearBlobUrl()
    setBlob(null)
    setIsPlaying(false)
    setRecordingTitle('')
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 pt-12 bg-cover bg-center bg-no-repeat relative" style={{backgroundImage: 'url(/cassette.jpg)'}}>
      <div className="absolute inset-0 bg-white bg-opacity-80"></div>
      <div className="letter-paper max-w-2xl w-full relative z-10">
        <h1 className="text-3xl font-script text-ink mb-6 text-center">Record Your Memory 📼</h1>
        
        {/* Cassette Tape Visual */}
        <div className="mb-8 flex justify-center">
          <CassetteTape 
            audioSrc={mediaBlobUrl || undefined}
            isRecording={status === 'recording'}
            isPlaying={isPlaying}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onStop={() => setIsPlaying(false)}
            size="large"
            title={recordingTitle || 'Audio Recording'}
          />
        </div>

        {/* Title Input */}
        <div className="mb-6">
          <label className="block font-handwriting text-ink mb-2">Give your recording a title:</label>
          <input
            type="text"
            value={recordingTitle}
            onChange={(e) => setRecordingTitle(e.target.value)}
            placeholder="What's on your mind?"
            className="w-full p-3 border-2 border-ink-light rounded-lg font-handwriting bg-paper focus:outline-none focus:border-ink"
            maxLength={50}
          />
        </div>

        {/* Mood Input */}
        <div className="mb-6">
          <label className="block font-handwriting text-ink mb-2">How are you feeling?</label>
          <Input
            type="text"
            value={selectedMood}
            onChange={(e) => setSelectedMood(e.target.value)}
            placeholder="Describe your mood..."
            className="w-full p-3 border-2 border-ink-light rounded-lg font-handwriting bg-paper focus:outline-none focus:border-ink"
            maxLength={50}
          />
        </div>

        {/* Audio Visualizer */}
        <div className="mb-6 p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border-2 border-gray-200 shadow-inner">
          <div className="flex justify-center">
            {status === 'recording' && mediaRecorder ? (
              <LiveAudioVisualizer
                mediaRecorder={mediaRecorder}
                width={600}
                height={100}
                barColor="#ef4444"
                backgroundColor="transparent"
              />
            ) : blob ? (
              <AudioVisualizer
                blob={blob}
                width={600}
                height={100}
                barWidth={3}
                gap={2}
                barColor="#2563eb"
                backgroundColor="transparent"
                barPlayedColor="#1d4ed8"
                currentTime={audioRef.current?.currentTime}
              />
            ) : (
              <div className="w-[600px] h-[100px] flex items-center justify-center text-gray-400 font-handwriting">
                Start recording to see live visualization
              </div>
            )}
          </div>
        </div>

        {/* Recording Controls */}
        <div className="flex flex-col items-center gap-4 mb-6">
          <div className="flex gap-4">
            {status !== 'recording' ? (
              <Button
                onClick={startRecording}
                className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-6 py-3"
                disabled={!selectedMood || !recordingTitle.trim()}
              >
                <Mic className="w-5 h-5" />
                Start Recording
              </Button>
            ) : (
              <Button
                onClick={stopRecording}
                className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-6 py-3"
              >
                <Square className="w-5 h-5" />
                Stop Recording
              </Button>
            )}

            {mediaBlobUrl && (
              <>
                <Button
                  onClick={handlePlayPause}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                  {isPlaying ? 'Pause' : 'Play'}
                </Button>

                <Button
                  onClick={handleReset}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <RotateCcw className="w-5 h-5" />
                  Reset
                </Button>
              </>
            )}
          </div>

          {status === 'recording' && (
            <p className="text-red-500 font-handwriting animate-pulse">
              🔴 Recording... Speak your mind!
            </p>
          )}
        </div>

        {/* Hidden audio element for playback */}
        {mediaBlobUrl && (
          <audio
            ref={audioRef}
            src={mediaBlobUrl}
            onEnded={() => setIsPlaying(false)}
            className="hidden"
          />
        )}

        {/* Save Button */}
        {mediaBlobUrl && (
          <div className="text-center">
            <Button
              onClick={handleSaveVent}
              className="bg-ink hover:bg-ink-dark text-paper px-8 py-3 text-lg font-handwriting shadow-lg hover:shadow-xl transition-all"
              disabled={!selectedMood || !recordingTitle.trim()}
            >
              Save to Audio Memories 📼
            </Button>
            <p className="text-sm text-ink-light mt-2 font-handwriting">
              Your memory will be available for 24 hours
            </p>
            
            {/* Decorative elements */}
            <div className="mt-6 flex justify-center items-center gap-3 opacity-40">
              <span className="text-ink text-lg">♪</span>
              <div className="w-12 h-0.5 bg-ink-light"></div>
              <span className="text-ink text-lg">♫</span>
              <div className="w-12 h-0.5 bg-ink-light"></div>
              <span className="text-ink text-lg">♪</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}