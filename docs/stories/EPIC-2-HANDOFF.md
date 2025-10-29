# Epic 2: Trainings-Dojo - Distraction-Free Practice Mode

**Date:** 2025-10-29
**Status:** ✅ **RELEASED FOR DEVELOPMENT**
**From:** PM John
**To:** Development Team
**Subject:** Epic 2 - Trainings-Dojo Brownfield Enhancement

---

## 🎯 Epic Goal

Enable children to practice math in a distraction-free environment without triggering the reward system, allowing focused repetition of difficult topics through a dedicated "Trainings-Dojo" mode with granular subtopic selection.

**Value Proposition:** Some children need focused practice without the pressure or distraction of unlocking rewards. The Trainings-Dojo provides a calm, pressure-free space for deliberate practice and skill reinforcement.

---

## 📊 Existing System Context

### Current Relevant Functionality

**Mathe-Stylistin MVP (Epic 1):**
- Gamified math practice with character styling rewards
- 6 math topics: Addition, Subtraction, Multiplication, Division, Geometry, Sizes
- Adaptive difficulty system (1-10 per topic)
- Reward system: 5 correct answers → unlock 1 styling item
- TopicSelection page → MathTask page flow
- All progress tracked in IndexedDB (UserProgress, StylingItems, CharacterState)

### Technology Stack

- **Frontend:** React 18.3+, TypeScript 5.6, Wouter routing, Tailwind CSS, Shadcn/ui
- **State Management:** React Context API (AppContext)
- **Storage:** IndexedDB (db.ts service)
- **Business Logic:** MathEngine (problem generation), RewardManager (unlock logic)

### Integration Points

1. **Home Page** (`src/client/src/pages/Home.tsx`)
   - Add "Trainings-Dojo" button/link alongside existing "Practice Math" button

2. **Routing** (`src/client/src/App.tsx` or main router)
   - Add new routes:
     - `/dojo` - Dojo topic/subtopic selection
     - `/dojo/practice` - Dojo practice session

3. **MathEngine** (`src/client/src/lib/mathEngine.ts`)
   - Reuse existing problem generation logic
   - No changes required (engine is stateless)

4. **AppContext** (`src/client/src/contexts/AppContext.tsx`)
   - No changes required (Dojo will not call update methods)

---

## 🚀 Enhancement Details

### What's Being Added

**New Feature: Trainings-Dojo Practice Mode**

1. **New Page: DojoTopicSelection** (`src/client/src/pages/DojoTopicSelection.tsx`)
   - Display all 6 main topics (Addition, Subtraction, etc.)
   - Display subtopics for each main topic (e.g., "Einmaleins" under Multiplication)
   - User selects one subtopic to practice

2. **New Page: DojoPractice** (`src/client/src/pages/DojoPractice.tsx`)
   - Similar to MathTask.tsx but without reward system integration
   - Generate problems using MathEngine
   - Display problems, accept answers, show feedback
   - NO database writes (no progress tracking, no unlocks)
   - Exit button returns to DojoTopicSelection

3. **Subtopic System**
   - Define subtopics for each main topic (e.g., "Einmaleins", "Punkt vor Strich")
   - Map subtopics to MathEngine problem generation parameters

4. **Navigation**
   - Add "Trainings-Dojo" button on Home page
   - Link to `/dojo` route

### What's NOT Changing

- ❌ Existing reward flow (Styling → TopicSelection → MathTask → RewardManager)
- ❌ MathEngine logic (reused as-is)
- ❌ AppContext structure
- ❌ IndexedDB schema
- ❌ Existing pages (Home, Styling, TopicSelection, MathTask)

### How It Integrates

**User Flow:**
```
Home Page
  → "Trainings-Dojo" button
  → DojoTopicSelection Page
  → Select topic + subtopic
  → DojoPractice Page
  → Solve problems (no tracking)
  → Exit → DojoTopicSelection
```

**Technical Integration:**
- **Routing:** Add `/dojo` and `/dojo/practice` routes in router config
- **MathEngine:** Import and instantiate in DojoPractice (same as MathTask)
- **No DB Writes:** DojoPractice does NOT call `db.updateUserProgress()` or `RewardManager`
- **Styling:** Reuse existing Tailwind/Shadcn components for consistency

### Success Criteria

1. ✅ Users can access Trainings-Dojo from Home page
2. ✅ Users can select from all 6 main topics
3. ✅ Users can select subtopics within each main topic
4. ✅ Users can practice unlimited problems without triggering rewards
5. ✅ No progress is saved to IndexedDB during Dojo sessions
6. ✅ UI is consistent with existing app design
7. ✅ Existing reward flow remains unaffected

---

## 📋 Stories

### Story 2.1: Trainings-Dojo Page & Navigation

**Goal:** Create the Trainings-Dojo entry point and navigation flow from Home page.

**Tasks:**
- Add "Trainings-Dojo" button on Home page
- Create DojoTopicSelection page with topic grid (similar to TopicSelection)
- Create DojoPractice page shell (empty for now)
- Add routes `/dojo` and `/dojo/practice` to router
- Implement basic navigation flow (Home → Dojo → Practice → Dojo)

**Acceptance Criteria:**
- [ ] Home page has "Trainings-Dojo" button
- [ ] Button navigates to `/dojo` route
- [ ] DojoTopicSelection displays all 6 main topics
- [ ] Clicking topic navigates to `/dojo/practice` (shell page)
- [ ] DojoPractice has "Exit" button returning to `/dojo`
- [ ] UI follows existing design patterns
- [ ] No console errors
- [ ] Component tests for new pages

**Estimated Effort:** 1-2 days

---

### Story 2.2: Subtopic System for Math Topics

**Goal:** Implement granular subtopic selection within each main topic.

**Tasks:**
- Define subtopic data structure (e.g., `{ topicId, subtopicId, name, description }`)
- Create subtopic definitions for all 6 topics:
  - **Addition:** "Bis 100", "Bis 1000", "Mit Übertrag"
  - **Subtraction:** "Bis 100", "Bis 1000", "Mit Übertrag"
  - **Multiplication:** "Einmaleins (1-5)", "Einmaleins (6-10)", "Gemischte Aufgaben"
  - **Division:** "Geteilt durch 2-5", "Geteilt durch 6-10", "Mit Rest"
  - **Geometry:** "Formen erkennen", "Ecken und Kanten zählen"
  - **Sizes:** "Längen (cm, m)", "Gewichte (g, kg)", "Zeit (min, h)"
- Update DojoTopicSelection to show subtopics when topic is clicked
- Pass selected subtopic to DojoPractice via route params or state
- Map subtopics to MathEngine parameters (difficulty range, constraints)

**Acceptance Criteria:**
- [ ] Subtopic data structure defined in types
- [ ] All 6 topics have 2-3 subtopics defined
- [ ] DojoTopicSelection shows subtopics after topic selection
- [ ] Clicking subtopic navigates to DojoPractice with subtopic context
- [ ] DojoPractice receives subtopic information
- [ ] Unit tests for subtopic data and mapping logic

**Estimated Effort:** 2-3 days

---

### Story 2.3: Tracking-Free Practice Mode

**Goal:** Implement problem generation and answer checking in DojoPractice WITHOUT database writes.

**Tasks:**
- Instantiate MathEngine in DojoPractice component
- Generate problems based on selected subtopic (use subtopic → MathEngine param mapping)
- Display problem using existing UI components (reuse from MathTask where possible)
- Accept user input (keyboard or on-screen number pad)
- Check answer using MathEngine
- Show immediate feedback (correct/incorrect)
- Generate next problem on correct answer
- NO calls to `db.updateUserProgress()`, `db.updateStylingItem()`, or `RewardManager`
- Add "Nächste Aufgabe" button to manually skip problems
- Track in-memory streak (optional, for display only, not persisted)

**Acceptance Criteria:**
- [ ] DojoPractice generates problems using MathEngine
- [ ] Problems align with selected subtopic
- [ ] User can input answers
- [ ] Correct/incorrect feedback is immediate
- [ ] Next problem generates automatically after correct answer
- [ ] NO database writes occur during Dojo session
- [ ] NO reward notifications triggered
- [ ] In-memory streak counter displays (optional)
- [ ] "Nächste Aufgabe" skip button works
- [ ] Unit tests for DojoPractice logic
- [ ] Component tests for DojoPractice page
- [ ] Manual QA: Verify no DB writes (check IndexedDB in DevTools)

**Estimated Effort:** 2-3 days

---

## ✅ Compatibility Requirements

- [x] Existing APIs remain unchanged (MathEngine, db service, AppContext)
- [x] Database schema changes: **None** (no schema changes)
- [x] UI changes follow existing patterns (Tailwind + Shadcn/ui)
- [x] Performance impact is minimal (no new DB operations, reuses existing logic)
- [x] Existing reward flow is not affected

---

## ⚠️ Risk Mitigation

### Primary Risk
**Accidental triggering of reward system from Dojo mode**

**Likelihood:** Low (if DojoPractice does not import or call RewardManager)

**Impact:** Medium (children might be confused if items unlock unexpectedly)

**Mitigation:**
1. DojoPractice component does NOT import `RewardManager` or `db.updateUserProgress()`
2. Code review checklist item: "Verify no DB writes in DojoPractice"
3. Manual QA testing: Open DevTools → IndexedDB while using Dojo, verify no writes
4. Unit test: Mock db service, verify zero calls during Dojo practice

### Secondary Risk
**Inconsistent UI/UX between normal practice and Dojo**

**Likelihood:** Medium (if not careful with component reuse)

**Impact:** Low (confusing for users, but not breaking)

**Mitigation:**
1. Reuse existing UI components from MathTask where possible
2. Follow existing design patterns (Tailwind classes, Shadcn/ui components)
3. Visual QA review: Compare MathTask and DojoPractice side-by-side

### Rollback Plan

If Epic 2 needs to be rolled back:
1. Remove "Trainings-Dojo" button from Home page
2. Remove `/dojo` and `/dojo/practice` routes from router
3. Delete files:
   - `src/client/src/pages/DojoTopicSelection.tsx`
   - `src/client/src/pages/DojoPractice.tsx`
   - `src/client/src/types/dojoSubtopics.ts` (if created)
4. No database migration required (no schema changes)
5. Existing functionality remains 100% intact

---

## ✅ Definition of Done

Epic 2 will be marked **DONE** when:

- [ ] Story 2.1 completed with all acceptance criteria met
- [ ] Story 2.2 completed with all acceptance criteria met
- [ ] Story 2.3 completed with all acceptance criteria met
- [ ] Manual QA verification: No DB writes during Dojo sessions
- [ ] Manual QA verification: Existing reward flow still works correctly
- [ ] All unit tests passing (`pnpm test`)
- [ ] Component tests for DojoTopicSelection and DojoPractice
- [ ] Test coverage remains >70% overall
- [ ] Code review completed (no RewardManager or db writes in Dojo code)
- [ ] Documentation updated (README, CLAUDE.md if needed)
- [ ] User acceptance testing with target age group (optional, recommended)

---

## 📁 Story Files Location

Story files will be created in: `docs/stories/`

- `epic-2.story-2.1-dojo-navigation.md`
- `epic-2.story-2.2-subtopic-system.md`
- `epic-2.story-2.3-tracking-free-practice.md`

---

## 🚀 Implementation Sequence

### Recommended Order

**Week 1: Foundation**

1. **Story 2.1: Trainings-Dojo Page & Navigation** (Days 1-2)
   - Establishes routes, pages, and navigation flow
   - Creates skeleton for Stories 2.2 and 2.3 to build upon
   - Low risk, high visibility (users can see Dojo entry point)

**Week 2: Subtopics & Practice Logic**

2. **Story 2.2: Subtopic System** (Days 3-5)
   - Defines subtopic data and UI selection
   - Prepares context for Story 2.3 problem generation
   - Can be developed in parallel with Story 2.3 backend logic

3. **Story 2.3: Tracking-Free Practice Mode** (Days 6-8)
   - Implements core Dojo functionality (problem generation, answer checking)
   - Integrates with subtopic system from Story 2.2
   - Critical: Verify NO database writes

### Why This Order?

1. **Story 2.1 First:** Establishes UI structure and navigation before adding complexity
2. **Story 2.2 Second:** Subtopic selection UI needed before practice logic
3. **Story 2.3 Last:** Requires subtopic context from Story 2.2; most complex story

**Dependencies:**
- Story 2.2 depends on Story 2.1 (needs DojoTopicSelection page to exist)
- Story 2.3 depends on Story 2.2 (needs subtopic selection to work)

---

## 🛠️ Development Notes

### Key Files to Create

**New Pages:**
- `src/client/src/pages/DojoTopicSelection.tsx`
- `src/client/src/pages/DojoPractice.tsx`

**New Types (optional):**
- `src/client/src/types/dojoSubtopics.ts` (or add to existing `models.ts`)

**Files to Modify:**
- `src/client/src/pages/Home.tsx` (add Dojo button)
- `src/client/src/App.tsx` (add routes)

### Reusable Components

Consider extracting reusable components from MathTask for Dojo:
- Problem display component
- Answer input component
- Feedback component (correct/incorrect)

### Testing Strategy

**Unit Tests:**
- Subtopic data structure and mapping logic
- DojoPractice problem generation (without DB writes)

**Component Tests:**
- DojoTopicSelection renders topics and subtopics
- DojoPractice renders problems and accepts input
- Navigation flow (Home → Dojo → Practice → Dojo)

**Manual QA:**
- Open DevTools → Application → IndexedDB
- Use Dojo for 10-20 problems
- Verify `user_progress` and `styling_items` stores remain unchanged
- Verify existing practice mode still triggers rewards correctly

---

## 📚 Key Documentation References

### Architecture Docs
- `docs/architecture/tech-stack.md` - React, Wouter routing, IndexedDB
- `docs/architecture/source-tree.md` - Where to place new files
- `docs/architecture/coding-standards.md` - TypeScript and React patterns
- `docs/architecture/test-strategy-and-standards.md` - Testing requirements

### PRD Docs
- `docs/prd/requirements.md` - Functional requirements (for context)
- `docs/prd/goals-and-background-context.md` - Project goals

### Codebase Reference
- `src/client/src/pages/MathTask.tsx` - Reference for problem display/input
- `src/client/src/pages/TopicSelection.tsx` - Reference for topic selection UI
- `src/client/src/lib/mathEngine.ts` - Problem generation logic to reuse
- `CLAUDE.md` - Project conventions and patterns

---

## 📞 Handoff to Story Manager

**Story Manager Handoff:**

"Please develop detailed user stories for this brownfield epic. Key considerations:

- **Existing System:** React 18 + TypeScript PWA with IndexedDB, MathEngine, RewardManager
- **Integration Points:**
  - Home page (add button)
  - Router (add `/dojo` and `/dojo/practice` routes)
  - MathEngine (reuse for problem generation)
  - NO integration with RewardManager or db writes
- **Existing Patterns:**
  - Page components in `src/client/src/pages/`
  - Wouter routing in `App.tsx`
  - Tailwind CSS + Shadcn/ui components
  - Service layer pattern (MathEngine instantiation)
- **Critical Compatibility Requirement:** DojoPractice must NOT write to IndexedDB or trigger RewardManager
- **Verification:** Each story must include manual QA step to verify no DB writes and existing reward flow remains intact

The epic should maintain system integrity while delivering a distraction-free practice mode for focused skill reinforcement."

---

## 🎉 Success Metrics

### User Success Criteria

When Epic 2 is complete, users should be able to:
1. ✅ Access Trainings-Dojo from Home page with one button click
2. ✅ Select any of 6 main topics
3. ✅ Choose specific subtopics (e.g., "Einmaleins 1-5" within Multiplication)
4. ✅ Practice unlimited problems without unlocking styling items
5. ✅ Receive immediate feedback (correct/incorrect)
6. ✅ Exit Dojo and return to normal reward-based practice seamlessly

### Technical Success Criteria

1. ✅ Zero database writes during Dojo sessions
2. ✅ MathEngine reused without modification
3. ✅ Existing reward flow unaffected (verified via manual testing)
4. ✅ Test coverage >70% maintained
5. ✅ No new TypeScript errors
6. ✅ No new console errors or warnings
7. ✅ All new components have unit/component tests

---

## ⚠️ Important Notes

### DO NOT
- ❌ Modify MathEngine.ts (reuse as-is)
- ❌ Modify RewardManager.ts
- ❌ Change IndexedDB schema
- ❌ Import RewardManager in DojoPractice
- ❌ Call `db.updateUserProgress()` from Dojo code
- ❌ Change existing pages (Home, Styling, TopicSelection, MathTask) beyond adding Dojo button

### DO
- ✅ Reuse MathEngine for problem generation
- ✅ Follow existing UI patterns (Tailwind + Shadcn/ui)
- ✅ Add comprehensive tests for new components
- ✅ Verify zero DB writes manually during QA
- ✅ Keep Dojo code isolated from reward system

### Code Review Checklist

Before merging each story:
- [ ] No `import { RewardManager }` in Dojo files
- [ ] No `db.updateUserProgress()` calls in Dojo files
- [ ] No `db.updateStylingItem()` calls in Dojo files
- [ ] New routes added to router config
- [ ] Unit tests written for new logic
- [ ] Component tests written for new pages
- [ ] Manual QA: IndexedDB unchanged during Dojo session
- [ ] Manual QA: Existing practice mode still triggers rewards

---

## 🚦 Getting Started

### Your First Steps

1. **Read Story 2.1 Details:**
   - Open `docs/stories/epic-2.story-2.1-dojo-navigation.md` (to be created)
   - Review acceptance criteria and tasks

2. **Understand Existing Code:**
   - Review `src/client/src/pages/Home.tsx` (where button will be added)
   - Review `src/client/src/pages/TopicSelection.tsx` (template for DojoTopicSelection)
   - Review `src/client/src/pages/MathTask.tsx` (template for DojoPractice)
   - Review `src/client/src/App.tsx` (where routes are defined)

3. **Create New Files:**
   - Create `src/client/src/pages/DojoTopicSelection.tsx`
   - Create `src/client/src/pages/DojoPractice.tsx`

4. **Track Progress:**
   - Update story file with completion notes
   - Check off acceptance criteria as completed
   - Run tests after each change

5. **When Story 2.1 Complete:**
   - Mark status as "Done" in story file
   - Proceed to Story 2.2

---

**Questions?** Contact PM John

**Ready to start?** Begin with Story 2.1!

🚀 **Let's build the Trainings-Dojo!**
