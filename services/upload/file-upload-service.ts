import type { UploadProgress, UploadedFile, FileValidationResult } from '@/lib/types/upload'

class FileUploadService {
  /**
   * Validate a file before uploading
   */
  validateFile(file: File): FileValidationResult {
    // Check if it's an audio file
    if (!file.type.startsWith('audio/')) {
      return {
        isValid: false,
        errorMessage: 'Only audio files are allowed'
      }
    }

    // Check file size (10MB limit)
    const MAX_SIZE = 10 * 1024 * 1024 // 10MB
    if (file.size > MAX_SIZE) {
      return {
        isValid: false,
        errorMessage: 'File size exceeds 10MB limit'
      }
    }

    return { isValid: true }
  }

  /**
   * Upload a file to the server
   * Note: In a real app, this would use actual file upload APIs
   */
  async uploadFile(
    file: File, 
    projectId: string, 
    onProgress?: (progress: UploadProgress) => void
  ): Promise<UploadedFile> {
    return new Promise((resolve, reject) => {
      try {
        // Simulate upload progress
        let loaded = 0
        const total = file.size
        const interval = setInterval(() => {
          loaded += total / 10
          const percentage = Math.min(Math.floor((loaded / total) * 100), 100)
          
          if (onProgress) {
            onProgress({
              loaded,
              total,
              percentage
            })
          }
          
          if (percentage >= 100) {
            clearInterval(interval)
            
            // Simulate server response
            const uploadedFile: UploadedFile = {
              id: `file-${Date.now()}`,
              name: file.name,
              size: file.size,
              type: file.type,
              url: `/audio/${file.name}` // In a real app, this would be a URL from the server
            }
            
            resolve(uploadedFile)
          }
        }, 300)
      } catch (error) {
        reject(error)
      }
    })
  }
}

export const fileUploadService = new FileUploadService()
