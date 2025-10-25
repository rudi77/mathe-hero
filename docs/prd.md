# Mathe-Stylistin Product Requirements Document (PRD)

## Goals and Background Context

### Goals

* [cite_start]**Improve Math Skills:** Increase user proficiency and confidence in 3rd-grade math topics (Bavarian curriculum)[cite: 1007].
* [cite_start]**Engage Target User:** Make math practice enjoyable and achieve regular app usage through the creative styling game mechanic[cite: 1007].
* [cite_start]**Validate Core Concept:** Confirm the gamified approach (math tasks unlock creative rewards) effectively motivates learning[cite: 1007].
* [cite_start]**Launch MVP:** Successfully release a stable, functional MVP as a web application[cite: 1007].
* [cite_start]**User Success:** Ensure users show improved performance (accuracy), increased engagement (session frequency/duration), feel a sense of progress (items unlocked), and master specific topics[cite: 1007].

### Background Context

[cite_start]Many primary school children, particularly those in 3rd grade in Bavaria, find mathematics unengaging or difficult, leading to poor motivation and performance[cite: 1008]. [cite_start]Traditional learning methods often don't resonate with creatively inclined children who learn best through play[cite: 1008]. [cite_start]Existing solutions may lack alignment with specific regional curricula or fail to leverage non-mathematical interests as effective motivators[cite: 1008].

[cite_start]"Mathe-Stylistin" aims to address this by integrating math practice (aligned with the 3rd-grade Bavarian curriculum) directly into a creative styling game[cite: 1008]. [cite_start]By solving math problems, users unlock digital items (colors, accessories) to style a virtual character head[cite: 1008]. [cite_start]This core loop, combined with adaptive difficulty and topic selection, intends to transform math practice into an intrinsically rewarding activity, boosting both skills and confidence[cite: 1008].

### Change Log

| Date             | Version | Description              | Author   |
| :--------------- | :------ | :----------------------- | :------- |
| October 25, 2025 | 0.1     | Initial PRD draft        | PM John  |
| October 25, 2025 | 0.2     | Updated for React/TypeScript web implementation | PM John  |

---

## Requirements

### Functional Requirements

1.  **FR1:** The application MUST provide a virtual character head interface where styling items can be applied.
2.  **FR2:** The application MUST present math problems appropriate for the 3rd-grade curriculum in Bavaria.
3.  **FR3:** The application MUST cover core 3rd-grade topics: Numbers up to 1000 (Addition, Subtraction, Multiplication, Division), basic geometry, and sizes (length, weight, time).
4.  **FR4:** The application MUST implement an adaptive difficulty mechanism that adjusts problem complexity based on user performance.
5.  **FR5:** The application MUST allow users to select specific math topics (e.g., Multiplication, Geometry) for practice.
6.  **FR6:** Successfully solving math problems MUST unlock new styling items (e.g., colors, accessories).
7.  **FR7:** Users MUST be able to apply unlocked styling items to the virtual character head.
8.  **FR8:** The application MUST save the user's unlocked items and current difficulty level locally in the browser between sessions.
9.  **FR9:** The application MUST function as a web application accessible through modern browsers on desktop and mobile devices.

### Non-Functional Requirements

1.  [cite_start]**NFR1:** The application MUST run smoothly on modern browsers (Chrome, Firefox, Safari, Edge) on both desktop and mobile devices without noticeable lag during core interactions (problem-solving, styling)[cite: 1].
2.  **NFR2:** The application's initial load time SHOULD be under 5 seconds on target devices.
3.  **NFR3:** The user interface MUST be intuitive and easily navigable for children aged 8-9.
4.  **NFR4:** All user data (progress, unlocked items) MUST be stored locally using browser storage (IndexedDB) for the MVP.
5.  **NFR5:** The application MUST comply with child data privacy regulations applicable in Germany/EU (e.g., GDPR-K), minimizing data collection.
6.  **NFR6:** The application MUST be developed using React with TypeScript as per the current technical implementation.
7.  **NFR7:** Error handling SHOULD be user-friendly, providing simple feedback without technical jargon.
8.  **NFR8:** Visual assets (character head, styling items) SHOULD be appealing and appropriate for the target age group.

---

## User Interface Design Goals

### Overall UX Vision

The user experience should be highly engaging, visually rewarding, and simple to navigate for an 8-9 year old. The primary loop (solve math -> get reward -> style) must be clear and satisfying. The focus should be on encouraging creativity and exploration while seamlessly integrating the math practice. The interface should feel playful and positive, reducing potential math anxiety.

### Key Interaction Paradigms

* **Direct Manipulation:** Applying colors/accessories should be intuitive, likely via drag-and-drop or simple taps.
* **Clear Feedback:** Correct/incorrect math answers need immediate, encouraging, and clear visual/audio feedback. Unlocking items should feel like a celebratory event.
* **Minimal Text:** Instructions and feedback should rely heavily on visuals and icons, with minimal text, appropriate for the age group.
* **Progressive Disclosure:** Keep the interface clean. Perhaps math problems appear in a dedicated modal or section, separate from the main styling canvas. Advanced styling options could be revealed gradually.

### Core Screens and Views

*(Conceptual - names and specifics TBD)*

* [cite_start]**Main Styling Screen:** Shows the character head, available styling items/colors, and access to math tasks[cite: 1015].
* [cite_start]**Math Task Screen/Modal:** Presents the math problems clearly, with input methods suitable for the age group (e.g., number pad, multiple choice)[cite: 1015].
* [cite_start]**Rewards/Unlocks Screen:** Shows newly unlocked items after successful task completion[cite: 1015].
* [cite_start]**Topic Selection Screen:** Allows the user to choose which math area to practice[cite: 1015].
* [cite_start]**(Maybe) Basic Item Inventory:** A simple way to view already unlocked items[cite: 1015].

### Accessibility

* **Target:** Aim for basic accessibility principles initially (e.g., sufficient contrast, clear focus indicators, reasonably sized touch targets). [cite_start]WCAG AA could be a post-MVP target[cite: 1016].

### Branding

* **Style:** Playful, colorful, encouraging, and age-appropriate. Should appeal to children interested in creativity and styling. (No specific corporate branding mentioned, assuming creative freedom) [cite_start][cite: 1017].

### Target Device and Platforms

* **Target:** Web browsers on desktop computers, tablets, and mobile phones. Progressive Web App (PWA) capabilities for future consideration. [cite_start][cite: 1019].

---

## Technical Assumptions

### Repository Structure

* [cite_start]**Structure:** Single Repository (Monorepo)[cite: 1021].
    * **Rationale:** For the MVP web application, a single repository containing both client and server code is simplest and allows for easy development and deployment.

### Service Architecture

* [cite_start]**Architecture:** Client-Side Web Application with Static Server (MVP)[cite: 1022].
    * **Rationale:** The MVP is implemented as a React-based web application. All game logic, math engine, and data persistence reside on the client using browser storage (IndexedDB). A lightweight Express server serves the static assets.

### Testing Requirements

* [cite_start]**Testing:** Unit Tests required, basic component tests recommended[cite: 1023].
    * **Rationale:** Unit tests are essential for verifying the math engine, adaptive difficulty logic, and reward system. Basic component tests (using React Testing Library) ensure core interactions function correctly. Comprehensive E2E testing is out of scope for MVP.

### Additional Technical Assumptions and Requests

* **Platform & Language:** Web application using React 18+ with TypeScript 5+. Rationale: Provides cross-platform compatibility and modern development experience with type safety.
* **Build Tool:** Vite 7+ for fast development and optimized production builds. Rationale: Modern, fast, and excellent developer experience.
* **Local Storage:** IndexedDB (via browser API) for persisting unlocked items and user progress. Rationale: Sufficient for MVP needs, avoids backend complexity, works offline.
* **Browser Compatibility:** Target modern evergreen browsers (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+). Rationale: Balances modern features with reasonable browser coverage.
* **UI Framework:** Shadcn/ui with Radix UI primitives and Tailwind CSS. Rationale: Accessible components, consistent design system, rapid development.
* **Routing:** Wouter for client-side routing. Rationale: Lightweight and performant.
* **Testing:** Vitest for unit tests and React Testing Library for component tests. Rationale: Fast, modern testing tools with excellent TypeScript support.
* **External APIs:** None required for MVP.
* **Graphics:** SVG and web-optimized 2D assets for scalability and performance.

---

## Epic List

* [cite_start]**Epic 1: MVP Core - Math Styling Loop:** Establish the React web application foundation, implement the basic styling interface, integrate the 3rd-grade math engine with adaptive difficulty and topic selection, implement the reward system for unlocking items, and set up local data persistence using IndexedDB[cite: 1027, 1032].

---

## Epic 1: MVP Core - Math Styling Loop

**Epic Goal:** To establish the foundational React web application, implement the core styling interface with basic items, integrate the 3rd-grade Bavarian math curriculum engine with adaptive difficulty and topic selection, create the reward loop linking math success to unlocking styling items, and ensure basic progress persists locally. [cite_start]This delivers the minimum viable experience to test the core learning-through-styling hypothesis[cite: 1035].

### Story 1.1: Project Setup & Basic Styling Screen

**Story:** As a Developer, I want to set up the initial React project structure with TypeScript and display a basic, non-interactive styling screen with a placeholder character head, so that the foundation for the app is established.

**Acceptance Criteria:**

1.  A new React project using TypeScript and Vite is created and builds successfully.
2.  A basic screen layout is created displaying a placeholder for the character head.
3.  A simple, static palette of initial colors/items is displayed (non-functional).
4.  The project structure follows modern React/TypeScript conventions (e.g., folders for components, pages, lib).
5.  Code adheres to TypeScript and React best practices with ESLint/Prettier.

### Story 1.2: Math Engine - Problem Generation & Basic Display

**Story:** As a User (Child), I want to be presented with basic math problems (initially focusing on Addition/Subtraction up to 1000) from the 3rd-grade curriculum, so that I can start practicing math.

**Acceptance Criteria:**

1.  A mechanism exists to load/generate math problems (e.g., Addition/Subtraction up to 1000).
2.  A dedicated screen or modal can display a math problem (question and input area/options).
3.  User input for the answer is captured (e.g., via a number pad or multiple choice).
4.  Basic (non-adaptive) problem presentation logic is implemented.
5.  Unit tests verify problem generation/display logic.

### Story 1.3: Math Engine - Answer Checking & Basic Feedback

**Story:** As a User (Child), I want to receive immediate feedback on whether my math answer is correct or incorrect, so that I know if I solved the problem successfully.

**Acceptance Criteria:**

1.  After submitting an answer, the app checks if it's correct.
2.  Clear visual feedback is provided for correct answers (e.g., green checkmark, positive sound).
3.  Clear visual feedback is provided for incorrect answers (e.g., red cross, gentle sound).
4.  The system correctly identifies right/wrong answers for the implemented problem types.
5.  Unit tests verify the answer-checking logic.

### Story 1.4: Reward System - Unlocking Basic Items

**Story:** As a User (Child), I want to unlock a new styling item (e.g., a new color, a simple accessory) after successfully solving a certain number of math problems, so that I feel rewarded for my effort.

**Acceptance Criteria:**

1.  A simple counter tracks the number of correctly solved problems.
2.  Upon reaching a predefined threshold (e.g., 5 correct answers), a new styling item is designated as "unlocked".
3.  The user is notified visually when a new item is unlocked.
4.  The unlocked status of items is tracked (initially, can be in memory or simple variable).
5.  Unit tests verify the unlocking logic.

### Story 1.5: Styling Integration - Applying Unlocked Items

**Story:** As a User (Child), I want to apply the styling items I have unlocked to the character head on the main styling screen, so that I can be creative.

**Acceptance Criteria:**

1.  The main styling screen displays both initially available and newly unlocked items.
2.  Users can select an unlocked item (e.g., tap a color).
3.  Users can apply the selected item to the character head (e.g., tap the head to apply color).
4.  The character head visually updates to reflect the applied item.
5.  Users can apply multiple different unlocked items.
6.  Basic UI tests verify item selection and application.

### Story 1.6: Local Persistence - Saving Progress

**Story:** As a Developer, I want the user's unlocked items and current progress (e.g., correct answer streak for rewards) to be saved locally in the browser, so that progress is not lost when the app is closed and reopened.

**Acceptance Criteria:**

1.  The list/status of unlocked styling items is saved using IndexedDB.
2.  Relevant progress metrics (e.g., counter towards next reward) are saved.
3.  When the app restarts, previously unlocked items are available on the styling screen.
4.  Progress towards the next reward is correctly loaded.
5.  Data is saved reliably and persists across browser sessions.
6.  Unit tests verify data saving and loading logic.

### Story 1.7: Math Engine - Adaptive Difficulty (Basic)

**Story:** As a User (Child), I want the math problems to become slightly harder if I answer correctly many times, and slightly easier if I make mistakes, so that I am appropriately challenged.

**Acceptance Criteria:**

1.  The app tracks user performance (e.g., accuracy over recent problems).
2.  A basic algorithm adjusts the difficulty level (e.g., range of numbers, complexity of operations) based on performance.
3.  Problems presented to the user reflect the current calculated difficulty level.
4.  The current difficulty level is saved locally (as part of Story 1.6).
5.  Unit tests verify the difficulty adjustment logic.

### Story 1.8: Math Engine - Topic Selection & Curriculum Expansion

**Story:** As a User (Child), I want to choose which math topic (e.g., Addition, Multiplication, Geometry basics) I want to practice, and see problems covering the main 3rd-grade curriculum areas, so that I can focus my learning.

**Acceptance Criteria:**

1.  A UI element allows the user to select from available math topics (Addition, Subtraction, Multiplication, Division, Basic Geometry, Sizes - based on FR3).
2.  The math engine generates problems corresponding to the selected topic.
3.  The math engine includes problems covering all required areas from FR3.
4.  Topic selection integrates with the adaptive difficulty (difficulty adjusts within the selected topic).
5.  Unit tests verify topic-specific problem generation.

---

## Checklist Results Report

*(Based on simulated `pm-checklist` execution)*

### Executive Summary

* **Overall PRD completeness:** High (approx. 90-95% for MVP planning stage).
* **MVP scope appropriateness:** Appears Just Right - focused on the core loop validation.
* [cite_start]**Readiness for architecture phase:** Ready[cite: 1148].
* **Most critical gaps or concerns:** Minor - primarily the need for detailed curriculum content and confirmation of specific asset details.

### Category Analysis Table

| Category                         | Status   | Critical Issues                        |
| :------------------------------- | :------- | :------------------------------------- |
| 1. Problem Definition & Context  | PASS     | None                                   |
| 2. MVP Scope Definition          | PASS     | None                                   |
| 3. User Experience Requirements  | PASS     | Needs detailed visual design later.    |
| 4. Functional Requirements       | PASS     | Needs specific curriculum mapping.     |
| 5. Non-Functional Requirements   | PASS     | None                                   |
| 6. Epic & Story Structure        | PASS     | None                                   |
| 7. Technical Guidance            | PASS     | Needs confirmation (e.g., native vs X-plat). |
| 8. Cross-Functional Requirements | PASS     | Minimal for MVP.                       |
| 9. Clarity & Communication       | PASS     | None                                   |

### Top Issues by Priority

* **BLOCKERS:** None identified.
* **HIGH:** Gather specific Bavarian 3rd-grade curriculum details to ensure FR3-5 and Story 1.8 are accurately implemented.
* **MEDIUM:** Confirm the Native Android (Kotlin/Compose) technical assumption before the Architect commits significant design effort. Define initial set of styling items (FR1, FR6, Story 1.4/1.5).
* **LOW:** Refine specific KPI targets (Goals/Metrics section).

### MVP Scope Assessment

* The current scope seems appropriately minimal for validating the core hypothesis.
* No essential features appear missing for the defined MVP goal.
* No obvious scope creep identified.
* Complexity seems manageable for an MVP.

### Technical Readiness

* [cite_start]Technical constraints (Android, Local Storage, curriculum focus) are clear[cite: 1137].
* [cite_start]Technical risks (engagement, curriculum accuracy, scalability) identified[cite: 1137].
* [cite_start]Areas needing Architect investigation: Optimal local storage solution (Room vs DataStore), confirmation of Native Kotlin choice[cite: 1137].

### Recommendations

* Proceed to the UX Expert and Architect phases.
* Prioritize gathering detailed 3rd-grade Bavarian math curriculum content.
* Make a firm decision on Native vs. Cross-Platform soon.
* Start defining the initial set of visual assets (head model, styling items).

### Final Decision

* [cite_start]**READY FOR ARCHITECT/UX EXPERT**: The PRD and epics are sufficiently defined and structured for the next stages of design and architectural planning[cite: 1148].

---

## Next Steps

### UX Expert Prompt

Please review the attached PRD (`docs/prd.md`) and the originating Project Brief (`docs/brief.md`) for the 'Mathe-Stylistin' app. [cite_start]Your task is to create the **UI/UX Specification** using the `front-end-spec-tmpl.yaml`[cite: 1046]. [cite_start]Focus on translating the PRD's UI goals, user needs (3rd grader), and functional requirements into a clear specification covering information architecture, user flows, wireframe concepts (if needed), component ideas, branding/style direction, accessibility, and responsiveness for the Android MVP[cite: 1046].

### Architect Prompt

Please review the attached PRD (`docs/prd.md`) and the originating Project Brief (`docs/brief.md`) for the 'Mathe-Stylistin' app. [cite_start]Your task is to create the **Architecture Document** using the `architecture-tmpl.yaml` (note: since this is primarily a client-side MVP, a frontend or fullstack template might be adaptable, but focus on the Android native aspects)[cite: 1047]. [cite_start]Detail the technical architecture based on the PRD's requirements and technical assumptions (Native Android/Kotlin/Compose, local storage via Room/DataStore, adaptive difficulty logic, math engine structure, testing strategy)[cite: 1047]. [cite_start]Ensure the architecture supports the defined MVP scope and considers potential future scalability (like backend integration or iOS support)[cite: 1047].