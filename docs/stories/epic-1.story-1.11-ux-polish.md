# Story 1.11: Child-Friendly UX Polish

## Status

**Approved** - Ready for Implementation

## Story

**As a** Child User,
**I want** a more visually appealing character and helpful error messages,
**so that** the app feels professional, welcoming, and supportive when things go wrong.

## Acceptance Criteria

1. Custom SVG character head design created (or sourced from child-appropriate assets) to replace emoji-based placeholder.
2. Character head rendered using the new custom artwork in CharacterDisplay component.
3. Error messages rewritten in child-friendly language (tested with age-appropriate readability - simple sentences, encouraging tone).
4. ErrorBoundary displays age-appropriate "Oops! Something went wrong" message instead of technical error details.
5. "Gemischte Aufgaben" (Mixed Tasks) feature fully implemented to randomize across all topics, not defaulting to addition.
6. Visual polish pass: consistent spacing, colors, smooth animations for correct/incorrect feedback.
7. Basic accessibility improvements: keyboard navigation for topic selection and entering math answers (Tab, Enter).
8. User-facing text reviewed for child-appropriate tone and clarity (no technical jargon).

## Tasks / Subtasks

- [ ] Design or source custom character head (AC: 1)
  - [ ] Research child-appropriate SVG character options
  - [ ] Create or license custom SVG character head
  - [ ] Ensure character is gender-neutral and appealing to ages 8-9
  - [ ] Create facial features (eyes, smile) as separate SVG elements
  - [ ] Ensure character works well with accessories/items overlay
- [ ] Implement custom character in CharacterDisplay (AC: 2)
  - [ ] Replace emoji head with SVG character
  - [ ] Update CharacterDisplay component to render SVG
  - [ ] Maintain backward compatibility with item positioning
  - [ ] Test character rendering on different screen sizes
- [ ] Rewrite error messages for children (AC: 3, 4, 8)
  - [ ] Audit all user-facing error messages
  - [ ] Rewrite in simple, encouraging language
  - [ ] Update ErrorBoundary with child-friendly message
  - [ ] Add friendly "Oops!" message with reassuring tone
  - [ ] Test readability with target age group (if possible)
- [ ] Implement "Gemischte Aufgaben" randomization (AC: 5)
  - [ ] Update TopicSelection.tsx mixed tasks logic
  - [ ] Create topic randomization function
  - [ ] Test that all 6 topics appear in random order
  - [ ] Ensure difficulty tracking works across topics
- [ ] Visual polish pass (AC: 6)
  - [ ] Review spacing consistency across all pages
  - [ ] Audit color usage for accessibility (contrast ratios)
  - [ ] Add smooth animations for correct answer (green flash, confetti)
  - [ ] Add gentle animations for incorrect answer (red flash, encouraging shake)
  - [ ] Polish transition between screens
  - [ ] Ensure consistent button sizes and styles
- [ ] Add keyboard navigation (AC: 7)
  - [ ] Enable Tab navigation for topic selection
  - [ ] Enable Enter key for topic selection
  - [ ] Ensure math answer input is keyboard accessible
  - [ ] Test full keyboard flow through the app
  - [ ] Add visible focus indicators
- [ ] Review all user-facing text (AC: 8)
  - [ ] Audit button labels, headings, instructions
  - [ ] Remove or simplify technical terms
  - [ ] Ensure consistent, friendly tone
  - [ ] Test with native German speakers for age-appropriate language

## Dev Notes

### Relevant Architecture

**NFR3 Requirement:**
- "The user interface MUST be intuitive and easily navigable for children aged 8-9."

**NFR7 Requirement:**
- "Error handling SHOULD be user-friendly, providing simple feedback without technical jargon."

**NFR8 Requirement:**
- "Visual assets (character head, styling items) SHOULD be appealing and appropriate for the target age group."

### Current State

**Character Display:**
- Currently uses simple emoji-based head (yellow circle with eyes and smile)
- Located in `src/client/src/components/CharacterDisplay.tsx`
- Renders on `#FFE4E1` background by default

**Error Handling:**
- ErrorBoundary exists in `src/client/src/components/ErrorBoundary.tsx`
- Currently shows generic React error messages
- Needs child-friendly replacement

**Gemischte Aufgaben:**
- Button exists in TopicSelection.tsx (line 66-77)
- Currently defaults to 'addition' topic (not randomized)
- Needs proper randomization logic

### Design Considerations

**Character Design Principles:**
- Simple, clean lines (easy to recognize)
- Gender-neutral appearance
- Friendly, welcoming expression
- Works well with emoji accessories (current items are emojis)
- Scalable vector format (SVG)

**Child-Friendly Language Examples:**
- ❌ "Error: Failed to load user progress"
- ✅ "Ups! Wir konnten deine Fortschritte nicht laden. Versuch es nochmal!"

- ❌ "Invalid input"
- ✅ "Das ist keine Zahl. Probier's nochmal!"

- ❌ "Network error"
- ✅ "Oh nein! Etwas ist schiefgelaufen. Keine Sorge, versuchen wir es einfach nochmal!"

### Accessibility Guidelines

**Keyboard Navigation:**
- All interactive elements must be keyboard accessible
- Visible focus indicators (outline or highlight)
- Logical tab order
- Enter/Space to activate buttons

**Color Contrast:**
- Minimum 4.5:1 contrast ratio for text
- Use tools like WebAIM Contrast Checker

### SVG Character Resources

**Free SVG Resources:**
- Undraw (unDraw.co) - customizable illustrations
- Humaaans (humaaans.com) - mix-and-match characters
- Open Peeps (openpeeps.com) - hand-drawn character library
- Create custom in Figma or Adobe Illustrator

**Requirements:**
- License allows commercial use
- SVG format for scalability
- Child-appropriate style
- Easy to modify/customize

### Testing

- **Visual Testing:** Review character on different screen sizes and devices
- **Accessibility:** Test keyboard navigation flow
- **Language Testing:** Review with native German speakers (preferably parents of target age)
- **Animation Testing:** Ensure animations are smooth and not distracting
- **Error Testing:** Trigger errors intentionally to verify messages

## Change Log

| Date | Version | Description | Author |
|------|---------|-------------|--------|
| 2025-10-25 | 1.0 | Story created from course correction analysis | PM John |

## Dev Agent Record

*This section will be populated during implementation.*

## QA Results

*This section will be populated after QA review.*
