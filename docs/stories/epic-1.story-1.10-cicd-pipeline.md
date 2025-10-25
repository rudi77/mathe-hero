# Story 1.10: CI/CD Pipeline & Coverage Reporting

## Status

**Approved** - Ready for Implementation

## Story

**As a** Developer,
**I want** automated testing and coverage reporting on every code change,
**so that** quality is enforced and visible to the team.

## Acceptance Criteria

1. GitHub Actions workflow configured to run tests on every push/PR.
2. Workflow fails if tests don't pass (blocking merge).
3. Coverage reports generated and displayed in PR comments or checks.
4. Coverage badge added to README showing current coverage percentage.
5. Pre-commit hooks configured to run tests locally before commits (optional but recommended).
6. Documentation updated with instructions for running tests locally (README or contributing guide).
7. Test watch mode works correctly during local development (`pnpm test` or `pnpm test:watch`).

## Tasks / Subtasks

- [ ] Create GitHub Actions workflow file (AC: 1, 2)
  - [ ] Create `.github/workflows/test.yml`
  - [ ] Configure Node.js setup (use pnpm)
  - [ ] Configure test job to run `pnpm test`
  - [ ] Set workflow to fail if tests fail
  - [ ] Configure to run on push and pull_request events
- [ ] Configure coverage reporting (AC: 3)
  - [ ] Add coverage generation to workflow
  - [ ] Install coverage reporting action (e.g., codecov or coveralls)
  - [ ] Configure PR comment with coverage results
  - [ ] Set up coverage diff display
- [ ] Add coverage badge to README (AC: 4)
  - [ ] Generate coverage badge from workflow
  - [ ] Add badge to README.md
  - [ ] Verify badge displays correctly
- [ ] Configure pre-commit hooks (AC: 5 - Optional)
  - [ ] Install husky or similar tool
  - [ ] Configure pre-commit hook to run tests
  - [ ] Document how to skip hooks if needed (for emergency commits)
- [ ] Update developer documentation (AC: 6)
  - [ ] Add testing section to README
  - [ ] Document `pnpm test` command
  - [ ] Document `pnpm test:coverage` command
  - [ ] Document watch mode usage
  - [ ] Document CI/CD workflow
- [ ] Verify test watch mode (AC: 7)
  - [ ] Test `pnpm test` in watch mode
  - [ ] Verify hot reload on file changes
  - [ ] Document any issues or configuration needed

## Dev Notes

### Relevant Architecture

**CI Integration:**
- Run `pnpm test` on every push/PR via GitHub Actions
- Tests must pass before merge
- Coverage reports generated automatically

**Watch Mode:**
- Local development uses `pnpm test` in watch mode for instant feedback
- Vitest provides excellent watch mode with smart re-running

### GitHub Actions Workflow Template

**Basic Structure (.github/workflows/test.yml):**
```yaml
name: Tests

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8

      - name: Install dependencies
        run: pnpm install

      - name: Run tests
        run: pnpm test

      - name: Generate coverage
        run: pnpm test:coverage

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json
          fail_ci_if_error: true
```

### Coverage Reporting Options

**Option 1: Codecov (Recommended)**
- Free for open source
- Excellent PR integration
- Beautiful coverage visualization

**Option 2: Coveralls**
- Alternative to Codecov
- Similar features

**Option 3: GitHub Actions Summary**
- Built-in, no external service
- Less feature-rich but simple

### Pre-commit Hooks (Optional)

**Using Husky:**
```json
{
  "scripts": {
    "prepare": "husky install"
  }
}
```

**Hook configuration (.husky/pre-commit):**
```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

pnpm test
```

### Testing

- **Verify workflow:** Push to a test branch and verify GitHub Actions runs
- **Test coverage:** Ensure coverage reports are generated and uploaded
- **Test failure:** Create a failing test and verify workflow fails
- **Test badge:** Verify coverage badge displays on README

## Change Log

| Date | Version | Description | Author |
|------|---------|-------------|--------|
| 2025-10-25 | 1.0 | Story created from course correction analysis | PM John |

## Dev Agent Record

*This section will be populated during implementation.*

## QA Results

*This section will be populated after QA review.*
