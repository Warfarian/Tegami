import React, { useState, useRef, useEffect } from 'react'
import { AudioVisualizer } from 'react-audio-visualize'

interface CassetteTapeProps {
  audioSrc?: string
  isPlaying?: boolean
  isRecording?: boolean
  onPlay?: () => void
  onPause?: () => void
  onStop?: () => void
  size?: 'small' | 'medium' | 'large'
  className?: string
  title?: string
  autoPlay?: boolean
}

export default function CassetteTape({ 
  audioSrc,
  isPlaying = false, 
  isRecording = false,
  onPlay,
  onPause,
  onStop,
  size = 'medium',
  className = '',
  title = 'Audio Tape',
  autoPlay = false
}: CassetteTapeProps) {
  const [internalPlaying, setInternalPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  
  const playing = isPlaying || internalPlaying
  
  const sizeMap = {
    small: { width: 200, height: 120, scale: 0.7 },
    medium: { width: 280, height: 170, scale: 1 },
    large: { width: 360, height: 220, scale: 1.3 }
  }
  
  const { width, height, scale } = sizeMap[size]

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateTime = () => setCurrentTime(audio.currentTime)
    const updateDuration = () => setDuration(audio.duration)
    const handleEnded = () => {
      setInternalPlaying(false)
      onStop?.()
    }

    audio.addEventListener('timeupdate', updateTime)
    audio.addEventListener('loadedmetadata', updateDuration)
    audio.addEventListener('ended', handleEnded)

    return () => {
      audio.removeEventListener('timeupdate', updateTime)
      audio.removeEventListener('loadedmetadata', updateDuration)
      audio.removeEventListener('ended', handleEnded)
    }
  }, [onStop])

  // Convert audio src to blob for visualizer
  useEffect(() => {
    if (audioSrc) {
      fetch(audioSrc)
        .then(response => response.blob())
        .then(blob => setAudioBlob(blob))
        .catch(console.error)
    }
  }, [audioSrc])

  const handlePlayPause = () => {
    const audio = audioRef.current
    if (!audio || !audioSrc) return

    if (playing) {
      audio.pause()
      setInternalPlaying(false)
      onPause?.()
    } else {
      audio.play()
      setInternalPlaying(true)
      onPlay?.()
    }
  }

  const handleStop = () => {
    const audio = audioRef.current
    if (!audio) return

    audio.pause()
    audio.currentTime = 0
    setInternalPlaying(false)
    setCurrentTime(0)
    onStop?.()
  }

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <div className={`relative ${className}`} style={{ transform: `scale(${scale})` }}>
      {audioSrc && (
        <audio
          ref={audioRef}
          src={audioSrc}
          preload="metadata"
          autoPlay={autoPlay}
        />
      )}
      
      <svg
        width={width}
        height={height}
        viewBox="0 0 280 170"
        className="drop-shadow-xl"
      >
        {/* Main cassette body */}
        <rect
          x="10"
          y="20"
          width="260"
          height="130"
          rx="8"
          ry="8"
          fill="url(#cassetteGradient)"
          stroke="#2a2a2a"
          strokeWidth="2"
        />
        
        {/* Cassette body highlight */}
        <rect
          x="12"
          y="22"
          width="256"
          height="4"
          rx="4"
          ry="4"
          fill="url(#highlightGradient)"
        />
        
        {/* Top label section */}
        <rect
          x="20"
          y="30"
          width="240"
          height="35"
          rx="4"
          ry="4"
          fill="url(#labelGradient)"
          stroke="#d0d0d0"
          strokeWidth="1"
        />
        
        {/* Label border detail */}
        <rect
          x="22"
          y="32"
          width="236"
          height="31"
          rx="3"
          ry="3"
          fill="none"
          stroke="#e8e8e8"
          strokeWidth="0.5"
        />
        
        {/* Title text */}
        <text
          x="140"
          y="48"
          textAnchor="middle"
          fontSize="10"
          fill="#333"
          fontFamily="Arial, sans-serif"
          fontWeight="bold"
        >
          {title.toUpperCase()}
        </text>
        
        {/* Main tape window */}
        <rect
          x="30"
          y="75"
          width="220"
          height="55"
          rx="6"
          ry="6"
          fill="url(#windowGradient)"
          stroke="#333"
          strokeWidth="1.5"
        />
        
        {/* Left reel */}
        <g>
          <circle
            cx="80"
            cy="102"
            r="20"
            fill="url(#reelGradient)"
            stroke="#2a2a2a"
            strokeWidth="1.5"
          />
          <circle
            cx="80"
            cy="102"
            r="18"
            fill="none"
            stroke="url(#reelRingGradient)"
            strokeWidth="1"
          />
          <circle
            cx="80"
            cy="102"
            r="16"
            fill="#1a1a1a"
            className={playing || isRecording ? 'animate-spin' : ''}
            style={{ 
              transformOrigin: '80px 102px',
              animationDuration: '2s',
              animationTimingFunction: 'linear',
              animationIterationCount: 'infinite'
            }}
          />
          {/* Reel spokes */}
          <g className={playing || isRecording ? 'animate-spin' : ''} 
             style={{ 
               transformOrigin: '80px 102px',
               animationDuration: '2s',
               animationTimingFunction: 'linear',
               animationIterationCount: 'infinite'
             }}>
            <line x1="80" y1="88" x2="80" y2="116" stroke="#444" strokeWidth="1"/>
            <line x1="66" y1="102" x2="94" y2="102" stroke="#444" strokeWidth="1"/>
            <line x1="71" y1="91" x2="89" y2="113" stroke="#444" strokeWidth="1"/>
            <line x1="89" y1="91" x2="71" y2="113" stroke="#444" strokeWidth="1"/>
          </g>
          <circle cx="80" cy="102" r="3" fill="#666" />
        </g>
        
        {/* Right reel */}
        <g>
          <circle
            cx="200"
            cy="102"
            r="20"
            fill="url(#reelGradient)"
            stroke="#2a2a2a"
            strokeWidth="1.5"
          />
          <circle
            cx="200"
            cy="102"
            r="18"
            fill="none"
            stroke="url(#reelRingGradient)"
            strokeWidth="1"
          />
          <circle
            cx="200"
            cy="102"
            r="16"
            fill="#1a1a1a"
            className={playing || isRecording ? 'animate-spin' : ''}
            style={{ 
              transformOrigin: '200px 102px',
              animationDuration: '2s',
              animationTimingFunction: 'linear',
              animationIterationCount: 'infinite'
            }}
          />
          {/* Reel spokes */}
          <g className={playing || isRecording ? 'animate-spin' : ''} 
             style={{ 
               transformOrigin: '200px 102px',
               animationDuration: '2s',
               animationTimingFunction: 'linear',
               animationIterationCount: 'infinite'
             }}>
            <line x1="200" y1="88" x2="200" y2="116" stroke="#444" strokeWidth="1"/>
            <line x1="186" y1="102" x2="214" y2="102" stroke="#444" strokeWidth="1"/>
            <line x1="191" y1="91" x2="209" y2="113" stroke="#444" strokeWidth="1"/>
            <line x1="209" y1="91" x2="191" y2="113" stroke="#444" strokeWidth="1"/>
          </g>
          <circle cx="200" cy="102" r="3" fill="#666" />
        </g>
        
        {/* Tape between reels */}
        <rect
          x="100"
          y="98"
          width="80"
          height="8"
          fill="url(#tapeGradient)"
          rx="2"
          ry="2"
        />
        
        {/* Audio Visualizer in tape window */}
        {audioBlob && size === 'large' && (
          <foreignObject x="35" y="80" width="210" height="45">
            <div className="flex justify-center items-center h-full">
              <AudioVisualizer
                blob={audioBlob}
                width={200}
                height={40}
                barWidth={2}
                gap={1}
                barColor={playing ? "#A0522D" : "#8B4513"}
                backgroundColor="transparent"
                barPlayedColor="#D2691E"
                currentTime={currentTime}
              />
            </div>
          </foreignObject>
        )}
        
        {/* Progress indicator for smaller sizes */}
        {audioSrc && duration > 0 && size !== 'large' && (
          <rect
            x="100"
            y="98"
            width={80 * (progress / 100)}
            height="8"
            fill="url(#progressGradient)"
            rx="2"
            ry="2"
          />
        )}
        

        
        {/* Cassette holes */}
        <circle cx="50" cy="50" r="3" fill="#333" />
        <circle cx="230" cy="50" r="3" fill="#333" />
        <circle cx="50" cy="130" r="3" fill="#333" />
        <circle cx="230" cy="130" r="3" fill="#333" />
        
        {/* Side screws */}
        <circle cx="40" cy="90" r="3" fill="url(#screwGradient)" stroke="#666" strokeWidth="0.5"/>
        <circle cx="240" cy="90" r="3" fill="url(#screwGradient)" stroke="#666" strokeWidth="0.5"/>
        <circle cx="40" cy="90" r="1" fill="#333"/>
        <circle cx="240" cy="90" r="1" fill="#333"/>
        
        {/* Additional detail screws */}
        <circle cx="40" cy="50" r="2" fill="url(#screwGradient)" stroke="#666" strokeWidth="0.5"/>
        <circle cx="240" cy="50" r="2" fill="url(#screwGradient)" stroke="#666" strokeWidth="0.5"/>
        <circle cx="40" cy="130" r="2" fill="url(#screwGradient)" stroke="#666" strokeWidth="0.5"/>
        <circle cx="240" cy="130" r="2" fill="url(#screwGradient)" stroke="#666" strokeWidth="0.5"/>
        
        {/* Recording indicator */}
        {isRecording && (
          <circle
            cx="250"
            cy="40"
            r="4"
            fill="#ff4444"
            className="animate-pulse"
          />
        )}
        
        {/* Brand text */}
        <text
          x="140"
          y="165"
          textAnchor="middle"
          fontSize="7"
          fill="#666"
          fontFamily="Arial, sans-serif"
        >
          TEGAMI AUDIO
        </text>
        
        {/* Gradient definitions */}
        <defs>
          <linearGradient id="cassetteGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f0f0f0" />
            <stop offset="30%" stopColor="#e0e0e0" />
            <stop offset="70%" stopColor="#c8c8c8" />
            <stop offset="100%" stopColor="#b0b0b0" />
          </linearGradient>
          
          <linearGradient id="highlightGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" opacity="0.8" />
            <stop offset="100%" stopColor="#ffffff" opacity="0.2" />
          </linearGradient>
          
          <linearGradient id="labelGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="50%" stopColor="#f8f8f8" />
            <stop offset="100%" stopColor="#f0f0f0" />
          </linearGradient>
          
          <linearGradient id="windowGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#2a2a2a" />
            <stop offset="50%" stopColor="#1a1a1a" />
            <stop offset="100%" stopColor="#0a0a0a" />
          </linearGradient>
          
          <linearGradient id="reelGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#5a5a5a" />
            <stop offset="50%" stopColor="#4a4a4a" />
            <stop offset="100%" stopColor="#3a3a3a" />
          </linearGradient>
          
          <linearGradient id="reelRingGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#888" />
            <stop offset="50%" stopColor="#666" />
            <stop offset="100%" stopColor="#444" />
          </linearGradient>
          
          <linearGradient id="tapeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#8B4513" />
            <stop offset="50%" stopColor="#A0522D" />
            <stop offset="100%" stopColor="#654321" />
          </linearGradient>
          
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#4CAF50" />
            <stop offset="50%" stopColor="#45a049" />
            <stop offset="100%" stopColor="#3d8b40" />
          </linearGradient>
          
          <linearGradient id="buttonGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#4f46e5" />
            <stop offset="50%" stopColor="#3730a3" />
            <stop offset="100%" stopColor="#312e81" />
          </linearGradient>
          
          <radialGradient id="screwGradient" cx="30%" cy="30%">
            <stop offset="0%" stopColor="#ccc" />
            <stop offset="70%" stopColor="#999" />
            <stop offset="100%" stopColor="#666" />
          </radialGradient>
        </defs>
      </svg>
    </div>
  )
}
