# Story 2.1: Trainings-Dojo Page & Navigation

## Status

**Ready for Development** 🟢

## Story

**As a** User (Child),
**I want** to access a dedicated "Trainings-Dojo" practice area from the home screen,
**so that** I can practice math problems without the distraction or pressure of unlocking styling items.

## Acceptance Criteria

1. Home page displays a "Trainings-Dojo" button/link clearly visible to users
2. Clicking "Trainings-Dojo" button navigates to `/dojo` route
3. DojoTopicSelection page displays all 6 main math topics (Addition, Subtraction, Multiplication, Division, Geometry, Sizes)
4. Clicking a topic on DojoTopicSelection navigates to `/dojo/practice` route
5. DojoPractice page has an "Exit" or "Back" button that returns to `/dojo`
6. All new pages follow existing UI design patterns (Tailwind CSS, Shadcn/ui components)
7. No console errors during navigation flow
8. Component tests verify navigation flow works correctly

## Tasks / Subtasks

- [ ] Add "Trainings-Dojo" button to Home page (AC: 1, 2)
  - [ ] Open `src/client/src/pages/Home.tsx`
  - [ ] Add button/link component using Shadcn/ui Button
  - [ ] Link to `/dojo` route using Wouter's `<Link>` or `useLocation`
  - [ ] Style consistently with existing Home page buttons
  - [ ] Test navigation manually

- [ ] Create DojoTopicSelection page (AC: 3, 4, 6)
  - [ ] Create `src/client/src/pages/DojoTopicSelection.tsx`
  - [ ] Display 6 main topics in a grid (similar to TopicSelection.tsx)
  - [ ] Use existing topic icons/names (reuse from TopicSelection if possible)
  - [ ] Handle topic click → navigate to `/dojo/practice` with topic context
  - [ ] Add page header/title ("Trainings-Dojo" or "Übungsbereich")
  - [ ] Follow existing Tailwind/Shadcn styling patterns

- [ ] Create DojoPractice page shell (AC: 5, 6)
  - [ ] Create `src/client/src/pages/DojoPractice.tsx`
  - [ ] Add basic page structure (header, content area, footer)
  - [ ] Add "Exit" or "Zurück" button
  - [ ] Link "Exit" button to `/dojo` route
  - [ ] Display selected topic name in header
  - [ ] Placeholder content ("Practice problems will appear here")

- [ ] Add routes to router (AC: 2, 4)
  - [ ] Open `src/client/src/App.tsx` (or main routing file)
  - [ ] Add route: `/dojo` → `<DojoTopicSelection />`
  - [ ] Add route: `/dojo/practice` → `<DojoPractice />`
  - [ ] Verify routes work with Wouter's `<Route>` component

- [ ] Write component tests (AC: 8)
  - [ ] Test DojoTopicSelection renders 6 topics
  - [ ] Test topic click navigates to `/dojo/practice`
  - [ ] Test DojoPractice "Exit" button navigates to `/dojo`
  - [ ] Test Home page "Trainings-Dojo" button navigates to `/dojo`
  - [ ] Use React Testing Library + Vitest

- [ ] Manual QA (AC: 7)
  - [ ] Navigate: Home → Dojo → Practice → Dojo → Home
  - [ ] Check DevTools console for errors
  - [ ] Verify UI is consistent across pages
  - [ ] Test on mobile viewport (responsive design)

## Dev Notes

### Relevant Architecture

**Routing:**
- Wouter routing library (lightweight, ~1.3KB)
- Routes defined in `src/client/src/App.tsx`
- Use `<Route path="/dojo" component={DojoTopicSelection} />`
- Use `<Link href="/dojo">` or `useLocation()` for navigation

**UI Components:**
- Tailwind CSS for styling (utility classes)
- Shadcn/ui components (Button, Card, etc.)
- Follow existing design patterns from `Home.tsx`, `TopicSelection.tsx`

**File Structure:**
- New pages: `src/client/src/pages/`
- Component tests: `src/client/src/pages/__tests__/`

### Reference Files

**For Routing:**
- `src/client/src/App.tsx` - Main routing configuration

**For Topic Grid UI:**
- `src/client/src/pages/TopicSelection.tsx` - Topic selection grid layout

**For Home Button:**
- `src/client/src/pages/Home.tsx` - Existing buttons/links

**For Page Structure:**
- `src/client/src/pages/MathTask.tsx` - Page layout with header/footer

### Topic Data

Reuse existing topic definitions:
```typescript
const topics = [
  { id: 'addition', name: 'Addition', icon: '➕' },
  { id: 'subtraction', name: 'Subtraktion', icon: '➖' },
  { id: 'multiplication', name: 'Multiplikation', icon: '✖️' },
  { id: 'division', name: 'Division', icon: '➗' },
  { id: 'geometry', name: 'Geometrie', icon: '📐' },
  { id: 'sizes', name: 'Größen', icon: '📏' },
];
```

### State Management

For Story 2.1, pass topic via:
- **Option A:** URL query params (`/dojo/practice?topic=addition`)
- **Option B:** Wouter route params (if supported)
- **Option C:** React state (using `useLocation` state)

Recommendation: **Option A** (query params) for simplicity

### Testing

**Component Test Example (DojoTopicSelection):**
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { Router } from 'wouter';
import DojoTopicSelection from '../DojoTopicSelection';

test('renders all 6 topics', () => {
  render(
    <Router>
      <DojoTopicSelection />
    </Router>
  );
  expect(screen.getByText('Addition')).toBeInTheDocument();
  expect(screen.getByText('Subtraktion')).toBeInTheDocument();
  // ... test all 6 topics
});

test('navigates to practice on topic click', () => {
  const { container } = render(
    <Router>
      <DojoTopicSelection />
    </Router>
  );
  const additionButton = screen.getByText('Addition');
  fireEvent.click(additionButton);
  // Assert navigation (check window.location or mock useLocation)
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
- `src/client/src/pages/DojoTopicSelection.tsx`
- `src/client/src/pages/DojoPractice.tsx`
- `src/client/src/pages/__tests__/DojoTopicSelection.test.tsx`
- `src/client/src/pages/__tests__/DojoPractice.test.tsx`

**To Be Modified:**
- `src/client/src/pages/Home.tsx` (add Trainings-Dojo button)
- `src/client/src/App.tsx` (add `/dojo` and `/dojo/practice` routes)

### Blockers/Issues

*[To be filled during implementation if issues arise]*

## QA Results

**Status:** Pending

*[To be filled by QA agent after implementation]*

---

**Estimated Effort:** 1-2 days

**Dependencies:** None (first story in Epic 2)

**Next Story:** Story 2.2 (Subtopic System)
