# VolunteerConnect

VolunteerConnect is a responsive Vue 3 web application concept for helping university students find practical local volunteering opportunities and helping community organisations coordinate applicants.

## Current scope

The first five milestones and the rating feature provide:

- Vue 3 with Vite
- Bootstrap 5 responsive layout
- Vue Router route structure
- Responsive navigation and footer
- Public home page and supporting information routes
- Six dynamic opportunity records seeded into Local Storage
- Keyword search and filters for cause, location, mode, commitment and experience
- Responsive opportunity result cards and complete detail pages
- Empty search results and invalid opportunity states
- Volunteer registration and login with session restoration
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

Final security validation is intentionally scheduled for the next stage.

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
| BR C.4 – Basic security | Next stage |

## Demo accounts

Coordinator: `coordinator@volunteerconnect.test` / `Coord123!`

New registrations create volunteer accounts. Coordinator access is not available through the public registration form.

Authentication is implemented in the browser for this coursework prototype. It uses Local Storage for user records and Session Storage for the active user ID.

Application review controls are restricted to the coordinator account. Volunteer accounts are redirected away from the coordinator route and cannot call the status update service successfully.

## Image credits

Opportunity photographs are sourced from [Unsplash](https://unsplash.com/) and stored locally for reliable classroom demonstrations.
