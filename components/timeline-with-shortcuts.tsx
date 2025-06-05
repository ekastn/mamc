"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import {
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  SkipBack,
  SkipForward,
  Volume2,
  ZoomIn,
  ZoomOut,
  Plus,
  MessageSquare,
  Keyboard
} from "lucide-react"
import { cn } from "@/lib/utils"
import { SAMPLE_COMMENTS, SAMPLE_PROJECTS, SAMPLE_USERS } from "@/lib/constants"
import { WaveformVisualizer } from "@/components/waveform-visualizer"
import { TrackItem } from "@/components/features/timeline/track-item"
import { 
  TrackVisualizationModes, 
  type VisualizationMode 
} from "@/components/features/timeline/track-visualization-modes"
import { TimelineCommentMarkers } from "@/components/features/timeline/timeline-comment-markers"
import { TimelineCommentCreator } from "@/components/features/timeline/timeline-comment-creator"
import { TimelineCommentEditor } from "@/components/features/timeline/timeline-comment-editor"
import { TimelineKeyboardHelp } from "@/components/features/timeline/timeline-keyboard-help"
import { TimelineKeyboardShortcuts } from "@/components/features/timeline/timeline-keyboard-shortcuts"
import type { Track, Comment } from "@/lib/types"

// Fallback audio URL for testing
const FALLBACK_AUDIO_URL = "https://upload.wikimedia.org/wikipedia/commons/2/28/SampleAudio_0.4mb.mp3"

interface TimelineProps {
  projectId?: string;
  tracks?: Track[];
  comments?: Comment[];
}

export function Timeline({ projectId, tracks: propTracks, comments: propComments }: TimelineProps) {
  // Use provided tracks or fallback to sample data
  const tracks = propTracks || (projectId 
    ? SAMPLE_PROJECTS.find(p => p.id === projectId)?.tracks 
    : SAMPLE_PROJECTS[0]?.tracks) || []
  
  // Use provided comments or fallback to sample data
  const comments = propComments || SAMPLE_COMMENTS
  
  // Playback state
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTimeSeconds, setCurrentTimeSeconds] = useState(0)
  const [durationSeconds, setDurationSeconds] = useState(225) // 3:45 in seconds
  const [currentTime, setCurrentTime] = useState("0:00")
  const [duration, setDuration] = useState("3:45")
  const [volume, setVolume] = useState([80])
  const [zoom, setZoom] = useState(1)
  const [selectedTrack, setSelectedTrack] = useState<string | null>(null)
  const [activeComments, setActiveComments] = useState(true)
  const [mutedTracks, setMutedTracks] = useState<string[]>([])
  const [soloTracks, setSoloTracks] = useState<string[]>([])
  const [visualizationMode, setVisualizationMode] = useState<VisualizationMode>("waveform")
  const [showTimelineActions, setShowTimelineActions] = useState(false)
  const [showCommentCreator, setShowCommentCreator] = useState(false)
  const [showCommentEditor, setShowCommentEditor] = useState(false)
  const [editingComment, setEditingComment] = useState<Comment | null>(null)
  const [newComments, setNewComments] = useState<Comment[]>([])
  const [editedComments, setEditedComments] = useState<Comment[]>([])
  const [deletedCommentIds, setDeletedCommentIds] = useState<string[]>([])
  
  // Audio elements refs
  const audioRefs = useRef<Map<string, HTMLAudioElement>>(new Map())
  const mainAudioRef = useRef<HTMLAudioElement | null>(null)
  const timelineContainerRef = useRef<HTMLDivElement>(null)
  
  // Initialize main audio for timeline control
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Use the first track's audio or fallback
      const firstTrackAudio = tracks[0]?.audioUrl || FALLBACK_AUDIO_URL
      const audio = new Audio(firstTrackAudio)
      mainAudioRef.current = audio
      
      // Set up event listeners
      audio.addEventListener('timeupdate', handleTimeUpdate)
      audio.addEventListener('loadedmetadata', handleMetadataLoaded)
      audio.addEventListener('ended', handleEnded)
      
      return () => {
        audio.removeEventListener('timeupdate', handleTimeUpdate)
        audio.removeEventListener('loadedmetadata', handleMetadataLoaded)
        audio.removeEventListener('ended', handleEnded)
        audio.pause()
      }
    }
  }, [tracks])
  
  // Initialize individual track audio elements
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Clear previous audio elements
      audioRefs.current.forEach(audio => {
        audio.pause()
        audio.remove()
      })
      audioRefs.current.clear()
      
      // Create new audio elements for each track
      tracks.forEach(track => {
        const audioUrl = track.audioUrl || FALLBACK_AUDIO_URL
        const audio = new Audio(audioUrl)
        audio.volume = volume[0] / 100
        audioRefs.current.set(track.id, audio)
      })
      
      return () => {
        // Cleanup
        audioRefs.current.forEach(audio => {
          audio.pause()
          audio.remove()
        })
        audioRefs.current.clear()
      }
    }
  }, [tracks])
  
  // Update track audibility when mute/solo settings change
  useEffect(() => {
    audioRefs.current.forEach((audio, trackId) => {
      audio.volume = isTrackAudible(trackId) ? volume[0] / 100 : 0
    })
  }, [mutedTracks, soloTracks, volume])
  
  // Format time from seconds to MM:SS
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${minutes}:${secs.toString().padStart(2, '0')}`
  }
  
  // Handle time updates
  const handleTimeUpdate = () => {
    if (mainAudioRef.current) {
      const time = mainAudioRef.current.currentTime
      setCurrentTimeSeconds(time)
      setCurrentTime(formatTime(time))
      
      // Synchronize all track audios with the main audio
      audioRefs.current.forEach(audio => {
        if (Math.abs(audio.currentTime - time) > 0.1) {
          audio.currentTime = time
        }
      })
      
      // Auto-scroll the timeline if needed based on zoom level
      if (timelineContainerRef.current && zoom > 1) {
        const scrollPosition = (time / durationSeconds) * timelineContainerRef.current.scrollWidth * zoom
        const viewportWidth = timelineContainerRef.current.clientWidth
        
        if (scrollPosition > timelineContainerRef.current.scrollLeft + viewportWidth * 0.75) {
          timelineContainerRef.current.scrollLeft = scrollPosition - viewportWidth * 0.25
        }
      }
    }
  }
  
  // Handle metadata loaded
  const handleMetadataLoaded = () => {
    if (mainAudioRef.current) {
      const audioDuration = mainAudioRef.current.duration
      setDurationSeconds(audioDuration)
      setDuration(formatTime(audioDuration))
    }
  }
  
  // Handle playback ended
  const handleEnded = () => {
    setIsPlaying(false)
    audioRefs.current.forEach(audio => {
      audio.pause()
      audio.currentTime = 0
    })
  }
  
  // Handle seek in the waveform
  const handleSeek = (position: number) => {
    if (mainAudioRef.current) {
      mainAudioRef.current.currentTime = position
      
      // Update all track audio positions
      audioRefs.current.forEach(audio => {
        audio.currentTime = position
      })
      
      setCurrentTimeSeconds(position)
      setCurrentTime(formatTime(position))
    }
  }
  
  // Toggle play/pause
  const togglePlayback = () => {
    if (mainAudioRef.current) {
      if (isPlaying) {
        mainAudioRef.current.pause()
        audioRefs.current.forEach(audio => {
          audio.pause()
        })
      } else {
        const playPromises = Array.from(audioRefs.current.entries()).map(([trackId, audio]) => {
          if (isTrackAudible(trackId)) {
            return audio.play().catch(error => {
              console.error("Audio playback error:", error)
            })
          }
          return Promise.resolve()
        })
        
        // Play main audio after all tracks start playing
        Promise.all(playPromises).then(() => {
          mainAudioRef.current?.play().catch(error => {
            console.error("Main audio playback error:", error)
          })
        })
      }
      setIsPlaying(!isPlaying)
    }
  }
  
  // Skip backward by 5 seconds
  const skipBackward = () => {
    if (mainAudioRef.current) {
      const newTime = Math.max(0, mainAudioRef.current.currentTime - 5)
      mainAudioRef.current.currentTime = newTime
      
      // Update all track audio positions
      audioRefs.current.forEach(audio => {
        audio.currentTime = newTime
      })
    }
  }
  
  // Skip forward by 5 seconds
  const skipForward = () => {
    if (mainAudioRef.current) {
      const newTime = Math.min(mainAudioRef.current.duration, mainAudioRef.current.currentTime + 5)
      mainAudioRef.current.currentTime = newTime
      
      // Update all track audio positions
      audioRefs.current.forEach(audio => {
        audio.currentTime = newTime
      })
    }
  }
  
  // Handle volume change
  const handleVolumeChange = (newVolume: number[]) => {
    setVolume(newVolume)
    
    // Update volume for all audible tracks
    audioRefs.current.forEach((audio, trackId) => {
      if (isTrackAudible(trackId)) {
        audio.volume = newVolume[0] / 100
      }
    })
    
    if (mainAudioRef.current) {
      mainAudioRef.current.volume = newVolume[0] / 100
    }
  }
  
  // Handle volume increase by 5%
  const handleVolumeUp = () => {
    const newVolume = Math.min(100, volume[0] + 5)
    handleVolumeChange([newVolume])
  }
  
  // Handle volume decrease by 5%
  const handleVolumeDown = () => {
    const newVolume = Math.max(0, volume[0] - 5)
    handleVolumeChange([newVolume])
  }
  
  // Handle zoom in
  const handleZoomIn = () => {
    setZoom(Math.min(2, zoom + 0.1))
  }
  
  // Handle zoom out
  const handleZoomOut = () => {
    setZoom(Math.max(0.5, zoom - 0.1))
  }
  
  // Handle track selection
  const handleTrackSelect = (trackId: string) => {
    setSelectedTrack(selectedTrack === trackId ? null : trackId)
  }
  
  // Handle track mute
  const handleTrackMute = (trackId: string, muted: boolean) => {
    if (muted) {
      setMutedTracks([...mutedTracks, trackId])
    } else {
      setMutedTracks(mutedTracks.filter(id => id !== trackId))
    }
    
    // Update audio volume
    const audio = audioRefs.current.get(trackId)
    if (audio) {
      audio.volume = muted ? 0 : volume[0] / 100
    }
  }
  
  // Handle mute for selected track (keyboard shortcut)
  const handleMuteSelectedTrack = () => {
    if (selectedTrack) {
      const isMuted = mutedTracks.includes(selectedTrack)
      handleTrackMute(selectedTrack, !isMuted)
    }
  }
  
  // Handle track solo
  const handleTrackSolo = (trackId: string, solo: boolean) => {
    const newSoloTracks = solo 
      ? [...soloTracks, trackId] 
      : soloTracks.filter(id => id !== trackId)
    
    setSoloTracks(newSoloTracks)
    
    // Update all track volumes based on new solo state
    audioRefs.current.forEach((audio, id) => {
      const isSolo = newSoloTracks.includes(id)
      const isMuted = mutedTracks.includes(id)
      const shouldPlay = newSoloTracks.length === 0 ? !isMuted : isSolo
      
      audio.volume = shouldPlay ? volume[0] / 100 : 0
    })
  }
  
  // Handle solo for selected track (keyboard shortcut)
  const handleSoloSelectedTrack = () => {
    if (selectedTrack) {
      const isSolo = soloTracks.includes(selectedTrack)
      handleTrackSolo(selectedTrack, !isSolo)
    }
  }

  // Handle comment click
  const handleCommentClick = (comment: Comment) => {
    // Jump to comment position
    handleSeek(comment.timePosition);
    
    // You could also display a comment detail modal here
    console.log("Comment clicked:", comment);
  }
  
  // Open comment creator at current time
  const handleOpenCommentCreator = () => {
    setShowCommentCreator(true)
  }
  
  // Handle adding a new comment
  const handleAddComment = (text: string, emotion: string) => {
    const newComment: Comment = {
      id: `new-${Date.now()}`,
      position: Math.floor((currentTimeSeconds / durationSeconds) * 100),
      timePosition: currentTimeSeconds,
      user: SAMPLE_USERS[0], // Use the current user from your auth system
      text,
      emotion: emotion as "happy" | "sad" | "frustrated" | "neutral",
      timestamp: new Date().toISOString(),
    }
    
    setNewComments([...newComments, newComment])
    setShowCommentCreator(false)
  }
  
  // Open comment editor for a specific comment
  const handleEditComment = (comment: Comment) => {
    setEditingComment(comment)
    setShowCommentEditor(true)
  }
  
  // Handle saving edited comment
  const handleSaveComment = (commentId: string, text: string, emotion: string) => {
    // Find if it's a new comment or an existing one
    const isNewComment = commentId.startsWith('new-')
    
    if (isNewComment) {
      // Update in new comments
      setNewComments(newComments.map(comment => {
        if (comment.id === commentId) {
          return {
            ...comment,
            text,
            emotion: emotion as "happy" | "sad" | "frustrated" | "neutral",
          }
        }
        return comment
      }))
    } else {
      // Find the original comment
      const originalComment = comments.find(c => c.id === commentId)
      
      if (originalComment) {
        // Check if this comment is already in editedComments
        const existingEditIndex = editedComments.findIndex(c => c.id === commentId)
        
        if (existingEditIndex >= 0) {
          // Update the existing edit
          const updatedEdits = [...editedComments]
          updatedEdits[existingEditIndex] = {
            ...updatedEdits[existingEditIndex],
            text,
            emotion: emotion as "happy" | "sad" | "frustrated" | "neutral",
          }
          setEditedComments(updatedEdits)
        } else {
          // Add a new edit
          setEditedComments([
            ...editedComments,
            {
              ...originalComment,
              text,
              emotion: emotion as "happy" | "sad" | "frustrated" | "neutral",
            }
          ])
        }
      }
    }
    
    setEditingComment(null)
    setShowCommentEditor(false)
  }
  
  // Handle deleting a comment
  const handleDeleteComment = (commentId: string) => {
    // Check if it's a new comment
    if (commentId.startsWith('new-')) {
      setNewComments(newComments.filter(comment => comment.id !== commentId))
    } else {
      // Add to deleted comments list
      setDeletedCommentIds([...deletedCommentIds, commentId])
    }
    
    setEditingComment(null)
    setShowCommentEditor(false)
  }

  // Determine if a track should be audible based on mute/solo settings
  const isTrackAudible = (trackId: string) => {
    if (mutedTracks.includes(trackId)) return false
    if (soloTracks.length > 0) return soloTracks.includes(trackId)
    return true
  }

  // Combine and filter comments for display
  const displayComments = [
    // Include original comments that haven't been deleted
    ...comments.filter(comment => !deletedCommentIds.includes(comment.id))
      // Replace with edited version if it exists
      .map(comment => {
        const editedVersion = editedComments.find(c => c.id === comment.id)
        return editedVersion || comment
      }),
    // Add new comments
    ...newComments
  ]

  return (
    <div className="space-y-6">
      {/* Keyboard shortcuts handler */}
      <TimelineKeyboardShortcuts
        onTogglePlayback={togglePlayback}
        onSkipForward={skipForward}
        onSkipBackward={skipBackward}
        onVolumeUp={handleVolumeUp}
        onVolumeDown={handleVolumeDown}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onMuteSelectedTrack={handleMuteSelectedTrack}
        onSoloSelectedTrack={handleSoloSelectedTrack}
        hasSelectedTrack={!!selectedTrack}
      />
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="border-2 border-black uppercase text-xs tracking-wide"
            onClick={() => setActiveComments(!activeComments)}
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            {activeComments ? 'Hide Comments' : 'Show Comments'}
          </Button>
          <TimelineKeyboardHelp />
        </div>
        <div className="flex items-center gap-2">
          <TrackVisualizationModes 
            currentMode={visualizationMode}
            onChange={setVisualizationMode}
          />
          <Button
            variant="outline"
            size="icon"
            onClick={handleZoomOut}
            className="border-2 border-black rounded-none"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-xs font-mono">{zoom.toFixed(1)}x</span>
          <Button
            variant="outline"
            size="icon"
            onClick={handleZoomIn}
            className="border-2 border-black rounded-none"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Card 
        className="border-2 border-black relative"
        onMouseEnter={() => setShowTimelineActions(true)}
        onMouseLeave={() => setShowTimelineActions(false)}
      >
        {/* Timeline actions that appear on hover */}
        {showTimelineActions && (
          <div className="absolute top-2 right-2 z-50 flex gap-1">
            <Button 
              variant="outline" 
              size="sm" 
              className="border-2 border-black bg-white rounded-none"
              title="Add comment"
              onClick={handleOpenCommentCreator}
            >
              <Plus className="h-3 w-3 mr-1" />
              Comment
            </Button>
          </div>
        )}
        
        <CardContent className="p-4">
          <div className="space-y-6">
            {/* Timeline container with scrolling for zoomed view */}
            <div 
              ref={timelineContainerRef}
              className={cn(
                "track-timeline-container relative",
                zoom > 1 ? "overflow-x-auto" : "overflow-x-hidden"
              )}
            >
              {/* Timeline ruler */}
              <div className="relative h-6 border-b border-gray-200 track-timeline-ruler"
                  style={{ width: `${zoom * 100}%` }}>
                {Array.from({ length: 11 }).map((_, i) => {
                  const percent = i * 10
                  return (
                    <div 
                      key={percent} 
                      className="absolute bottom-0 transform -translate-x-1/2" 
                      style={{ left: `${percent}%` }}
                    >
                      <div className="h-2 w-px bg-gray-400"></div>
                      <div className="text-xs text-gray-500">
                        {formatTime((durationSeconds * percent) / 100)}
                      </div>
                    </div>
                  )
                })}
                
                {/* Playhead */}
                <div 
                  className="absolute top-0 bottom-0 w-px bg-red-500 z-10" 
                  style={{ left: `${(currentTimeSeconds / durationSeconds) * 100}%` }}
                ></div>
              </div>
              
              {/* Main waveform container */}
              <div className="relative h-20 rounded-none overflow-hidden bg-gray-50"
                   style={{ width: `${zoom * 100}%` }}>
                <WaveformVisualizer
                  audioUrl={tracks[0]?.audioUrl || FALLBACK_AUDIO_URL}
                  currentTime={currentTimeSeconds}
                  duration={durationSeconds}
                  isPlaying={isPlaying}
                  onSeek={handleSeek}
                  height={80}
                  waveColor="#000000"
                  progressColor="#E41E26"
                  interactive={true}
                  className="bauhaus-grid"
                />
                
                {/* Comment markers using the updated component */}
                <TimelineCommentMarkers
                  comments={displayComments}
                  duration={durationSeconds}
                  currentTime={currentTimeSeconds}
                  zoom={zoom}
                  active={activeComments}
                  onCommentClick={handleCommentClick}
                  onEditComment={handleEditComment}
                  onDeleteComment={handleDeleteComment}
                />
              </div>
            </div>

            {/* Individual tracks */}
            <div className="space-y-2">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold uppercase tracking-wide">Tracks</h3>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">Select track to highlight</span>
                </div>
              </div>
              
              <div className={cn(
                "track-timeline-container",
                zoom > 1 ? "overflow-x-auto" : "overflow-x-hidden"
              )}>
                <div style={{ width: `${zoom > 1 ? zoom * 100 : 100}%` }}>
                  {tracks.map((track) => (
                    <TrackItem
                      key={track.id}
                      track={track}
                      isSelected={selectedTrack === track.id}
                      currentTimeSeconds={currentTimeSeconds}
                      durationSeconds={durationSeconds}
                      zoom={zoom}
                      visualizationMode={visualizationMode}
                      onSelect={handleTrackSelect}
                      onMute={handleTrackMute}
                      onSolo={handleTrackSolo}
                      isAudible={isTrackAudible(track.id)}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Playback controls */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="border-2 border-black rounded-none"
                  onClick={skipBackward}
                >
                  <SkipBack className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={togglePlayback}
                  className="border-2 border-black rounded-none"
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="border-2 border-black rounded-none"
                  onClick={skipForward}
                >
                  <SkipForward className="h-4 w-4" />
                </Button>
              </div>

              <div className="text-sm text-muted-foreground uppercase tracking-wide font-mono">
                {currentTime} / {duration}
              </div>
              
              {/* Progress slider */}
              <div className="flex-1 mx-4">
                <Slider
                  value={[currentTimeSeconds]}
                  min={0}
                  max={durationSeconds}
                  step={0.1}
                  onValueChange={(value) => handleSeek(value[0])}
                  className="cursor-pointer"
                />
              </div>

              <div className="flex items-center gap-2">
                <Volume2 className="h-4 w-4 text-muted-foreground" />
                <Slider 
                  value={volume} 
                  max={100} 
                  step={1} 
                  className="w-24" 
                  onValueChange={(value) => handleVolumeChange(value)} 
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" size="sm" className="border-2 border-black uppercase text-xs tracking-wide">
          <ChevronLeft className="h-4 w-4 mr-2" />
          Previous Section
        </Button>
        <Button variant="outline" size="sm" className="border-2 border-black uppercase text-xs tracking-wide">
          Next Section
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
      
      {/* Comment creator dialog */}
      {showCommentCreator && (
        <TimelineCommentCreator
          currentTime={currentTimeSeconds}
          formatTime={formatTime}
          onAddComment={handleAddComment}
          onCancel={() => setShowCommentCreator(false)}
        />
      )}
      
      {/* Comment editor dialog */}
      {showCommentEditor && editingComment && (
        <TimelineCommentEditor
          comment={editingComment}
          formatTime={formatTime}
          onSaveComment={handleSaveComment}
          onDeleteComment={handleDeleteComment}
          onCancel={() => {
            setShowCommentEditor(false)
            setEditingComment(null)
          }}
        />
      )}
    </div>
  )
}
