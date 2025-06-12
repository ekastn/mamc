"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  ChevronLeft,
  ChevronRight,
  Filter,
  Pause,
  Play,
  SkipBack,
  SkipForward,
  Volume2,
  ZoomIn,
  ZoomOut,
  Plus,
  MessageSquare
} from "lucide-react"
import { cn, getEmotionColor, getEmotionIcon } from "@/lib/utils"
// Import constants from their specific files
import { SAMPLE_USERS } from "@/lib/constants/user"
import { SAMPLE_COMMENTS } from "@/lib/constants/comments"
import { SAMPLE_PROJECTS } from "@/lib/constants/projects"
import { DEFAULT_AUDIO_URL, SAMPLE_TIMELINE_TRACKS } from "@/lib/constants/timeline-audio"
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
import type { Project, Comment } from "@/lib/types/index"
import type { ProjectTrack as Track } from "@/lib/types/project"

interface TimelineProps {
  projectId?: string;
  tracks?: Track[];
  comments?: Comment[];
}

export function Timeline({ projectId, tracks: propTracks, comments: propComments }: TimelineProps) {
  // Use provided tracks or fallback to sample data
  const tracks = propTracks || (projectId 
    ? SAMPLE_PROJECTS.find((p: any) => p.id === projectId)?.tracks 
    : SAMPLE_TIMELINE_TRACKS) || []
  
  // Use provided comments or fallback to sample data
  const comments = propComments || SAMPLE_COMMENTS
  
  // Playback state
  const [volume, setVolume] = useState([80])
  const [zoom, setZoom] = useState(1)
  const [activeComments, setActiveComments] = useState(true)
  const [visualizationMode, setVisualizationMode] = useState<VisualizationMode>("waveform")
  const [showTimelineActions, setShowTimelineActions] = useState(false)
  const [showCommentCreator, setShowCommentCreator] = useState(false)
  const [showCommentEditor, setShowCommentEditor] = useState(false)
  const [editingComment, setEditingComment] = useState<Comment | null>(null)
  const [newComments, setNewComments] = useState<Comment[]>([])
  const [editedComments, setEditedComments] = useState<Comment[]>([])
  const [deletedCommentIds, setDeletedCommentIds] = useState<string[]>([])

  // Per-track playback state
  const [trackPlayback, setTrackPlayback] = useState(() => {
    const state: Record<string, { currentTime: number; duration: number; isPlaying: boolean }> = {};
    tracks.forEach((track: Track) => {
      state[track.id] = { currentTime: 0, duration: 225, isPlaying: false };
    });
    return state;
  });
  const [selectedTrack, setSelectedTrack] = useState<string | null>(tracks[0]?.id || null)

  // Update playback state when tracks change
  useEffect(() => {
    setTrackPlayback(prev => {
      const next = { ...prev };
      tracks.forEach((track: Track) => {
        if (!next[track.id]) {
          next[track.id] = { currentTime: 0, duration: 225, isPlaying: false };
        }
      });
      // Remove state for tracks that no longer exist
      Object.keys(next).forEach(id => {
        if (!tracks.find((t: Track) => t.id === id)) delete next[id];
      });
      return next;
    });
  }, [tracks]);

  // Audio ref for the selected track
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const timelineContainerRef = useRef<HTMLDivElement>(null)
  const timelineRef = useRef<HTMLDivElement>(null)

  // Ref to always have the latest selectedTrack in event handlers
  const selectedTrackRef = useRef(selectedTrack);
  useEffect(() => {
    selectedTrackRef.current = selectedTrack;
  }, [selectedTrack]);

  // Format time from seconds to MM:SS
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${minutes}:${secs.toString().padStart(2, '0')}`
  }

  // Update duration and time for selected track
  useEffect(() => {
    if (!selectedTrack) return;
    const audio = audioRef.current;
    if (!audio) return;
    const handleTimeUpdate = () => {
      setTrackPlayback(prev => ({
        ...prev,
        [selectedTrack]: {
          ...prev[selectedTrack],
          currentTime: audio.currentTime,
          duration: audio.duration || prev[selectedTrack].duration,
        },
      }));
      setCurrentTime(formatTime(audio.currentTime));
      setDuration(formatTime(audio.duration || 225));
    };
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleTimeUpdate);
    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleTimeUpdate);
    };
  }, [selectedTrack]);

  // Sync isPlaying state with audio element events
  useEffect(() => {
    if (!selectedTrack) return;
    const audio = audioRef.current;
    if (!audio) return;
    const handlePlay = () => {
      const id = selectedTrackRef.current;
      if (!id) return;
      setTrackPlayback(prev => {
        if (!prev[id]) return prev;
        return {
          ...prev,
          [id]: {
            ...prev[id],
            isPlaying: true,
          },
        };
      });
    };
    const handlePause = () => {
      const id = selectedTrackRef.current;
      if (!id) return;
      setTrackPlayback(prev => {
        if (!prev[id]) return prev;
        return {
          ...prev,
          [id]: {
            ...prev[id],
            isPlaying: false,
          },
        };
      });
    };
    const handleEnded = () => {
      const id = selectedTrackRef.current;
      if (!id) return;
      setTrackPlayback(prev => {
        if (!prev[id]) return prev;
        return {
          ...prev,
          [id]: {
            ...prev[id],
            isPlaying: false,
            currentTime: 0,
          },
        };
      });
      audio.currentTime = 0;
    };
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);
    return () => {
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [selectedTrack]);

  // When switching tracks, pause playback and set audio to last position for that track
  const handleTrackSelect = (trackId: string) => {
    // Pause current audio and store its currentTime
    if (audioRef.current && selectedTrack) {
      setTrackPlayback(prev => {
        const next = { ...prev };
        if (selectedTrack && next[selectedTrack]) {
          next[selectedTrack] = {
            ...next[selectedTrack],
            isPlaying: false,
            currentTime: audioRef.current!.currentTime,
          };
        }
        return next;
      });
      audioRef.current.pause();
    }
    setSelectedTrack(trackId);
  };

  // Set audio.currentTime to the stored value when selectedTrack changes
  useEffect(() => {
    if (!selectedTrack) return;
    const audio = audioRef.current;
    if (!audio) return;
    const storedTime = trackPlayback[selectedTrack]?.currentTime || 0;
    if (Math.abs(audio.currentTime - storedTime) > 0.1) {
      audio.currentTime = storedTime;
    }
  }, [selectedTrack, trackPlayback]);

  // Get current playback state for selected track
  const currentTrackState = selectedTrack ? trackPlayback[selectedTrack] : undefined;
  const currentTimeSeconds = currentTrackState?.currentTime || 0;
  const durationSeconds = currentTrackState?.duration || 225;
  const isPlaying = currentTrackState?.isPlaying || false;
  const [currentTime, setCurrentTime] = useState("0:00");
  const [duration, setDuration] = useState("3:45");

  // Handle seek in the waveform
  const handleSeek = (position: number) => {
    if (!selectedTrack) return;
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = position;
    setTrackPlayback(prev => ({
      ...prev,
      [selectedTrack]: {
        ...prev[selectedTrack],
        currentTime: position,
      },
    }));
    setCurrentTime(formatTime(position));
  };

  // Toggle play/pause for selected track
  const togglePlayback = () => {
    if (!selectedTrack) return;
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio.play().catch(error => {
        console.error("Audio playback error:", error);
      });
    } else {
      audio.pause();
    }
  };

  // Skip backward by 5 seconds
  const skipBackward = () => {
    if (!selectedTrack) return;
    const audio = audioRef.current;
    if (!audio) return;
    const newTime = Math.max(0, audio.currentTime - 5);
    audio.currentTime = newTime;
    setTrackPlayback(prev => ({
      ...prev,
      [selectedTrack]: {
        ...prev[selectedTrack],
        currentTime: newTime,
      },
    }));
    setCurrentTime(formatTime(newTime));
  };

  // Skip forward by 5 seconds
  const skipForward = () => {
    if (!selectedTrack) return;
    const audio = audioRef.current;
    if (!audio) return;
    const newTime = Math.min(audio.duration, audio.currentTime + 5);
    audio.currentTime = newTime;
    setTrackPlayback(prev => ({
      ...prev,
      [selectedTrack]: {
        ...prev[selectedTrack],
        currentTime: newTime,
      },
    }));
    setCurrentTime(formatTime(newTime));
  };

  // Handle volume change
  const handleVolumeChange = (newVolume: number[]) => {
    setVolume(newVolume);
    if (!selectedTrack) return;
    const audio = audioRef.current;
    if (audio) {
      audio.volume = newVolume[0] / 100;
    }
  };

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
      const originalComment = comments.find((c: Comment) => c.id === commentId)
      
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

  // Combine and filter comments for display
  const displayComments = [
    // Include original comments that haven't been deleted
    ...comments.filter((comment: Comment) => !deletedCommentIds.includes(comment.id))
      // Replace with edited version if it exists
      .map((comment: Comment) => {
        const editedVersion = editedComments.find(c => c.id === comment.id)
        return editedVersion || comment
      }),
    // Add new comments
    ...newComments
  ]
  
  return (
    <div className="space-y-6" ref={timelineRef}>
      {/* Audio element for selected track (hidden) */}
      {selectedTrack && (
        <audio
          ref={audioRef}
          src={selectedTrack 
            ? (() => {
                const track = tracks.find((t: Track) => t.id === selectedTrack);
                if (!track) return DEFAULT_AUDIO_URL;
                const version = track.versions.find((v: any) => v.id === track.currentVersionId);
                return version?.audioUrl || DEFAULT_AUDIO_URL;
              })()
            : DEFAULT_AUDIO_URL
          }
          style={{ display: 'none' }}
        />
      )}
      {/* Keyboard shortcuts handler */}
      <TimelineKeyboardShortcuts
        onTogglePlayback={togglePlayback}
        onSkipForward={skipForward}
        onSkipBackward={skipBackward}
        onVolumeUp={() => handleVolumeChange([Math.min(100, volume[0] + 5)])}
        onVolumeDown={() => handleVolumeChange([Math.max(0, volume[0] - 5)])}
        onZoomIn={() => setZoom(Math.min(2, zoom + 0.1))}
        onZoomOut={() => setZoom(Math.max(0.5, zoom - 0.1))}
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
          <Badge
            variant="outline"
            className="gap-1 border-2 border-[#FFD500] bg-[#FFD500]/10 text-black uppercase text-xs tracking-wide rounded-none"
          >
            <span className="text-[#FFD500]">😊</span>
            Happy
          </Badge>
          <Badge
            variant="outline"
            className="gap-1 border-2 border-[#E41E26] bg-[#E41E26]/10 text-black uppercase text-xs tracking-wide rounded-none"
          >
            <span className="text-[#E41E26]">😤</span>
            Frustrated
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <TrackVisualizationModes 
            currentMode={visualizationMode}
            onChange={setVisualizationMode}
          />
          <Button
            variant="outline"
            size="icon"
            onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
            className="border-2 border-black rounded-none"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-xs font-mono">{zoom.toFixed(1)}x</span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setZoom(Math.min(2, zoom + 0.1))}
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
                  audioUrl={selectedTrack 
                    ? (() => {
                        const track = tracks.find((t: Track) => t.id === selectedTrack);
                        if (!track) return DEFAULT_AUDIO_URL;
                        const version = track.versions.find((v: any) => v.id === track.currentVersionId);
                        return version?.audioUrl || DEFAULT_AUDIO_URL;
                      })()
                    : DEFAULT_AUDIO_URL}
                  currentTime={currentTimeSeconds}
                  duration={durationSeconds}
                  isPlaying={isPlaying}
                  onSeek={handleSeek}
                  height={80}
                  waveColor="#000000"
                  progressColor="#E41E26"
                  interactive={true}
                  visualizationMode={visualizationMode}
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
                  {tracks.map((track: Track) => (
                    <TrackItem
                      key={track.id}
                      track={track}
                      isSelected={selectedTrack === track.id}
                      currentTimeSeconds={trackPlayback[track.id]?.currentTime || 0}
                      durationSeconds={trackPlayback[track.id]?.duration || 225}
                      zoom={zoom}
                      onSelect={handleTrackSelect}
                      isAudible={true}
                      onVersionSelect={(trackId, versionId) => {
                        // Find the track to update
                        const trackToUpdate = tracks.find((t: Track) => t.id === trackId);
                        if (!trackToUpdate) return;

                        // Update the track's current version
                        trackToUpdate.currentVersionId = versionId;

                        // If this is the selected track, update audio source
                        if (selectedTrack === trackId && audioRef.current) {
                          // Get the selected version
                          const selectedVersion = trackToUpdate.versions.find(v => v.id === versionId);
                          if (selectedVersion?.audioUrl) {
                            // Update the audio source and maintain playback state
                            const wasPlaying = !audioRef.current.paused;
                            const currentTime = audioRef.current.currentTime;
                            
                            // Set new audio source
                            audioRef.current.src = selectedVersion.audioUrl;
                            audioRef.current.currentTime = currentTime;
                            
                            // Resume playback if it was playing
                            if (wasPlaying) {
                              audioRef.current.play().catch(err => console.error("Error resuming playback:", err));
                            }
                          }
                        }

                        // Trigger a re-render to update the UI
                        setTrackPlayback(prev => ({
                          ...prev,
                          [trackId]: {
                            ...prev[trackId],
                            // Reset playback if needed or maintain current state
                          }
                        }));
                      }}
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
          comment={editingComment as Comment}
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
