# Story 2.2: Subtopic System for Math Topics

## Status

**Ready for Development** 🟢

## Story

**As a** User (Child),
**I want** to select specific subtopics within each math topic (e.g., "Einmaleins 1-5" within Multiplication),
**so that** I can practice exactly what I'm struggling with or want to reinforce.

## Acceptance Criteria

1. Subtopic data structure is defined for all 6 main topics
2. Each main topic has at least 2-3 meaningful subtopics
3. DojoTopicSelection page displays subtopics after a main topic is selected
4. Clicking a subtopic navigates to DojoPractice with subtopic context
5. DojoPractice receives and displays the selected subtopic name
6. Subtopics map to specific MathEngine generation parameters (difficulty range, constraints)
7. Subtopic definitions are documented and maintainable
8. Unit tests verify subtopic data structure and mapping logic

## Tasks / Subtasks

- [ ] Define subtopic data structure (AC: 1, 7)
  - [ ] Create `src/client/src/types/dojoSubtopics.ts` (or add to `models.ts`)
  - [ ] Define TypeScript interface:
    ```typescript
    interface DojoSubtopic {
      id: string;              // e.g., "multiplication_times_1_5"
      topicId: MathTopic;      // e.g., "multiplication"
      name: string;            // e.g., "Einmaleins 1-5"
      description?: string;    // Optional help text
      mathEngineParams: {
        difficultyMin?: number;
        difficultyMax?: number;
        constraints?: any;     // Topic-specific constraints
      };
    }
    ```
  - [ ] Export interface and subtopic array

- [ ] Define subtopics for all 6 topics (AC: 2)
  - [ ] **Addition** subtopics:
    - "Bis 100" (numbers up to 100)
    - "Bis 1000" (numbers up to 1000)
    - "Mit Übertrag" (with carry-over)
  - [ ] **Subtraction** subtopics:
    - "Bis 100" (numbers up to 100)
    - "Bis 1000" (numbers up to 1000)
    - "Mit Übertrag" (with borrowing)
  - [ ] **Multiplication** subtopics:
    - "Einmaleins 1-5" (times tables 1-5)
    - "Einmaleins 6-10" (times tables 6-10)
    - "Gemischte Aufgaben" (mixed multiplication)
  - [ ] **Division** subtopics:
    - "Geteilt durch 2-5" (divide by 2-5)
    - "Geteilt durch 6-10" (divide by 6-10)
    - "Mit Rest" (with remainder)
  - [ ] **Geometry** subtopics:
    - "Formen erkennen" (shape recognition)
    - "Ecken und Kanten zählen" (counting vertices and edges)
  - [ ] **Sizes** subtopics:
    - "Längen (cm, m)" (length measurements)
    - "Gewichte (g, kg)" (weight measurements)
    - "Zeit (min, h)" (time measurements)

- [ ] Map subtopics to MathEngine parameters (AC: 6)
  - [ ] For each subtopic, define `mathEngineParams`:
    - Difficulty range (min/max)
    - Constraints (e.g., maxNumber, operands range)
  - [ ] Example for "Einmaleins 1-5":
    ```typescript
    {
      id: 'multiplication_times_1_5',
      topicId: 'multiplication',
      name: 'Einmaleins 1-5',
      mathEngineParams: {
        difficultyMin: 1,
        difficultyMax: 5,
        constraints: { maxMultiplier: 5 }
      }
    }
    ```
  - [ ] Document mapping logic in comments

- [ ] Update DojoTopicSelection UI (AC: 3, 4)
  - [ ] Modify `src/client/src/pages/DojoTopicSelection.tsx`
  - [ ] Add two-step selection:
    1. Show 6 main topics initially
    2. When topic clicked, show subtopics for that topic
  - [ ] Use "Back" button to return to main topics
  - [ ] Pass selected subtopic to DojoPractice via query params or state
  - [ ] Example URL: `/dojo/practice?subtopic=multiplication_times_1_5`

- [ ] Update DojoPractice to receive subtopic (AC: 5)
  - [ ] Modify `src/client/src/pages/DojoPractice.tsx`
  - [ ] Read subtopic ID from URL query params (or state)
  - [ ] Look up subtopic definition by ID
  - [ ] Display subtopic name in page header
  - [ ] Store subtopic context for Story 2.3 (problem generation)

- [ ] Write unit tests (AC: 8)
  - [ ] Create `src/client/src/types/__tests__/dojoSubtopics.test.ts`
  - [ ] Test subtopic data structure is valid
  - [ ] Test all 6 topics have subtopics defined
  - [ ] Test subtopic lookup by ID
  - [ ] Test subtopic-to-MathEngine params mapping

- [ ] Write component tests
  - [ ] Test DojoTopicSelection shows subtopics after topic click
  - [ ] Test "Back" button returns to main topics
  - [ ] Test subtopic click navigates to DojoPractice with correct params
  - [ ] Test DojoPractice displays selected subtopic name

## Dev Notes

### Relevant Architecture

**Data Structure:**
- Define subtopics in centralized file for easy maintenance
- Use TypeScript for type safety
- Export as const array for immutability

**UI Flow:**
```
DojoTopicSelection (Main Topics)
  ↓ Click "Multiplication"
DojoTopicSelection (Subtopics for Multiplication)
  ↓ Click "Einmaleins 1-5"
DojoPractice (Practice with subtopic context)
```

**State Management:**
- No global state needed (subtopics are static data)
- Pass selected subtopic via URL params or React state
- DojoPractice reads subtopic from URL on mount

### Subtopic Definition Example

```typescript
// src/client/src/types/dojoSubtopics.ts
export interface DojoSubtopic {
  id: string;
  topicId: MathTopic;
  name: string;
  description?: string;
  mathEngineParams: {
    difficultyMin?: number;
    difficultyMax?: number;
    constraints?: Record<string, any>;
  };
}

export const DOJO_SUBTOPICS: DojoSubtopic[] = [
  // Addition subtopics
  {
    id: 'addition_up_to_100',
    topicId: 'addition',
    name: 'Bis 100',
    description: 'Addition mit Zahlen bis 100',
    mathEngineParams: {
      difficultyMin: 1,
      difficultyMax: 3,
      constraints: { maxNumber: 100 }
    }
  },
  {
    id: 'addition_up_to_1000',
    topicId: 'addition',
    name: 'Bis 1000',
    description: 'Addition mit Zahlen bis 1000',
    mathEngineParams: {
      difficultyMin: 4,
      difficultyMax: 7,
      constraints: { maxNumber: 1000 }
    }
  },
  // ... more subtopics
];

// Helper function
export function getSubtopicById(id: string): DojoSubtopic | undefined {
  return DOJO_SUBTOPICS.find(s => s.id === id);
}

export function getSubtopicsByTopic(topicId: MathTopic): DojoSubtopic[] {
  return DOJO_SUBTOPICS.filter(s => s.topicId === topicId);
}
```

### MathEngine Integration

**For Story 2.2:**
- Define `mathEngineParams` for each subtopic
- Document how params map to MathEngine methods
- **Do NOT modify MathEngine.ts yet** (that's Story 2.3)

**Example Mapping:**
- `difficultyMin/Max`: Determines problem difficulty range
- `constraints.maxNumber`: Limits operand size
- `constraints.maxMultiplier`: For multiplication tables
- `constraints.allowRemainder`: For division with/without remainder

### UI Design Notes

**Two-Step Selection Flow:**

**Step 1 - Main Topics:**
```
┌─────────────────────────────────────┐
│  Trainings-Dojo                     │
│  Wähle ein Thema:                   │
│                                     │
│  ┌───────┐ ┌───────┐ ┌───────┐    │
│  │   ➕  │ │   ➖  │ │   ✖️  │    │
│  │Addition│ │Subtr. │ │Mult.  │    │
│  └───────┘ └───────┘ └───────┘    │
│  ┌───────┐ ┌───────┐ ┌───────┐    │
│  │   ➗  │ │   📐  │ │   📏  │    │
│  │Divis. │ │Geomet.│ │Größen │    │
│  └───────┘ └───────┘ └───────┘    │
└─────────────────────────────────────┘
```

**Step 2 - Subtopics (after clicking Multiplication):**
```
┌─────────────────────────────────────┐
│  ⬅ Zurück  |  Multiplikation       │
│  Wähle einen Bereich:               │
│                                     │
│  ┌────────────────────────────┐    │
│  │  Einmaleins 1-5            │    │
│  │  (1×1 bis 5×10)            │    │
│  └────────────────────────────┘    │
│  ┌────────────────────────────┐    │
│  │  Einmaleins 6-10           │    │
│  │  (6×1 bis 10×10)           │    │
│  └────────────────────────────┘    │
│  ┌────────────────────────────┐    │
│  │  Gemischte Aufgaben        │    │
│  │  (Alle Reihen gemischt)    │    │
│  └────────────────────────────┘    │
└─────────────────────────────────────┘
```

### Testing

**Unit Test Example:**
```typescript
import { DOJO_SUBTOPICS, getSubtopicById, getSubtopicsByTopic } from '../dojoSubtopics';

describe('DojoSubtopics', () => {
  test('all topics have at least 2 subtopics', () => {
    const topics: MathTopic[] = ['addition', 'subtraction', 'multiplication', 'division', 'geometry', 'sizes'];
    topics.forEach(topic => {
      const subtopics = getSubtopicsByTopic(topic);
      expect(subtopics.length).toBeGreaterThanOrEqual(2);
    });
  });

  test('getSubtopicById returns correct subtopic', () => {
    const subtopic = getSubtopicById('multiplication_times_1_5');
    expect(subtopic).toBeDefined();
    expect(subtopic?.name).toBe('Einmaleins 1-5');
    expect(subtopic?.topicId).toBe('multiplication');
  });

  test('all subtopics have valid mathEngineParams', () => {
    DOJO_SUBTOPICS.forEach(subtopic => {
      expect(subtopic.mathEngineParams).toBeDefined();
      expect(typeof subtopic.mathEngineParams).toBe('object');
    });
  });
});
```

## Change Log

| Date | Version | Description | Author |
|------|---------|-------------|--------|
| 2025-10-29 | 1.0 | Initial story creation for Epic 2 | PM John |

## Dev Agent Record

### Implementation Notes

*[To be filled by dev agent during implementation]*

### File List

**To Be Created:**
- `src/client/src/types/dojoSubtopics.ts` (subtopic definitions)
- `src/client/src/types/__tests__/dojoSubtopics.test.ts` (unit tests)

**To Be Modified:**
- `src/client/src/pages/DojoTopicSelection.tsx` (two-step selection UI)
- `src/client/src/pages/DojoPractice.tsx` (receive and display subtopic)

### Blockers/Issues

*[To be filled during implementation if issues arise]*

## QA Results

**Status:** Pending

*[To be filled by QA agent after implementation]*

---

**Estimated Effort:** 2-3 days

**Dependencies:** Story 2.1 (DojoTopicSelection page must exist)

**Next Story:** Story 2.3 (Tracking-Free Practice Mode)
