# Mathe-Stylistin 🎨📐

[![Tests](https://github.com/rudi77/mathe-hero/actions/workflows/test.yml/badge.svg)](https://github.com/rudi77/mathe-hero/actions/workflows/test.yml)
[![codecov](https://codecov.io/gh/rudi77/mathe-hero/branch/main/graph/badge.svg)](https://codecov.io/gh/rudi77/mathe-hero)

Eine Progressive Web App (PWA) für Grundschulkinder (3. Klasse Bayern), die Mathematikübungen mit kreativem Styling kombiniert. Kinder lösen Matheaufgaben, um digitale Styling-Items freizuschalten und einen virtuellen Charakterkopf zu gestalten.

## 🎯 Projektübersicht

**Mathe-Stylistin** motiviert Kinder zum Mathe-Lernen durch ein spielerisches Belohnungssystem. Jede richtig gelöste Aufgabe bringt sie näher zum Freischalten neuer Farben, Accessoires und Effekte für ihren Charakter.

### Kernfeatures

- ✅ **Styling Interface**: Virtueller Charakterkopf mit anpassbaren Items
- ✅ **Math Engine**: Aufgaben für Addition, Subtraktion, Multiplikation, Division, Geometrie und Größen
- ✅ **Adaptive Schwierigkeit**: Passt sich automatisch an die Leistung des Kindes an
- ✅ **Reward System**: Schaltet nach jeweils 5 richtigen Antworten ein neues Item frei
- ✅ **Lokale Datenpersistenz**: Alle Fortschritte werden lokal im Browser gespeichert (IndexedDB)
- ✅ **PWA-Ready**: Installierbar auf Android-Geräten als App
- ✅ **Responsive Design**: Optimiert für Smartphones und Tablets
- ✅ **Touch-Optimiert**: Große Touch-Targets (min. 48x48px) für Kinder

## 🛠️ Technologie-Stack

### Frontend
- **React 19** mit **TypeScript**
- **Tailwind CSS 4** für Styling
- **Jetpack Compose**-inspirierte Komponentenarchitektur
- **IndexedDB** für lokale Datenspeicherung
- **Wouter** für Client-Side Routing

### Design
- **Farbpalette**: Bunt und kindgerecht
  - Primary: Blau (#3498DB)
  - Secondary: Gelb (#F1C40F)
  - Accent: Pink (#E74C3C)
  - Success: Grün (#2ECC71)
- **Typografie**: Nunito (Google Fonts)
- **Icons**: Emojis für maximale Kompatibilität

### Testing
- **Vitest** für Unit Tests
- **@testing-library/react** für Component Tests
- **27 Tests** mit voller Abdeckung der Kernlogik

## 📁 Projektstruktur

```
mathe-stylistin/
├── client/
│   ├── public/
│   │   ├── manifest.json          # PWA Manifest
│   │   ├── icon-192.png           # App Icon (192x192)
│   │   └── icon-512.png           # App Icon (512x512)
│   └── src/
│       ├── components/
│       │   ├── CharacterDisplay.tsx    # Charakter-Anzeige
│       │   ├── ItemPalette.tsx         # Item-Auswahl
│       │   └── RewardNotification.tsx  # Freischaltungs-Dialog
│       ├── contexts/
│       │   └── AppContext.tsx          # Globaler App-State
│       ├── lib/
│       │   ├── db.ts                   # IndexedDB Service
│       │   ├── mathEngine.ts           # Matheaufgaben-Generator
│       │   ├── rewardManager.ts        # Belohnungssystem
│       │   ├── initialData.ts          # Initiale Items & Progress
│       │   └── __tests__/              # Unit Tests
│       ├── pages/
│       │   ├── Styling.tsx             # Hauptseite (Styling)
│       │   ├── TopicSelection.tsx      # Themenauswahl
│       │   └── MathTask.tsx            # Matheaufgaben-Seite
│       ├── types/
│       │   └── models.ts               # TypeScript Typen
│       ├── App.tsx                     # App-Root mit Routing
│       └── index.css                   # Globale Styles & Theme
├── vitest.config.ts                    # Test-Konfiguration
└── package.json
```

## 🚀 Installation & Entwicklung

### Voraussetzungen
- Node.js 18+
- pnpm (empfohlen) oder npm

### Setup

```bash
# Repository klonen
cd mathe-stylistin

# Dependencies installieren
pnpm install

# Entwicklungsserver starten
pnpm dev
```

Die App läuft dann auf `http://localhost:3000`

### Verfügbare Scripts

```bash
pnpm dev              # Entwicklungsserver
pnpm build            # Production Build
pnpm preview          # Preview des Builds
pnpm test             # Tests ausführen
pnpm test:ui          # Tests mit UI
pnpm test:coverage    # Tests mit Coverage Report
pnpm check            # TypeScript Type-Checking
pnpm format           # Code formatieren
```

## 🎮 Verwendung

### 1. Hauptseite (Styling)
- Zeigt den Charakter und die verfügbaren Items
- Klicke auf ein Item, um es auszuwählen
- Bei Farben: Hintergrund ändert sich sofort
- Bei Accessoires/Effekten: Klicke auf den Kopf, um das Item zu platzieren
- Statistik zeigt Fortschritt an

### 2. Themenauswahl
- Klicke auf "Mathe üben 🎓"
- Wähle ein Mathe-Thema:
  - Addition ➕
  - Subtraktion ➖
  - Multiplikation ✖️
  - Division ➗
  - Geometrie 📐
  - Größen 📏

### 3. Matheaufgaben
- Löse die angezeigte Aufgabe
- Bei Rechenaufgaben: Gib die Zahl ein
- Bei Multiple Choice: Wähle die richtige Antwort
- Nach 5 richtigen Antworten: Neues Item wird freigeschaltet! 🎉

## 🧪 Testing

Das Projekt enthält umfassende Unit Tests für die Kernlogik:

### MathEngine Tests (18 Tests)
- Generierung aller Aufgabentypen
- Korrekte Berechnung der Lösungen
- Adaptive Schwierigkeit
- Validierung von Antworten

### RewardManager Tests (9 Tests)
- Item-Freischaltung bei Schwellenwert
- Progress-Tracking
- Locked/Unlocked Items

### Test Commands

```bash
# Tests im Watch-Modus ausführen (empfohlen für Entwicklung)
pnpm test

# Tests einmalig ausführen (für CI/CD)
pnpm test -- --run

# Tests mit interaktiver UI
pnpm test:ui

# Tests mit Coverage Report
pnpm test:coverage

# TypeScript Type-Checking
pnpm check
```

### CI/CD Pipeline

Das Projekt verwendet GitHub Actions für automatisierte Tests:

- ✅ **Automatische Tests** bei jedem Push/Pull Request
- ✅ **TypeScript Type-Checking** vor Tests
- ✅ **Coverage Reports** mit Codecov Integration
- ✅ **Test Summary** in GitHub Actions Output
- ✅ **Coverage Badge** im README

**Workflow-Datei:** `.github/workflows/test.yml`

### Pre-Commit Hooks

Pre-commit hooks sind konfiguriert und führen automatisch Tests vor jedem Commit aus:

```bash
# Normaler Commit (Tests laufen automatisch)
git commit -m "Your message"

# Hook für einen Commit überspringen (nur im Notfall!)
git commit -m "Your message" --no-verify

# Oder mit Umgebungsvariable
HUSKY=0 git commit -m "Your message"
```

**Test-Ergebnisse:**
- ✅ 27/27 Tests bestanden
- ✅ >70% Coverage-Ziel
- ✅ Volle Abdeckung der Kernlogik

## 📱 PWA Installation

Die App kann auf Android-Geräten als Progressive Web App installiert werden:

1. Öffne die App im Chrome Browser
2. Tippe auf das Menü (⋮)
3. Wähle "Zum Startbildschirm hinzufügen"
4. Die App erscheint als Icon auf dem Homescreen

### PWA Features
- ✅ Offline-fähig (nach erstem Laden)
- ✅ Installierbar auf dem Homescreen
- ✅ Fullscreen-Modus
- ✅ Eigenes App-Icon
- ✅ Splash Screen

## 🎨 Design-System

### Farbpalette
```css
--primary: #3498DB (Blau)
--secondary: #F1C40F (Gelb)
--accent: #E74C3C (Pink/Rot)
--success: #2ECC71 (Grün)
```

### Typografie
- **Font**: Nunito (400, 600, 700, 800)
- **Größen**: 14sp - 24sp
- **Line Height**: 1.5

### Spacing
- Grid: 8dp Basis
- Touch Targets: Min. 48x48px
- Border Radius: 1rem (16px)

## 📊 Datenmodelle

### StylingItem
```typescript
{
  id: string;
  type: 'color' | 'accessory' | 'effect';
  name: string;
  assetReference: string;
  isUnlocked: boolean;
  category?: string;
}
```

### UserProgress
```typescript
{
  id: number;
  difficultyLevelAddition: number;
  difficultyLevelSubtraction: number;
  difficultyLevelMultiplication: number;
  difficultyLevelDivision: number;
  difficultyLevelGeometry: number;
  difficultyLevelSizes: number;
  correctAnswersStreak: number;
  totalCorrectAnswers: number;
  totalIncorrectAnswers: number;
  lastSessionDate: string;
}
```

## 🔧 Konfiguration

### Reward System
Der Schwellenwert für Item-Freischaltung ist in `rewardManager.ts` konfigurierbar:

```typescript
private readonly UNLOCK_THRESHOLD = 5; // Anzahl korrekter Antworten
```

### Initiale Items
Die verfügbaren Styling-Items sind in `initialData.ts` definiert:
- 7 Farben (3 initial freigeschaltet)
- 8 Accessoires (1 initial freigeschaltet)
- 2 Effekte (beide gesperrt)

## 🎯 Lernziele (3. Klasse Bayern)

Die App deckt folgende Bereiche des bayerischen Lehrplans ab:

- **Zahlen bis 1000**: Addition, Subtraktion, Multiplikation, Division
- **Geometrie**: Formen erkennen, Ecken und Seiten zählen
- **Größen**: Länge (cm, m), Gewicht (g, kg), Zeit (min, h)

### Adaptive Schwierigkeit
- Start: Difficulty Level 1
- Range: 1-10
- Anpassung: ±0.5 pro Aufgabe
- Bei richtig: Schwierigkeit steigt
- Bei falsch: Schwierigkeit sinkt

## 🚀 Deployment

### Production Build
```bash
pnpm build
```

Erstellt optimierte Dateien in `dist/`

### Hosting
Die App kann auf jedem Static Hosting Service deployed werden:
- Vercel
- Netlify
- GitHub Pages
- Firebase Hosting

## 📝 Lizenz

MIT License

## 👨‍💻 Entwicklung

### Architektur-Prinzipien
- **MVVM Pattern**: Trennung von UI und Logik
- **Repository Pattern**: Abstraktion der Datenpersistenz
- **State Hoisting**: React Context für globalen State
- **Immutability**: Unveränderliche Datenstrukturen

### Code-Qualität
- ✅ TypeScript für Type Safety
- ✅ ESLint & Prettier für Code Style
- ✅ Unit Tests für Kernlogik
- ✅ Responsive Design
- ✅ Accessibility (WCAG 2.1 Basics)

## 🐛 Bekannte Einschränkungen

- **MVP-Scope**: Fokus auf Kernfunktionalität
- **Keine Backend-Synchronisation**: Alle Daten lokal
- **Keine Multiplayer-Features**: Einzelspieler-Modus
- **Keine Parent/Teacher Dashboard**: Keine Fortschrittsberichte
- **Emoji-basierte Assets**: Keine Custom-Grafiken

## 🔮 Zukünftige Features (Post-MVP)

- [ ] iOS Support
- [ ] Backend-Synchronisation
- [ ] KI-Lernassistent
- [ ] Erweiterte Styling-Optionen
- [ ] Multiplayer-Modus
- [ ] Parent/Teacher Dashboard
- [ ] Weitere Klassenstufen
- [ ] Achievements & Badges
- [ ] Sound-Effekte
- [ ] Animationen

## 📞 Support

Bei Fragen oder Problemen:
- GitHub Issues
- Dokumentation in `/docs`
- Code-Kommentare

---

**Viel Spaß beim Mathe-Lernen! 🎉📐🎨**

