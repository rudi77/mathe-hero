# Story 1.9: Comprehensive Test Suite

## Status

**Approved** - Ready for Implementation

## Story

**As a** Developer,
**I want** comprehensive automated tests covering all business logic and UI components,
**so that** we can confidently make changes without breaking existing functionality and meet our documented quality standards.

## Acceptance Criteria

1. Unit test coverage for mathEngine.ts is >90% (all methods, edge cases, difficulty scaling).
2. Unit test coverage for rewardManager.ts is >90% (unlock logic, thresholds, edge cases).
3. Unit test coverage for db.ts is >80% (all CRUD operations, error handling).
4. Component tests exist for all major React components using React Testing Library:
   - CharacterDisplay (item rendering, background changes)
   - ItemPalette (locked/unlocked display, selection)
   - MathTask (problem display, answer checking, feedback)
   - Styling (item application, character state updates)
   - TopicSelection (topic selection, navigation)
5. Overall project test coverage reaches >70% as measured by Vitest coverage reports.
6. All tests pass with `pnpm test`.
7. Test data fixtures/factories are created for reusable test objects.
8. Testing patterns and examples are documented in coding-standards.md.

## Tasks / Subtasks

- [ ] Expand unit tests for mathEngine.ts (AC: 1)
  - [ ] Test all 6 topic problem generation methods
  - [ ] Test difficulty scaling algorithm
  - [ ] Test edge cases (min/max difficulty, boundary values)
  - [ ] Test answer checking for all problem types
  - [ ] Achieve >90% coverage
- [ ] Expand unit tests for rewardManager.ts (AC: 2)
  - [ ] Test unlock threshold logic
  - [ ] Test streak-based unlocking
  - [ ] Test edge cases (all items unlocked, first unlock)
  - [ ] Test progress calculation
  - [ ] Achieve >90% coverage
- [ ] Create unit tests for db.ts (AC: 3)
  - [ ] Test IndexedDB initialization
  - [ ] Test styling item CRUD operations
  - [ ] Test user progress save/load
  - [ ] Test character state persistence
  - [ ] Test error handling scenarios
  - [ ] Achieve >80% coverage
- [ ] Create test fixtures and factories (AC: 7)
  - [ ] Create StylingItem factory
  - [ ] Create UserProgress factory
  - [ ] Create MathProblem factory
  - [ ] Create CharacterState factory
- [ ] Create component tests for CharacterDisplay (AC: 4)
  - [ ] Test background color rendering
  - [ ] Test applied items rendering
  - [ ] Test multiple items display
- [ ] Create component tests for ItemPalette (AC: 4)
  - [ ] Test unlocked items display
  - [ ] Test locked items display with lock icon
  - [ ] Test item selection interaction
  - [ ] Test category filtering
- [ ] Create component tests for MathTask (AC: 4)
  - [ ] Test problem display (calculation and multiple choice)
  - [ ] Test answer submission
  - [ ] Test correct/incorrect feedback display
  - [ ] Test progress tracking display
- [ ] Create component tests for Styling (AC: 4)
  - [ ] Test item selection
  - [ ] Test item application to character
  - [ ] Test character state updates
  - [ ] Test "clear all" functionality
- [ ] Create component tests for TopicSelection (AC: 4)
  - [ ] Test topic grid rendering
  - [ ] Test topic selection and navigation
- [ ] Verify overall coverage >70% (AC: 5)
  - [ ] Run `pnpm test:coverage`
  - [ ] Review coverage report
  - [ ] Address any gaps
- [ ] Document testing patterns (AC: 8)
  - [ ] Add testing examples to coding-standards.md
  - [ ] Document AAA pattern usage
  - [ ] Document component testing patterns

## Dev Notes

### Relevant Architecture

**Testing Philosophy:**
- **Approach:** Focus on Unit Tests (business logic) and Component Tests (UI interactions)
- **Coverage Goals:** >80% unit test coverage for services/logic; ~70% overall project coverage for MVP
- **Test Pyramid:** Prioritize unit tests, supplement with component tests. E2E out of scope for MVP.

**Test Frameworks:**
- **Unit Tests:** Vitest (Vite-native, Jest-compatible API)
- **Component Tests:** React Testing Library + Vitest

**Test Organization:**
- **Unit Tests:** `src/client/src/lib/__tests__/`
- **Component Tests:** Colocated with components or in dedicated test files

**Test Data Management:**
- Use factory functions to create test data objects
- Reusable test data builders for `StylingItem`, `UserProgress`, etc.
- Vitest automatically resets mocks; clear IndexedDB state between integration tests

### Existing Test Files

**Already exist (need expansion):**
- `src/client/src/lib/__tests__/mathEngine.test.ts` - Basic tests, needs >90% coverage
- `src/client/src/lib/__tests__/rewardManager.test.ts` - Basic tests, needs >90% coverage

**Need to create:**
- `src/client/src/lib/__tests__/db.test.ts` - New file for IndexedDB testing
- Component test files for all major components
- Test fixtures file (`src/client/src/test/fixtures.ts`)

### Testing Standards

**Unit Test Pattern (AAA):**
```typescript
describe('MathEngine', () => {
  it('should generate addition problems with correct answer', () => {
    // Arrange
    const engine = new MathEngine();

    // Act
    const problem = engine.generateProblem('addition', 1);

    // Assert
    expect(problem.topic).toBe('addition');
    expect(typeof problem.correctAnswer).toBe('number');
  });
});
```

**Component Test Pattern:**
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { ItemPalette } from '../ItemPalette';

test('displays unlocked items', () => {
  const items = [{ id: '1', name: 'Red', isUnlocked: true }];
  render(<ItemPalette items={items} onSelect={() => {}} />);
  expect(screen.getByText('Red')).toBeInTheDocument();
});
```

### Testing

- **Run Tests:** `pnpm test`
- **Watch Mode:** `pnpm test` (with --watch flag)
- **Coverage:** `pnpm test:coverage`
- **Coverage Target:** >70% overall, >80% for services, >90% for core business logic

## Change Log

| Date | Version | Description | Author |
|------|---------|-------------|--------|
| 2025-10-25 | 1.0 | Story created from course correction analysis | PM John |

## Dev Agent Record

*This section will be populated during implementation.*

## QA Results

*This section will be populated after QA review.*
