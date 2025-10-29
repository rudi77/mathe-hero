# Story 2.3: Tracking-Free Practice Mode

## Status

**Ready for Development** 🟢

## Story

**As a** User (Child),
**I want** to solve unlimited math problems in the Trainings-Dojo without triggering rewards or saving my progress,
**so that** I can practice in a distraction-free, pressure-free environment.

## Acceptance Criteria

1. DojoPractice generates problems using MathEngine based on selected subtopic
2. Problems align with subtopic's difficulty range and constraints
3. User can input answers via keyboard or on-screen input
4. Immediate feedback is shown for correct/incorrect answers
5. Next problem generates automatically after correct answer
6. "Nächste Aufgabe" (Next Problem) button allows skipping problems
7. **NO database writes occur** during Dojo practice sessions
8. **NO reward notifications** are triggered
9. Optional in-memory streak counter displays (not persisted)
10. "Exit" button returns to DojoTopicSelection without saving progress
11. Unit tests verify problem generation and answer checking logic
12. Component tests verify UI interactions
13. Manual QA verifies zero IndexedDB writes during Dojo session

## Tasks / Subtasks

- [ ] Implement problem generation in DojoPractice (AC: 1, 2)
  - [ ] Import and instantiate MathEngine in `DojoPractice.tsx`
  - [ ] Read selected subtopic from props/params (from Story 2.2)
  - [ ] Look up subtopic definition to get `mathEngineParams`
  - [ ] Generate problem using MathEngine with subtopic constraints
  - [ ] Store current problem in component state
  - [ ] Handle problem generation errors gracefully

- [ ] Implement answer input (AC: 3)
  - [ ] Add input field (text or number type)
  - [ ] Support keyboard input (Enter key submits)
  - [ ] Optional: Add on-screen number pad for touch devices
  - [ ] Validate input (only numbers allowed)
  - [ ] Clear input after answer submission

- [ ] Implement answer checking and feedback (AC: 4, 5)
  - [ ] Check user answer against `problem.correctAnswer`
  - [ ] Show immediate feedback:
    - Correct: Green checkmark, "Richtig!" message
    - Incorrect: Red X, "Versuch es nochmal!" message, show correct answer
  - [ ] Auto-generate next problem after correct answer (1-2 second delay)
  - [ ] For incorrect answer, allow retry or skip

- [ ] Implement "Nächste Aufgabe" skip button (AC: 6)
  - [ ] Add button below problem area
  - [ ] On click: Generate new problem immediately
  - [ ] Clear current input and feedback
  - [ ] Optional: Track skip count (in-memory, not persisted)

- [ ] Implement in-memory streak counter (AC: 9, optional)
  - [ ] Add state variable: `streakCount`
  - [ ] Increment on correct answer
  - [ ] Reset on incorrect answer or skip
  - [ ] Display in UI: "Richtige Antworten hintereinander: 3"
  - [ ] Counter resets when exiting Dojo (not persisted)

- [ ] Ensure NO database writes (AC: 7, 8)
  - [ ] **CRITICAL:** Do NOT import `RewardManager`
  - [ ] Do NOT import `db` service methods (`updateUserProgress`, etc.)
  - [ ] Do NOT call `AppContext.updateUserProgress()`
  - [ ] Do NOT call `AppContext.updateStylingItem()`
  - [ ] Add comment in code: "// Dojo Mode: No DB writes or rewards"

- [ ] Implement exit functionality (AC: 10)
  - [ ] "Exit" or "Zurück" button in header
  - [ ] On click: Navigate to `/dojo` (DojoTopicSelection)
  - [ ] No confirmation dialog needed (no progress to lose)
  - [ ] Clear component state on unmount

- [ ] Write unit tests (AC: 11)
  - [ ] Create `src/client/src/pages/__tests__/DojoPractice.test.tsx`
  - [ ] Test problem generation with subtopic params
  - [ ] Test answer checking (correct/incorrect)
  - [ ] Test streak counter increments and resets
  - [ ] Test skip button generates new problem
  - [ ] Mock MathEngine to control problem generation

- [ ] Write component tests (AC: 12)
  - [ ] Test problem displays correctly
  - [ ] Test input field accepts numbers
  - [ ] Test submit button/Enter key checks answer
  - [ ] Test feedback messages appear (correct/incorrect)
  - [ ] Test "Nächste Aufgabe" button works
  - [ ] Test "Exit" button navigates to `/dojo`

- [ ] Manual QA: Verify NO database writes (AC: 13)
  - [ ] Open DevTools → Application → IndexedDB
  - [ ] Open `mathe_stylistin_db` database
  - [ ] Note current state of `user_progress` and `styling_items` stores
  - [ ] Use Dojo for 10-20 problems (mix correct/incorrect)
  - [ ] Verify `user_progress` unchanged (no new data)
  - [ ] Verify `styling_items` unchanged (no unlocks)
  - [ ] Verify no new records created

- [ ] Manual QA: Verify existing reward flow still works (AC: 13)
  - [ ] Exit Dojo, go to normal practice mode (Styling → Topic → Practice)
  - [ ] Solve 5 problems correctly
  - [ ] Verify reward notification appears
  - [ ] Verify item unlocks in IndexedDB
  - [ ] Confirm Dojo did not interfere with normal flow

## Dev Notes

### Relevant Architecture

**MathEngine Integration:**
- MathEngine is a class: `const engine = new MathEngine()`
- Generate problem: `engine.generateProblem(topic, difficulty)`
- Problem object: `{ question, correctAnswer, type, options?, difficulty }`
- MathEngine is stateless (no side effects)

**NO Database Writes:**
- This is the MOST CRITICAL requirement
- Do NOT import or call:
  - `db.updateUserProgress()`
  - `db.updateStylingItem()`
  - `RewardManager.shouldUnlockItem()`
  - `AppContext.updateUserProgress()`
  - `AppContext.updateStylingItem()`

**State Management:**
- Use React `useState` for local state only:
  - Current problem
  - User input
  - Streak count
  - Feedback message
- All state is ephemeral (cleared on exit)

### Reference Files

**For MathEngine Usage:**
- `src/client/src/pages/MathTask.tsx` - Shows how to use MathEngine
- `src/client/src/lib/mathEngine.ts` - MathEngine class definition

**For Answer Checking:**
- `src/client/src/pages/MathTask.tsx` - Answer checking logic to reuse

**For UI Components:**
- Reuse components from MathTask where possible:
  - Problem display
  - Input field
  - Feedback messages

### Component Structure

```typescript
// DojoPractice.tsx (simplified)
import { MathEngine } from '@/lib/mathEngine';
import { getSubtopicById } from '@/types/dojoSubtopics';

export default function DojoPractice() {
  const [problem, setProblem] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [streak, setStreak] = useState(0);

  // Read subtopic from URL params
  const subtopicId = new URLSearchParams(window.location.search).get('subtopic');
  const subtopic = getSubtopicById(subtopicId);

  useEffect(() => {
    if (subtopic) {
      generateNewProblem();
    }
  }, [subtopic]);

  const generateNewProblem = () => {
    const engine = new MathEngine();
    const difficulty = Math.random() * (subtopic.mathEngineParams.difficultyMax - subtopic.mathEngineParams.difficultyMin) + subtopic.mathEngineParams.difficultyMin;
    const newProblem = engine.generateProblem(subtopic.topicId, difficulty);
    setProblem(newProblem);
    setUserAnswer('');
    setFeedback(null);
  };

  const handleSubmit = () => {
    if (userAnswer === problem.correctAnswer.toString()) {
      setFeedback({ correct: true, message: 'Richtig!' });
      setStreak(prev => prev + 1);
      setTimeout(() => generateNewProblem(), 2000);
    } else {
      setFeedback({ correct: false, message: `Nicht ganz. Die richtige Antwort ist ${problem.correctAnswer}` });
      setStreak(0);
    }
  };

  const handleSkip = () => {
    generateNewProblem();
    setStreak(0);
  };

  return (
    <div>
      <header>
        <h1>{subtopic?.name}</h1>
        <button onClick={() => window.location.href = '/dojo'}>Exit</button>
      </header>

      <div>
        <p>{problem?.question}</p>
        <input
          type="number"
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
        />
        <button onClick={handleSubmit}>Prüfen</button>
      </div>

      {feedback && (
        <div className={feedback.correct ? 'text-green-600' : 'text-red-600'}>
          {feedback.message}
        </div>
      )}

      <div>
        <p>Streak: {streak}</p>
        <button onClick={handleSkip}>Nächste Aufgabe</button>
      </div>
    </div>
  );
}
```

### MathEngine Subtopic Integration

**Mapping Subtopic Params to MathEngine:**

Example for "Einmaleins 1-5":
```typescript
const subtopic = {
  mathEngineParams: {
    difficultyMin: 1,
    difficultyMax: 5,
    constraints: { maxMultiplier: 5 }
  }
};

// Generate problem with random difficulty in range
const difficulty = Math.random() * (subtopic.mathEngineParams.difficultyMax - subtopic.mathEngineParams.difficultyMin) + subtopic.mathEngineParams.difficultyMin;

const engine = new MathEngine();
const problem = engine.generateProblem('multiplication', difficulty);

// Apply constraints (if needed)
// For MVP, MathEngine's difficulty should handle this
// Future: Pass constraints to MathEngine
```

**Note:** If MathEngine doesn't support all constraints, document limitations and implement workarounds (e.g., regenerate problem if it doesn't meet constraints).

### Testing Strategy

**Unit Tests:**
```typescript
describe('DojoPractice Problem Generation', () => {
  test('generates problem based on subtopic', () => {
    // Mock subtopic and MathEngine
    // Assert problem is generated with correct topic and difficulty
  });

  test('streak increments on correct answer', () => {
    // Simulate correct answer
    // Assert streak increases
  });

  test('streak resets on incorrect answer', () => {
    // Simulate incorrect answer
    // Assert streak resets to 0
  });

  test('skip button generates new problem', () => {
    // Click skip button
    // Assert new problem generated
  });
});
```

**Component Tests:**
```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import DojoPractice from '../DojoPractice';

test('displays problem question', () => {
  render(<DojoPractice />);
  expect(screen.getByText(/Was ist/i)).toBeInTheDocument();
});

test('checks answer and shows feedback', async () => {
  render(<DojoPractice />);
  const input = screen.getByRole('textbox');
  const submitButton = screen.getByText('Prüfen');

  fireEvent.change(input, { target: { value: '12' } });
  fireEvent.click(submitButton);

  await waitFor(() => {
    expect(screen.getByText(/Richtig|Nicht ganz/i)).toBeInTheDocument();
  });
});
```

**Manual QA Checklist:**
- [ ] Open DevTools → Application → IndexedDB → `mathe_stylistin_db`
- [ ] Note current state of `user_progress` (id: 1)
- [ ] Note current state of `styling_items` (count of `isUnlocked: true`)
- [ ] Enter Dojo mode, select subtopic
- [ ] Solve 20 problems (10 correct, 10 incorrect)
- [ ] Return to IndexedDB, verify NO changes to `user_progress`
- [ ] Verify NO changes to `styling_items` (no new unlocks)
- [ ] Exit Dojo, go to normal practice
- [ ] Solve 5 problems correctly
- [ ] Verify reward notification appears
- [ ] Verify item unlocks in IndexedDB

### Critical Code Review Checklist

Before merging Story 2.3:
- [ ] `DojoPractice.tsx` does NOT import `RewardManager`
- [ ] `DojoPractice.tsx` does NOT import `db` service
- [ ] `DojoPractice.tsx` does NOT call `AppContext.updateUserProgress()`
- [ ] `DojoPractice.tsx` does NOT call `AppContext.updateStylingItem()`
- [ ] Comment in code: "// Dojo Mode: No DB writes or rewards"
- [ ] Manual QA confirms zero DB writes
- [ ] Existing reward flow still works (tested manually)

## Change Log

| Date | Version | Description | Author |
|------|---------|-------------|--------|
| 2025-10-29 | 1.0 | Initial story creation for Epic 2 | PM John |

## Dev Agent Record

### Implementation Notes

*[To be filled by dev agent during implementation]*

### File List

**To Be Modified:**
- `src/client/src/pages/DojoPractice.tsx` (implement practice logic)

**To Be Created:**
- `src/client/src/pages/__tests__/DojoPractice.test.tsx` (component tests)

### Blockers/Issues

*[To be filled during implementation if issues arise]*

**Known Potential Issues:**
1. MathEngine may not support all subtopic constraints (e.g., "maxMultiplier")
   - **Mitigation:** Document limitations, implement filtering if needed
2. Difficulty mapping from subtopic params to MathEngine may need tuning
   - **Mitigation:** Test with real problems, adjust params in Story 2.2

## QA Results

**Status:** Pending

**Manual QA Required:**
- [ ] Zero database writes verified via IndexedDB inspection
- [ ] Existing reward flow verified (normal practice still triggers unlocks)
- [ ] 20+ problems tested in Dojo (mix of correct/incorrect)
- [ ] All subtopics tested (at least 1-2 per topic)

*[To be filled by QA agent after implementation]*

---

**Estimated Effort:** 2-3 days

**Dependencies:** Story 2.2 (Subtopic system must be complete)

**Epic Completion:** This is the final story in Epic 2

---

## ⚠️ CRITICAL WARNING

**This story involves implementing a NO-TRACKING mode.**

**FAILURE to prevent database writes will result in:**
- Unintended item unlocks during Dojo practice
- Confusion for users (items unlocking when they shouldn't)
- Corruption of progress tracking (incorrect stats)

**Verification is MANDATORY:**
- Manual IndexedDB inspection REQUIRED before marking story complete
- Code review MUST confirm zero DB write calls
- QA sign-off REQUIRED

**When in doubt, verify again.**
