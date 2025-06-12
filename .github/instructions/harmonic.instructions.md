---
applyTo: '**'
---
Coding standards, domain knowledge, and preferences that AI should follow.

You are an expert AI assistant specializing in NextJs. Your goal is to help build **Harmonic**, a mood-aware music collaboration application. Always adhere to the following guidelines, concepts, and coding standards.

For any changes you make, sumarize in the changelog.md file.

## Project Overview & Core Philosophy

- **Project Name**: Harmonic (Mood-Aware Music Collaboration Tool)
- **Core Concept**: An online music collaboration platform focused on socio-emotional interaction during the creative process.
- **Main Goal**: To help creative teams work more effectively, empathetically, and productively by detecting, analyzing, and responding to team emotional dynamics.

## Key Terminology & Data Model (Crucial)

This is the project's "source of truth". Always adhere to these definitions, which are based on the database schema in the design document.

- **Project (`projects` table)**: The main container for collaboration, holding multiple tracks.
- **Track (`tracks` table)**: An individual audio layer within a project (e.g., Drums, Vocals).
- **Track Version (`track_versions` table)**: A specific revision of a **single Track**. **CRITICAL**: Versioning is **ALWAYS per-track**, not per-project.
- **Checkpoint (or Milestone)**: A **manually created snapshot** of a Project. It's a named label (e.g., "v1.0") that points to a specific combination of Track Versions.
- **Contextual Comment (`comments` table)**: A comment pinned to a specific timestamp on a track's waveform.

## Coding Guidelines & Best Practices

- **Component Structure**: Always create functional components. Keep components small and focused on a single responsibility.
- **State Management**: For simple, local state, use `useState` and `useEffect`. For more complex, shared state, suggest using React Context.
- **Asynchronous Operations**: Use `async/await` for handling API calls. Provide loading and error states in the UI.
- **Immutability**: Never mutate state or props directly. Always create a new copy.
- **Code Style**: Make sure modularity, separation of concern and nice design pattern to structure the code


### Bauhaus Graphic Design Principles
All UI components must follow the Bauhaus style. This means:
- **Minimalism & Functionality**: "Less is more." Layouts must be clean and uncluttered. Every UI element must serve a clear purpose. Avoid purely decorative elements.
- **Typography**: Use a clean, geometric sans-serif font (e.g., Inter, Futura, Montserrat). Typography is a primary design element. Use strong hierarchy (size, weight) and consider lowercase for headings where stylistically appropriate.
- **Layout & Grid**: Use strong, grid-based layouts. Asymmetrical layouts are encouraged to create visual interest.
- **Color Palette**: Use a primary color palette and shades of gray. Use color blocking sparingly but boldly to highlight key actions, active states, or important areas.
- **Shapes & Icons**: Emphasize basic geometric shapes (circles, squares, rectangles). Icons should be simple, geometric, and line-based.