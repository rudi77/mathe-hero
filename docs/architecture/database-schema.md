# Database Schema

Based on browser IndexedDB.

## IndexedDB Database: `mathe_stylistin_db`

**Version:** 1

## Object Store: `styling_items`

**Key Path:** `id`

**Structure:**
```typescript
{
  id: string;              // Primary key, e.g., "color_red", "accessory_glasses1"
  type: string;            // "color" | "accessory" | "effect"
  name: string;            // Display name, e.g., "Glitter Pink"
  assetReference: string;  // CSS value, image path, etc.
  isUnlocked: boolean;     // Unlock status
  category?: string;       // Optional category
}
```

**Indexes:**
- `type` (non-unique) - for filtering by item type
- `isUnlocked` (non-unique) - for querying unlocked items

## Object Store: `user_progress`

**Key Path:** `id`

**Structure:**
```typescript
{
  id: number;                         // Always 1 (singleton)
  difficultyLevelAddition: number;    // 1-10
  difficultyLevelSubtraction: number; // 1-10
  difficultyLevelMultiplication: number; // 1-10
  difficultyLevelDivision: number;    // 1-10
  difficultyLevelGeometry: number;    // 1-10
  difficultyLevelSizes: number;       // 1-10
  correctAnswersStreak: number;       // Counter for rewards
  totalCorrectAnswers: number;        // Analytics
  totalIncorrectAnswers: number;      // Analytics
  lastSessionDate: string;            // ISO date string
}
```

**Initial Data:** Created on first app load with default values (all difficulties at 1, all counters at 0).

-----
