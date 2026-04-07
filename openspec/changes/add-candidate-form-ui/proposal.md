## Why

Recruiters need a way to register new candidates through the frontend application. The backend `POST /api/candidates` endpoint is already implemented, but the React frontend is still a bare Create React App scaffold with no routing, HTTP client, or component structure. Without this form, candidate data must be entered via direct API calls, which is not viable for non-technical recruiters.

## What Changes

- Install foundational frontend dependencies: `axios`, `react-router-dom@6`, `react-bootstrap`, `bootstrap`, `react-datepicker`
- Set up client-side routing with React Router and Bootstrap CSS integration
- Create a candidate API service layer using Axios
- Build a multi-section form (personal info, education, work experience, documents) with client-side validation
- Handle all backend error responses (400 validation, 409 duplicate email, 500 server error) with inline feedback
- Establish the frontend project structure (components, services, pages, types directories)

## Capabilities

### New Capabilities

- `candidate-form`: Multi-section form UI for creating candidates via POST /api/candidates, including client-side validation, dynamic list sections (education, work experience, documents), error mapping, and success feedback

### Modified Capabilities

(none)

## Impact

- **Frontend**: Establishes the initial component architecture (components/, services/, pages/, types/ directories). Modifies `App.tsx` (routing) and `index.tsx` (Bootstrap CSS import)
- **Dependencies**: Adds `axios`, `react-router-dom`, `react-bootstrap`, `bootstrap`, `react-datepicker` and their type packages to `frontend/package.json`
- **Backend**: No changes — consumes the existing `POST /api/candidates` endpoint
- **Testing**: New component tests using React Testing Library + Jest
