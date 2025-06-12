// Error-related constants

// Authentication error types
export enum AuthErrorType {
  INVALID_CREDENTIALS = "invalid_credentials",
  USER_NOT_FOUND = "user_not_found",
  EMAIL_ALREADY_EXISTS = "email_already_exists",
  WEAK_PASSWORD = "weak_password",
  UNAUTHORIZED = "unauthorized",
  SESSION_EXPIRED = "session_expired",
  TOKEN_INVALID = "token_invalid",
  INTERNAL_ERROR = "internal_error",
  NETWORK_ERROR = "network_error",
}

// Error messages that correspond to error types
export const AUTH_ERROR_MESSAGES = {
  [AuthErrorType.INVALID_CREDENTIALS]: "The email or password you entered is incorrect.",
  [AuthErrorType.USER_NOT_FOUND]: "No account found with this email address.",
  [AuthErrorType.EMAIL_ALREADY_EXISTS]: "An account with this email already exists.",
  [AuthErrorType.WEAK_PASSWORD]: "Password must be at least 8 characters and include a number and special character.",
  [AuthErrorType.UNAUTHORIZED]: "You don't have permission to access this resource.",
  [AuthErrorType.SESSION_EXPIRED]: "Your session has expired. Please log in again.",
  [AuthErrorType.TOKEN_INVALID]: "Authentication token is invalid or expired.",
  [AuthErrorType.INTERNAL_ERROR]: "An internal error occurred. Please try again later.",
  [AuthErrorType.NETWORK_ERROR]: "Network error. Please check your connection and try again.",
}

// Project error types
export enum ProjectErrorType {
  PROJECT_NOT_FOUND = "project_not_found",
  PERMISSION_DENIED = "permission_denied",
  VERSION_CONFLICT = "version_conflict",
  STORAGE_LIMIT_REACHED = "storage_limit_reached",
  INVALID_FORMAT = "invalid_format",
  UPLOAD_FAILED = "upload_failed",
  DELETE_FAILED = "delete_failed",
  UPDATE_FAILED = "update_failed",
}

// Error messages that correspond to project error types
export const PROJECT_ERROR_MESSAGES = {
  [ProjectErrorType.PROJECT_NOT_FOUND]: "The requested project could not be found.",
  [ProjectErrorType.PERMISSION_DENIED]: "You don't have permission to perform this action.",
  [ProjectErrorType.VERSION_CONFLICT]: "Version conflict detected. Someone else has updated this project.",
  [ProjectErrorType.STORAGE_LIMIT_REACHED]: "Storage limit reached. Please upgrade your plan or free up space.",
  [ProjectErrorType.INVALID_FORMAT]: "The file format is not supported.",
  [ProjectErrorType.UPLOAD_FAILED]: "Failed to upload file. Please try again.",
  [ProjectErrorType.DELETE_FAILED]: "Failed to delete resource. Please try again.",
  [ProjectErrorType.UPDATE_FAILED]: "Failed to update the project. Please try again.",
}

// Audio error types
export enum AudioErrorType {
  PLAYBACK_ERROR = "playback_error",
  RECORD_ERROR = "record_error",
  FORMAT_ERROR = "format_error",
  PROCESSING_ERROR = "processing_error",
  UNSUPPORTED_BROWSER = "unsupported_browser",
  PERMISSION_DENIED = "permission_denied",
}

// Error messages that correspond to audio error types
export const AUDIO_ERROR_MESSAGES = {
  [AudioErrorType.PLAYBACK_ERROR]: "Error playing audio. The file may be corrupted or unsupported.",
  [AudioErrorType.RECORD_ERROR]: "Error recording audio. Please check your microphone and try again.",
  [AudioErrorType.FORMAT_ERROR]: "Unsupported audio format. Please use WAV, MP3, or AIFF files.",
  [AudioErrorType.PROCESSING_ERROR]: "Error processing audio data. Please try again.",
  [AudioErrorType.UNSUPPORTED_BROWSER]: "Your browser doesn't support some audio features. Please try a different browser.",
  [AudioErrorType.PERMISSION_DENIED]: "Microphone access denied. Please allow microphone access and try again.",
}
