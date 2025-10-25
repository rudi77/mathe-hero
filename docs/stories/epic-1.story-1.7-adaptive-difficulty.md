# Story 1.7: Math Engine - Adaptive Difficulty (Basic)

## Status

**Done** ✅

## Story

**As a** User (Child),
**I want** the math problems to become slightly harder if I answer correctly many times, and slightly easier if I make mistakes,
**so that** I am appropriately challenged.

## Acceptance Criteria

1. The app tracks user performance (e.g., accuracy over recent problems).
2. A basic algorithm adjusts the difficulty level (e.g., range of numbers, complexity of operations) based on performance.
3. Problems presented to the user reflect the current calculated difficulty level.
4. The current difficulty level is saved locally (as part of Story 1.6).
5. Unit tests verify the difficulty adjustment logic.

## Tasks / Subtasks

- [x] Implement performance tracking (AC: 1)
  - [x] Track recent answer history
  - [x] Calculate accuracy rate
  - [x] Store performance data in AppContext
- [x] Implement difficulty adjustment algorithm (AC: 2)
  - [x] Define difficulty levels (1-10)
  - [x] Create adjustment rules based on accuracy
  - [x] Implement gradual difficulty changes
- [x] Update problem generation (AC: 3)
  - [x] Modify mathEngine to use difficulty level
  - [x] Adjust number ranges based on difficulty
  - [x] Scale complexity with difficulty
- [x] Integrate with persistence (AC: 4)
  - [x] Save difficulty level to IndexedDB
  - [x] Load difficulty level on app start
- [x] Write unit tests (AC: 5)
  - [x] Test difficulty adjustment logic
  - [x] Test performance tracking
  - [x] Test problem generation at different difficulties

## Dev Notes

### Relevant Architecture

**Adaptive Difficulty System:**
- Difficulty levels: 1-10 (1 = easiest, 10 = hardest)
- Tracks last 5-10 problems for accuracy calculation
- Adjusts difficulty gradually (±1 level at a time)

**Adjustment Rules:**
- High accuracy (>80%): Increase difficulty
- Medium accuracy (50-80%): Maintain difficulty
- Low accuracy (<50%): Decrease difficulty

**Problem Scaling:**
- Difficulty affects number ranges
- Difficulty affects operation complexity
- Maintains age-appropriate challenges

### Testing

- Unit tests for difficulty adjustment algorithm
- Tests for performance tracking accuracy
- Tests for problem generation at various difficulty levels

## Change Log

| Date | Version | Description | Author |
|------|---------|-------------|--------|
| 2025-10-25 | 1.0 | Retroactive documentation of completed story | PM John |

## Dev Agent Record

### Completion Notes

**Note:** This is retroactive documentation of completed story.

**Implementation Summary:**
- Adaptive difficulty system successfully implemented
- Performance tracking working with configurable history window
- Difficulty adjustment algorithm providing appropriate challenge scaling
- Problem generation properly reflects current difficulty level
- Difficulty level persisted and restored correctly
- Unit tests implemented and passing

### File List

**Modified:**
- `src/client/src/lib/mathEngine.ts` (difficulty-based problem generation)
- `src/client/src/contexts/AppContext.tsx` (performance tracking and difficulty state)
- `src/client/src/lib/db.ts` (save/load difficulty level)
- `src/client/src/lib/__tests__/mathEngine.test.ts` (difficulty adjustment tests)

## QA Results

**Status:** ✅ Passed (per Quinn's traceability report)

**Findings:**
- All acceptance criteria met
- Performance tracking working accurately over recent problems
- Difficulty adjustment algorithm responding appropriately to user performance
- Problems scale in difficulty (number ranges, complexity)
- Difficulty level saved locally and restored on app restart
- Gradual difficulty changes provide smooth learning progression
- Unit tests passing with good coverage of adjustment logic
