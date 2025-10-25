# High Level Architecture

This section establishes the foundational architectural approach for the native Android MVP.

## Technical Summary

[cite_start]The "Mathe-Stylistin" MVP is a **React-based web application** built using **TypeScript**, **React 18+**, and **Vite** for the build system[cite: 1155]. [cite_start]It follows a **client-side architecture**, with all core logic (math problem generation, adaptive difficulty, reward system) and data persistence (unlocked items, user progress) residing within the browser using **IndexedDB**[cite: 1021]. [cite_start]The architecture prioritizes a **simple, modular structure** suitable for the MVP scope, focusing on the core user flow of solving math problems to unlock and apply creative styling items[cite: 420].

## High Level Overview

1.  [cite_start]**Architectural Style:** Primarily a **client-side web application** with all logic contained within the browser[cite: 422]. No backend services are used for the MVP beyond static file serving.
2.  [cite_start]**Repository Structure:** A **single monorepo** containing both client (React) and server (Express) code[cite: 384, 1021].
3.  **Core Components:**
    * UI Layer (React): Manages the styling interface, math task presentation, and user interactions using React components.
    * Math Engine: Handles generation of curriculum-aligned problems, adaptive difficulty adjustments, and answer checking.
    * Reward/Unlock Logic: Manages the criteria for unlocking items based on math performance.
    * Data Persistence Layer: Saves and retrieves user progress (unlocked items, difficulty level) using browser IndexedDB.
4.  **Primary User Flow:** Solve Math Task -> Check Answer -> (If Correct) Trigger Reward Logic -> Update Persistence -> Update UI (Show Unlock/New Item) -> Apply Styling.
5.  [cite_start]**Key Decisions:** React web application chosen for cross-platform compatibility and rapid development; IndexedDB chosen to simplify MVP development by avoiding backend setup while enabling offline functionality[cite: 423].

## High Level Project Diagram

```mermaid
graph TD
    subgraph "React Web Application (Mathe-Stylistin MVP)"
        A[UI Layer (React Components)] -- Interacts with --> B[Context/State Management];
        B -- Uses --> C[Math Engine Logic];
        B -- Uses --> D[Reward/Unlock Logic];
        B -- Uses --> E[Data Persistence Layer];
        C -- Accesses --> E;
        D -- Modifies --> E;
        E -- Uses --> F[Browser IndexedDB];
    end

    A -- Displays --> User;
    User -- Interacts with --> A;
````

## Architectural and Design Patterns

  * **Component-Based Architecture:** React components organize the UI into reusable, composable pieces. Separation of concerns between presentational and container components.
      * *Rationale:* Standard React practice, promotes reusability, testability, and maintainability.
  * **Context API for Global State:** React Context API manages global application state (user progress, unlocked items, current styling).
      * *Rationale:* Built-in React solution, appropriate for MVP scope, avoids external state management library complexity.
  * **Custom Hooks:** Encapsulate reusable stateful logic in custom hooks (e.g., `useComposition`, `usePersistFn`).
      * *Rationale:* Promotes code reuse, separates concerns, improves testability.
  * [cite\_start]**Service Layer Pattern:** Separate business logic (MathEngine, RewardManager) from UI components[cite: 428].
      * [cite\_start]*Rationale:* Decouples logic from UI, simplifies testing, makes future changes easier[cite: 654].
  * **Client-Side Routing:** Wouter provides lightweight client-side routing for navigation between screens.
      * *Rationale:* Minimal bundle size, simple API, sufficient for MVP needs.

-----
