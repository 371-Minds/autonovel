# StoryForge AI - TODO List

This document tracks the development roadmap for StoryForge AI, organized by priority and development phase.

---

## 🚀 Foundation & Core Tech (Highest Priority)

*These tasks are critical for the application's stability and must be addressed before major feature work.*

-   [x] **Create `SERVICES.md`**: As per the StoryCraft Protocol, create the `SERVICES.md` file to document all contracts for AI service interactions. This is the source of truth for the `geminiService.ts`.
-   [x] **Data Persistence**: Implemented `localStorage` to save projects, story text, and settings. User work is now preserved on page refresh.
-   [ ] **Robust Error Handling**: Enhance user-facing error messages to be more specific, especially for API failures (e.g., invalid key, model not available).
-   [x] **Implement "New Project"**: A modal and logic to start a new writing project has been created. Core user flow is now possible.
-   [x] **Centralized State Management**: Refactored `App.tsx` state into a `ProjectContext` for cleaner state management of projects, theme, and active views.

---

## V1.0 - Core Feature Implementation

*Features required for the initial, complete version of the application.*

-   [x] **Implement "Use Template"**: Create new projects pre-populated with chapter structures and placeholder content based on the selected template.
-   [x] **Writing Space: Implement Smart Toolbar**:
    -   [x] Connect UI buttons (Bold, Italic) to text manipulation in the textarea.
    -   [x] Implement "AI Rewrite" to call `geminiService` with the currently selected text.
    -   [x] Implement "AI Complete" to call `geminiService` with the context of the current paragraph.
-   [x] **Story Structure View**:
    -   [x] Design and implement the UI to view a list of plot points/chapters for the active project.
    -   [x] Add functionality to create, edit, and delete plot points.
    -   [x] Implement drag-and-drop functionality to reorder the story structure.
-   [x] **Settings View**:
    -   [x] Implement Settings View UI Shell and connect theme toggling.
    -   [x] Add UI and logic for basic editor preferences (e.g., font size, line height).
    -   [x] Add UI and logic to clear all local application data.
-   [x] **Marketing Hub View**:
    -   [x] Implement an AI-powered blurb/synopsis generator based on the full story content.
    -   [x] Create an AI-powered social media post generator (e.g., tweets, Instagram captions) for book promotion.
    -   [x] Refactor Marketing Hub to support multiple, selectable marketing tools.

---

## V1.1 - Enhancements

*Improvements and new features to be added after the core application is stable.*

-   [ ] **Graphics Studio Improvements**:
    -   [x] Add basic text overlay capability for adding titles/author names to generated covers.
    -   [x] Create style presets (e.g., "Vintage Sci-Fi," "Modern Thriller") that append modifiers to the image prompt.
    -   [x] Add a gallery to view previously generated images for the current project.
-   [x] **Streaming AI Responses**: Update `geminiService` and UI components to handle streaming text responses for a better user experience on long generations.
-   [x] **Custom Agent Creation**: Design a UI to allow users to define their own creative agents with custom names, descriptions, and SOPs.

---

## V1.2 - Integration & Workflow

*Features focused on making the application a seamless, interconnected suite of tools.*

-   [x] **Integrate new user-provided SOPs**:
    -   [x] Add 'Angular Momentum' as a new Structural Framework for the Master Writer Agent.
    -   [x] Create a 'Marketing Campaign Planner' tool in the Marketing Hub.
-   [x] **Character Management**:
    -   [x] Create Character Hub view to display, add, edit, and delete characters.
    -   [x] Implement AI-powered character generation.
    -   [x] Integrate character list into the Right Sidebar for easy reference.
-   [x] **Project Context Awareness**: Ensure AI Assistants are aware of the currently active project's content, characters, and plot points to provide more relevant suggestions.
-   [x] **Dynamic Right Sidebar**: Implemented a 'Pin Character' feature. Writers can now pin a character from the navigator to keep their detailed profile visible in the sidebar for easy reference while writing.
-   [x] **Export Functionality**: Allow users to export their full story (or individual chapters) as a `.txt` or `.md` file.

---

## V1.3 - Extensibility

-   [x] **AI Provider Configuration**: Implemented a settings panel to switch between the default Gemini provider and a custom **Arch Gateway** provider. The service layer has been updated to be provider-aware, routing AI requests to the configured backend.

---

## V1.4 - Autonomous Creation

-   [x] **Implement Autonomous Book Generation**: Created a new workflow where users can provide a high-level concept, and the AI will generate a complete book structure (title, synopsis, chapters) and then write the full content for each chapter, creating a new, fully-drafted project.

---

## V1.5 - Deployment & Infrastructure

-   [x] **Containerization & Deployment**: Containerize the application with Docker and create deployment configurations for local development (Docker Compose) and decentralized hosting (Akash Network SDL).

---

## V1.6 - Provider Role Routing

-   [x] **Role-Based Provider Contract**: Added shared StoryForge provider/types definitions so UI and MCP can express provider by role, model by role, provider base URLs, and provider secret fields.
-   [x] **MCP Role-Aware Config Defaults**: Refactored MCP narrative, character, and marketing tools to build AI config from shared role/provider/model settings instead of duplicating provider setup logic.

---

## 🧹 Technical Debt & Quality of Life

*Ongoing tasks to improve code quality, performance, and maintainability.*

-   [x] **Responsiveness**: Improved layout and usability on smaller screens. The left sidebar is now collapsible on tablet and mobile views, accessible via a hamburger menu, ensuring a fluid experience on all devices.
-   [ ] **Accessibility (A11y)**: Conduct a full accessibility audit and add necessary ARIA attributes, keyboard navigation improvements, and focus management.
-   [ ] **Component Refactoring**: Break down large view components (`AiAssistantsView`, `App.tsx`) into smaller, more manageable sub-components to improve readability and maintainability.
-   [ ] **Add Tests**: Implement unit tests for services (`geminiService`) and key UI components (`Button`, `Card`). Add integration tests for core user flows (e.g., generating content, creating a new project).
