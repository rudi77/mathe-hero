# BUG-3: Items können mehrfach platziert werden - Brownfield Bug Fix

## Status

**Todo**

## User Story

Als ein **Kind-Benutzer**,
möchte ich **dass jedes Item nur einmal auf meinem Charakter platziert wird**,
damit **mein Charakter nicht komisch aussieht mit mehreren identischen Items übereinander**.

## Story Context

**Existing System Integration:**

- Integrates with: Styling page, CharacterDisplay component, CharacterState management
- Technology: React state management, AppContext
- Follows pattern: Click-to-apply item system with appliedItems array
- Touch points: Styling.tsx (handleCharacterClick), CharacterDisplay.tsx (renders items), AppContext.tsx (manages character state)

**Problem Description:**

Wenn ein Benutzer ein Item aus der Palette auswählt und mehrfach auf den Charakter-Kopf klickt, wird das gleiche Item mehrfach platziert. Dies führt zu:
1. **Visueller Unordnung** - Mehrere identische Items übereinander (z.B. 5 Schleifen)
2. **Verwirrung** - Benutzer weiß nicht, ob Items angewendet wurden oder nicht
3. **Inkonsistente UX** - Erwartet wird "ein Item = eine Platzierung"

**Root Cause:**

In `Styling.tsx` (handleCharacterClick, Zeile 41-43) wird bei jedem Klick ein neues `AppliedStyling`-Objekt erstellt und zum `appliedItems`-Array hinzugefügt:

```typescript
updateCharacterState({
  appliedItems: [...characterState.appliedItems, newAppliedItem],
});
```

Es gibt keine Prüfung, ob das Item bereits angewendet wurde. Jedes Klick führt zu einem neuen Array-Eintrag.

## Acceptance Criteria

**Functional Requirements:**

1. Ein Item kann nur einmal gleichzeitig auf dem Charakter platziert werden.
2. Wenn ein bereits platziertes Item erneut ausgewählt und angeklickt wird, wird die Position des existierenden Items aktualisiert (nicht dupliziert).
3. Visuelle Feedback zeigt an, wenn ein Item bereits platziert ist (optional: Item-Badge in Palette).

**Integration Requirements:**

4. Existing character state management (appliedItems array) continues to work.
5. New duplicate-prevention logic follows existing React state update patterns.
6. Integration with CharacterDisplay rendering maintains current behavior (no visual changes beyond preventing duplicates).

**Quality Requirements:**

7. Component test verifies duplicate prevention logic.
8. Manual testing confirms no duplicate items can be placed.
9. No regression in existing item application functionality (clear all, color application, etc.).

## Technical Notes

- **Integration Approach:**
  - Before adding item to `appliedItems`, check if `itemId` already exists in array
  - If exists: Update position of existing item (replace in array)
  - If not exists: Add new item to array
  - Use `array.find()` to locate existing item, then `array.map()` to replace or `array.filter()` + push pattern

- **Existing Pattern Reference:**
  - `updateCharacterState()` already handles state updates via AppContext
  - Array immutability is already maintained (using spread operator)
  - Follow same pattern, add duplicate check before spread operation

- **Key Constraints:**
  - Must maintain array immutability (React best practice)
  - Must not break "Alles löschen" (clear all) functionality
  - Should work for all item types (accessories, effects, etc.)

- **Files to Modify:**
  - `src/client/src/pages/Styling.tsx` (update handleCharacterClick logic)
  - Potentially: Add helper function `applyOrUpdateItem()` for clarity

## Definition of Done

- [x] Functional requirements met (no duplicate items, position updates work)
- [x] Integration requirements verified (character state management unchanged)
- [x] Manual testing: Click same item multiple times, verify only one instance exists
- [x] Code follows existing patterns (React immutability, context updates)
- [x] Tests pass (existing and new)
- [x] No regression in "clear all" or color application features

## Risk and Compatibility Check

**Minimal Risk Assessment:**

- **Primary Risk:** Logic error could prevent items from being applied at all
- **Mitigation:** Thorough testing with all item types, fallback to add if update fails
- **Rollback:** Revert handleCharacterClick logic if items can't be applied

**Compatibility Verification:**

- [x] No breaking changes to existing APIs (only changing item application logic)
- [x] Database changes: None (character state structure unchanged)
- [x] UI changes follow existing design patterns (no visual changes, behavior fix)
- [x] Performance impact is negligible (single array lookup per click)

## Implementation Guidance

### Recommended Solution:

**Update handleCharacterClick in Styling.tsx:**

```typescript
const handleCharacterClick = (e: React.MouseEvent<HTMLDivElement>) => {
  if (!selectedItem || selectedItem.type === 'color') return;

  const rect = e.currentTarget.getBoundingClientRect();
  const x = ((e.clientX - rect.left) / rect.width) * 100;
  const y = ((e.clientY - rect.top) / rect.height) * 100;

  const newAppliedItem: AppliedStyling = {
    itemId: selectedItem.id,
    position: { x, y },
    scale: 1,
    rotation: 0,
  };

  // Check if item already exists
  const existingIndex = characterState.appliedItems.findIndex(
    item => item.itemId === selectedItem.id
  );

  let updatedItems: AppliedStyling[];
  
  if (existingIndex !== -1) {
    // Update existing item position
    updatedItems = characterState.appliedItems.map((item, index) =>
      index === existingIndex ? newAppliedItem : item
    );
  } else {
    // Add new item
    updatedItems = [...characterState.appliedItems, newAppliedItem];
  }

  updateCharacterState({
    appliedItems: updatedItems,
  });
};
```

### Alternative Approach (More Functional):

```typescript
const handleCharacterClick = (e: React.MouseEvent<HTMLDivElement>) => {
  if (!selectedItem || selectedItem.type === 'color') return;

  const rect = e.currentTarget.getBoundingClientRect();
  const x = ((e.clientX - rect.left) / rect.width) * 100;
  const y = ((e.clientY - rect.top) / rect.height) * 100;

  const newAppliedItem: AppliedStyling = {
    itemId: selectedItem.id,
    position: { x, y },
    scale: 1,
    rotation: 0,
  };

  // Remove existing item if present, then add new one
  const updatedItems = [
    ...characterState.appliedItems.filter(item => item.itemId !== selectedItem.id),
    newAppliedItem,
  ];

  updateCharacterState({
    appliedItems: updatedItems,
  });
};
```

### Testing Approach:

1. **Manual Testing:**
   - Select an item (e.g., "Rosa Schleife")
   - Click on character head 5 times
   - Verify only ONE item appears (not 5)
   - Click different location
   - Verify item moves to new location (not duplicates)
   - Test with different item types (accessories, effects)

2. **Automated Testing:**
   - Component test for Styling with mocked AppContext
   - Simulate multiple clicks with same item
   - Assert appliedItems array length === 1
   - Assert item position is updated

## Estimated Effort

**1-2 hours** (Simple logic change, straightforward implementation)

## Priority

**🔴 HIGH** - User-facing bug that creates visual confusion and poor UX

## Related Issues

- Story 1.5: Styling Integration (original item application logic)
- Story 1.11: Child-Friendly UX Polish (visual quality matters for children)
- BUG-2: Item positioning (related to item application flow)

## Additional Notes

### Future Enhancement Ideas (Out of Scope for This Bug Fix):

- **Item Categories:** Some items might allow multiples (e.g., stickers), others only one (e.g., glasses)
  - Could add `allowMultiple: boolean` to StylingItem metadata
  - For now, assume all items are single-instance

- **Visual Feedback:** Show badge/indicator in palette when item is already applied
  - Could add "Applied ✓" label or highlight
  - Defer to future UX enhancement story

- **Remove Item Action:** Right-click or double-click to remove item
  - Currently users must use "Alles löschen" to remove items
  - Defer to future feature story

---

**Created:** 2025-10-26
**By:** PM John
**Epic:** Epic 1 - MVP Core (Bug Fix)

