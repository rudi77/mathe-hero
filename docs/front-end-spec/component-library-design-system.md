# Component Library / Design System

## Design System Approach

  * **Approach:** For the MVP, use Shadcn/ui component library built on Radix UI primitives with Tailwind CSS. [cite\_start]Consistency through Tailwind design tokens and Shadcn component standards[cite: 1397]. [cite\_start]A formal custom design system is post-MVP[cite: 1397].
  * **Customization:** Customize Shadcn components via `components/ui/` folder and Tailwind config.

## Core Components

*(Initial list - Architect/Developer will refine)*

  * **CharacterDisplay:**
      * [cite\_start]**Purpose:** Renders the virtual character head and applied styling items[cite: 1398].
      * **Usage:** Central element on Main Styling Screen.
  * **ItemPalette:**
      * [cite\_start]**Purpose:** Displays available/unlocked styling items[cite: 1398].
      * [cite\_start]**States:** Locked, unlocked, selected[cite: 1398].
      * **Usage:** On Main Styling Screen, allows selection.
  * **MathTaskPresenter:**
      * [cite\_start]**Purpose:** Displays math problem and input controls[cite: 1398].
      * [cite\_start]**Variants:** Different input types[cite: 1398].
      * **Usage:** Within Math Task Screen/Modal.
  * **RewardNotification:**
      * [cite\_start]**Purpose:** Visually informs user of unlocked item[cite: 1398].
      * **Usage:** Appears temporarily after meeting criteria.
  * **TopicSelectorButton:**
      * [cite\_start]**Purpose:** Represents a math topic choice[cite: 1398].
      * **Usage:** On Topic Selection Screen.
  * **Basic Button:**
      * [cite\_start]**Purpose:** Standard action button[cite: 1398].
      * **Usage:** Consistent for main calls to action.

-----
