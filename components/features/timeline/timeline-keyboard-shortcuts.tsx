"use client"

import { useEffect } from 'react'

interface TimelineKeyboardShortcutsProps {
  onTogglePlayback: () => void
  onSkipForward: () => void
  onSkipBackward: () => void
  onVolumeUp: () => void
  onVolumeDown: () => void
  onZoomIn: () => void
  onZoomOut: () => void
  onMuteSelectedTrack?: () => void
  onSoloSelectedTrack?: () => void
  hasSelectedTrack: boolean
}

export function TimelineKeyboardShortcuts({
  onTogglePlayback,
  onSkipForward,
  onSkipBackward,
  onVolumeUp,
  onVolumeDown,
  onZoomIn,
  onZoomOut,
  onMuteSelectedTrack,
  onSoloSelectedTrack,
  hasSelectedTrack
}: TimelineKeyboardShortcutsProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
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
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault()
            onVolumeUp()
          }
          break
        case 'ArrowDown':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault()
            onVolumeDown()
          }
          break
        case '=': // Plus for zoom in
        case '+':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault()
            onZoomIn()
          }
          break
        case '-': // Minus for zoom out
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault()
            onZoomOut()
          }
          break
        case 'm': // 'M' for mute selected track
          if (hasSelectedTrack && onMuteSelectedTrack) {
            e.preventDefault()
            onMuteSelectedTrack()
          }
          break
        case 's': // 'S' for solo selected track
          if (hasSelectedTrack && onSoloSelectedTrack) {
            e.preventDefault()
            onSoloSelectedTrack()
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
    onMuteSelectedTrack,
    onSoloSelectedTrack,
    hasSelectedTrack
  ])

  return null // This component doesn't render anything
}
