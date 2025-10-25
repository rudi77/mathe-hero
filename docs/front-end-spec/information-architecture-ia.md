# Information Architecture (IA)

## Site Map / Screen Inventory

[cite_start]This diagram shows the main screens/areas of the MVP and how they connect[cite: 1381].

```mermaid
graph TD
    A[Main Styling Screen] --> B{Start Math Task};
    B --> C[Topic Selection Screen];
    C --> D[Math Task Screen/Modal];
    D -- Correct Answer --> E(Show Reward Unlocked);
    E --> A;
    D -- Incorrect Answer --> F(Show Feedback);
    F --> A;
    A --> G[Item Inventory (within Styling Screen)];
````

**Description:**

  * The **Main Styling Screen (A)** is the central hub.
  * From here, the user can initiate a **Math Task (B)**.
  * This first leads to **Topic Selection (C)**.
  * Then, the **Math Task Screen/Modal (D)** is presented.
  * Correct answers trigger a **Reward Notification (E)** and return to Styling.
  * Incorrect answers show **Feedback (F)** and return to Styling.
  * The **Item Inventory (G)** is likely integrated directly into the Main Styling Screen, showing available items.

## Navigation Structure

  * **Primary Navigation:** Will likely be minimal, possibly just access to the math tasks/topics from the main styling screen. No complex menus needed for MVP.
  * **Secondary Navigation:** Not applicable for MVP.
  * **Breadcrumb Strategy:** Not necessary for this simple structure. [cite\_start]Transitions will be direct[cite: 1385].

-----
