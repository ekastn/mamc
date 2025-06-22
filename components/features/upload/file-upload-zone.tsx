"use client"

import type React from "react"

import { useState, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Upload, X, File, AlertCircle, CheckCircle } from "lucide-react"
import { fileUploadService } from "@/lib/services/client/upload/file-upload-service"
import type { UploadProgress, UploadedFile, FileValidationResult } from "@/lib/types/upload"
import { cn } from "@/lib/utils"

interface FileUploadZoneProps {
  projectId: string
  onUploadComplete?: (files: UploadedFile[]) => void
  onUploadError?: (error: string) => void
  multiple?: boolean
  className?: string
}

interface FileUploadItem {
  file: File
  validation: FileValidationResult
  progress?: UploadProgress
  status: "pending" | "uploading" | "completed" | "error"
  uploadedFile?: UploadedFile
  error?: string
}

export function FileUploadZone({
  projectId,
  onUploadComplete,
  onUploadError,
  multiple = true,
  className,
}: FileUploadZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [uploadItems, setUploadItems] = useState<FileUploadItem[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)

    const files = Array.from(e.dataTransfer.files)
    handleFiles(files)
  }, [])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    handleFiles(files)
  }, [])

  const handleFiles = useCallback((files: File[]) => {
    const newItems: FileUploadItem[] = files.map((file) => ({
      file,
      validation: fileUploadService.validateFile(file),
      status: "pending",
    }))

    setUploadItems((prev) => [...prev, ...newItems])
  }, [])

  const removeFile = useCallback((index: number) => {
    setUploadItems((prev) => prev.filter((_, i) => i !== index))
  }, [])

  const startUpload = useCallback(async () => {
    const validItems = uploadItems.filter((item) => item.validation.isValid && item.status === "pending")

    if (validItems.length === 0) {
      onUploadError?.("No valid files to upload")
      return
    }

    setIsUploading(true)

    try {
      const uploadPromises = validItems.map(async (item, index) => {
        const itemIndex = uploadItems.findIndex((i) => i === item)

        // Update status to uploading
        setUploadItems((prev) =>
          prev.map((prevItem, i) => (i === itemIndex ? { ...prevItem, status: "uploading" as const } : prevItem)),
        )

        try {
          const uploadedFile = await fileUploadService.uploadFile(item.file, projectId, (progress) => {
            setUploadItems((prev) =>
              prev.map((prevItem, i) => (i === itemIndex ? { ...prevItem, progress } : prevItem)),
            )
          })

          // Update status to completed
          setUploadItems((prev) =>
            prev.map((prevItem, i) =>
              i === itemIndex
                ? {
                    ...prevItem,
                    status: "completed" as const,
                    uploadedFile,
                  }
                : prevItem,
            ),
          )

          return uploadedFile
        } catch (error) {
          // Update status to error
          setUploadItems((prev) =>
            prev.map((prevItem, i) =>
              i === itemIndex
                ? {
                    ...prevItem,
                    status: "error" as const,
                    error: error instanceof Error ? error.message : "Upload failed",
                  }
                : prevItem,
            ),
          )
          throw error
        }
      })

      const uploadedFiles = await Promise.allSettled(uploadPromises)
      const successfulUploads = uploadedFiles
        .filter((result): result is PromiseFulfilledResult<UploadedFile> => result.status === "fulfilled")
        .map((result) => result.value)

      if (successfulUploads.length > 0) {
        onUploadComplete?.(successfulUploads)
      }

      const failedUploads = uploadedFiles.filter((result) => result.status === "rejected")
      if (failedUploads.length > 0) {
        onUploadError?.(`${failedUploads.length} file(s) failed to upload`)
      }
    } catch (error) {
      onUploadError?.(error instanceof Error ? error.message : "Upload failed")
    } finally {
      setIsUploading(false)
    }
  }, [uploadItems, projectId, onUploadComplete, onUploadError])

  const clearCompleted = useCallback(() => {
    setUploadItems((prev) => prev.filter((item) => item.status !== "completed"))
  }, [])

  const clearAll = useCallback(() => {
    setUploadItems([])
  }, [])

  return (
    <div className={cn("space-y-4", className)}>
      {/* Drop Zone */}
      <Card
        className={cn(
          "border-2 border-dashed transition-colors cursor-pointer",
          isDragOver ? "border-[#1C3F95] bg-[#1C3F95]/5" : "border-black",
          "hover:border-[#1C3F95] hover:bg-[#1C3F95]/5",
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Upload className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium uppercase tracking-wide mb-2">Drop audio files here</h3>
          <p className="text-sm text-muted-foreground uppercase tracking-wide mb-4">Or click to browse files</p>
          <Button variant="outline" className="border-2 border-black uppercase text-xs tracking-wide">
            Choose Files
          </Button>
          <p className="text-xs text-muted-foreground mt-2 uppercase tracking-wide">
            Supports MP3, WAV, FLAC (max 100MB)
          </p>
        </CardContent>
      </Card>

      <input
        ref={fileInputRef}
        type="file"
        multiple={multiple}
        accept="audio/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* File List */}
      {uploadItems.length > 0 && (
        <Card className="border-2 border-black">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium uppercase tracking-wide">Files ({uploadItems.length})</h3>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearCompleted}
                  className="border-2 border-black uppercase text-xs tracking-wide"
                >
                  Clear Completed
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearAll}
                  className="border-2 border-black uppercase text-xs tracking-wide"
                >
                  Clear All
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              {uploadItems.map((item, index) => (
                <div key={index} className="border border-black p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <File className="h-4 w-4" />
                      <span className="text-sm font-medium uppercase tracking-wide">{item.file.name}</span>
                      <Badge
                        variant={
                          item.status === "completed"
                            ? "default"
                            : item.status === "error"
                              ? "destructive"
                              : item.status === "uploading"
                                ? "secondary"
                                : "outline"
                        }
                        className="uppercase text-xs tracking-wide rounded-none"
                      >
                        {item.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground uppercase tracking-wide">
                        {fileUploadService.formatFileSize(item.file.size)}
                      </span>
                      {item.status === "completed" && <CheckCircle className="h-4 w-4 text-green-600" />}
                      {item.status === "error" && <AlertCircle className="h-4 w-4 text-red-600" />}
                      <Button variant="ghost" size="sm" onClick={() => removeFile(index)} className="h-6 w-6 p-0">
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  {/* Validation Errors */}
                  {!item.validation.isValid && (
                    <div className="mb-2">
                      {item.validation.errors.map((error, errorIndex) => (
                        <p key={errorIndex} className="text-xs text-red-600 uppercase tracking-wide">
                          {error}
                        </p>
                      ))}
                    </div>
                  )}

                  {/* Upload Progress */}
                  {item.status === "uploading" && item.progress && (
                    <div className="space-y-1">
                      <Progress value={item.progress.percentage} className="h-2" />
                      <div className="flex justify-between text-xs text-muted-foreground uppercase tracking-wide">
                        <span>{item.progress.percentage}%</span>
                        <span>
                          {fileUploadService.formatUploadSpeed(item.progress.speed)} •
                          {fileUploadService.formatRemainingTime(item.progress.remainingTime)} remaining
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Error Message */}
                  {item.status === "error" && item.error && (
                    <p className="text-xs text-red-600 uppercase tracking-wide">{item.error}</p>
                  )}
                </div>
              ))}
            </div>

            {/* Upload Button */}
            {uploadItems.some((item) => item.validation.isValid && item.status === "pending") && (
              <div className="mt-4 pt-4 border-t border-black">
                <Button
                  onClick={startUpload}
                  disabled={isUploading}
                  className="w-full bg-[#1C3F95] text-white hover:bg-[#1C3F95]/90 uppercase text-xs tracking-wide"
                >
                  {isUploading ? "Uploading..." : "Start Upload"}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
