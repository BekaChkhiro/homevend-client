# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Development Commands

```bash
npm install                          # Install dependencies
npm run dev                          # Start dev server on port 8080 (not 5173)
npm run build                        # Production build to ./build directory
npm run build:dev                    # Development build
npm run preview                      # Preview production build
npm run lint                         # Run ESLint
npm test                             # Run Vitest tests
npm test -- --run src/path/file.test.tsx  # Run single test file
npm run test:coverage                # Run tests with coverage report
```

## High-Level Architecture

React-based real estate platform built with Vite, TypeScript, and shadcn/ui components.

### Tech Stack
- **Build Tool**: Vite with React SWC plugin
- **Framework**: React 18 with TypeScript
- **Routing**: React Router v6
- **UI Components**: shadcn/ui (Radix UI + Tailwind CSS)
- **State Management**: TanStack Query + Context API (AuthContext, CurrencyContext)
- **Styling**: Tailwind CSS with class-variance-authority
- **Form Handling**: React Hook Form with Zod validation
- **i18n**: i18next with URL-based language detection (en, ka/Georgian, ru)
- **Testing**: Vitest with @testing-library/react

### Project Structure
- `src/pages/` - Page components (Dashboard/, AdminDashboard/)
- `src/components/` - Reusable components (PropertyCard, FilterPanel, etc.)
- `src/components/ui/` - shadcn/ui component library
- `src/contexts/` - React Context providers
- `src/hooks/` - Custom React hooks
- `src/lib/` - Utilities (api.ts for backend calls)
- `src/i18n/` - Translation files

### Key Architectural Patterns

1. **Authentication**: JWT-based via AuthContext with localStorage persistence

2. **Routing Structure**: All routes defined in App.tsx with language prefix (`/en/`, `/ge/`, `/ru/`)

3. **API Integration**: All backend calls via `src/lib/api.ts`, proxied to `http://localhost:5000/api`

4. **Path Aliases**: `@/*` maps to `./src/*`

5. **Build Output**: `./build` directory (not default `dist`)

6. **Dashboard Architecture**:
   - User Dashboard (`/dashboard`) with nested routes
   - Admin Dashboard (`/admin`) with role-based access
   - Both use outlet-based routing with sidebar navigation

7. **i18n URL Structure**:
   - URL `ge` maps to i18n code `ka` (Georgian)
   - Default fallback: Georgian (`ka`)

### Development Notes
- Dev server runs on port 8080 (not Vite's default 5173)
- TypeScript configured with relaxed settings for rapid prototyping
- Lovable-tagger plugin active in development mode only
- Console logs stripped in production builds
