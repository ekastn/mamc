"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Upload, File, X, CheckCircle, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  status: "uploading" | "completed" | "error"
  progress: number
  error?: string
}

interface SimpleFileUploadProps {
  projectId: string
  onUploadComplete?: (files: UploadedFile[]) => void
  className?: string
}

export function SimpleFileUpload({ projectId, onUploadComplete, className }: SimpleFileUploadProps) {
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const validateFile = (file: File): { isValid: boolean; error?: string } => {
    // Check file size (max 100MB)
    if (file.size > 100 * 1024 * 1024) {
      return { isValid: false, error: "File size must be less than 100MB" }
    }

    // Check file type (audio files primarily)
    const allowedTypes = [
      "audio/mpeg",
      "audio/wav",
      "audio/flac",
      "audio/aac",
      "audio/ogg",
      "image/jpeg",
      "image/png",
      "image/gif",
      "application/pdf",
      "text/plain",
    ]

    if (!allowedTypes.includes(file.type)) {
      return { isValid: false, error: "File type not supported" }
    }

    return { isValid: true }
  }

  const simulateUpload = async (file: UploadedFile): Promise<void> => {
    return new Promise((resolve, reject) => {
      let progress = 0
      const interval = setInterval(() => {
        progress += Math.random() * 15

        setFiles((prev) => prev.map((f) => (f.id === file.id ? { ...f, progress: Math.min(progress, 100) } : f)))

        if (progress >= 100) {
          clearInterval(interval)
          // Simulate random success/failure
          const success = Math.random() > 0.1 // 90% success rate

          setFiles((prev) =>
            prev.map((f) =>
              f.id === file.id
                ? {
                    ...f,
                    progress: 100,
                    status: success ? "completed" : "error",
                    error: success ? undefined : "Upload failed. Please try again.",
                  }
                : f,
            ),
          )

          if (success) {
            resolve()
          } else {
            reject(new Error("Upload failed"))
          }
        }
      }, 200)
    })
  }

  const handleFiles = async (fileList: FileList) => {
    const newFiles: UploadedFile[] = []

    Array.from(fileList).forEach((file) => {
      const validation = validateFile(file)

      const uploadFile: UploadedFile = {
        id: `${Date.now()}-${Math.random()}`,
        name: file.name,
        size: file.size,
        type: file.type,
        status: validation.isValid ? "uploading" : "error",
        progress: 0,
        error: validation.error,
      }

      newFiles.push(uploadFile)
    })

    setFiles((prev) => [...prev, ...newFiles])

    // Start uploads for valid files
    const validFiles = newFiles.filter((f) => f.status === "uploading")

    for (const file of validFiles) {
      try {
        await simulateUpload(file)
      } catch (error) {
        console.error("Upload failed:", error)
      }
    }

    // Notify parent of completed uploads
    const completedFiles = files.filter((f) => f.status === "completed")
    if (completedFiles.length > 0) {
      onUploadComplete?.(completedFiles)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    handleFiles(e.dataTransfer.files)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files)
    }
  }

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id))
  }

  const clearCompleted = () => {
    setFiles((prev) => prev.filter((f) => f.status !== "completed"))
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Drop Zone */}
      <Card
        className={cn(
          "border-2 border-dashed transition-colors cursor-pointer",
          isDragOver ? "border-[#1C3F95] bg-[#1C3F95]/5" : "border-black",
          "hover:border-[#1C3F95] hover:bg-[#1C3F95]/5",
        )}
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragOver(true)
        }}
        onDragLeave={(e) => {
          e.preventDefault()
          setIsDragOver(false)
        }}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <CardContent className="flex flex-col items-center justify-center py-8">
          <Upload className="h-8 w-8 text-muted-foreground mb-3" />
          <h3 className="text-sm font-medium uppercase tracking-wide mb-2">Drop files here or click to browse</h3>
          <p className="text-xs text-muted-foreground uppercase tracking-wide">Audio, images, documents (max 100MB)</p>
        </CardContent>
      </Card>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="audio/*,image/*,.pdf,.txt"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* File List */}
      {files.length > 0 && (
        <Card className="border-2 border-black">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm uppercase tracking-wide">Files ({files.length})</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={clearCompleted}
                className="border-2 border-black uppercase text-xs tracking-wide h-7"
              >
                Clear Completed
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {files.map((file) => (
              <div key={file.id} className="border border-black p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <File className="h-4 w-4 flex-shrink-0" />
                    <span className="text-sm font-medium uppercase tracking-wide truncate">{file.name}</span>
                    <span className="text-xs text-muted-foreground uppercase tracking-wide flex-shrink-0">
                      {formatFileSize(file.size)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {file.status === "completed" && <CheckCircle className="h-4 w-4 text-green-600" />}
                    {file.status === "error" && <AlertCircle className="h-4 w-4 text-red-600" />}
                    <Button variant="ghost" size="sm" onClick={() => removeFile(file.id)} className="h-6 w-6 p-0">
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                {file.status === "uploading" && (
                  <div className="space-y-1">
                    <Progress value={file.progress} className="h-2" />
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">
                      {Math.round(file.progress)}% uploaded
                    </p>
                  </div>
                )}

                {file.status === "error" && file.error && (
                  <p className="text-xs text-red-600 uppercase tracking-wide">{file.error}</p>
                )}

                {file.status === "completed" && (
                  <p className="text-xs text-green-600 uppercase tracking-wide">Upload completed successfully</p>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
