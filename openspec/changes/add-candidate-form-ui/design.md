## Context

The frontend is a stock Create React App (React 18, TypeScript 4.9) with no routing, no HTTP client, and no component directory structure. The backend already exposes `POST /api/candidates` on port 3010 with full validation, returning 201/400/409/500 responses. The project standards mandate React Bootstrap for UI, Axios for HTTP, React Router v6 for routing, and functional components with hooks.

## Goals / Non-Goals

**Goals:**

- Establish the frontend project structure (components, services, pages, types)
- Deliver a fully functional Add Candidate form matching backend `CreateCandidateDTO`
- Implement client-side validation mirroring backend rules
- Handle all API error codes with appropriate user feedback
- Achieve ≥90% test coverage on new files

**Non-Goals:**

- Real file upload — Document section captures metadata only
- Candidate listing, detail, edit, or delete views
- Authentication or authorization
- Global state management (Redux, Zustand, etc.) — local state is sufficient
- Server-side rendering or SSR optimization

## Decisions

### 1. Form state management: single `useState` object vs per-field state

**Decision:** Single `useState` with a `FormData` object mirroring `CreateCandidateDTO`, updated via a generic `handleChange` helper.

**Rationale:** Keeps state co-located and makes it trivial to serialize for the API call. Dynamic arrays (education, work experience, documents) are managed as nested arrays within the same state object. Per-field state would require 15+ hooks and complicate serialization.

**Alternatives considered:** React Hook Form — adds a dependency and learning curve for a single form; not justified yet.

### 2. Component decomposition: monolith form vs fieldset components

**Decision:** One parent `AddCandidateForm` component plus three child fieldset components (`EducationFieldset`, `WorkExperienceFieldset`, `DocumentFieldset`). Each fieldset renders one entry and receives `value`, `onChange`, `onRemove`, `errors`, and `index` props.

**Rationale:** Keeps each dynamic-list section testable and reusable. The parent owns state and validation; children are presentational. Follows the project convention of co-locating related components.

### 3. Client-side validation strategy

**Decision:** Custom validation function (`validateCandidateForm`) in a dedicated utility file. Runs on submit (not on every keystroke). Returns an errors map keyed by field path (e.g., `educations[0].institution`).

**Rationale:** Matches the backend error shape (`{ field, message }`), making it easy to merge client and server errors into a single error display. Avoids a validation library dependency for straightforward rules.

### 4. API error mapping

**Decision:** On 400 responses, parse `errors[]` array and map each `{ field, message }` to the form's error state. On 409, inject an error on the `email` field. On 500 or network failure, show a global alert.

**Rationale:** Provides field-level feedback wherever possible, falling back to a global message only for unrecoverable errors.

### 5. API base URL configuration

**Decision:** Use `REACT_APP_API_BASE_URL` environment variable with a fallback to `http://localhost:3010`.

**Rationale:** CRA supports `REACT_APP_*` env vars natively. Allows per-environment configuration without code changes.

### 6. Routing setup

**Decision:** Add `BrowserRouter` in `App.tsx` wrapping a `Routes` block. Only one route initially: `/candidates/add` renders `AddCandidatePage`. The root `/` redirects to `/candidates/add` for now.

**Rationale:** Minimal routing that can grow as more pages are added. Follows React Router v6 conventions from the project standards.

## Risks / Trade-offs

- **No form library** → More boilerplate for validation and change handlers, but avoids an additional dependency for a single form. [Risk: maintenance cost increases if more forms are added] → Mitigation: extract validation utilities so a form library can be adopted later.
- **No global state** → If other pages need candidate data, prop drilling or lifting state will be needed. → Mitigation: Local state is correct for a single-page form; introduce Context or a store only when a second consumer appears.
- **Date handling** → `react-datepicker` returns `Date` objects, but the API expects ISO date strings. → Mitigation: Convert to `YYYY-MM-DD` string format in the service layer before sending.
- **CRLF/LF warnings** → The project mixes line endings. → Mitigation: Not addressed in this change; formatting conventions are a separate concern.
