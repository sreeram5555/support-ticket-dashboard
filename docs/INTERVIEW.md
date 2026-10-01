# Support Ticket Dashboard — Interview Preparation

---

## Key Design Decisions & Why

| Decision | Why | What I'd Say |
|---|---|---|
| **SQLite over PostgreSQL** | Zero setup for reviewers. Single file, no server process. `better-sqlite3` has a synchronous API that simplifies error handling. For one table with 25 rows, it's the right tool. | "I chose SQLite because the assignment prioritizes running locally with minimal setup. It eliminates the need for reviewers to install or configure a database server." |
| **better-sqlite3 over Knex/Sequelize** | One table doesn't need an ORM. Raw SQL is more transparent, easier to debug, and easier to explain. Less abstraction = less magic. | "With a single table, an ORM adds complexity without benefit. Writing SQL directly lets me demonstrate I understand the queries, and it's easier for another developer to read." |
| **Layered architecture (routes → controllers → services)** | Separation of concerns. SQL lives in one file. HTTP handling in another. Validation in middleware. Makes testing and modifications predictable. | "I separated concerns so each layer has one job. If you ask me to change a query, I know it's in `ticketService.js`. If you ask me to add a validation rule, it's in `validators.js`." |
| **express-validator over manual validation** | Declarative, composable middleware chains. Produces structured errors. Industry standard. | "It integrates cleanly with Express middleware and produces consistent error objects that the frontend can parse field-by-field for inline errors." |
| **Dual validation (frontend + backend)** | Frontend for UX (instant feedback). Backend for security (never trust the client). | "Frontend validation is for user experience — fast feedback. Backend validation is for data integrity — you can't trust the client." |
| **PATCH over PUT for updates** | We're updating partial fields (status, priority), not replacing the entire resource. PATCH is semantically correct. | "PATCH is the right HTTP method because we're doing a partial update. PUT would imply replacing the entire ticket." |
| **CSS custom properties, no framework** | Assignment says advanced design is outside scope. Vanilla CSS is simpler, has no build overhead, and is easy to modify. | "The assignment explicitly says advanced visual design isn't required. I focused on clarity and usability with a clean, simple design system." |
| **Separate stats endpoint** | Stats must reflect the full dataset regardless of filters. A separate endpoint is cleaner than embedding stats in every list response. | "The assignment says counts should reflect the entire dataset. A separate endpoint keeps the list response focused and avoids re-computing global stats on every filtered request." |

---

## 15 Likely Interview Questions & Answers

### Architecture & Design

**1. Why did you choose this tech stack?**
> React + Express + SQLite is the simplest, most widely understood stack that meets all requirements. SQLite eliminates database setup friction. Vite gives instant dev server startup. Express is the industry standard for Node.js APIs. Every choice minimizes setup complexity for the reviewer while demonstrating competence with mainstream tools.

**2. How does your folder structure help maintainability?**
> Backend follows a layered pattern: routes define endpoints, validators check input, controllers handle HTTP, services contain business logic and SQL. This means each file has one responsibility. To add a feature, you follow the same pattern: add a route, a validator, a controller method, and a service method. The frontend mirrors this with pages, components, hooks, and API client modules.

**3. Why didn't you use an ORM like Sequelize or Prisma?**
> For a single-table application, an ORM adds a layer of abstraction that obscures what's happening. Writing SQL directly shows I understand the queries, makes debugging easier, and keeps the codebase simpler. If the app grew to multiple tables with relationships, I'd reconsider.

**4. How do you handle errors consistently?**
> Every error response follows the same JSON shape: `{ success: false, error: { code, message, details } }`. Validation errors return 422 with field-level details. Not-found returns 404. Unexpected errors hit the global error handler and return 500. The frontend Axios interceptor catches these and displays appropriate UI (inline errors for 422, banner for others).

### Functional Questions

**5. How does your search work? Is it efficient?**
> Search uses `LIKE '%term%' COLLATE NOCASE` on both title and email with an OR condition. It's case-insensitive and partial. For 25 rows this is fine. At scale, I'd add full-text search (SQLite's FTS5 extension) or use a dedicated search service. I created indexes on title and email to help, though `LIKE '%...'` can't use a standard B-tree index — that's a known limitation.

**6. How do search and filters work together?**
> The service builds a dynamic WHERE clause. Each filter (status, priority, search) adds an AND condition if present. They're composable — you can search for "login" AND filter by status "Open" AND priority "High" simultaneously. The SQL uses parameterized queries to prevent injection.

**7. How does your pagination work?**
> Backend uses `LIMIT ? OFFSET ?` with a separate `COUNT(*)` query (using the same WHERE conditions) to get `totalCount`. The response includes `{ page, pageSize, totalCount, totalPages }`. The frontend disables Previous on page 1 and Next on the last page. Out-of-range pages return an empty array, not an error.

**8. Why is the stats endpoint separate from the list endpoint?**
> The assignment says counts should reflect the "entire dataset, regardless of active filters." If I embedded stats in the list response, I'd need to run two different WHERE clauses — one filtered, one unfiltered. A separate endpoint is cleaner and can be cached independently.

### Code Quality

**9. What would you do differently with more time?**
> I'd add: (1) client-side URL state syncing so filters survive browser refresh, (2) optimistic updates on status changes for faster UX, (3) end-to-end tests with Cypress or Playwright, (4) a dark mode toggle, (5) request rate limiting. I'd also refactor the service layer to use a repository pattern if more entities were added.

**10. How would you scale this for production?**
> Replace SQLite with PostgreSQL. Add connection pooling. Put the API behind a reverse proxy (Nginx). Add authentication (JWT or sessions). Add rate limiting. Deploy frontend to a CDN, backend to a container service. Add monitoring and structured logging.

**11. What are the weaknesses in your code?**
> (1) No authentication — anyone can modify tickets. (2) Search with `LIKE '%...'` doesn't use indexes efficiently at scale. (3) No request rate limiting. (4) Stats endpoint runs a separate query per request — could be cached. (5) No client-side caching or optimistic updates. These are all acceptable tradeoffs for a 6-hour assignment.

### Testing

**12. Why did you choose these specific tests?**
> I covered the three areas the assignment specifies: validation (tests 1-3), querying with combined filters and pagination (tests 4-5), and updates (tests 6-7). These hit the highest-weighted criteria — functional correctness (30%) and API validation (20%). Each test verifies both the happy path and an error case.

**13. How do your tests avoid affecting the real database?**
> The `database.js` module reads `DB_PATH` from the environment. Tests set `DB_PATH=:memory:`, which creates a fresh in-memory SQLite database for each test suite. Each suite seeds its own data, so tests are isolated and repeatable.

**14. Why API-level tests instead of unit tests?**
> API tests (via Supertest) verify the entire request pipeline: routing, validation, controller, service, and database — all in one test. For a small app, this gives more confidence per test than mocking individual layers. If the app grew, I'd add unit tests for complex business logic.

### Scenario Questions

**15. The team wants to add a "category" dropdown. Walk me through the changes.**
> 1. Add `CATEGORIES` constant to `server/src/constants.js` and `client/src/utils/validation.js`
> 2. Add `category` column to schema in `database.js` (with CHECK constraint and DEFAULT)
> 3. Add `category` to INSERT and SELECT queries in `ticketService.js`
> 4. Add validation rule in `validators.js` (`body('category').optional().isIn(CATEGORIES)`)
> 5. Add `<select>` dropdown to `TicketForm.jsx` and display in `TicketDetail.jsx` and `TicketCard.jsx`
> 6. Optionally add a category filter to `TicketFilters.jsx` and the service query
> 7. Add category values to `seedData.js`
> 8. Run existing tests to check nothing broke, add a test for the new field

---

## Weaknesses an Interviewer Might Spot

| Weakness | How to Respond |
|---|---|
| **No TypeScript** | "I used JavaScript as specified in my skill set. In a production codebase I'd use TypeScript for type safety, especially across the API boundary. I understand the tradeoffs." |
| **`LIKE '%...'` search is slow at scale** | "For 25-100 rows it's perfectly fine. At scale I'd use SQLite FTS5 or PostgreSQL full-text search. I chose simplicity over premature optimization." |
| **No client-side state management (no Redux/Zustand)** | "With 3 pages and simple data flow, React's built-in `useState` and a custom hook are sufficient. Adding a state library would be over-engineering for this scope." |
| **Duplicated validation constants** | "I chose to duplicate rather than share via a monorepo package because it keeps the setup simple (no Lerna/workspaces). In a real project with more shared code, I'd extract a shared package." |
| **No optimistic updates** | "The app re-fetches after every mutation. This is simpler and guarantees data consistency. With more time, I'd add optimistic updates with rollback on error." |
| **No E2E tests** | "I prioritized API tests because they cover the highest-weighted criteria (30% + 20%). With more time, I'd add Cypress tests for the frontend flows." |
| **Stats endpoint could be slow** | "It runs a COUNT query on every call. For 25 rows this is instant. At scale, I'd cache the result or compute it incrementally." |

---

## "How to Make a Small Change Safely" Checklist

Use this step-by-step process when asked to make a live change during the interview:

1. **Understand the request**: Restate it back. "So you want me to add a `category` field that appears in the form and the ticket list?"
2. **Identify affected layers**: "This touches the database schema, service layer, validation, and two frontend components."
3. **Start with the database**: Add the column/constraint. Run seed to verify.
4. **Update the service layer**: Modify SQL queries to include the new field.
5. **Update validation**: Add rules in `validators.js` (backend) and `validation.js` (frontend).
6. **Update the controller**: Usually no change needed if the service signature stays the same.
7. **Update the frontend**: Add the UI element to the form and/or display components.
8. **Test manually**: Create a ticket with the new field, verify it appears in the list and detail.
9. **Run existing tests**: `npm test` — make sure nothing broke.
10. **Explain what you did**: Walk through the change layer by layer.

> **Key principle**: Follow the same layered pattern every time. Start from the bottom (DB), work up to the top (UI). This is predictable and prevents missing a layer.

---

## Quick Reference: Where Things Live

| "I need to change..." | File |
|---|---|
| Database schema | `server/src/config/database.js` |
| SQL queries | `server/src/services/ticketService.js` |
| Validation rules | `server/src/middleware/validators.js` |
| API routes | `server/src/routes/ticketRoutes.js` |
| Request/response handling | `server/src/controllers/ticketController.js` |
| Error format | `server/src/middleware/errorHandler.js` |
| Enums/constants (backend) | `server/src/constants.js` |
| Enums/constants (frontend) | `client/src/utils/validation.js` |
| API calls | `client/src/api/ticketApi.js` |
| Data fetching logic | `client/src/hooks/useTickets.js` |
| Create form | `client/src/components/tickets/TicketForm.jsx` |
| Ticket list display | `client/src/components/tickets/TicketCard.jsx` |
| Detail/edit view | `client/src/components/tickets/TicketDetail.jsx` |
| Filters | `client/src/components/tickets/TicketFilters.jsx` |
| Global styles | `client/src/App.css` |
| Seed data | `server/seed/seedData.js` |
