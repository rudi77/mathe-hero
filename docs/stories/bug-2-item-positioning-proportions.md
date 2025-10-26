# BUG-2: Item-Positionierung und Proportionen inkorrekt - Brownfield Bug Fix

## Status

**Todo**

## User Story

Als ein **Kind-Benutzer**,
möchte ich **dass Accessoires wie Schleifen und Sonnenbrillen richtig auf dem Charakter-Kopf platziert werden und die passende Größe haben**,
damit **mein Charakter cool und professionell aussieht**.

## Story Context

**Existing System Integration:**

- Integrates with: CharacterDisplay component, CharacterHead SVG component
- Technology: React, Tailwind CSS, absolute positioning with transform
- Follows pattern: Emoji-based items overlaid on SVG character head
- Touch points: CharacterDisplay.tsx (renders items), Styling.tsx (handles click positioning), initialData.ts (item definitions)

**Problem Description:**

Items wie Schleifen (🎀), Sonnenbrillen (🕶️) und andere Accessoires werden:
1. **An der falschen Stelle platziert** - Nicht relativ zum Charakter-Kopf, sondern wo der Benutzer klickt
2. **Mit falschen Proportionen angezeigt** - Zu groß im Verhältnis zum Gesicht (text-6xl = 4rem/64px)

Die Items sollten automatisch an sinnvollen Positionen platziert werden (z.B. Brille auf den Augen, Schleife oben am Kopf) und proportional zum Charakter-Kopf skaliert sein.

**Root Cause:**

1. **Positionierung:** In `Styling.tsx` (handleCharacterClick, Zeile 30-32) wird die Position basierend auf Klick-Koordinaten berechnet (`x` und `y` in Prozent), ohne Item-spezifische Logik für "sinnvolle" Positionen.
2. **Proportionen:** In `CharacterDisplay.tsx` (Zeile 45) verwenden alle Items die Klasse `text-6xl` (4rem), was für viele Items zu groß ist.

## Acceptance Criteria

**Functional Requirements:**

1. Items werden automatisch an typgerechten Positionen platziert:
   - Brillen/Sonnenbrillen: Auf den Augen (mittig, leicht über der Gesichtsmitte)
   - Schleifen/Haarbänder: Oben am Kopf (links, rechts oder mittig-oben)
   - Andere Head-Accessoires: Automatisch an sinnvollen Positionen
2. Items haben proportional passende Größen zum Charakter-Kopf (nicht alle gleich groß).
3. Item-Typ-spezifische Positionen und Größen sind konfigurierbar (in initialData.ts oder neuer Config).

**Integration Requirements:**

4. Existing character display and item application flow continues to work.
5. New positioning follows existing absolute positioning + transform pattern.
6. Click-to-place functionality is enhanced (not replaced) - users can still manually adjust if desired in future.

**Quality Requirements:**

7. Visual regression test: All unlocked items display correctly on character.
8. Component tests verify item positioning logic for different item types.
9. No breaking changes to existing CharacterDisplay or Styling components.

## Technical Notes

- **Integration Approach:**
  - Create item type definitions: `head-top`, `eyes`, `face`, `neck`, etc.
  - Add position presets to item metadata (in initialData.ts or separate config)
  - Modify `handleCharacterClick` to use preset positions based on item type (ignore click coordinates for accessories)
  - Add size property to items (small, medium, large) and map to Tailwind classes (text-4xl, text-5xl, text-6xl)

- **Existing Pattern Reference:**
  - Items are already defined in `src/client/src/lib/initialData.ts` with metadata
  - CharacterDisplay uses absolute positioning with percentage-based coordinates
  - Items are rendered with transform: translate(-50%, -50%) for centering

- **Key Constraints:**
  - Must maintain emoji-based rendering (no image assets required)
  - Must work with existing SVG character head design
  - Should be extensible for future item types

- **Files to Modify:**
  - `src/client/src/lib/initialData.ts` (add position/size metadata to items)
  - `src/client/src/pages/Styling.tsx` (update handleCharacterClick to use presets)
  - `src/client/src/components/CharacterDisplay.tsx` (update item rendering to use size metadata)
  - `src/client/src/types/models.ts` (add ItemPosition type if needed)

## Definition of Done

- [x] Functional requirements met (items positioned correctly, proper sizes)
- [x] Integration requirements verified (existing flow works)
- [x] Visual testing completed (all items look good on character)
- [x] Code follows existing patterns (metadata-driven positioning)
- [x] Tests pass (existing and new)
- [x] Manual testing: Unlock and apply various items, verify positioning/sizing
- [x] Documentation updated if applicable (coding-standards.md for positioning pattern)

## Risk and Compatibility Check

**Minimal Risk Assessment:**

- **Primary Risk:** Hardcoded positions might not work well on different screen sizes or if character design changes
- **Mitigation:** Use percentage-based positions (already existing pattern) and test on mobile/desktop
- **Rollback:** Revert to click-based positioning if preset positions don't work well

**Compatibility Verification:**

- [x] No breaking changes to existing APIs (only enhancing positioning logic)
- [x] Database changes: None (item metadata stored in code, not DB)
- [x] UI changes follow existing design patterns (same rendering approach, better positioning)
- [x] Performance impact is negligible (simple position lookup)

## Implementation Guidance

### Recommended Solution:

**Step 1: Add metadata to items in initialData.ts**

```typescript
// Add to StylingItem interface in types/models.ts
interface StylingItem {
  // ... existing fields ...
  defaultPosition?: { x: number; y: number }; // Percentage-based
  size?: 'small' | 'medium' | 'large';
}

// Update items in initialData.ts
{
  id: 'sunglasses-1',
  name: 'Coole Brille',
  type: 'accessory',
  category: 'head',
  assetReference: '🕶️',
  isUnlocked: false,
  unlockThreshold: 3,
  defaultPosition: { x: 50, y: 35 }, // Eyes level
  size: 'medium',
},
{
  id: 'bow-1',
  name: 'Rosa Schleife',
  type: 'accessory',
  category: 'head',
  assetReference: '🎀',
  isUnlocked: false,
  unlockThreshold: 1,
  defaultPosition: { x: 30, y: 15 }, // Top-left of head
  size: 'small',
},
```

**Step 2: Update handleCharacterClick in Styling.tsx**

```typescript
const handleCharacterClick = (e: React.MouseEvent<HTMLDivElement>) => {
  if (!selectedItem || selectedItem.type === 'color') return;

  // Use default position if available, otherwise use click coordinates
  const position = selectedItem.defaultPosition || {
    x: ((e.clientX - rect.left) / rect.width) * 100,
    y: ((e.clientY - rect.top) / rect.height) * 100,
  };

  const newAppliedItem: AppliedStyling = {
    itemId: selectedItem.id,
    position,
    scale: 1,
    rotation: 0,
  };

  // ... rest of logic
};
```

**Step 3: Update CharacterDisplay.tsx for size**

```typescript
// Map size to Tailwind classes
const sizeClasses = {
  small: 'text-4xl',   // 2.25rem / 36px
  medium: 'text-5xl',  // 3rem / 48px
  large: 'text-6xl',   // 4rem / 64px
};

return (
  <div
    key={applied.itemId}
    className={`absolute pointer-events-none select-none transition-all duration-200 ${
      sizeClasses[item.size || 'medium']
    }`}
    // ... rest of props
  >
    {item.assetReference}
  </div>
);
```

### Testing Approach:

1. **Manual Testing:**
   - Unlock all items
   - Apply each item type to character
   - Verify positioning (glasses on eyes, bows on top, etc.)
   - Verify sizing (items proportional to head)

2. **Visual Regression:**
   - Take screenshots of character with various items
   - Compare before/after to ensure improvements

## Estimated Effort

**3-4 hours** (Metadata updates, positioning logic, testing)

## Priority

**🟡 MEDIUM** - User experience issue, affects visual quality but not functionality

## Related Issues

- Story 1.11: Child-Friendly UX Polish (custom character implementation)
- Story 1.5: Styling Integration (original item application)
- BUG-3: Items can be placed multiple times (related positioning issue)

---

**Created:** 2025-10-26
**By:** PM John
**Epic:** Epic 1 - MVP Core (Bug Fix)

