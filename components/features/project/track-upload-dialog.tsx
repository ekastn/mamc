"use client"

import { useState, useCallback } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Upload, Plus, Music } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/components/ui/use-toast"
import { Project, ProjectTrack } from "@/lib/types/project"
import { FileDropZone } from "@/components/features/upload/file-drop-zone"
import { fileUploadService } from "@/lib/services/client/upload/file-upload-service"

interface TrackUploadDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  project: Project
  onUploadComplete: (trackId: string, audioUrl: string, changes: string[]) => void
}

export function TrackUploadDialog({
  open,
  onOpenChange,
  project,
  onUploadComplete
}: TrackUploadDialogProps) {
  const { toast } = useToast()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [selectedTrackId, setSelectedTrackId] = useState<string>("")
  const [newTrackName, setNewTrackName] = useState<string>("")
  const [isCreatingTrack, setIsCreatingTrack] = useState<boolean>(false)
  const [changes, setChanges] = useState<string>("")
  const [uploadProgress, setUploadProgress] = useState<number>(0)
  const [isUploading, setIsUploading] = useState<boolean>(false)

  const handleFileChange = useCallback((files: File[]) => {
    if (files.length > 0) {
      const file = files[0];
      // Check if the file is an audio file
      if (!file.type.startsWith("audio/")) {
        toast({
          title: "Invalid file type",
          description: "Please select an audio file",
          variant: "destructive"
        })
        return
      }
      setSelectedFile(file)
    }
  }, [toast])

  const handleTrackSelect = useCallback((value: string) => {
    setSelectedTrackId(value)
    setIsCreatingTrack(false)
  }, [])

  const handleCreateTrack = useCallback(() => {
    setIsCreatingTrack(true)
    setSelectedTrackId("")
  }, [])

  const handleUpload = useCallback(async () => {
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please select an audio file to upload",
        variant: "destructive"
      })
      return
    }

    if (!selectedTrackId && (!isCreatingTrack || !newTrackName)) {
      toast({
        title: "No track selected",
        description: "Please select an existing track or create a new one",
        variant: "destructive"
      })
      return
    }

    try {
      setIsUploading(true)

      // Upload the file and get the URL
      const uploadedFile = await fileUploadService.uploadFile(
        selectedFile, 
        project.id, 
        (progress) => {
          setUploadProgress(progress.percentage)
        }
      )

      // Create changes array from the changes text
      const changesArray = changes.split('\n').filter(change => change.trim() !== '')
      
      // If no changes were provided, add a default change note
      if (changesArray.length === 0) {
        changesArray.push(`New version uploaded: ${selectedFile.name}`)
      }

      // Call the callback with the track ID (existing or new) and the audio URL
      onUploadComplete(
        selectedTrackId || `new-track-${Date.now()}`,
        uploadedFile.url,
        changesArray
      )

      // Reset the form
      setSelectedFile(null)
      setSelectedTrackId("")
      setNewTrackName("")
      setIsCreatingTrack(false)
      setChanges("")
      setUploadProgress(0)
      setIsUploading(false)

      // Close the dialog
      onOpenChange(false)

      toast({
        title: "Upload successful",
        description: "Your audio file has been uploaded successfully",
      })
    } catch (error) {
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      })
      setIsUploading(false)
    }
  }, [selectedFile, selectedTrackId, isCreatingTrack, newTrackName, changes, onUploadComplete, onOpenChange, toast])

  const existingTracks = project.tracks || []

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="uppercase tracking-wide">Upload Track Version</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* File Selection */}
          <div className="space-y-2">
            <Label htmlFor="file" className="text-sm uppercase tracking-wide">Audio File</Label>
            <FileDropZone 
              onFilesSelected={handleFileChange}
              isFileSelected={!!selectedFile}
              selectedFileName={selectedFile?.name}
              selectedFileSize={selectedFile?.size}
              className="h-[150px]"
            />
          </div>

          {/* Track Selection or Creation */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label className="text-sm uppercase tracking-wide">Select Track</Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCreateTrack}
                className="text-xs uppercase tracking-wide"
              >
                <Plus className="h-3 w-3 mr-1" />
                New Track
              </Button>
            </div>

            {isCreatingTrack ? (
              <div className="space-y-2">
                <Input
                  placeholder="Enter new track name"
                  value={newTrackName}
                  onChange={(e) => setNewTrackName(e.target.value)}
                  className="border-2 border-black"
                />
              </div>
            ) : (
              <Select value={selectedTrackId} onValueChange={handleTrackSelect}>
                <SelectTrigger className="border-2 border-black uppercase text-xs tracking-wide">
                  <SelectValue placeholder="Select a track" />
                </SelectTrigger>
                <SelectContent>
                  {existingTracks.map((track) => (
                    <SelectItem key={track.id} value={track.id} className="uppercase text-xs tracking-wide">
                      {track.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Changes/Description */}
          <div className="space-y-2">
            <Label htmlFor="changes" className="text-sm uppercase tracking-wide">Changes Description</Label>
            <Textarea
              id="changes"
              placeholder="Describe the changes in this version (one per line)"
              className="border-2 border-black resize-none h-20"
              value={changes}
              onChange={(e) => setChanges(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Enter each change on a new line. If left empty, a default description will be used.
            </p>
          </div>

          {/* Progress Bar (shown only during upload) */}
          {isUploading && (
            <div className="space-y-2">
              <Label className="text-sm uppercase tracking-wide">Upload Progress</Label>
              <Progress value={uploadProgress} className="h-2" />
              <p className="text-xs text-center text-muted-foreground">
                {uploadProgress}% - Uploading...
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-2 border-black uppercase text-xs tracking-wide"
            disabled={isUploading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            className="bg-black text-white hover:bg-black/90 uppercase text-xs tracking-wide"
            disabled={isUploading || (!selectedFile) || (isCreatingTrack && !newTrackName) || (!isCreatingTrack && !selectedTrackId)}
          >
            {isUploading ? "Uploading..." : "Upload"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
