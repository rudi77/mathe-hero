# Responsiveness Strategy

## Breakpoints

*(Tailwind CSS default breakpoints)*

| Breakpoint   | Min Width | Target Devices                         |
| :----------- | :-------- | :------------------------------------- |
| Mobile (sm)  | 0px       | Mobile Phones (Portrait)               |
| Tablet (md)  | 768px     | Tablets, Large Phones (Landscape)      |
| Desktop (lg) | 1024px    | Small Desktops, Tablets (Landscape)    |
| Desktop (xl) | 1280px    | Standard Desktops                      |
| Wide (2xl)   | 1536px    | Large Desktops                         |

## Adaptation Patterns

  * **Layout Changes:** Mobile-first approach (320px+). Palette displayed below character on mobile, moves to sidebar on tablet+. [cite\_start]Avoid complex multi-column layouts for MVP[cite: 1412].
  * [cite\_start]**Navigation Changes:** Minimal changes likely needed for MVP[cite: 1412].
  * **Content Priority:** Character and palette remain primary. [cite\_start]Math tasks use larger font sizes on desktop[cite: 1412].
  * **Interaction Changes:** Touch-friendly on mobile/tablet, mouse/keyboard optimized on desktop. [cite\_start]Ensure touch targets remain adequate (min 44x44px)[cite: 1412].

-----
