# Support Ticket Dashboard - QA Test Report

## 1. Test Cases Overview

| Area | Case | Result | Evidence / Notes |
|---|---|---|---|
| **Automated Tests** | Full test suite execution | **PASS** | 14/14 tests pass successfully using `npm test`. |
| **API Create** | Valid ticket | **PASS** | Returns 201, id generated, timestamps set, status defaults to 'Open' |
| **API Create** | Empty/whitespace title | **PASS** | Returns 422 with proper error structure |
| **API Create** | Exact 120 char title | **PASS** | Returns 201 |
| **API Create** | Exact 121 char title | **PASS** | Returns 422 |
| **API Create** | Missing required fields | **PASS** | Returns 422 for missing description or email |
| **API Create** | Invalid emails | **PASS** | Returns 422 for 'abc', 'abc@', 'a@b', 'a b@c.com' |
| **API Create** | Invalid priority | **PASS** | Returns 422 for priority 'Urgent' |
| **API Create** | Invalid status on create | **FAIL** | Ignored by backend (defaults to Open anyway), but returns 201 instead of 422 validation error |
| **API Create** | Empty body | **PASS** | Returns 422 |
| **API Create** | Client sets ID/Timestamp | **PASS** | Backend ignores provided values and generates its own |
| **API List** | Default list & Pagination metadata| **PASS** | Returns 10 items with correct totalCount, totalPages metadata |
| **API List** | Page 2 & limits | **PASS** | Returns correctly paginated results |
| **API List** | Page 0, -1, 'abc' | **PASS** | Returns 422 (must be positive integer) |
| **API List** | Out of range page (e.g. 999) | **PASS** | Returns 200 with empty data array |
| **API List** | Sort newest first | **PASS** | `created_desc` works correctly |
| **API List** | Sort oldest first | **FAIL** | `created_asc` does not work (returns data sorted newest first) |
| **API List** | Filter status / priority | **PASS** | Returns correctly filtered results |
| **API List** | Search wildcards `%` | **PASS** | Properly escaped, returns only literal matches |
| **API List** | Search SQL Injection | **PASS** | Handled safely by parameterized queries |
| **API Detail** | GET existing ticket | **PASS** | Returns 200 with full details |
| **API Detail** | GET non-existent ticket | **PASS** | Returns 404 |
| **API Detail** | GET invalid ID | **PASS** | Returns 404 safely |
| **API Update** | Valid update | **PASS** | Returns 200 and properly updates fields |
| **API Update** | Invalid status update | **PASS** | Returns 422 |
| **API Summary**| Status counts | **PASS** | Values match database totals regardless of filters |

## 2. Bugs Found

| Severity | Description | Steps to Reproduce | Likely Culprit |
|---|---|---|---|
| **Medium** | **Sort order `created_asc` fails** | 1. Send `GET /api/tickets?sortBy=created_asc`. 2. Observe results are still newest-first. | `server/src/services/ticketService.js` (Sort order mapping or query construction ignores `asc`) |
| **Low** | **Invalid status/priority allowed on POST** | 1. Send `POST /api/tickets` with `status: "Done"`. 2. It succeeds (201) and ignores the status field. | `server/src/middleware/validators.js` (`validateCreateTicket` does not validate the `status` field) |

## 3. Missing Automated Tests

The following areas lack automated tests in `tests/ticket.test.js`:
1. **defaults (status = Open)**: Verify a ticket created without a status defaults to 'Open'.
2. **timestamps (created and updated)**: Verify `created_at` and `updated_at` are correctly generated on POST, and `updated_at` changes on PATCH.
3. **status & priority filters**: Verify `GET /api/tickets?status=Open&priority=High` returns only matching tickets.
4. **sort order both ways**: Verify `GET /api/tickets?sortBy=created_asc` and `created_desc` return lists in the correct date order.
5. **pagination limits**: Verify `GET /api/tickets?page=2` returns the correct slice, and `page=999` returns an empty array.
6. **invalid query params**: Verify invalid page numbers or sort orders return 422.

## 4. Prioritized Fix List

Based on evaluation weights:
1. **[Functional Correctness - 30%]** Fix `sortBy=created_asc` in `ticketService.js` to ensure the oldest-first sort actually reverses the SQL `ORDER BY` clause.
2. **[API Design / Validation - 20%]** Add validation for `status` in `validateCreateTicket` (or explicitly reject if provided, since it should default to 'Open').
3. **[API Design / Validation - 20%]** Ensure the `validateUpdateTicket` explicitly prevents updating `id` or `created_at` (though currently ignored, strict validation is safer).
4. **[Tests - 10%]** Add the 6 missing automated tests to `ticket.test.js` to ensure all edge cases are continuously verified.
5. **[Usability - 15%]** (Pending manual UI checks, see section 5).

## 5. Items to Check Manually (UI)

Because I do not have direct browser access, please verify the following manually:
1. **Dashboard Interactions**: Ensure changing filters, sorting, and pagination immediately triggers a backend request and updates the UI.
2. **State Persistence**: Select a filter/search, click a ticket to view details, and click "Back". Ensure your filters and search are preserved.
3. **Create Form**: Verify HTML5 required-field errors appear, and the 120-character counter works and prevents further typing. Verify the "loading" spinner appears on submit.
4. **Mobile Responsiveness**: Test the UI at 375px width (e.g. using Chrome DevTools). Ensure the table doesn't cause horizontal scrolling (it should ideally wrap, stack, or allow a clean horizontal scroll inside its container).
5. **Empty/Error States**: Search for a gibberish string like "zzzzz" to ensure the empty state appears. Turn off the backend and try to refresh to ensure the error boundary/state appears gracefully.
6. **Keyboard Accessibility**: Use the `Tab` key to navigate the Dashboard and Create Ticket forms. Ensure every button and input has a visible focus ring.
