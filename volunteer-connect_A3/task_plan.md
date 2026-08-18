# VolunteerConnect A3 HD Task Plan

## Goal

Extend the A2 VolunteerConnect Vue application into an independent A3 implementation covering BR D, E and F while keeping the A2 theme and workflows intact.

## Phases

- [completed] Bootstrap A3, dependency/configuration layer and persistent notes
- [completed] Vercel Functions and Neon/Postgres data/auth adapters with JWT sessions
- [completed] BR D/E: tables, email/export, map, REST/API and accessibility
- [completed] BR F: booking, bulk email, charts, AI adapter, admin and offline features
- [completed] Build, browser smoke test and deployment documentation

## Decisions

- Vercel Functions + Neon/Postgres is the production backend target.
- Leaflet/OpenStreetMap is the map stack.
- Resend is the email provider through Vercel Functions.
- GenAI is provider-agnostic and disabled safely without a server key.
- A2 seed opportunities and coordinator demo identity remain available.
- To stay within the Vercel Hobby limit, one catch-all Function dispatches all `/api/*` routes to handlers in `server/`.

## Errors Encountered

| Error | Attempt | Resolution |
|---|---:|---|
| npm install attempted to create `D:\` | 1 | Retried with project-local `--prefix .`; dependencies installed successfully. |
| Browser automation runtime was not exposed in this session | 1 | Used local Vite HTTP route checks plus production build and Node Functions load checks. |
| Vercel Hobby plan rejected more than 12 Functions | 1 | Consolidated the API behind `api/[...route].js` and excluded API paths from the SPA fallback. |
