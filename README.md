# Support Ticket Dashboard

A full-stack web application for managing customer support tickets with search, filtering, pagination, and status tracking.

## Tech Stack

- **Frontend**: React 18, Vite, React Router v6, Axios
- **Backend**: Node.js, Express.js, better-sqlite3
- **Testing**: Jest, Supertest
- **Database**: SQLite (zero-config, file-based)

## Prerequisites

- Node.js >= 18.x
- npm >= 9.x

## Quick Start

1. **Clone the repository**
   ```bash
   git clone [repo-url]
   cd "support-ticket-dashboard" # or your folder name
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```

4. **Seed the database** (25 sample tickets)
   ```bash
   npm run seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

   This starts both the backend (port 3001) and frontend (port 5173) concurrently.

6. **Open the application**
   
   Navigate to `http://localhost:5173`

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `PORT` | `3001` | Backend server port |
| `DB_PATH` | `./tickets.db` | SQLite database file path |
| `NODE_ENV` | `development` | Environment (development/test/production) |

See `.env.example` for a complete template.

## Deployment

This app can be deployed as a single web service on platforms like Render.

**Live URL**: [https://your-app-url.onrender.com](https://your-app-url.onrender.com)

1. **Build Command**: `npm run build`
2. **Start Command**: `npm run start`
3. **Environment Variables**:
   - `NODE_ENV`: `production`
   - `PORT`: (Provided by the host, e.g. `10000`)
   - `DB_PATH`: `./tickets.db` (Default, stored in the container)

**Notes**:
- The free tier on Render spins down after inactivity, so the first load may take ~50 seconds.
- Since SQLite writes to disk, database persistence depends on your hosting setup (e.g. Render free tier uses an ephemeral disk, so data will reset on next deploy or restart unless a persistent disk is attached).
- The database is automatically seeded with 25 tickets upon the first production boot if it is empty.

## Running Tests

```bash
npm test
```

This runs 11 automated tests covering:
- Input validation (missing title, invalid email, title length)
- Query filtering + search + pagination
- Ticket status/priority updates
- 404 error handling

## API Overview

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/tickets` | List tickets (search, filter, sort, paginate) |
| `GET` | `/api/tickets/stats` | Get summary counts |
| `GET` | `/api/tickets/:id` | Get single ticket |
| `POST` | `/api/tickets` | Create new ticket |
| `PATCH` | `/api/tickets/:id` | Update ticket details (status, priority, title, description) |
| `DELETE` | `/api/tickets/:id` | Delete a ticket |

See `docs/ARCHITECTURE.md` for full API documentation.

## Project Structure

```
├── client/          # React frontend (Vite)
│   └── src/
│       ├── api/         # API client functions
│       ├── components/  # UI components (dashboard, tickets)
│       ├── pages/       # Page components (Dashboard, CreateTicket, TicketDetail)
│       └── ...
├── server/          # Express backend
│   └── src/
│       ├── config/      # Database setup
│       ├── controllers/ # Request handlers
│       ├── middleware/  # Validation, error handling
│       ├── routes/      # Route definitions
│       └── services/    # Business logic + SQL
├── docs/            # Architecture and task docs
├── seed/            # Seeding scripts
└── README.md
```

---

## Technical Choices, Assumptions & Limitations

### Technical Choices

| Choice | Reasoning |
|---|---|
| **SQLite (better-sqlite3)** | Zero-config database — no install, no server process, runs from a single file. Synchronous API simplifies error handling. Perfect for a local-first app with one table. |
| **React + Vite** | Vite provides instant dev server startup and HMR. React is widely known, making the code easy for reviewers to follow. |
| **Express.js** | Industry standard for Node.js APIs. Minimal boilerplate, large ecosystem, easy to extend. |
| **express-validator** | Declarative validation chains that integrate cleanly with Express middleware. Produces structured errors for frontend consumption. |
| **Layered architecture (routes → controllers → services)** | Separates HTTP handling from business logic from data access. Makes testing easy and changes predictable. |
| **CSS custom properties (no framework)** | Assignment requires intermediate knowledge without external libraries (unless justified). Vanilla CSS with custom properties is simple and fast. |
| **concurrently** | Run both frontend and backend with a single `npm run dev` command. Reduces friction to run the app. |

### Assumptions

1. Search is partial and case-insensitive (matches substrings of title or email).
2. Out-of-range page numbers return an empty data array (not an error).
3. Summary counts always reflect the full dataset, not filtered results (per assignment wording).
4. Page size is fixed at 10 tickets per page.
5. The application is single-user (no concurrent editing concerns).
6. Timestamps use ISO 8601 format (UTC).

### Known Limitations

1. **No authentication** — intentionally excluded per assignment scope.
2. **No real-time updates** — requires page refresh or re-fetch to see changes by other users.
3. **SQLite limitations** — not suitable for production with concurrent writes; sufficient for this use case.
4. **No client-side caching** — every navigation re-fetches data from the API.

### Time Spent

| Phase | Time |
|---|---|
| Planning and architecture (reading the PDF, designing with Claude) | [X] hours |
| Backend (API, database, validation, seed data) | [X] hours |
| Frontend (dashboard, create form, ticket detail) | [X] hours |
| Automated tests | [X] hours |
| README, docs and screenshots | [X] hours |
| QA pass and bug fixes | [X] hours |
| Extras beyond the required scope | [X] hours |
| **Total** | **[X] hours** |

The total time spent on this project was [X] hours. I can confirm that the core requirements were completed within the main build time, and part of this total time was spent reviewing, testing and understanding AI-generated code so that I can confidently explain and modify it.

---

## How I Used AI Tools

- **Claude Opus**: Used for planning, architecture design, and code review.
- **Gemini 3.1 Pro (in Antigravity)**: Used for code generation, automated testing, and the QA pass.

All code in this repository was reviewed, understood, and can be modified by me. I can explain every design decision and implementation detail.
