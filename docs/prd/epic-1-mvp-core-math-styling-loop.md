# Epic 1: MVP Core - Math Styling Loop

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
