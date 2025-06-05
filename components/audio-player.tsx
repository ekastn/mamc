"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Volume2, Play, Pause, SkipBack, SkipForward } from "lucide-react"
import { cn } from "@/lib/utils"

interface AudioPlayerProps {
  src: string
  onTimeUpdate?: (currentTime: number, duration: number) => void
  onPlayStateChange?: (isPlaying: boolean) => void
  onLoaded?: (duration: number) => void
  className?: string
  autoPlay?: boolean
  loop?: boolean
  seekTo?: number
}

export function AudioPlayer({
  src,
  onTimeUpdate,
  onPlayStateChange,
  onLoaded,
  className,
  autoPlay = false,
  loop = false,
  seekTo,
}: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [volume, setVolume] = useState([80])
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Format seconds to MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  // Initialize audio element
  useEffect(() => {
    // Clean up any previous audio element
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.src = ""
      audioRef.current.load()
    }

    const audio = new Audio(src)
    audioRef.current = audio
    audio.volume = volume[0] / 100
    audio.loop = loop
    audio.autoplay = autoPlay
    setIsLoaded(false)
    setError(null)

    const handleLoadedMetadata = () => {
      setDuration(audio.duration)
      setIsLoaded(true)
      if (onLoaded) onLoaded(audio.duration)
    }

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime)
      if (onTimeUpdate) onTimeUpdate(audio.currentTime, audio.duration)
    }

    const handleEnded = () => {
      setIsPlaying(false)
      if (onPlayStateChange) onPlayStateChange(false)
    }

    const handleError = (e: ErrorEvent) => {
      console.error("Audio error:", e)
      setError("Failed to load audio")
      setIsLoaded(false)
    }

    audio.addEventListener("loadedmetadata", handleLoadedMetadata)
    audio.addEventListener("timeupdate", handleTimeUpdate)
    audio.addEventListener("ended", handleEnded)
    audio.addEventListener("error", handleError as EventListener)

    // Start loading the audio
    audio.load()

    return () => {
      audio.pause()
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata)
      audio.removeEventListener("timeupdate", handleTimeUpdate)
      audio.removeEventListener("ended", handleEnded)
      audio.removeEventListener("error", handleError as EventListener)
    }
  }, [src, autoPlay, loop, onLoaded, onTimeUpdate, onPlayStateChange])

  // Handle volume change in a separate effect
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume[0] / 100
    }
  }, [volume])

  // Handle play/pause
  const togglePlayPause = () => {
    if (!audioRef.current || !isLoaded) return

    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play().catch((error) => {
        console.error("Error playing audio:", error)
        setError("Failed to play audio")
      })
    }

    setIsPlaying(!isPlaying)
    if (onPlayStateChange) onPlayStateChange(!isPlaying)
  }

  // Handle seeking
  useEffect(() => {
    if (audioRef.current && isLoaded && seekTo !== undefined) {
      try {
        audioRef.current.currentTime = seekTo
        setCurrentTime(seekTo)
      } catch (e) {
        console.error("Error seeking audio:", e)
      }
    }
  }, [seekTo, isLoaded])

  // Handle skip forward/backward
  const skipForward = () => {
    if (!audioRef.current || !isLoaded) return
    const newTime = Math.min(audioRef.current.currentTime + 10, duration)
    audioRef.current.currentTime = newTime
    setCurrentTime(newTime)
  }

  const skipBackward = () => {
    if (!audioRef.current || !isLoaded) return
    const newTime = Math.max(audioRef.current.currentTime - 10, 0)
    audioRef.current.currentTime = newTime
    setCurrentTime(newTime)
  }

  // Handle seeking with slider
  const handleSeek = (value: number[]) => {
    if (!audioRef.current || !isLoaded) return
    const newTime = (value[0] / 100) * duration
    try {
      audioRef.current.currentTime = newTime
      setCurrentTime(newTime)
    } catch (e) {
      console.error("Error seeking audio:", e)
    }
  }

  return (
    <div className={cn("flex items-center gap-4", className)}>
      {error ? (
        <div className="text-[#E41E26] text-sm uppercase tracking-wide">{error}</div>
      ) : (
        <>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              onClick={skipBackward}
              className="border-2 border-black rounded-none"
              disabled={!isLoaded}
            >
              <SkipBack className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={togglePlayPause}
              className="border-2 border-black rounded-none"
              disabled={!isLoaded}
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={skipForward}
              className="border-2 border-black rounded-none"
              disabled={!isLoaded}
            >
              <SkipForward className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex-1 flex items-center gap-2">
            <span className="text-sm text-muted-foreground uppercase tracking-wide min-w-[45px]">
              {formatTime(currentTime)}
            </span>
            <Slider
              value={[isLoaded ? (currentTime / duration) * 100 : 0]}
              max={100}
              step={0.1}
              className="flex-1"
              onValueChange={handleSeek}
              disabled={!isLoaded}
            />
            <span className="text-sm text-muted-foreground uppercase tracking-wide min-w-[45px]">
              {isLoaded ? formatTime(duration) : "--:--"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Volume2 className="h-4 w-4 text-muted-foreground" />
            <Slider value={volume} max={100} step={1} className="w-24" onValueChange={setVolume} disabled={!isLoaded} />
          </div>
        </>
      )}
    </div>
  )
}
