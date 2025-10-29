# Epic 2: Trainings-Dojo - Development Release

**Date:** 2025-10-29
**Status:** ✅ **READY FOR DEVELOPMENT**
**From:** PM John
**To:** Development Team

---

## 🚀 Quick Start

**Epic Goal:** Add distraction-free math practice mode without rewards

**Start Here:** `docs/stories/epic-2.story-2.1-dojo-navigation.md`

---

## 📦 Epic Overview

### What We're Building

**Trainings-Dojo** - A dedicated practice area where children can:
- Practice any math topic without unlocking styling items
- Select granular subtopics (e.g., "Einmaleins 1-5")
- Get immediate feedback without progress tracking
- Focus on difficult areas without pressure

### Why This Matters

Some children need focused, pressure-free practice to master difficult concepts. The Dojo provides a calm space for deliberate skill reinforcement.

---

## 📋 Stories (Sequential Order)

| # | Story | Effort | Status |
|---|-------|--------|--------|
| 2.1 | [Dojo Navigation](epic-2.story-2.1-dojo-navigation.md) | 1-2 days | 🟢 Ready |
| 2.2 | [Subtopic System](epic-2.story-2.2-subtopic-system.md) | 2-3 days | 🟢 Ready |
| 2.3 | [Tracking-Free Practice](epic-2.story-2.3-tracking-free-practice.md) | 2-3 days | 🟢 Ready |

**Total Estimated Effort:** 5-8 days

**Implementation Order:** Must be done sequentially (2.1 → 2.2 → 2.3)

---

## 🎯 Key Success Criteria

1. ✅ Users can access Trainings-Dojo from Home screen
2. ✅ Users can select topics and subtopics
3. ✅ Users can practice unlimited problems
4. ✅ **ZERO database writes during Dojo sessions** (CRITICAL)
5. ✅ Existing reward flow remains unaffected

---

## ⚠️ Critical Requirements

### DO NOT
- ❌ Modify `MathEngine.ts` (reuse as-is)
- ❌ Modify `RewardManager.ts`
- ❌ Change IndexedDB schema
- ❌ Import `RewardManager` in Dojo code
- ❌ Call `db.updateUserProgress()` from Dojo
- ❌ Call `AppContext.updateUserProgress()` from Dojo

### DO
- ✅ Reuse MathEngine for problem generation
- ✅ Follow existing UI patterns (Tailwind + Shadcn/ui)
- ✅ Add comprehensive tests
- ✅ Verify zero DB writes manually (IndexedDB inspection)
- ✅ Keep Dojo code isolated from reward system

---

## 🧪 Testing Requirements

### Unit Tests
- All new business logic (subtopic mapping, problem generation)
- >70% coverage maintained

### Component Tests
- All new pages (DojoTopicSelection, DojoPractice)
- Navigation flow (Home → Dojo → Practice → Dojo)

### Manual QA (MANDATORY)
**Before marking Story 2.3 complete:**
1. Open DevTools → Application → IndexedDB
2. Note current state of `user_progress` and `styling_items`
3. Use Dojo for 20 problems (mix correct/incorrect)
4. Verify NO changes to IndexedDB
5. Test normal practice mode still triggers rewards

---

## 📁 File Structure

### New Files to Create
```
src/client/src/pages/
  ├── DojoTopicSelection.tsx          (Story 2.1)
  ├── DojoPractice.tsx                 (Story 2.1)
  └── __tests__/
      ├── DojoTopicSelection.test.tsx  (Story 2.1)
      └── DojoPractice.test.tsx        (Story 2.3)

src/client/src/types/
  ├── dojoSubtopics.ts                 (Story 2.2)
  └── __tests__/
      └── dojoSubtopics.test.ts        (Story 2.2)
```

### Files to Modify
```
src/client/src/pages/
  └── Home.tsx                         (Add Dojo button - Story 2.1)

src/client/src/
  └── App.tsx                          (Add routes - Story 2.1)
```

---

## 🔗 Key References

### Full Documentation
- **Epic Handoff:** `docs/stories/EPIC-2-HANDOFF.md` (complete epic context)
- **Story 2.1:** `docs/stories/epic-2.story-2.1-dojo-navigation.md`
- **Story 2.2:** `docs/stories/epic-2.story-2.2-subtopic-system.md`
- **Story 2.3:** `docs/stories/epic-2.story-2.3-tracking-free-practice.md`

### Codebase References
- **MathEngine Usage:** `src/client/src/pages/MathTask.tsx`
- **Topic Selection UI:** `src/client/src/pages/TopicSelection.tsx`
- **Routing:** `src/client/src/App.tsx`
- **Project Conventions:** `CLAUDE.md`

### Architecture Docs
- **Tech Stack:** `docs/architecture/tech-stack.md`
- **Coding Standards:** `docs/architecture/coding-standards.md`
- **Test Strategy:** `docs/architecture/test-strategy-and-standards.md`

---

## 🚦 Implementation Checklist

### Before Starting
- [ ] Read `EPIC-2-HANDOFF.md` for full context
- [ ] Read Story 2.1 acceptance criteria
- [ ] Review `MathTask.tsx` and `TopicSelection.tsx` for patterns
- [ ] Ensure dev environment is running (`pnpm dev`)

### During Development
- [ ] Follow sequential story order (2.1 → 2.2 → 2.3)
- [ ] Run tests frequently (`pnpm test`)
- [ ] Check coverage after each story (`pnpm test:coverage`)
- [ ] Update story files with completion notes

### Before Marking Complete
- [ ] All acceptance criteria met
- [ ] All unit tests passing
- [ ] All component tests passing
- [ ] Coverage >70% maintained
- [ ] Manual QA completed (IndexedDB verification for Story 2.3)
- [ ] Code review checklist completed
- [ ] No console errors
- [ ] Story file updated with Dev Agent Record

---

## 📞 Questions or Issues?

**For Product Questions:**
- Contact: PM John
- Scope clarification, requirements interpretation

**For Technical Questions:**
- Refer to: `CLAUDE.md`, architecture docs
- If blocked: Document in story file "Blockers/Issues" section

**For QA Questions:**
- Manual QA required for Story 2.3
- IndexedDB verification is MANDATORY

---

## 🎉 Definition of Done

Epic 2 is complete when:
- ✅ All 3 stories marked "Done"
- ✅ All acceptance criteria met
- ✅ All tests passing (>70% coverage)
- ✅ Manual QA passed (zero DB writes verified)
- ✅ Existing reward flow verified (still works)
- ✅ Code review completed
- ✅ No regressions in existing features

---

## 🚀 Ready to Start?

**Next Steps:**
1. Open `docs/stories/epic-2.story-2.1-dojo-navigation.md`
2. Read acceptance criteria and tasks
3. Start with first task: Add "Trainings-Dojo" button to Home page
4. Track progress, update story file as you go

**Let's build the Trainings-Dojo!** 💪

---

**Epic Status:** ✅ **RELEASED FOR DEVELOPMENT**
**Release Date:** 2025-10-29
**Approved By:** PM John
