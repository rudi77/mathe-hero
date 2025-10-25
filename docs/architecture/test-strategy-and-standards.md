# Test Strategy and Standards

## Testing Philosophy

  * [cite\_start]**Approach:** Focus on Unit Tests (business logic) and Component Tests (UI interactions)[cite: 489]. [cite\_start]TDD encouraged[cite: 489].
  * **Coverage Goals:** >80% unit test coverage for services/logic; [cite\_start]~70% overall project coverage for MVP[cite: 489].
  * [cite\_start]**Test Pyramid:** Prioritize unit tests, supplement with component tests[cite: 489]. [cite\_start]E2E out of scope for MVP[cite: 489].

## Test Types and Organization

### Unit Tests

  * [cite\_start]**Framework:** Vitest (Vite-native, Jest-compatible API)[cite: 490].
  * [cite\_start]**Location:** `src/client/src/lib/__tests__/`[cite: 490].
  * **Scope:** Isolate business logic (MathEngine, RewardManager, db service). [cite\_start]Pure functions, no React dependencies[cite: 490].
  * [cite\_start]**Pattern:** Arrange-Act-Assert (AAA); test public APIs, edge cases, error handling[cite: 491].
  * **Example:**
    ```typescript
    describe('MathEngine', () => {
      it('should generate addition problems with correct answer', () => {
        const engine = new MathEngine();
        const problem = engine.generateProblem('addition', 1);
        expect(problem.topic).toBe('addition');
        expect(typeof problem.correctAnswer).toBe('number');
      });
    });
    ```

### Component Tests

  * [cite\_start]**Framework:** React Testing Library + Vitest[cite: 492].
  * [cite\_start]**Scope:** Test React components in isolation, verify user interactions and state updates[cite: 492].
  * [cite\_start]**Location:** Colocated with components or in dedicated test files[cite: 492].
  * **Focus:** User behavior over implementation details (query by role, label, text, not internal state).
  * **Example:**
    ```typescript
    import { render, screen, fireEvent } from '@testing-library/react';
    import { ItemPalette } from '../ItemPalette';

    test('displays unlocked items', () => {
      const items = [{ id: '1', name: 'Red', isUnlocked: true }];
      render(<ItemPalette items={items} onSelect={() => {}} />);
      expect(screen.getByText('Red')).toBeInTheDocument();
    });
    ```

### Integration Tests

  * **Scope:** Test integration between AppContext, db service, and IndexedDB (optional for MVP).
  * **Approach:** Use fake/mock IndexedDB if needed, or test against real browser IndexedDB in jsdom.

## Test Data Management

  * **Strategy:** Use factory functions to create test data objects.
  * [cite\_start]**Fixtures:** Reusable test data builders for `StylingItem`, `UserProgress`, etc.[cite: 495].
  * [cite\_start]**Cleanup:** Vitest automatically resets mocks; clear IndexedDB state between integration tests[cite: 495].

## Continuous Testing

  * [cite\_start]**CI Integration:** Run `pnpm test` on every push/PR via GitHub Actions[cite: 496].
  * [cite\_start]**Watch Mode:** Local development uses `pnpm test` in watch mode for instant feedback[cite: 496].
  * [cite\_start]**Coverage Reports:** Generate with `pnpm test:coverage`, aim for >70% overall[cite: 496].
  * [cite\_start]**Performance/Security Tests:** N/A for MVP[cite: 496].

-----
