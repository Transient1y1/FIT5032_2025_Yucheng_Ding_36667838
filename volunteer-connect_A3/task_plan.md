# VolunteerConnect A3 HD Task Plan

## Goal

Extend the A2 VolunteerConnect Vue application into an independent A3 implementation covering BR D, E and F while keeping the A2 theme and workflows intact.

## Phases

- [completed] Bootstrap A3, dependency/configuration layer and persistent notes
- [completed] Firebase-ready data/auth adapters with local demo fallback
- [completed] BR D/E: tables, email/export, map, REST/API and accessibility
- [completed] BR F: booking, bulk email, charts, AI adapter, admin and offline features
- [completed] Build, browser smoke test and deployment documentation

## Decisions

- Firebase is the production backend target.
- Leaflet/OpenStreetMap is the map stack.
- Resend is the email provider through Cloud Functions.
- GenAI is provider-agnostic and disabled safely without a server key.
- A2 seed opportunities and coordinator demo identity remain available.

## Errors Encountered

| Error | Attempt | Resolution |
|---|---:|---|
| npm install attempted to create `D:\` | 1 | Retried with project-local `--prefix .`; dependencies installed successfully. |
| Browser automation runtime was not exposed in this session | 1 | Used local Vite HTTP route checks plus production build and Node Functions load checks. |
