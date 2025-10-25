# Tech Stack

## Cloud Infrastructure

  * [cite\_start]**Provider:** N/A (MVP uses browser local storage only)[cite: 433].
  * **Key Services:** Optional static hosting (Vercel, Netlify, or similar for deployment).
  * **Deployment Regions:** N/A for MVP (CDN distribution available through hosting providers).

## Technology Stack Table

| Category            | Technology        | Version (Minimum/Target) | Purpose                                  | Rationale                                                                 |
| :------------------ | :---------------- | :----------------------- | :--------------------------------------- | :------------------------------------------------------------------------ |
| **Language** | TypeScript        | 5.6+                     | Primary development language             | Type safety, excellent IDE support, catches errors at compile time    |
| **Runtime** | Node.js           | 20+                      | Server runtime for Express               | Industry standard, excellent ecosystem                                    |
| **UI Framework** | React             | 18.3+                    | Declarative UI library                   | Component-based architecture, large ecosystem, excellent performance      |
| **Build Tool** | Vite              | 7.1+                     | Fast dev server and build tool           | Lightning-fast HMR, optimized production builds, modern ESM-based         |
| **Styling** | Tailwind CSS      | 4.1+                     | Utility-first CSS framework              | Rapid UI development, consistent design system, small bundle size         |
| **UI Components** | Shadcn/ui         | Latest                   | Accessible component library             | Built on Radix UI, customizable, accessible, TypeScript-first            |
| **UI Primitives** | Radix UI          | Latest                   | Unstyled accessible components           | WCAG compliant, keyboard navigation, screen reader support                |
| **Router** | Wouter            | 3.3+                     | Lightweight client-side routing          | Minimal bundle size (1.3KB), simple API, React hooks-based                |
| **State Management** | React Context  | Built-in                 | Global application state                 | No external dependency, sufficient for MVP scope                          |
| **Data Queries** | TanStack Query    | 4.41+                    | Server state management                  | Caching, background updates, optimistic updates (for future API use)      |
| **Local Storage** | IndexedDB         | Browser API              | Client-side data persistence             | Structured storage, works offline, async API, large storage capacity      |
| **Animations** | Framer Motion     | 12.23+                   | Animation library                        | Declarative animations, smooth performance, gesture support               |
| **Icons** | Lucide React      | Latest                   | Icon library                             | Consistent design, tree-shakeable, extensive collection                   |
| **Forms** | React Hook Form   | 7.64+                    | Form validation and management           | Excellent performance, minimal re-renders, TypeScript support             |
| **Schema Validation** | Zod           | 4.1+                     | Runtime type validation                  | TypeScript-first, composable schemas, excellent error messages            |
| **Server** | Express           | 4.21+                    | Static file server                       | Lightweight, standard, simple setup for serving built assets              |
| **Package Manager** | pnpm            | 10.4+                    | Fast, disk-efficient package manager     | Faster than npm/yarn, saves disk space, strict dependency resolution      |
| **Unit Testing** | Vitest            | 2.1+                     | Fast unit test framework                 | Vite-native, Jest-compatible API, excellent TypeScript support            |
| **Component Testing** | React Testing Library | 16.3+            | React component testing                  | Encourages accessibility, tests user behavior not implementation          |
| **Test Utilities** | jsdom             | 27.0+                    | DOM implementation for Node.js           | Enables component testing in Node environment                             |
| **Browser Compatibility** | Evergreen browsers | Chrome 90+, Firefox 88+, Safari 14+, Edge 90+ | Target browsers | Modern features, broad coverage, automatic updates                        |

-----
