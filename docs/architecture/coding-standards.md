# Coding Standards

## Core Standards

  * [cite\_start]**Language:** TypeScript (5.6+) with strict mode enabled[cite: 480].
  * [cite\_start]**Style & Linting:** Prettier for formatting, ESLint for linting (React + TypeScript rules)[cite: 480].
  * [cite\_start]**Test Organization:** Unit tests colocated in `__tests__` folders, test files end with `.test.ts` or `.test.tsx`[cite: 480].

## Naming Conventions

  * **Components:** PascalCase (e.g., `CharacterDisplay.tsx`, `ItemPalette.tsx`).
  * **Hooks:** camelCase starting with `use` (e.g., `useComposition.ts`).
  * **Services/Utilities:** camelCase (e.g., `mathEngine.ts`, `db.ts`).
  * **Types/Interfaces:** PascalCase (e.g., `StylingItem`, `UserProgress`).
  * **Constants:** UPPER_SNAKE_CASE for true constants, camelCase for config objects.
  * **File Names:** Match primary export, use kebab-case for multi-word UI components folder.

## Critical Rules

  * **Immutability:** Use `const` by default, prefer immutable data patterns, avoid mutations.
  * **State Management:** Use React hooks (`useState`, `useContext`) properly, avoid prop drilling beyond 2 levels.
  * **Type Safety:** Enable strict TypeScript, avoid `any`, use explicit types for function params/returns.
  * **Error Handling:** Use try-catch for async operations, provide user-friendly error messages.
  * **Accessibility:** Use semantic HTML, ARIA labels where needed, ensure keyboard navigation.
  * **Performance:** Use `React.memo` for expensive components, avoid inline function definitions in render.
  * **Async Operations:** Use async/await, handle promises properly, show loading states.

## React-Specific Guidelines

  * **Component Structure:** Functional components with hooks only (no class components).
  * **Props:** Use TypeScript interfaces for prop types, destructure props at function signature.
  * **Hooks Order:** Follow Rules of Hooks (call hooks at top level, same order every render).
  * **Effects:** Keep `useEffect` focused, clean up side effects, list all dependencies.
  * **Keys:** Use stable, unique keys for list items (not array index).

-----
