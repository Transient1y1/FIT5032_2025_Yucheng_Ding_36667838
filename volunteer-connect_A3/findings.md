# A3 Findings

## Baseline

- A2 is a Vue 3 + Vite + Bootstrap application with client-side auth, local opportunity data, volunteer applications, coordinator review and ratings.
- A2 has no Firebase, Firestore, Cloud Functions, map, email, data table, chart, export or service worker integration.
- A2 already has a strong responsive visual system in `src/assets/main.css` and six seeded opportunities in `src/data/opportunities.js`.
- The A2 directory must remain untouched; A3 is the implementation boundary.

## Assessment Mapping

- BR D.1: external authentication adapter and Firebase-ready configuration.
- BR D.2: server-side email adapter with attachment payload support.
- BR D.3: reusable table component with per-column search, sorting and ten-row pagination.
- BR D.4: Firebase Hosting configuration and deployment instructions.
- BR E.1: callable/HTTP cloud-function contract documented in the client adapter.
- BR E.2: Leaflet map with marker search and route planning.
- BR E.3: keyboard, labels, focus, contrast and reduced-motion checks.
- BR E.4: CSV and printable/PDF-friendly exports.
- BR F.1: booking, bulk mail, REST endpoints, charts, AI adapter, admin dashboard and offline support.

