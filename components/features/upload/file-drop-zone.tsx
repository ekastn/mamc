"use client"

import { useState, useCallback } from "react"
import { cn } from "@/lib/utils"
import { Upload, File, Music } from "lucide-react"

interface FileDropZoneProps {
  onFilesSelected: (files: File[]) => void
  className?: string
  accept?: string
  multiple?: boolean
  isFileSelected?: boolean
  selectedFileName?: string
  selectedFileSize?: number
}

export function FileDropZone({
  onFilesSelected,
  className,
  accept = "audio/*",
  multiple = false,
  isFileSelected = false,
  selectedFileName,
  selectedFileSize
}: FileDropZoneProps) {
  const [isDragging, setIsDragging] = useState(false)

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const files = Array.from(e.dataTransfer.files)
    if (files.length === 0) return

    // Filter by accepted file types if specified
    const validFiles = accept
      ? files.filter(file => {
          const fileType = file.type
          return accept.includes("*")
            ? accept.split("/")[0] === fileType.split("/")[0]
            : accept.includes(fileType)
        })
      : files

    if (validFiles.length === 0) return
    
    // If multiple is false, only take the first file
    const selectedFiles = multiple ? validFiles : [validFiles[0]]
    onFilesSelected(selectedFiles)
  }, [accept, multiple, onFilesSelected])

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return
    
    const files = Array.from(e.target.files)
    const selectedFiles = multiple ? files : [files[0]]
    onFilesSelected(selectedFiles)
    
    // Reset the input value so the same file can be selected again
    e.target.value = ""
  }, [multiple, onFilesSelected])

  return (
    <div
      className={cn(
        "relative border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center transition-colors",
        isDragging ? "border-primary bg-muted/20" : "border-muted-foreground/25",
        isFileSelected ? "bg-muted/10" : "",
        className
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        accept={accept}
        multiple={multiple}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        onChange={handleFileInputChange}
      />
      
      {isFileSelected ? (
        <div className="text-center space-y-2">
          <Music className="h-10 w-10 mx-auto text-muted-foreground" />
          <div className="text-sm font-medium truncate max-w-[200px]">{selectedFileName}</div>
          {selectedFileSize && (
            <div className="text-xs text-muted-foreground">
              {(selectedFileSize / 1024 / 1024).toFixed(2)} MB
            </div>
          )}
        </div>
      ) : (
        <div className="text-center space-y-2">
          <Upload className="h-10 w-10 mx-auto text-muted-foreground" />
          <div className="text-sm">
            <span className="font-medium">Click to upload</span> or drag and drop
          </div>
          <div className="text-xs text-muted-foreground">
            {accept === "audio/*" ? "Audio files only" : accept}
          </div>
        </div>
      )}
    </div>
  )
}
