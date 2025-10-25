# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Mathe-Stylistin** is a Progressive Web App (PWA) that gamifies 3rd-grade math practice for children in Bavaria. Children solve math problems aligned with the Bavarian curriculum to unlock styling items (colors, accessories, effects) that they can apply to a virtual character head. The core mechanic: **solve math → unlock rewards → style character**.

This is an MVP focused on validating the hypothesis that creative rewards can motivate math learning.

## Development Commands

### Primary Workflow
```bash
pnpm dev              # Start dev server (http://localhost:3000)
pnpm build            # Build for production (client + server)
pnpm start            # Run production server
pnpm preview          # Preview production build
```

### Testing
```bash
pnpm test                      # Run tests in watch mode
pnpm test:ui                   # Run tests with Vitest UI
pnpm test:coverage             # Run tests with coverage report (>70% target)
```

**Important**: Tests use `fake-indexeddb` for IndexedDB mocking. All business logic tests are in `__tests__` folders colocated with source files.

### Code Quality
```bash
pnpm check            # TypeScript type checking (no emit)
pnpm format           # Format code with Prettier
```

## Architecture

### High-Level Structure

**Pattern**: Client-side React web application with service layer pattern
- **No backend** for MVP - all data stored locally in browser IndexedDB
- **Monorepo**: Single repository containing both client and minimal Express server (static file serving only)
- **State Management**: React Context API (`AppContext`) for global state
- **Routing**: Wouter (lightweight, ~1.3KB)

### Core Flow
```
User on Styling Page
  → Clicks "Practice Math"
  → TopicSelection Page
  → MathTask Page
  → MathEngine generates problem
  → User answers
  → RewardManager checks unlock threshold (5 correct answers)
  → (If unlocked) Update db.stylingItems.isUnlocked = true
  → Return to Styling Page with new item available
```

### Key Layers

1. **Pages Layer** (`src/client/src/pages/`)
   - `Styling.tsx` - Main hub, character display, styling interactions
   - `TopicSelection.tsx` - Choose math topic (addition, subtraction, etc.)
   - `MathTask.tsx` - Presents problems, handles input, triggers rewards
   - `Home.tsx`, `NotFound.tsx` - Routing pages

2. **Service Layer** (`src/client/src/lib/`)
   - `mathEngine.ts` - **MathEngine class**: Generates curriculum-aligned problems, adjusts difficulty per topic
   - `rewardManager.ts` - **RewardManager class**: Determines when to unlock items (5 correct answer threshold)
   - `db.ts` - IndexedDB service: CRUD operations for StylingItem, UserProgress, CharacterState
   - `initialData.ts` - Seed data: 7 colors, 8 accessories, 2 effects

3. **Context Layer** (`src/client/src/contexts/`)
   - `AppContext.tsx` - Global state provider: stylingItems, userProgress, characterState
   - `ThemeContext.tsx` - Theme management (light/dark mode)

4. **Component Layer** (`src/client/src/components/`)
   - `CharacterDisplay.tsx` - Renders character head with applied items
   - `ItemPalette.tsx` - Displays available/unlocked items
   - `RewardNotification.tsx` - Unlock celebration modal
   - `ui/` - Shadcn/ui components (30+ Radix UI primitives)

### Data Models

**StylingItem** (`src/client/src/types/models.ts`)
```typescript
{
  id: string;                    // "color_red", "accessory_glasses1"
  type: 'color' | 'accessory' | 'effect';
  name: string;                  // Display name
  assetReference: string;        // CSS value or emoji
  isUnlocked: boolean;           // Unlock status
  category?: string;
}
```

**UserProgress** (singleton, id: 1)
```typescript
{
  id: number;
  difficultyLevelAddition: number;        // 1-10 per topic
  difficultyLevelSubtraction: number;
  difficultyLevelMultiplication: number;
  difficultyLevelDivision: number;
  difficultyLevelGeometry: number;
  difficultyLevelSizes: number;
  correctAnswersStreak: number;           // Counter for rewards (resets at 5)
  totalCorrectAnswers: number;
  totalIncorrectAnswers: number;
  lastSessionDate: string;                // ISO date
}
```

**CharacterState**
```typescript
{
  appliedItems: string[];  // Array of StylingItem IDs currently applied
}
```

### IndexedDB Schema

**Database**: `mathe_stylistin_db` (version 1)

**Object Stores**:
- `styling_items` (keyPath: `id`, indexes: `type`, `isUnlocked`)
- `user_progress` (keyPath: `id`, singleton record with id=1)
- `character_state` (keyPath: `id`, singleton record with id=1)

## Key Architectural Decisions

### Why Client-Side Only?
- **MVP Simplicity**: No backend complexity, no auth, no deployment overhead
- **Privacy**: No PII collection (GDPR-K compliant)
- **Offline-First**: Works offline after initial load (PWA)
- **Cost**: Zero backend costs

### Why IndexedDB over LocalStorage?
- **Structured Data**: Object stores vs. string key-value
- **Size**: Large capacity vs. 5-10MB limit
- **Async API**: Non-blocking operations
- **Complex Queries**: Indexes and cursors

### Adaptive Difficulty Algorithm
- **Range**: 1-10 per topic
- **Adjustment**: ±0.5 per problem
- **Correct answer**: Increase difficulty
- **Incorrect answer**: Decrease difficulty
- **Max number scaling**: For addition/subtraction, `maxNumber = Math.min(difficulty * 100, 1000)`

### Reward Threshold
- **5 correct answers** → unlock 1 new item
- Managed by `RewardManager.shouldUnlockItem()`
- After unlock, `correctAnswersStreak` resets to 0

## File Path Conventions

### Path Aliases
- `@/` → `src/client/src/`
- `@shared/` → `src/shared/`
- `@assets/` → `src/attached_assets/`

### Important Paths
- Business logic: `src/client/src/lib/`
- Tests: Colocated in `__tests__/` folders
- Test setup: `src/client/src/test/setup.ts`
- Test fixtures: `src/client/src/test/fixtures.ts`
- UI components: `src/client/src/components/ui/` (Shadcn - don't modify unless needed)
- Types: `src/client/src/types/models.ts`

## Testing Strategy

### Test Organization
- **Unit tests**: `lib/__tests__/*.test.ts` - Pure logic (MathEngine, RewardManager, db)
- **Component tests**: `components/__tests__/*.test.tsx` - React components with RTL
- **Integration tests**: `pages/__tests__/*.test.tsx`, `contexts/__tests__/*.test.tsx`

### Running Specific Tests
```bash
# Run tests for a specific file
pnpm test mathEngine

# Run tests for a specific suite
pnpm test -t "MathEngine"

# Run in watch mode with filter
pnpm test --watch mathEngine
```

### Test Coverage Goals
- **Unit tests**: >80% coverage for services/logic
- **Overall**: ~70% project coverage
- **Excluded**: UI components in `components/ui/`, `main.tsx`, config files

### Key Testing Notes
- Use `fake-indexeddb` for IndexedDB tests (imported in `test/setup.ts`)
- Use RTL's `render`, `screen`, `fireEvent`, `waitFor` for component tests
- Test **user behavior**, not implementation details
- Query by role/label/text, not internal state

## Common Development Tasks

### Adding a New Math Problem Type
1. Add topic to `MathTopic` type in `src/client/src/types/models.ts`
2. Add difficulty field to `UserProgress` interface (e.g., `difficultyLevelNewTopic`)
3. Implement generator in `MathEngine` class (`src/client/src/lib/mathEngine.ts`)
4. Add case to `generateProblem()` switch
5. Update `initialUserProgress` in `src/client/src/lib/initialData.ts`
6. Add topic to `TopicSelection.tsx` page
7. Write tests in `src/client/src/lib/__tests__/mathEngine.test.ts`

### Adding New Styling Items
1. Add entries to `initialStylingItems` in `src/client/src/lib/initialData.ts`
2. Follow naming convention: `{type}_{descriptor}` (e.g., `color_pink`, `accessory_glasses2`)
3. Set `isUnlocked: false` for new items (will be unlocked via rewards)
4. For emojis: Use `assetReference: "🎨"` format
5. For colors: Use `assetReference: "#HEX"` format

### Modifying Reward Threshold
- Edit `UNLOCK_THRESHOLD` in `src/client/src/lib/rewardManager.ts` (currently 5)
- Update tests in `src/client/src/lib/__tests__/rewardManager.test.ts`

### Debugging IndexedDB
- Use browser DevTools → Application → IndexedDB → `mathe_stylistin_db`
- Check console for `[AppContext]`, `[db]` prefixed logs
- Clear DB: DevTools → Application → Clear storage

## Important Implementation Notes

### State Updates
- **Critical**: `AppContext.updateUserProgress()` reads back from DB after save to ensure consistency
- Always use `await` when calling context update methods
- React state updates trigger re-renders; use `JSON.parse(JSON.stringify())` to force new object references if needed

### MathEngine Problem Generation
- All problems include `difficulty` field for tracking
- Calculations return numeric `correctAnswer`
- Multiple choice problems use `options` array and string `correctAnswer`
- Geometry/sizes use `type: 'multipleChoice'`

### React Component Patterns
- **Functional components only** (no class components)
- Use hooks (`useState`, `useEffect`, `useContext`)
- Destructure props at function signature
- Use `React.memo` for expensive components
- Keep `useEffect` focused with proper cleanup

### TypeScript Standards
- **Strict mode enabled** (`tsconfig.json`)
- No `any` types - use `unknown` or proper types
- Explicit return types for exported functions
- Use interfaces for data models, types for unions/primitives

## Curriculum Coverage (3rd Grade Bavaria)

### Math Topics Implemented
1. **Addition** (`addition`) - Numbers up to 1000
2. **Subtraction** (`subtraction`) - Numbers up to 1000
3. **Multiplication** (`multiplication`) - Up to 10×10
4. **Division** (`division`) - Up to 100÷10
5. **Geometry** (`geometry`) - Shape recognition, vertices/edges counting
6. **Sizes** (`sizes`) - Length (cm, m), weight (g, kg), time (min, h)

### Difficulty Scaling
- **Level 1-3**: Basic operations, small numbers
- **Level 4-6**: Medium complexity, larger numbers
- **Level 7-10**: Complex operations, max curriculum range

## Tech Stack Reference

### Core Framework
- **React 18.3+** with TypeScript 5.6
- **Vite 7.1+** - Build tool (fast HMR, ESM-based)
- **Wouter 3.3+** - Routing (~1.3KB)

### UI & Styling
- **Tailwind CSS 4.1+** - Utility-first CSS (4px spacing system)
- **Shadcn/ui** - Accessible component library (built on Radix UI)
- **Radix UI** - Unstyled primitives (WCAG compliant, keyboard nav)
- **Framer Motion 12.23+** - Animation library
- **Lucide React** - Icon library

### State & Data
- **React Context API** - Global state (no external library)
- **IndexedDB** - Browser storage (native API)
- **Zod 4.1+** - Runtime validation (if needed)
- **TanStack Query 4.41+** - Installed but not used in MVP (for future API calls)

### Testing
- **Vitest 4.0+** - Test runner (Jest-compatible, Vite-native)
- **React Testing Library 16.3+** - Component testing
- **jsdom 27.0+** - DOM implementation for Node
- **fake-indexeddb 6.2+** - IndexedDB mock for tests

### Build & Dev Tools
- **pnpm 10.4+** - Package manager (fast, disk-efficient)
- **esbuild 0.25+** - Server bundler (fast native bundler)
- **TypeScript 5.6** - Type safety (strict mode)
- **Prettier 3.6+** - Code formatting
- **ESLint** - Linting (React + TS rules)

### Server (Minimal)
- **Express 4.21+** - Static file server only (no API endpoints)

## Documentation References

- **PRD**: `docs/prd.md` - Product requirements, user stories, epic breakdown
- **Architecture**: `docs/architecture.md` - Detailed system design, workflows, data models
- **Front-end Spec**: `docs/front-end-spec.md` - UX goals, user flows, wireframes, design system
- **README**: `src/README.md` - German-language user/developer guide

## Code Style Guidelines

### Naming Conventions
- **Components**: PascalCase (`CharacterDisplay.tsx`)
- **Hooks**: camelCase with `use` prefix (`useComposition.ts`)
- **Services**: camelCase (`mathEngine.ts`)
- **Types/Interfaces**: PascalCase (`StylingItem`)
- **Constants**: UPPER_SNAKE_CASE or camelCase for config objects

### Critical Rules
- **Immutability**: Use `const`, avoid mutations, prefer immutable patterns
- **Type Safety**: No `any`, explicit types for function params/returns
- **Error Handling**: Try-catch for async ops, user-friendly messages
- **Accessibility**: Semantic HTML, ARIA labels, keyboard navigation, min 44×44px touch targets
- **Performance**: `React.memo` for expensive components, avoid inline functions in render

### React Specific
- Call hooks at top level, same order every render
- List all dependencies in `useEffect`
- Use stable, unique keys for lists (not array index)
- Clean up side effects in `useEffect` return function

## Known Limitations (MVP Scope)

- No backend synchronization (all data local)
- No user accounts or authentication
- No parent/teacher dashboard
- No multiplayer features
- Emoji-based assets (no custom graphics)
- No sound effects or advanced animations
- No iOS-specific optimizations (web-only PWA)

## Deployment

### Build Process
```bash
pnpm build
```
Outputs:
- Client: `dist/public/` (Vite optimized bundle)
- Server: `dist/index.js` (esbuild bundled Express server)

### Production Server
```bash
NODE_ENV=production node dist/index.js
```

### Recommended Hosting
- **Vercel** / **Netlify** - Automatic deployments, CDN, HTTPS
- **GitHub Pages** - Free static hosting
- **Firebase Hosting** - PWA-optimized

### Environment Variables
Currently none required. Future backend integration would use `.env` files (not committed).

## Troubleshooting

### Tests Failing
- Check `fake-indexeddb` is working: `pnpm test db`
- Clear coverage cache: `rm -rf coverage`
- Increase memory: Tests already run with `NODE_OPTIONS='--max-old-space-size=4096'`

### Dev Server Not Starting
- Port 3000 in use? Server will auto-find next port (`strictPort: false`)
- Check `pnpm` version: Requires 10.4+
- Clear node_modules: `rm -rf node_modules && pnpm install`

### TypeScript Errors
- Run type check: `pnpm check`
- Rebuild: `pnpm build`
- Check `tsconfig.json` paths match file structure

### IndexedDB Issues
- Clear browser data: DevTools → Application → Clear storage
- Check browser compatibility: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- Verify initialization: Check console for `[db]` logs

## Future Considerations (Post-MVP)

- Backend API for sync across devices
- User accounts with Firebase Auth
- Parent/teacher dashboard with analytics
- Achievement system and badges
- Sound effects and advanced animations
- Custom SVG character graphics
- iOS-specific PWA optimizations
- Expanded curriculum (other grade levels)
- Multiplayer challenges
- AI-powered difficulty tuning
