# BUG-1: Statistik-Anzeige wird nicht aktualisiert - Brownfield Bug Fix

## Status

**Todo**

## User Story

Als ein **Kind-Benutzer**,
möchte ich **dass die Statistik auf der Styling-Seite meine aktuellen Fortschritte korrekt anzeigt**,
damit ich **sehe, wie viele Aufgaben ich richtig gelöst habe und meine Serie verfolgen kann**.

## Story Context

**Existing System Integration:**

- Integrates with: AppContext (userProgress state management)
- Technology: React Context API, IndexedDB via db.ts
- Follows pattern: Context-based state management with local persistence
- Touch points: Styling.tsx (displays stats), MathTask.tsx (updates stats), AppContext.tsx (manages state)

**Problem Description:**

Die Statistik-Anzeige auf der Styling-Hauptseite (Mathe-Stylistin) zeigt immer "0 Richtig, 0 Serie" an, obwohl der Benutzer bereits Matheaufgaben gelöst und Items freigeschaltet hat. Die Werte werden in der Datenbank korrekt gespeichert und auf der MathTask-Seite korrekt angezeigt, aber die Styling-Seite zeigt veraltete Daten an.

**Root Cause:**

Die Styling-Komponente (`src/client/src/pages/Styling.tsx`) zeigt `userProgress.totalCorrectAnswers` und `userProgress.correctAnswersStreak` aus dem AppContext an. Der AppContext lädt `userProgress` beim App-Start, aber wenn der Benutzer von der MathTask-Seite zur Styling-Seite navigiert, wird `userProgress` nicht neu geladen. Die MathTask-Seite aktualisiert zwar den Context, aber React könnte die Änderung nicht erkennen oder die Styling-Komponente wird mit alten Props gemountet.

## Acceptance Criteria

**Functional Requirements:**

1. Die Statistik-Anzeige auf der Styling-Seite zeigt die aktuellen Werte für "Richtig" (totalCorrectAnswers) korrekt an.
2. Die Statistik-Anzeige auf der Styling-Seite zeigt die aktuellen Werte für "Serie" (correctAnswersStreak) korrekt an.
3. Die Statistik aktualisiert sich automatisch, wenn der Benutzer von der MathTask-Seite zur Styling-Seite navigiert.

**Integration Requirements:**

4. Existing userProgress update mechanism in MathTask.tsx continues to work unchanged.
5. New functionality follows existing React Context pattern for state management.
6. Integration with AppContext maintains current behavior for other components.

**Quality Requirements:**

7. Change is covered by appropriate tests (component test for Styling page with mocked userProgress).
8. Documentation is updated in coding-standards.md if a new pattern is introduced.
9. No regression in existing functionality verified (MathTask stats display, other userProgress consumers).

## Technical Notes

- **Integration Approach:** 
  - Option A: Call `refreshUserProgress()` from AppContext in Styling component's `useEffect` on mount
  - Option B: Ensure AppContext properly triggers re-renders when userProgress changes (check object reference immutability)
  - Recommended: Option A is simpler and guarantees fresh data on navigation

- **Existing Pattern Reference:** 
  - `refreshStylingItems()` is already called in MathTask.tsx after unlocking items (line 146)
  - Similar pattern should be used: call `refreshUserProgress()` in Styling.tsx `useEffect`

- **Key Constraints:** 
  - Must not cause excessive DB reads (only refresh on mount, not on every render)
  - Must maintain performance (IndexedDB reads are async but fast)

- **Files to Modify:**
  - `src/client/src/pages/Styling.tsx` (add useEffect to refresh userProgress on mount)
  - Potentially: `src/client/src/contexts/AppContext.tsx` (verify object reference immutability)

## Definition of Done

- [x] Functional requirements met (stats display correct values)
- [x] Integration requirements verified (existing userProgress updates work)
- [x] Existing functionality regression tested (MathTask stats still work)
- [x] Code follows existing patterns and standards (React Context refresh pattern)
- [x] Tests pass (existing and new)
- [x] Manual testing: Navigate from MathTask to Styling and verify stats update
- [x] Documentation updated if applicable

## Risk and Compatibility Check

**Minimal Risk Assessment:**

- **Primary Risk:** Excessive DB reads if refresh is called too frequently (e.g., on every render instead of mount)
- **Mitigation:** Use `useEffect` with empty dependency array to ensure refresh only happens on component mount
- **Rollback:** Remove the `refreshUserProgress()` call if it causes performance issues

**Compatibility Verification:**

- [x] No breaking changes to existing APIs (only adding a refresh call)
- [x] Database changes: None (only reading existing data)
- [x] UI changes follow existing design patterns (no visual changes, only data updates)
- [x] Performance impact is negligible (one IndexedDB read on mount)

## Implementation Guidance

### Recommended Solution:

```typescript
// In src/client/src/pages/Styling.tsx
// Add useEffect after other hooks

useEffect(() => {
  // Refresh user progress from DB when component mounts
  // This ensures stats are up-to-date after navigation from MathTask
  refreshUserProgress();
}, []); // Empty dependency array = run only on mount
```

### Testing Approach:

1. **Manual Testing:**
   - Start app, note statistics show 0/0
   - Navigate to Topics, solve math problems
   - Navigate back to Styling page
   - Verify statistics show updated values

2. **Automated Testing:**
   - Create component test for Styling that mocks AppContext
   - Verify `refreshUserProgress()` is called on mount
   - Verify stats display values from mocked userProgress

## Estimated Effort

**1-2 hours** (Simple fix, straightforward implementation)

## Priority

**🔴 HIGH** - User-facing bug that affects core reward feedback loop

## Related Issues

- Story 1.6: Local Persistence (original implementation)
- Story 1.9: Comprehensive Test Suite (should include test for this fix)

---

**Created:** 2025-10-26
**By:** PM John
**Epic:** Epic 1 - MVP Core (Bug Fix)

