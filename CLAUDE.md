# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Development Commands

### Development
```bash
npm run dev        # Start development server on port 8080
npm run build      # Production build to ./build directory
npm run build:dev  # Development build
npm run preview    # Preview production build
npm run lint       # Run ESLint (no fix flag available)
```

### Installation
```bash
npm install        # Install dependencies
```

## High-Level Architecture

This is a React-based real estate platform built with Vite, TypeScript, and shadcn/ui components.

### Tech Stack
- **Build Tool**: Vite with React SWC plugin
- **Framework**: React 18 with TypeScript
- **Routing**: React Router v6
- **UI Components**: shadcn/ui (Radix UI + Tailwind CSS)
- **State Management**: React Context API for authentication
- **Data Fetching**: TanStack Query (React Query)
- **Styling**: Tailwind CSS with class-variance-authority
- **Form Handling**: React Hook Form with Zod validation

### Project Structure
- `src/pages/` - Page components corresponding to routes
- `src/components/` - Reusable components (property cards, headers, etc.)
- `src/components/ui/` - shadcn/ui component library
- `src/contexts/` - React Context providers (AuthContext for authentication)
- `src/hooks/` - Custom React hooks
- `src/lib/` - Utility functions

### Key Architectural Patterns

1. **Authentication**: Mock authentication implemented via AuthContext with localStorage persistence. Test credentials:
   - User: test@example.com / password
   - Admin: admin@example.com / adminpass

2. **Routing Structure**: All routes defined in App.tsx with protected routes handled by authentication state

3. **Component Organization**: 
   - Page components handle routing and layout
   - Feature components (PropertyCard, FilterPanel) are self-contained
   - UI components from shadcn/ui provide consistent design system

4. **Path Aliases**: TypeScript configured with `@/*` alias mapping to `./src/*`

5. **Build Output**: Production builds output to `./build` directory (not default `dist`)

6. **Dashboard Architecture**: 
   - User Dashboard (`/dashboard`) with nested routes for properties, favorites, profile
   - Admin Dashboard (`/admin`) with role-based access control
   - Both dashboards use outlet-based routing with sidebar navigation

7. **Mock Data Layer**: No backend integration - all data is mocked in components and contexts

### Development Notes
- Georgian language content present in AuthContext comments and user data
- Lovable platform integration via lovable-tagger plugin (development mode only)
- TypeScript configured with relaxed settings for rapid prototyping
- Server runs on port 8080 (not default 5173)
- No test framework configured