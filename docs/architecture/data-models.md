# Data Models

We need to store two main types of information locally for the MVP: the status of unlockable styling items and the user's progress.

## 1\. StylingItem Interface

Represents a single unlockable styling item (like a color or an accessory).

```typescript
// TypeScript interface for StylingItem
export interface StylingItem {
  id: string;                    // Unique ID, e.g., "color_red", "accessory_glasses1"
  type: 'color' | 'accessory' | 'effect'; // Item type
  name: string;                  // Display name, e.g., "Glitter Pink", "Cool Glasses"
  assetReference: string;        // Reference to the visual asset (e.g., CSS value, image path)
  isUnlocked: boolean;           // Tracks if the user has unlocked this item
  category?: string;             // Optional category for organization
}
```

**Purpose:** To keep track of all available styling items and whether the user has earned access to them.
**Key Attributes:** A unique ID, type (color/accessory/effect), display name, a way to reference the visual asset, and a boolean `isUnlocked` flag.
**Storage:** Stored in IndexedDB in the `styling_items` object store.
**Initial State:** A predefined list of items will be initialized in IndexedDB on first launch, some marked as `isUnlocked: true`, others `isUnlocked: false`.

## 2\. UserProgress Interface

Represents the user's current learning state and progress.

```typescript
// TypeScript interface for UserProgress
export interface UserProgress {
  id: number;                         // Singleton entity, always use ID 1
  difficultyLevelAddition: number;    // Current difficulty for addition (1-10)
  difficultyLevelSubtraction: number; // Current difficulty for subtraction (1-10)
  difficultyLevelMultiplication: number; // Current difficulty for multiplication (1-10)
  difficultyLevelDivision: number;    // Current difficulty for division (1-10)
  difficultyLevelGeometry: number;    // Current difficulty for geometry (1-10)
  difficultyLevelSizes: number;       // Current difficulty for sizes (1-10)
  correctAnswersStreak: number;       // Counter towards next reward unlock
  totalCorrectAnswers: number;        // Total correct answers (for analytics)
  totalIncorrectAnswers: number;      // Total incorrect answers (for analytics)
  lastSessionDate: string;            // ISO date string of last session
}
```

**Purpose:** To store the user's current adaptive difficulty level for different math topics and track metrics needed for the reward system.
**Key Attributes:** Difficulty level per topic (1-10 scale), streak counter for rewards, and session tracking data.
**Storage:** Stored in IndexedDB in the `user_progress` object store as a singleton (always ID 1).
**Relationships:** None directly.

-----
