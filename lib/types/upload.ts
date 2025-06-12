/**
 * Types related to file uploads
 */

export interface UploadProgress {
  loaded: number
  total: number
  percentage: number
}

export interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  url: string
  trackId?: string
}

export interface FileValidationResult {
  isValid: boolean
  errorMessage?: string
}
