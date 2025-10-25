# Story 1.8: Math Engine - Topic Selection & Curriculum Expansion

## Status

**Done** ✅

## Story

**As a** User (Child),
**I want** to choose which math topic (e.g., Addition, Multiplication, Geometry basics) I want to practice, and see problems covering the main 3rd-grade curriculum areas,
**so that** I can focus my learning.

## Acceptance Criteria

1. A UI element allows the user to select from available math topics (Addition, Subtraction, Multiplication, Division, Basic Geometry, Sizes - based on FR3).
2. The math engine generates problems corresponding to the selected topic.
3. The math engine includes problems covering all required areas from FR3.
4. Topic selection integrates with the adaptive difficulty (difficulty adjusts within the selected topic).
5. Unit tests verify topic-specific problem generation.

## Tasks / Subtasks

- [x] Implement topic selection UI (AC: 1)
  - [x] Create TopicSelection component
  - [x] Display available topics
  - [x] Handle topic selection
- [x] Expand math engine for all topics (AC: 2, 3)
  - [x] Implement Multiplication problems
  - [x] Implement Division problems
  - [x] Implement Basic Geometry problems
  - [x] Implement Size comparison problems
  - [x] Add "Mixed Tasks" option
- [x] Integrate topic with difficulty (AC: 4)
  - [x] Apply difficulty scaling per topic
  - [x] Track difficulty separately by topic
  - [x] Adjust problem complexity within topic
- [x] Write unit tests (AC: 5)
  - [x] Test topic-specific problem generation
  - [x] Test all curriculum areas
  - [x] Test topic + difficulty integration

## Dev Notes

### Relevant Architecture

**Topic Selection:**
- TopicSelection component for UI
- Topics stored in AppContext
- Persisted to IndexedDB

**Supported Topics (per FR3):**
1. Addition (up to 1000)
2. Subtraction (up to 1000)
3. Multiplication (times tables)
4. Division (basic division)
5. Basic Geometry (shapes, angles)
6. Sizes (comparisons, measurements)
7. Mixed Tasks (random selection from all topics)

**Integration:**
- mathEngine.ts generates problems based on selected topic
- Adaptive difficulty applies within each topic
- Problem types scale with difficulty level

### Testing

- Unit tests for each topic's problem generation
- Tests for Mixed Tasks randomization
- Integration tests for topic + difficulty combination

## Change Log

| Date | Version | Description | Author |
|------|---------|-------------|--------|
| 2025-10-25 | 1.0 | Retroactive documentation of completed story | PM John |

## Dev Agent Record

### Completion Notes

**Note:** This is retroactive documentation of completed story.

**Implementation Summary:**
- Topic selection UI successfully implemented
- Math engine expanded to cover all 3rd-grade curriculum topics
- All required topic areas from FR3 implemented and tested
- Topic selection integrated with adaptive difficulty system
- Mixed Tasks feature working for cross-topic practice
- Unit tests implemented and passing

### File List

**Created:**
- `src/client/src/components/TopicSelection.tsx`
- `src/client/src/components/__tests__/TopicSelection.test.tsx`

**Modified:**
- `src/client/src/lib/mathEngine.ts` (expanded for all topics)
- `src/client/src/contexts/AppContext.tsx` (topic state management)
- `src/client/src/App.tsx` (integrated TopicSelection)
- `src/client/src/lib/__tests__/mathEngine.test.ts` (topic-specific tests)

## QA Results

**Status:** ✅ Passed (per Quinn's traceability report)

**Findings:**
- All acceptance criteria met
- Topic selection UI clear and child-friendly
- All 6 math topics generating appropriate problems
- Mixed Tasks feature providing variety across topics
- Adaptive difficulty working correctly within each topic
- Problems align with 3rd-grade Bavarian curriculum (FR3)
- Unit tests passing with comprehensive coverage of all topics
