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

## Running Tests

```bash
npm test
```

This runs 7 automated tests covering:
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
| `PATCH` | `/api/tickets/:id` | Update ticket status/priority |

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
4. Only status and priority are updatable (not title, description, or email) on existing tickets.
5. Page size is fixed at 10 tickets per page.
6. The application is single-user (no concurrent editing concerns).
7. Timestamps use ISO 8601 format (UTC).

### Known Limitations

1. **No authentication** — intentionally excluded per assignment scope.
2. **No deployment** — runs locally only, as specified.
3. **No real-time updates** — requires page refresh or re-fetch to see changes by other users.
4. **SQLite limitations** — not suitable for production with concurrent writes; sufficient for this use case.
5. **No client-side caching** — every navigation re-fetches data from the API.

### Time Spent

| Phase | Time |
|---|---|
| Planning & architecture | 30 min |
| Backend implementation | 30 min |
| Frontend implementation | 30 min |
| Testing | 10 min |
| Documentation & polish | 10 min |
| **Total** | **~1 hour 50 min** |

---

## How I Used AI Tools

I used Gemini to assist with:
- **Architecture planning**: Discussed requirements mapping, identified edge cases and ambiguities, designed API contracts and error formats.
- **Code generation**: Generated boilerplate code for the React UI and Express routing.
- **Documentation**: AI helped draft the README structure and technical choices section.

All code in this repository was reviewed, understood, and can be modified by me. I can explain every design decision and implementation detail.
