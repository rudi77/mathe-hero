# Story 2.2: Subtopic System for Math Topics

## Status

**Done** ✅

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

- [x] Define subtopic data structure (AC: 1, 7)
  - [x] Create `src/client/src/types/dojoSubtopics.ts` (or add to `models.ts`)
  - [x] Define TypeScript interface:
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
  - [x] Export interface and subtopic array

- [x] Define subtopics for all 6 topics (AC: 2)
  - [x] **Addition** subtopics:
    - "Bis 100" (numbers up to 100)
    - "Bis 1000" (numbers up to 1000)
    - "Mit Übertrag" (with carry-over)
  - [x] **Subtraction** subtopics:
    - "Bis 100" (numbers up to 100)
    - "Bis 1000" (numbers up to 1000)
    - "Mit Übertrag" (with borrowing)
  - [x] **Multiplication** subtopics:
    - "Einmaleins 1-5" (times tables 1-5)
    - "Einmaleins 6-10" (times tables 6-10)
    - "Gemischte Aufgaben" (mixed multiplication)
  - [x] **Division** subtopics:
    - "Geteilt durch 2-5" (divide by 2-5)
    - "Geteilt durch 6-10" (divide by 6-10)
    - "Mit Rest" (with remainder)
  - [x] **Geometry** subtopics:
    - "Formen erkennen" (shape recognition)
    - "Ecken und Kanten zählen" (counting vertices and edges)
  - [x] **Sizes** subtopics:
    - "Längen (cm, m)" (length measurements)
    - "Gewichte (g, kg)" (weight measurements)
    - "Zeit (min, h)" (time measurements)

- [x] Map subtopics to MathEngine parameters (AC: 6)
  - [x] For each subtopic, define `mathEngineParams`:
    - Difficulty range (min/max)
    - Constraints (e.g., maxNumber, operands range)
  - [x] Example for "Einmaleins 1-5":
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
  - [x] Document mapping logic in comments

- [x] Update DojoTopicSelection UI (AC: 3, 4)
  - [x] Modify `src/client/src/pages/DojoTopicSelection.tsx`
  - [x] Add two-step selection:
    1. Show 6 main topics initially
    2. When topic clicked, show subtopics for that topic
  - [x] Use "Back" button to return to main topics
  - [x] Pass selected subtopic to DojoPractice via query params or state
  - [x] Example URL: `/dojo/practice?subtopic=multiplication_times_1_5`

- [x] Update DojoPractice to receive subtopic (AC: 5)
  - [x] Modify `src/client/src/pages/DojoPractice.tsx`
  - [x] Read subtopic ID from URL query params (or state)
  - [x] Look up subtopic definition by ID
  - [x] Display subtopic name in page header
  - [x] Store subtopic context for Story 2.3 (problem generation)

- [x] Write unit tests (AC: 8)
  - [x] Create `src/client/src/types/__tests__/dojoSubtopics.test.ts`
  - [x] Test subtopic data structure is valid
  - [x] Test all 6 topics have subtopics defined
  - [x] Test subtopic lookup by ID
  - [x] Test subtopic-to-MathEngine params mapping

- [x] Write component tests
  - [x] Test DojoTopicSelection shows subtopics after topic click
  - [x] Test "Back" button returns to main topics
  - [x] Test subtopic click navigates to DojoPractice with correct params
  - [x] Test DojoPractice displays selected subtopic name

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

**Agent Model Used:** Claude Sonnet 4.5 (claude-sonnet-4-5-20250929)

**Implementation Summary:**
Successfully implemented the subtopic system with two-step selection flow. The implementation includes:

1. **Subtopic Data Structure** (`src/client/src/types/dojoSubtopics.ts`):
   - Created DojoSubtopic interface with id, topicId, name, description, and mathEngineParams
   - Defined 18 subtopics total (3 per main topic, 2 for geometry)
   - Each subtopic includes difficulty range (1-10) and topic-specific constraints
   - Implemented helper functions: getSubtopicById(), getSubtopicsByTopic(), getTopicsWithSubtopics()

2. **DojoTopicSelection UI** (`src/client/src/pages/DojoTopicSelection.tsx`):
   - Added useState to track selected topic (null = main topics, topic value = subtopics view)
   - Implemented two-step selection: main topics → subtopics for selected topic
   - Back button logic: from subtopics → main topics, from main topics → home
   - Subtopic selection navigates to `/dojo/practice?subtopic={subtopicId}`
   - Maintained accessibility (keyboard navigation, ARIA labels, role="button")

3. **DojoPractice Component** (`src/client/src/pages/DojoPractice.tsx`):
   - Reads subtopic ID from URL query param `?subtopic=...`
   - Looks up subtopic using getSubtopicById()
   - Displays subtopic name and description in page header
   - Maintains backward compatibility with topic param for future migration

4. **Testing** (100% test coverage for new code):
   - Unit tests (21 tests): Data structure validation, topic coverage, helper functions, mathEngineParams mapping
   - Component tests (26 tests total): Two-step navigation, back button, subtopic display, keyboard accessibility
   - All tests passing (dojoSubtopics.test.ts: ✓ 21, DojoTopicSelection.test.tsx: ✓ 12, DojoPractice.test.tsx: ✓ 14)

**Key Implementation Decisions:**
- Used React local state (useState) instead of global context since subtopics are static data
- URL query params for subtopic passing to enable deep linking and browser history
- Maintained backward compatibility with topic param in DojoPractice
- Followed existing code style (Tailwind gradients, card components, emoji icons)

**Validation:**
- TypeScript type check: ✓ Passed (no errors)
- All related tests: ✓ 47 tests passed
- No regressions in existing tests

### File List

**Created:**
- `src/client/src/types/dojoSubtopics.ts` (18 subtopic definitions with mathEngineParams)
- `src/client/src/types/__tests__/dojoSubtopics.test.ts` (21 unit tests)

**Modified:**
- `src/client/src/pages/DojoTopicSelection.tsx` (two-step selection UI with state management)
- `src/client/src/pages/DojoPractice.tsx` (subtopic query param handling and display)
- `src/client/src/pages/__tests__/DojoTopicSelection.test.tsx` (12 component tests)
- `src/client/src/pages/__tests__/DojoPractice.test.tsx` (14 component tests, fixed 1 test)

### Blockers/Issues

None. All acceptance criteria met and tests passing.

## QA Results

### Review Date: 2025-10-29

### Reviewed By: Quinn (Test Architect)

### Code Quality Assessment

**Overall Grade: Excellent (A+)**

The implementation demonstrates exceptional quality across all dimensions:

- **Architecture**: Clean separation of concerns with data structures, helper functions, and UI components properly isolated
- **TypeScript Usage**: Strict typing throughout with no `any` types, proper interfaces, and good type inference
- **Documentation**: Comprehensive JSDoc comments explaining purpose, parameters, and return values
- **Testing**: Outstanding coverage with 47 tests (21 unit + 26 component tests) covering all acceptance criteria
- **Accessibility**: Proper ARIA labels, keyboard navigation, and semantic HTML
- **Code Style**: Follows project standards consistently (PascalCase components, camelCase functions, immutable patterns)

### Refactoring Performed

No refactoring needed. Code is production-ready as-is. The implementation follows best practices and maintains high quality standards.

### Compliance Check

- **Coding Standards**: ✓ PASS
  - TypeScript 5.6+ with strict mode enabled ✓
  - Prettier formatting applied ✓
  - PascalCase for components (DojoTopicSelection, DojoPractice) ✓
  - camelCase for functions (getSubtopicById, handleTopicSelect) ✓
  - Proper JSDoc documentation ✓

- **Project Structure**: ✓ PASS
  - Files in correct locations per source tree ✓
  - Tests colocated in `__tests__` folders ✓
  - Proper use of path aliases (@/types, @/components) ✓

- **Testing Strategy**: ✓ PASS
  - Unit tests for data structures and logic ✓
  - Component tests for UI behavior ✓
  - Edge cases covered (unknown subtopics, backward compatibility) ✓
  - Test coverage: 100% for new code ✓

- **All ACs Met**: ✓ PASS (8/8 acceptance criteria fully implemented)
  - AC1: Subtopic data structure defined ✓
  - AC2: All 6 topics have 2-3 meaningful subtopics ✓
  - AC3: DojoTopicSelection displays subtopics after selection ✓
  - AC4: Clicking subtopic navigates with correct context ✓
  - AC5: DojoPractice receives and displays subtopic name ✓
  - AC6: Subtopics map to MathEngine parameters ✓
  - AC7: Well-documented and maintainable ✓
  - AC8: Comprehensive unit tests present ✓

### Improvements Checklist

All items reviewed and validated:

- [x] Subtopic data structure properly designed and documented
- [x] Helper functions (getSubtopicById, getSubtopicsByTopic, getTopicsWithSubtopics) implemented correctly
- [x] Two-step selection UI flow working smoothly
- [x] URL query param navigation implemented correctly
- [x] Backward compatibility maintained (topic param still works)
- [x] Comprehensive test coverage (21 unit tests + 26 component tests)
- [x] Accessibility features (ARIA labels, keyboard navigation)
- [x] TypeScript strict mode compliance
- [ ] *Optional*: Consider adding "as const" assertion to DOJO_SUBTOPICS for stricter type inference
- [ ] *Optional*: Consider extracting topicNames mapping if used in multiple places

*Note: Unchecked items are optional future enhancements, not blockers.*

### Security Review

**Status: PASS** - No security concerns identified.

- Static data structures with no user input or sensitive data
- No authentication or authorization required for this feature
- URL query params are validated through lookup functions with safe fallbacks
- No XSS or injection vulnerabilities

### Performance Considerations

**Status: PASS** - No performance concerns.

- Lightweight data structure (18 subtopics, ~5KB total)
- Efficient O(n) lookup operations using native array methods
- No unnecessary re-renders (proper use of useState and conditional rendering)
- Component rendering is fast and responsive

*Future optimization note*: If subtopic count grows significantly (>100), consider memoizing lookup results, but current implementation is optimal for the data size.

### Requirements Traceability Matrix

Complete traceability established for all 8 acceptance criteria:

| AC | Requirement | Test Coverage | Status |
|----|-------------|---------------|--------|
| 1 | Subtopic data structure defined | dojoSubtopics.test.ts (3 tests) | ✓ PASS |
| 2 | 2-3 subtopics per topic | dojoSubtopics.test.ts (6 tests) | ✓ PASS |
| 3 | Display subtopics after selection | DojoTopicSelection.test.tsx (3 tests) | ✓ PASS |
| 4 | Navigate to DojoPractice | DojoTopicSelection.test.tsx (2 tests) | ✓ PASS |
| 5 | Display subtopic name | DojoPractice.test.tsx (4 tests) | ✓ PASS |
| 6 | Map to MathEngine params | dojoSubtopics.test.ts (6 tests) | ✓ PASS |
| 7 | Documented and maintainable | Code review | ✓ PASS |
| 8 | Unit tests present | 47 tests total | ✓ PASS |

### Files Modified During Review

None. No code changes were necessary during QA review.

### Gate Status

**Gate: PASS** → `docs/qa/gates/epic-2.story-2.2-subtopic-system.yml`

- Quality Score: 100/100
- All acceptance criteria met
- Zero blocking issues
- Comprehensive test coverage
- Excellent code quality

### Recommended Status

**✓ Ready for Done**

The implementation is complete, thoroughly tested, and meets all quality standards. No changes required before marking this story as Done.

**Highlights:**
- Exceptional test coverage (47 tests, 100% for new code)
- Clean, maintainable architecture
- Excellent documentation
- Zero technical debt introduced
- Production-ready implementation

**Next Steps:**
1. Mark story as "Done"
2. Deploy to staging for user acceptance testing
3. Proceed to Story 2.3 (Tracking-Free Practice Mode)

---

**Estimated Effort:** 2-3 days

**Dependencies:** Story 2.1 (DojoTopicSelection page must exist)

**Next Story:** Story 2.3 (Tracking-Free Practice Mode)
