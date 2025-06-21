# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added
- Implemented standardized API response utilities to ensure consistent JSON response format across all API endpoints
- Created utility functions for success responses, error responses, and custom API responses with cookie and header support
- Added type definitions for standard API response structure
- Enhanced debugging for authentication with detailed logging across auth flow
- Added user store debugging to track user creation and authentication
- Added token debugging utility function to diagnose token-related issues
- Added fixed IDs for demo users to ensure consistent authentication between server restarts
- Added automatic redirection to dashboard after successful login
- Added redirect to login page after logout
- Added comprehensive debug logging to AuthGuard component
- Added full page reload on logout to ensure clean state
- Added Zod schemas for all authentication operations (login, register, token payloads)
- Added jose-based JWT token handling for better security and standardization

### Changed
- Simplified authentication state management to use only cookies instead of localStorage and sessionStorage
- Refactored auth context to rely solely on server-side sessions through HTTP-only cookies
- Updated all API calls to include credentials for consistent cookie handling
- Improved cookie clearing during logout with explicit cookie deletion and forced page navigation
- Enhanced logout API to use direct NextResponse for more reliable cookie management
- Replaced manual validation with Zod schema validation for all authentication operations
- Refactored register route to use Zod for request validation and response formatting
- Updated auth service to use jose for JWT operations and Zod for data validation
- Standardized API response format across all authentication endpoints to use { success: boolean, data: any } structure

### Fixed
- Fixed authentication issues with protected routes by improving token verification and user lookup
- Enhanced logout functionality to ensure complete session cleanup
- Fixed logout API to properly clear cookies with correct parameters and paths
- Fixed issue where hard page refresh would log users out despite having valid auth cookies
- Fixed async/await pattern in user service to properly await token verification
- Fixed token expiration handling by using jose's native expiration time format
- Improved error handling for expired tokens with better logging
- Updated cookie maxAge to match token expiration time consistently across login and register routes
- Improved error handling during logout to ensure users are always redirected correctly
- Fixed React hooks error in AuthGuard component by removing conditionally called useEffect
- Enhanced error handling and logging in user services and authentication middleware
- Fixed "User not found" errors in profile API by implementing static user IDs for demo accounts
- Fixed inconsistent user IDs between server restarts causing authentication failures
- Fixed issue with login form not redirecting users after successful authentication
- Fixed logout functionality by adding proper cookie clearing and redirection
- Fixed AuthGuard component with improved conditional logic for authenticated and non-authenticated routes
- Fixed authentication redirects to use Next.js router instead of window.location for better client-side navigation
- Improved demo account login experience with automatic form submission and redirection
- Improved error reporting in user profile endpoint to show more debugging information

### Changed
- Refactored all API routes to use the new consistent response format
- Updated user profile routes to use the standardized response utilities
- Enhanced authentication routes to return structured API responses
- Improved error handling with consistent error format across all endpoints
- Updated user store to use predefined IDs for demo accounts to maintain consistency
- Implemented backend API for authentication and user management
- Created layered architecture with API routes, services, and data store
- Added user registration API with validation and error handling
- Added user login API with secure token generation
- Added user profile management APIs for fetching and updating profiles
- Implemented secure password handling with hashing
- Added validation layer for authentication and profile data
- Created in-memory user store for development (to be replaced with database)
- Added middleware for token verification and route protection
- Added JWT-based authentication flow
- Created comprehensive documentation for backend requirements
- Added demo accounts for easier testing and demonstration
- Restructured API services into a proper services/api directory for better organization
- Added barrel files for cleaner imports across the application

## [Unreleased]

### Added
- Implemented backend API for authentication and user management
- Created layered architecture with API routes, services, and data store
- Added user registration API with validation and error handling
- Added user login API with secure token generation
- Added user profile management APIs for fetching and updating profiles
- Implemented secure password handling with hashing
- Added validation layer for authentication and profile data
- Created in-memory user store for development (to be replaced with database)
- Added middleware for token verification and route protection
- Added JWT-based authentication flow
- Created comprehensive documentation for backend requirements
- Added demo accounts for easier testing and demonstration
- Restructured API services into a proper services/api directory for better organization
- Added barrel files for cleaner imports across the application
- Integrated frontend authentication with the backend API
- Updated auth context to use real API endpoints instead of mock data
- Enhanced profile page to fetch and update user data from the API
- Added loading and error states for profile data fetching
- Implemented proper authentication flow with token-based sessions
- Added token validation and expiration checks for better session management.
- Added more specific authentication error types to better identify and handle different error scenarios.
- Created track upload service for managing track versions and file uploads.
- Added file upload simulation with progress tracking for audio files.
- Enhanced constants index file with explicit exports of commonly used constants for better IDE support and developer experience.
- Implemented track version selection functionality in the timeline component, allowing users to switch between different versions of audio tracks with seamless playback transition.
- Added loading skeletons to dashboard page for better user experience while fetching data.
- Created a reusable `HarmonicCard` component to unify card styling across the application, making it more maintainable and ensuring consistent styling.

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
- Removed Analytics page and related components to streamline the application's focus on core music collaboration features.
- Replaced mood trends visualization in dashboard sidebar with a compact current activity component to provide more actionable information to users.
- Renamed "Current Activity" to "Recent Activity" in the dashboard sidebar for clearer UI labeling.
- Moved full recent activity display from the main dashboard content to a dedicated Activity page.
- Improved collaborator card layout to follow stronger grid-based design principles, fixing the stacked appearance and creating a more balanced visual hierarchy.
- Enhanced `HarmonicCard` component with Bauhaus-inspired hover animations including elevation effect, expanding color bar, and geometric corner indicator for a more dynamic user experience.
- Improved collaborator card layout to follow stronger grid-based design principles, fixing the stacked appearance and creating a more balanced visual hierarchy.
- Added a new Activity navigation item to provide direct access to the activity feed.
- Refactored card components across multiple pages to use the new reusable `HarmonicCard` component, ensuring consistent card styling and behavior throughout the application.
- Created a comprehensive activity page with filtering options for all, read, and unread activities.
- Updated dashboard to fetch projects from project service instead of using hardcoded data, making the application more dynamic.
- Improved projects page filtering with categorical tabs (All Projects, My Projects, Shared With Me, Archived) instead of tag-based filtering for better organization and user experience.
- Reorganized Activity page into time-based sections (Today, This Week, Older) for better visualization and organization of updates.
- Simplified `HarmonicCard` component API by replacing multiple variant options with a single boolean prop called `interactive`, improving maintainability and reducing CSS bundle size.
- Updated conflict moderation page to use the `HarmonicCard` component, providing consistent styling and enhanced Bauhaus-inspired hover animations.
- Improved conflict moderation page layout with proper grid-based structure according to Bauhaus design principles, enhancing visual organization and information hierarchy.
- Enhanced conflict card content with better spacing, improved participant display, and more intuitive action buttons placement.

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
