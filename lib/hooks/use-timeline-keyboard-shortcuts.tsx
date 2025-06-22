"use client"

import { useEffect, RefObject } from 'react'

interface TimelineShortcutsOptions {
  onTogglePlayback: () => void
  onSkipForward: () => void
  onSkipBackward: () => void
  onVolumeUp?: () => void
  onVolumeDown?: () => void
  onZoomIn?: () => void
  onZoomOut?: () => void
  onMuteTrack?: (trackId: string) => void
  onSoloTrack?: (trackId: string) => void
  containerRef?: RefObject<HTMLElement>
  selectedTrackId?: string | null
  disabled?: boolean
}

export function useTimelineKeyboardShortcuts({
  onTogglePlayback,
  onSkipForward,
  onSkipBackward,
  onVolumeUp,
  onVolumeDown,
  onZoomIn,
  onZoomOut,
  onMuteTrack,
  onSoloTrack,
  containerRef,
  selectedTrackId,
  disabled = false
}: TimelineShortcutsOptions) {
  useEffect(() => {
    if (disabled) return

    const handleKeyDown = (e: KeyboardEvent) => {
      // Check if focus is within the container (if provided)
      if (containerRef?.current) {
        if (!containerRef.current.contains(document.activeElement) && 
            !containerRef.current.isSameNode(document.activeElement)) {
          return
        }
      }

      // Ignore keyboard events when typing in form controls
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA' ||
        document.activeElement?.getAttribute('contenteditable') === 'true'
      ) {
        return
      }

      switch (e.key) {
        case ' ': // Space bar for play/pause
          e.preventDefault()
          onTogglePlayback()
          break
        case 'ArrowRight':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault()
            onSkipForward()
          }
          break
        case 'ArrowLeft':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault()
            onSkipBackward()
          }
          break
        case 'ArrowUp':
          if (e.ctrlKey || e.metaKey && onVolumeUp) {
            e.preventDefault()
            onVolumeUp()
          }
          break
        case 'ArrowDown':
          if (e.ctrlKey || e.metaKey && onVolumeDown) {
            e.preventDefault()
            onVolumeDown()
          }
          break
        case '=': // Plus for zoom in
        case '+':
          if (e.ctrlKey || e.metaKey && onZoomIn) {
            e.preventDefault()
            onZoomIn()
          }
          break
        case '-': // Minus for zoom out
          if (e.ctrlKey || e.metaKey && onZoomOut) {
            e.preventDefault()
            onZoomOut()
          }
          break
        case 'm': // 'M' for mute selected track
          if (selectedTrackId && onMuteTrack) {
            e.preventDefault()
            onMuteTrack(selectedTrackId)
          }
          break
        case 's': // 'S' for solo selected track
          if (selectedTrackId && onSoloTrack) {
            e.preventDefault()
            onSoloTrack(selectedTrackId)
          }
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [
    onTogglePlayback,
    onSkipForward,
    onSkipBackward,
    onVolumeUp,
    onVolumeDown,
    onZoomIn,
    onZoomOut,
    onMuteTrack,
    onSoloTrack,
    containerRef,
    selectedTrackId,
    disabled
  ])
}
