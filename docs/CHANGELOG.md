# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added
- Implemented checkpoint creation and application feature for project versioning.
- Added dedicated service methods in project-service.ts for checkpoint management.
- Created documentation for checkpoint feature in docs/checkpoint-feature.md.
- Added demo accounts section to login form for easier testing and demonstration.
- Added `getMoodBorderColor` and `getEmotionBorderColor` utility functions for consistent mood/emotion styling.
- Added more specific authentication error types to better identify and handle different error scenarios.
- Added token validation and expiration checks for better session management.
- Created comprehensive constants structure for centralized management of colors, emotions, and error types.
- Added new utility functions for mood gradients and light background colors.
- Created detailed documentation for constants organization in CONSTANTS.md.
- Added sample track versions and audio constants to replace hardcoded fallback values in timeline component.
- Implemented track upload functionality with dialog to select existing tracks or create new ones.
- Created track upload service for managing track versions and file uploads.
- Added file upload simulation with progress tracking for audio files.
- Enhanced constants index file with explicit exports of commonly used constants for better IDE support and developer experience.
- Implemented track version selection functionality in the timeline component, allowing users to switch between different versions of audio tracks with seamless playback transition.

### Changed
- Updated VersionTracker component to use real checkpoint functionality instead of placeholder code.
- Enhanced ProjectPage to properly handle checkpoint creation and application with state updates.
- Updated ProjectHeader component to display the current checkpoint label instead of hardcoded version.
- Improved Timeline component with consolidated type imports from a single source for better code consistency.
- Enhanced constants index file with detailed documentation of what each module contains.
- Improved projects page to display checkpoint information including current checkpoint label and count.
- Removed redundant `timeline-with-shortcuts.tsx` component in favor of the main `timeline.tsx` component which already contains the same functionality. This simplifies the codebase by centralizing the timeline implementation in a single component.
- Enhanced authentication security by moving from localStorage to sessionStorage for auth data storage.
- Improved type definitions for project data model by consolidating types and ensuring backward compatibility.
- Consolidated mood/emotion utility functions in utils.ts to eliminate duplicate code and provide consistent behavior.
- Updated the register form with improved validation and error handling similar to the login form.
- Removed duplicate mood utility functions from ProjectService in favor of centralized utilities.
- Improved error handling in version management components and services.
- Refactored components to use centralized constants instead of hardcoded values.
- Updated emotion/mood-related components to reference the new constants structure.
- Fixed critical error in projects page by correcting import path for types and adding defensive error handling.
- Added fallback handling for projects data to prevent "Cannot read properties of undefined" errors.
- Standardized type imports across the codebase to use consistent paths.
- Enhanced track version selection in Timeline component with proper audio source updates and playback state management.
- Replaced MoodSelector with EmotionSelector in dashboard page to provide a more comprehensive emotion selection experience with a consistent UI across the application.

### Fixed
- Fixed "Cannot read properties of undefined (reading 'filter')" error in projects page by adding proper null checks.
- Corrected import path in project-service.ts from "@/lib/types" to "@/lib/types/index".
- Enhanced error handling in getAllProjects method to return empty array instead of undefined when projects data is not available.
- Standardized type imports in project-sidebar.tsx and constants/projects.ts to use "@/lib/types/index" for consistency.
- Updated Timeline component to use sample track versions from constants instead of hardcoded fallback audio paths.
- Enhanced sample project data with proper track versions and audio URLs.
- Fixed syntax error in timeline.tsx by removing an extra closing bracket that was causing "unexpected token ']'" error.
- Fixed type issues in timeline.tsx to prevent "implicitly has 'any' type" errors by adding proper type annotations.

### Fixed
- Replaced incorrect <VersionHistory /> usage with <VersionTracker /> in project page tabs to resolve runtime error due to incorrect component name.
- Passed required props to `VersionTracker` in project page to prevent runtime error when accessing `project.checkpoints`.
- Fixed Timeline component to properly pass project data to the TimelineComponent.
- Fixed Tailwind class string concatenation in ProjectSidebar component that would not work correctly with the Tailwind JIT compiler.
- Added proper error handling and validation in the authentication system.
- Improved form validation in LoginForm with more detailed error messages.
- Fixed duplicate code in utils.ts getMoodIcon function.
- Updated ProjectSidebar to use the utility functions from utils.ts for consistent styling.
- Added comprehensive error handling in VersionTracker component to prevent crashes when dealing with invalid track data.
- Enhanced version management with proper error handling and validations.
- Updated auth functions to check for empty fields before validation.

### Security
- Enhanced authentication system with email and password validation.
- Moved auth data from localStorage to sessionStorage for better security.
- Added input validation to prevent common security issues.
- Implemented mock JWT token-based authentication as a foundation for proper server-side auth.
- Added token format validation and expiration checks for improved security.

### Performance
- Reduced unnecessary re-renders in project components by using memoization and proper state management.

### Accessibility
- Added proper ARIA attributes to form inputs and validation errors.
- Improved error messaging with visual indicators.
