# VolunteerConnect A3

VolunteerConnect is a responsive Vue 3 web application concept for a Melbourne health charity. It connects university student volunteers with practical programs that support older adults' health, independence and social connection, while giving VolunteerConnect coordinators a structured way to review applicants.

## Current scope

The completed development milestones provide:

- Vue 3 with Vite
- Bootstrap 5 responsive layout
- Vue Router route structure
- Responsive navigation and footer
- Public home page and supporting information routes
- Six dynamic opportunity records seeded into Neon/Postgres on first API access
- Keyword search and filters for cause, location, mode, commitment and experience
- Responsive opportunity result cards and complete detail pages
- Empty search results and invalid opportunity states
- Volunteer registration and login with JWT session restoration
- A pre-seeded coordinator account
- Role-protected volunteer and coordinator dashboard routes
- Volunteer-specific saved opportunities stored in Local Storage
- An expression of interest form with required, length and consent validation
- Duplicate application prevention and application confirmation
- A volunteer dashboard with saved roles and application statuses
- A coordinator dashboard grouped by opportunity and applicant
- Coordinator access to volunteer availability, skills, notes and motivation
- Accept, waitlist, decline and request-more-information outcomes
- Application status updates visible on the volunteer dashboard
- A 1-5 star rating for the clarity and usefulness of each role
- An aggregate average score and rating count for every opportunity
- One editable rating per volunteer for each opportunity
- Shared client and service validation for user-entered text
- Same-origin Content Security Policy and allowlisted status and rating values
- Vue text interpolation without raw HTML rendering

The A3 implementation retains the A2 requirements and adds the advanced D, E and F feature set. Production authentication and data use Vercel Functions, Neon/Postgres and HttpOnly JWT cookies. A local demonstration fallback remains available when the API is deliberately disabled, allowing the interface to be reviewed without exposing credentials.

## A3 advanced features

- Vercel Functions, Neon/Postgres data contracts and JWT HttpOnly-cookie authentication.
- Reusable interactive opportunity and application tables with individual-column search, sorting and ten rows per page.
- CSV exports and printable PDF administrator reports.
- Leaflet/OpenStreetMap opportunity map with place search and OSRM route planning.
- FullCalendar booking interface with local conflict detection.
- Coordinator command centre with interactive Chart.js charts, selectable applicants and bulk-email preparation.
- Resend email Vercel Functions with attachment support and a safe no-key demonstration response.
- REST Functions API: `GET /api/opportunities` and `GET /api/opportunities/:id`.
- Provider-neutral GenAI Function with a safe demonstration insight when no AI key is configured.
- Service Worker application-shell cache, online/offline status, saved application drafts and offline action queue.
- WCAG-focused skip link, semantic labels, visible focus, status announcements and reduced-motion support.

## Setup

Requirements: Node.js 20 or newer and npm.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite. To verify a production build:

```bash
npm run build
npm run preview
```

## Vercel deployment

1. Import this repository in Vercel and set the project Root Directory to `volunteer-connect_A3`.
2. Keep the Vite defaults from `vercel.json`: `npm ci`, `npm run build`, output directory `dist`.
3. Install and connect the Neon Marketplace integration to this Vercel project, then add its `POSTGRES_URL` environment variable.
4. Add a generated `JWT_SECRET` of at least 32 random characters. Keep it server-only; do not prefix it with `VITE_`.
5. Set `VITE_API_ENABLED=true` for Preview and Production. Keep `VITE_API_BASE_URL` empty for the same-origin Vercel API.
6. Add `RESEND_API_KEY`, `MAIL_FROM`, and optional `AI_API_KEY`/`AI_ENDPOINT` as server-only variables.
7. Deploy with `npm run deploy:vercel`. The first database-backed request creates the tables, seeds six opportunities and creates the coordinator demo account. `schema.sql` is provided for manual Neon migration and the API also applies the same idempotent schema automatically.

The first production deployment is available at `https://volunteer-connect-a3.vercel.app`. To enable automatic deployments, connect the GitHub repository from **Vercel Project Settings > Git** after authorising the Vercel GitHub App for `Transient1y1/FIT5032_2025_Yucheng_Ding_36667838`; set `codex/a3-vercel-deploy` as the production branch or merge it into `main` first.

The Vercel API checks JWT sessions and role claims before reading or changing protected records. Public opportunity endpoints remain readable without a session.

## Business requirement progress

| Requirement | Progress |
|---|---|
| BR A.1 – VueJS 3 | Implemented |
| BR A.2 – Responsive design | Implemented |
| BR B.1 – Input validation | Implemented |
| BR B.2 – Dynamic data | Implemented |
| BR C.1 – Authentication | Implemented |
| BR C.2 – Role-based authentication | Implemented |
| BR C.3 – Aggregated rating | Implemented |
| BR C.4 – Basic security | Implemented |
| BR D.1 – External authentication | Vercel API JWT authentication with local demonstration fallback |
| BR D.2 – Email with attachment | Resend Vercel Function contract and batch email UI |
| BR D.3 – Interactive table data | Implemented for opportunities and applications |
| BR D.4 – Cloud deployment | Vercel configuration included |
| BR E.1 – Cloud functions | Vercel Functions source included |
| BR E.2 – Geo location | Leaflet search, markers and route planning implemented |
| BR E.3 – Accessibility | WCAG-focused interaction improvements implemented |
| BR E.4 – Export | CSV and PDF exports implemented |
| BR F.1 – Innovation | Booking, bulk email, REST, charts, GenAI, admin dashboard and offline features implemented |

## Demo accounts

Coordinator: `coordinator@volunteerconnect.test` / `Coord123!`

New registrations create volunteer accounts. Coordinator access is not available through the public registration form.

Authentication is implemented by the Vercel API in the deployed application. Neon stores user records and the API issues an HttpOnly `vc_session` JWT cookie. The browser-only Local Storage flow is retained only as an explicit local demonstration fallback.

Application review controls are restricted to the coordinator account. Volunteer accounts are redirected away from the coordinator route and cannot call the status update service successfully.

## Security approach

- User-entered content is rendered with Vue text interpolation. The application does not use `v-html` or direct HTML injection.
- Names, emails, passwords, EOI fields, identifiers, ratings and application statuses are checked at the client and service boundaries.
- Text fields reject HTML brackets and control characters and apply explicit length limits.
- The Content Security Policy limits scripts, images, forms and connections to approved sources.
- Passwords are hashed with Node `crypto.scrypt`; plain-text passwords are never stored.

The deployed application uses Neon/Postgres for server-side records. Local Storage is used only for saved opportunities, offline drafts and the opt-in local demonstration fallback.
