# Sentinel Dynamic

Voice-activated personal safety application. Self-hosted, zero external cloud dependencies.

## Architecture

- **Frontend**: React 18 + Vite, wouter routing, TanStack Query v5, Tailwind CSS, shadcn/ui, framer-motion
- **Backend**: Express.js, Drizzle ORM, PostgreSQL
- **No auth** - single-user self-hosted app

## Theme

- Dark only: background #0d0d0d, primary turquoise #00d4aa
- Fonts: Cinzel (headings/labels), Inter (body)
- All buttons/inputs use rounded-none
- No light mode toggle

## Database Tables

- `emergency_contacts` - 3-tier contact system (levels 1/2/3)
- `alert_settings` - per-level activation phrases, message templates
- `user_preferences` - system armed state, voice sensitivity, decoy mode
- `check_in_timers` - timed check-ins with auto-alert
- `safe_locations` - GPS coordinates with auto-disarm radius

## Pages

- `/` - Landing page (full-screen, no sidebar)
- `/home` - System status, arm/disarm shield, voice test
- `/map` - Live GPS map (Leaflet + OpenStreetMap), real-time tracking, safe location markers
- `/contacts` - Manage emergency contacts by level
- `/alerts` - Configure alert phrases and message templates
- `/checkin` - Check-in timer management
- `/locations` - Safe location management
- `/settings` - User preferences, decoy mode, voice sensitivity

## Key Features

- Voice trigger simulation with Web Audio API beep (works offline)
- Decoy mode: beep sounds play even when system disarmed
- EXIT button in header redirects to google.com (stealth)
- GPS location tracking via browser Geolocation API
- Leaflet map with safe location markers and radius circles
- Online/offline status indicators

## File Structure

- `shared/schema.ts` - Drizzle schema + Zod insert schemas + types
- `server/db.ts` - Database connection
- `server/storage.ts` - DatabaseStorage class (IStorage interface)
- `server/routes.ts` - All API routes
- `server/seed.ts` - Initial seed data
- `client/src/pages/` - All page components
- `client/src/components/` - Shared components (app-sidebar, voice-activation-control, etc.)
