# Accessibility Requirements

## Compliance Target

  * **Standard:** MVP focuses on fundamental accessibility best practices. [cite\_start]WCAG 2.1 Level AA is a post-MVP goal[cite: 1407].

## Key Requirements

*(MVP Basics)*

  * **Visual:**
      * [cite\_start]**Color Contrast:** Meet WCAG AA minimum ratios (4.5:1 for normal text, 3:1 for large text)[cite: 1408].
      * [cite\_start]**Focus Indicators:** Use clear, visible focus rings (Tailwind's `focus:` variants)[cite: 1408].
      * [cite\_start]**Text Sizing:** Use readable default sizes (minimum 16px for body text)[cite: 1408].
  * **Interaction:**
      * [cite\_start]**Keyboard Navigation:** Full keyboard support - all interactive elements focusable and operable via keyboard[cite: 1408].
      * [cite\_start]**Screen Reader Support:** Use semantic HTML and ARIA labels where needed (Radix UI provides built-in ARIA)[cite: 1408].
      * [cite\_start]**Touch Targets:** Ensure minimum 44x44px touch target size on mobile[cite: 1408].
  * **Content:**
      * [cite\_start]**Alternative Text:** Use `alt` attributes for images, `aria-label` for icon-only buttons[cite: 1409].
      * [cite\_start]**Heading Structure:** Use semantic HTML (`h1`, `h2`, `h3`) in proper hierarchy[cite: 1409].
      * [cite\_start]**Form Labels:** Associate labels with inputs using `htmlFor` attribute or wrapping[cite: 1409].
      * **Language:** Specify `lang="de"` on `<html>` tag for German content.

## Testing Strategy

  * [cite\_start]**MVP:** Basic manual checks (contrast, touch size), keyboard navigation testing, limited testing with screen readers (NVDA/VoiceOver)[cite: 1407].
  * **Tools:** Use browser DevTools accessibility inspector, axe DevTools extension.

-----
