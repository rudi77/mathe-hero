# Source Tree

```plaintext
src/
├── client/                          # Client-side React application
│   └── src/
│       ├── App.tsx                  # Root App component with routing
│       ├── main.tsx                 # Entry point, renders App
│       ├── const.ts                 # Global constants
│       ├── components/              # Reusable UI components
│       │   ├── CharacterDisplay.tsx
│       │   ├── ItemPalette.tsx
│       │   ├── RewardNotification.tsx
│       │   ├── ManusDialog.tsx
│       │   ├── ErrorBoundary.tsx
│       │   └── ui/                  # Shadcn/ui components
│       │       ├── button.tsx
│       │       ├── dialog.tsx
│       │       ├── card.tsx
│       │       └── ... (30+ components)
│       ├── pages/                   # Page-level components (routes)
│       │   ├── Home.tsx
│       │   ├── Styling.tsx
│       │   ├── TopicSelection.tsx
│       │   ├── MathTask.tsx
│       │   └── NotFound.tsx
│       ├── contexts/                # React Context providers
│       │   ├── AppContext.tsx       # Main app state context
│       │   └── ThemeContext.tsx     # Theme management
│       ├── hooks/                   # Custom React hooks
│       │   ├── useComposition.ts
│       │   ├── useMobile.tsx
│       │   └── usePersistFn.ts
│       ├── lib/                     # Business logic & utilities
│       │   ├── mathEngine.ts        # Math problem generation
│       │   ├── rewardManager.ts     # Reward/unlock logic
│       │   ├── db.ts                # IndexedDB service
│       │   ├── initialData.ts       # Initial data seeding
│       │   ├── utils.ts             # Utility functions
│       │   └── __tests__/           # Unit tests
│       │       ├── mathEngine.test.ts
│       │       └── rewardManager.test.ts
│       ├── types/                   # TypeScript type definitions
│       │   └── models.ts            # Data model interfaces
│       ├── test/                    # Test configuration
│       │   └── setup.ts
│       └── index.css                # Global styles & Tailwind
├── server/                          # Express server (static file serving)
│   └── index.ts                     # Server entry point
├── shared/                          # Shared code between client/server
│   └── const.ts
├── package.json                     # Dependencies & scripts
├── tsconfig.json                    # TypeScript configuration
├── vite.config.ts                   # Vite build configuration
├── vitest.config.ts                 # Vitest test configuration
├── tailwind.config.ts               # Tailwind CSS configuration
└── .env                             # Environment variables (if needed)
```

-----
