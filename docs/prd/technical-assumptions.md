# Technical Assumptions

### Repository Structure

* [cite_start]**Structure:** Single Repository (Monorepo)[cite: 1021].
    * **Rationale:** For the MVP web application, a single repository containing both client and server code is simplest and allows for easy development and deployment.

### Service Architecture

* [cite_start]**Architecture:** Client-Side Web Application with Static Server (MVP)[cite: 1022].
    * **Rationale:** The MVP is implemented as a React-based web application. All game logic, math engine, and data persistence reside on the client using browser storage (IndexedDB). A lightweight Express server serves the static assets.

### Testing Requirements

* [cite_start]**Testing:** Unit Tests required, basic component tests recommended[cite: 1023].
    * **Rationale:** Unit tests are essential for verifying the math engine, adaptive difficulty logic, and reward system. Basic component tests (using React Testing Library) ensure core interactions function correctly. Comprehensive E2E testing is out of scope for MVP.

### Additional Technical Assumptions and Requests

* **Platform & Language:** Web application using React 18+ with TypeScript 5+. Rationale: Provides cross-platform compatibility and modern development experience with type safety.
* **Build Tool:** Vite 7+ for fast development and optimized production builds. Rationale: Modern, fast, and excellent developer experience.
* **Local Storage:** IndexedDB (via browser API) for persisting unlocked items and user progress. Rationale: Sufficient for MVP needs, avoids backend complexity, works offline.
* **Browser Compatibility:** Target modern evergreen browsers (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+). Rationale: Balances modern features with reasonable browser coverage.
* **UI Framework:** Shadcn/ui with Radix UI primitives and Tailwind CSS. Rationale: Accessible components, consistent design system, rapid development.
* **Routing:** Wouter for client-side routing. Rationale: Lightweight and performant.
* **Testing:** Vitest for unit tests and React Testing Library for component tests. Rationale: Fast, modern testing tools with excellent TypeScript support.
* **External APIs:** None required for MVP.
* **Graphics:** SVG and web-optimized 2D assets for scalability and performance.

---
