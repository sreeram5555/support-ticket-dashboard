# Support Ticket Dashboard — README Outline

> This document is a template. Replace all `[bracketed]` content with actual values during Step 8.

---

## README.md Structure

```markdown
# Support Ticket Dashboard

A full-stack web application for managing customer support tickets with search, filtering, pagination, and status tracking.

![Dashboard Screenshot](docs/screenshots/dashboard.png)

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
   cd support-ticket-dashboard
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

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for full API documentation.

## Project Structure

```
├── client/          # React frontend (Vite)
│   └── src/
│       ├── api/         # API client functions
│       ├── components/  # Reusable UI components
│       ├── hooks/       # Custom React hooks
│       ├── pages/       # Page components
│       └── utils/       # Validation helpers
├── server/          # Express backend
│   └── src/
│       ├── config/      # Database setup
│       ├── controllers/ # Request handlers
│       ├── middleware/   # Validation, error handling
│       ├── routes/      # Route definitions
│       └── services/    # Business logic + SQL
├── docs/            # Documentation + screenshots
└── README.md
```

## Screenshots

[Include 4-5 screenshots: dashboard, create form, detail view, mobile view, empty state]

---

## Technical Choices, Assumptions & Limitations

### Technical Choices

| Choice | Reasoning |
|---|---|
| **SQLite (better-sqlite3)** | Zero-config database — no install, no server process, runs from a single file. Synchronous API simplifies error handling. Perfect for a local-first app with one table. |
| **React + Vite** | Vite provides instant dev server startup and HMR. React is the most widely known frontend framework, making the code easy for reviewers to follow. |
| **Express.js** | Industry standard for Node.js APIs. Minimal boilerplate, large ecosystem, easy to extend. |
| **express-validator** | Declarative validation chains that integrate cleanly with Express middleware. Produces structured errors for frontend consumption. |
| **Layered architecture (routes → controllers → services)** | Separates HTTP handling from business logic from data access. Makes testing easy (mock service layer) and changes predictable (SQL changes only in service file). |
| **CSS custom properties (no framework)** | Assignment says advanced design is outside scope. Vanilla CSS with custom properties is simple, fast, and has no build step. |
| **concurrently** | Run both frontend and backend with a single `npm run dev` command. Reduces reviewer friction. |

### Assumptions

1. Search is partial and case-insensitive (matches substrings of title or email).
2. Out-of-range page numbers return an empty data array (not an error).
3. Summary counts always reflect the full dataset, not filtered results (per assignment wording).
4. Only status and priority are updatable (not title, description, or email).
5. Page size is fixed at 10 tickets per page.
6. The application is single-user (no concurrent editing concerns).
7. Timestamps use ISO 8601 format (UTC).

### Known Limitations

1. **No authentication** — intentionally excluded per assignment scope.
2. **No deployment** — runs locally only, as specified.
3. **No real-time updates** — requires page refresh or re-fetch to see changes by other users.
4. **SQLite limitations** — not suitable for production with concurrent writes; sufficient for this use case.
5. **No client-side caching** — every navigation re-fetches data from the API.
6. [Any incomplete features if time runs out]

### Time Spent

| Phase | Time |
|---|---|
| Planning & architecture | [X] min |
| Backend implementation | [X] min |
| Frontend implementation | [X] min |
| Testing | [X] min |
| Documentation & polish | [X] min |
| **Total** | **[X] hours** |

---

## How I Used AI Tools

I used [AI tool name] to assist with:
- **Architecture planning**: Discussed requirements mapping, identified edge cases and ambiguities, designed API contracts and error formats.
- **Code generation**: Generated initial boilerplate for [specific files]. I reviewed, modified, and tested all generated code.
- **Debugging**: Used AI to troubleshoot [specific issue, e.g., SQLite query syntax].
- **Documentation**: AI helped draft the README structure and technical choices section.

All code in this repository was reviewed, understood, and can be modified by me. I can explain every design decision and implementation detail.
```

---

## .env.example Content

```
# Backend server port
PORT=3001

# SQLite database file path (relative to server/)
DB_PATH=./tickets.db

# Environment: development | test | production
NODE_ENV=development
```

---

## Screenshot Capture Plan

| # | Screen | What to Show | File Name |
|---|---|---|---|
| 1 | Dashboard (desktop) | Stats bar + 10 tickets listed + pagination showing "Page 1 of 3" + filters visible | `dashboard.png` |
| 2 | Create Ticket (with error) | Form with empty title field showing red inline error "Title is required" + char counter | `create-ticket-error.png` |
| 3 | Ticket Detail | Full ticket info + status dropdown changed to "In Progress" + Save button | `ticket-detail.png` |
| 4 | Dashboard (mobile) | Same dashboard at 375px width — stacked filters, simplified cards | `dashboard-mobile.png` |
| 5 | Empty State | Dashboard with search term "xyznonexistent" showing empty state message | `empty-state.png` |

> Use browser DevTools responsive mode (375×667 for mobile). Take screenshots with DevTools → "Capture screenshot" for clean edges.

---

## Git Commit Strategy

| Order | Commit Message | What's Included |
|---|---|---|
| 1 | `chore: initial project scaffolding` | Root package.json, .gitignore, .env.example, empty client/ and server/ folders |
| 2 | `feat: backend scaffolding with Express and SQLite` | server/package.json, app.js, server.js, database.js, constants.js, health endpoint |
| 3 | `feat: frontend scaffolding with Vite and React Router` | client/ initialization, vite.config.js, App.jsx with routing, App.css design system |
| 4 | `feat: ticket service layer with CRUD operations` | ticketService.js |
| 5 | `feat: API validation middleware` | validators.js |
| 6 | `feat: ticket controller and routes` | ticketController.js, ticketRoutes.js, errorHandler.js |
| 7 | `feat: common UI components` | LoadingSpinner, EmptyState, ErrorBanner, Pagination, StatusBadge |
| 8 | `feat: dashboard page with stats, filters, and ticket list` | DashboardPage, StatsSummary, TicketFilters, TicketList, TicketCard, useTickets hook |
| 9 | `feat: create ticket page with form validation` | CreateTicketPage, TicketForm, validation.js |
| 10 | `feat: ticket detail page with status/priority update` | TicketDetailPage, TicketDetail |
| 11 | `feat: seed data with 25 realistic tickets` | seedData.js |
| 12 | `test: add 7 automated API tests` | All test files, jest.config.js, test setup |
| 13 | `style: responsive layout and mobile support` | CSS media queries, responsive adjustments |
| 14 | `docs: add README with setup instructions` | README.md, screenshots |
| 15 | `chore: final cleanup and polish` | Remove console.logs, verify all states, final tweaks |

> Small, meaningful commits show professionalism and make code review easy.
