"use client"

import type React from "react"

import { useRef, useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface WaveformVisualizerProps {
  audioUrl: string
  currentTime: number
  duration: number
  isPlaying: boolean
  onSeek?: (position: number) => void
  className?: string
  height?: number
  waveColor?: string
  progressColor?: string
  interactive?: boolean
  visualizationMode?: 'waveform' | 'blocks' | 'lines' | 'none'
}

export function WaveformVisualizer({
  audioUrl,
  currentTime,
  duration,
  isPlaying,
  onSeek,
  className,
  height = 80,
  waveColor = "#000000",
  progressColor = "#E41E26",
  interactive = true,
  visualizationMode = 'waveform',
}: WaveformVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null)

  // Initialize audio context
  useEffect(() => {
    try {
      const context = new (window.AudioContext || (window as any).webkitAudioContext)()
      setAudioContext(context)
      return () => {
        context.close()
      }
    } catch (err) {
      console.error("AudioContext not supported:", err)
      setError("Your browser doesn't support audio visualization")
    }
  }, [])

  // Load and decode audio data
  useEffect(() => {
    if (!audioContext) return

    const fetchData = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Add a cache-busting parameter to prevent cached 404 responses
        const audioUrlWithCache = audioUrl.includes('?') 
          ? `${audioUrl}&t=${Date.now()}` 
          : `${audioUrl}?t=${Date.now()}`

        const response = await fetch(audioUrlWithCache)
        if (!response.ok) {
          throw new Error(`Failed to fetch audio: ${response.status} ${response.statusText}`)
        }

        const arrayBuffer = await response.arrayBuffer()

        audioContext.decodeAudioData(
          arrayBuffer,
          (decodedData) => {
            setAudioBuffer(decodedData)
            setIsLoading(false)
          },
          (err) => {
            console.error("Error decoding audio data:", err)
            setError("Failed to decode audio data")
            setIsLoading(false)
          },
        )
      } catch (err) {
        console.error("Error loading audio:", err)
        setError("Failed to load audio data")
        setIsLoading(false)
      }
    }

    fetchData()
  }, [audioUrl, audioContext])

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (!canvasRef.current || !containerRef.current || !audioBuffer) return

      // Update canvas size
      canvasRef.current.width = containerRef.current.clientWidth

      // Redraw waveform - we'll trigger this by forcing a re-render
      setIsLoading((prev) => {
        // Toggle and immediately toggle back to force re-render without changing state
        setTimeout(() => setIsLoading(prev), 0)
        return !prev
      })
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [audioBuffer])

  // Draw waveform and update when necessary
  useEffect(() => {
    if (!canvasRef.current) return 
    
    if (!audioBuffer && error) {
      // Draw a fallback visualization if there's an error
      drawFallbackWaveform()
      return
    }
    
    if (audioBuffer && !isLoading) {
      drawWaveform()
    }
  }, [audioBuffer, isLoading, currentTime, duration, waveColor, progressColor, error])

  // Draw the actual waveform from audio data
  const drawWaveform = () => {
    const canvas = canvasRef.current
    if (!canvas || !audioBuffer) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Get the channel data (mono or left channel)
    const channelData = audioBuffer.getChannelData(0)

    // Calculate the number of samples to skip to reduce data points
    const sampleSize = Math.max(1, Math.floor(channelData.length / canvas.width))

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Calculate the playback position
    const playbackPosition = duration > 0 ? (currentTime / duration) * canvas.width : 0

    const centerY = canvas.height / 2
    const scaleY = (canvas.height / 2) * 0.9 // 90% of half height for some margin

    ctx.beginPath()

    for (let i = 0; i < canvas.width; i++) {
      const startSample = Math.floor((i / canvas.width) * channelData.length)
      const endSample = Math.floor(((i + 1) / canvas.width) * channelData.length)

      // Calculate the average amplitude for this segment
      let sum = 0
      for (let j = startSample; j < endSample; j++) {
        sum += Math.abs(channelData[j] || 0)
      }
      const avgAmplitude = sum / (endSample - startSample)

      // Draw the waveform bar
      const barHeight = avgAmplitude * scaleY * 2

      // Set color based on playback position
      if (i <= playbackPosition) {
        ctx.fillStyle = progressColor
      } else {
        ctx.fillStyle = waveColor
      }

      // Draw a rectangle for each data point
      ctx.fillRect(i, centerY - barHeight / 2, 1, barHeight)
    }
  }
  
  // Draw a fallback visualization when audio can't be loaded
  const drawFallbackWaveform = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Calculate the playback position
    const playbackPosition = duration > 0 ? (currentTime / duration) * canvas.width : 0

    const centerY = canvas.height / 2
    const scaleY = (canvas.height / 2) * 0.5 // 50% of half height for some margin

    // Generate a dummy waveform using sine waves
    for (let i = 0; i < canvas.width; i++) {
      // Create a sine wave pattern
      const freq1 = 0.01 // Base frequency
      const freq2 = 0.05 // Higher frequency for detail
      
      // Combine sine waves for a more complex pattern
      const y1 = Math.sin(i * freq1) * 0.5
      const y2 = Math.sin(i * freq2) * 0.2
      const y3 = Math.sin(i * freq1 * 2 + 1) * 0.3
      
      // Combine the waves and scale to our canvas
      const combinedHeight = (y1 + y2 + y3) * scaleY
      
      // Set color based on playback position
      if (i <= playbackPosition) {
        ctx.fillStyle = progressColor
      } else {
        ctx.fillStyle = waveColor
      }
      
      // Draw with varying opacity to make it look like a fallback
      ctx.globalAlpha = 0.5
      
      // Draw a rectangle for each data point
      ctx.fillRect(i, centerY - combinedHeight, 1, combinedHeight * 2)
    }
    
    // Reset opacity
    ctx.globalAlpha = 1.0
  }

  // Handle click to seek
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!containerRef.current || !duration || !interactive || !onSeek) return

    const rect = containerRef.current.getBoundingClientRect()
    const clickPosition = (e.clientX - rect.left) / rect.width

    // Seek to the clicked position
    onSeek(clickPosition * duration)
  }

  // Visualization rendering logic
  const renderVisualization = () => {
    switch (visualizationMode) {
      case 'blocks':
        // Render block visualization
        return (
          <div className="absolute inset-0 flex items-center overflow-hidden">
            {Array.from({ length: 50 }).map((_, i) => (
              <div
                key={i}
                className="h-8 mx-px transition-all bg-gray-300"
                style={{
                  width: '2%',
                  height: `${30 + Math.random() * 70}%`,
                  background: i / 50 <= (currentTime / duration) ? progressColor : waveColor,
                  opacity: 0.7
                }}
              />
            ))}
          </div>
        )
      case 'lines':
        // Render lines visualization
        const generateRandomPath = () => {
          const points = 10;
          let path = `M 0 50`;
          for (let i = 1; i <= points; i++) {
            const x = (i / points) * 100;
            const y = 20 + Math.random() * 60;
            path += ` L ${x} ${y}`;
          }
          return path;
        }
        return (
          <svg width="100%" height={height} viewBox={`0 0 100 100`} className="absolute inset-0">
            <path d={generateRandomPath()} fill="none" stroke={waveColor} strokeWidth="2" opacity={0.3} />
            <path d={generateRandomPath()} fill="none" stroke={progressColor} strokeWidth="2" opacity={0.7} />
          </svg>
        )
      case 'none':
        return null
      case 'waveform':
      default:
        // Default waveform rendering (existing canvas logic)
        return (
          <canvas
            ref={canvasRef}
            className={cn("w-full", className)}
            style={{ height, width: '100%' }}
            onClick={handleCanvasClick}
          />
        )
    }
  }

  return (
    <div
      ref={containerRef}
      className={cn("relative h-full", interactive ? "cursor-pointer" : "cursor-default", className)}
      style={{ height: `${height}px` }}
    >
      {isLoading ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-sm uppercase tracking-wide text-muted-foreground">Loading waveform...</div>
        </div>
      ) : error ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-sm uppercase tracking-wide text-[#E41E26]">{error}</div>
          {/* Add a fallback visualization when audio fails to load */}
          <canvas
            ref={canvasRef}
            width={containerRef.current?.clientWidth || 800}
            height={height}
            className="w-full h-full absolute top-0 left-0 z-[-1]"
            style={{ opacity: 0.3 }}
          />
        </div>
      ) : (
        renderVisualization()
      )}

      {/* Playhead */}
      <div
        className="absolute top-0 bottom-0 w-px bg-[#E41E26] pointer-events-none"
        style={{ left: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
      />
    </div>
  )
}
