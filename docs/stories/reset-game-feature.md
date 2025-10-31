# User Story: Game Reset Feature

**Story ID:** STORY-RESET-001
**Created:** 2025-10-31
**Status:** Ready for Development
**Estimated Effort:** 2-4 hours

---

## User Story

Als **Benutzer (Kind oder Elternteil)**,
möchte ich **das Spiel komplett zurücksetzen können**,
so dass **ich von vorne anfangen kann und alle Fortschritte, freigeschalteten Items und den Charakter-Zustand zurückgesetzt werden**.

---

## Story Context

### Existing System Integration

- **Integrates with:** `AppContext` (state management), `db.ts` (IndexedDB service), `initialData.ts` (default data)
- **Technology:** React Context API, IndexedDB, TypeScript, Shadcn/ui components
- **Follows pattern:** Async context methods with error handling, confirmation dialogs for destructive actions
- **Touch points:**
  - `src/client/src/contexts/AppContext.tsx` - Add `resetGame()` method
  - `src/client/src/lib/db.ts` - Use existing `clearAllData()` method
  - `src/client/src/pages/Styling.tsx` or new Settings component - Add reset button
  - `src/client/src/lib/initialData.ts` - Use for reset values

---

## Acceptance Criteria

### Functional Requirements

1. A "Spiel zurücksetzen" (Reset Game) button is accessible from the main menu/settings
2. Clicking the reset button shows a confirmation dialog with clear warning message in German
3. Upon confirmation, all data is reset:
   - All styling items reset to initial locked/unlocked state
   - User progress reset to initial values (difficulty level 1, counters at 0)
   - Character state reset (no applied items)
   - IndexedDB cleared and re-seeded with initial data

### Integration Requirements

4. Existing `db.clearAllData()` method is used to clear IndexedDB stores
5. New `resetGame()` method added to AppContext follows existing async pattern
6. Reset functionality integrates with existing initialization logic (`initializeApp()`)
7. UI updates immediately after reset completes

### Quality Requirements

8. Reset operation includes proper error handling with user-friendly error messages
9. Confirmation dialog prevents accidental data loss
10. Tests verify reset functionality restores initial state correctly
11. Loading state shown during reset operation

---

## Technical Notes

### Integration Approach

Add `resetGame()` method to `AppContext` that:
1. Calls `db.clearAllData()` to clear all stores
2. Calls `db.saveStylingItems(initialStylingItems)` to restore initial items
3. Calls `db.saveUserProgress(initialUserProgress)` to restore initial progress
4. Calls `db.saveCharacterState({ appliedItems: [] })` to clear character
5. Updates React state via `refreshStylingItems()` and `refreshUserProgress()`

### Existing Pattern Reference

- Follow `updateUserProgress()` pattern: async operation → DB save → refresh state
- Use Shadcn AlertDialog component for confirmation (consistent with existing UI)
- Error handling pattern from `initializeApp()` method

### Key Constraints

- Must be accessible but not too prominent (prevent accidental clicks)
- Confirmation dialog required (destructive action)
- Operation must be atomic (all-or-nothing)
- Works offline (client-side only)

---

## Definition of Done

- [ ] "Spiel zurücksetzen" button added to settings/menu UI
- [ ] Confirmation dialog implemented with clear German warning
- [ ] `resetGame()` method added to AppContext with full implementation
- [ ] All IndexedDB stores cleared and reinitialized on reset
- [ ] UI updates immediately showing initial state
- [ ] Error handling covers all failure scenarios
- [ ] Unit tests for `resetGame()` method
- [ ] Component tests for reset button and confirmation dialog
- [ ] Manual testing confirms full reset works correctly
- [ ] No regressions in existing functionality

---

## Risk and Compatibility Check

### Minimal Risk Assessment

- **Primary Risk:** User accidentally resets game and loses all progress
- **Mitigation:**
  - Require explicit confirmation dialog with clear warning
  - Use distinct, non-prominent button placement
  - Consider adding "Are you absolutely sure?" second confirmation for extra safety
- **Rollback:** No technical rollback needed (user action), but could add "Export progress" feature in future

### Compatibility Verification

- [x] No breaking changes to existing APIs
- [x] Database changes are clearing existing data (intentional, user-initiated)
- [x] UI changes follow existing Shadcn/ui design patterns
- [x] Performance impact is negligible (one-time operation)

---

## Implementation Details

### Files to Modify

1. **`src/client/src/contexts/AppContext.tsx`**
   - Add `resetGame()` method to context interface
   - Implement reset logic following existing patterns
   - Export method via context provider

2. **`src/client/src/pages/Styling.tsx`** (or create new Settings component)
   - Add reset button to UI
   - Add confirmation dialog
   - Wire up to `resetGame()` method

3. **`src/client/src/contexts/__tests__/AppContext.test.tsx`**
   - Add tests for `resetGame()` method

### UI Mockup (Confirmation Dialog)

```
┌─────────────────────────────────────────┐
│  Spiel zurücksetzen?                    │
├─────────────────────────────────────────┤
│                                         │
│  ⚠️ Warnung: Alle Fortschritte gehen   │
│  verloren!                              │
│                                         │
│  Dies löscht:                           │
│  • Alle freigeschalteten Items          │
│  • Deinen gesamten Fortschritt          │
│  • Deine Charakter-Gestaltung           │
│                                         │
│  Möchtest du wirklich neu anfangen?     │
│                                         │
│     [Abbrechen]  [Zurücksetzen]         │
└─────────────────────────────────────────┘
```

---

## Success Criteria

The story is successfully completed when:

1. User can easily find and click the reset button
2. Confirmation dialog clearly explains consequences
3. After confirmation, all game data is completely reset
4. App immediately reflects initial state (locked items, level 1 difficulty)
5. No errors occur during reset operation
6. All tests pass
7. No regressions in existing functionality

---

## Related Documentation

- PRD: `docs/prd.md` - Functional requirements
- Architecture: `docs/architecture.md` - Data models and patterns
- CLAUDE.md: Project structure and conventions

---

## Notes

- This is a brownfield enhancement to existing system
- Follows existing patterns exactly (no new architecture needed)
- Uses existing `clearAllData()` method from db.ts:137
- Consider adding "Export/Import Progress" feature in future for backup before reset
