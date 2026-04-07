## 1. Project Setup and Dependencies

- [x] 1.1 Install frontend dependencies: axios, react-router-dom, react-bootstrap, bootstrap, react-datepicker and their @types packages
- [x] 1.2 Import Bootstrap CSS in frontend/src/index.tsx
- [x] 1.3 Create directory structure: components/candidates/, services/, pages/, types/

## 2. TypeScript Types

- [x] 2.1 Create frontend/src/types/candidate.ts with EducationDTO, WorkExperienceDTO, DocumentDTO, CreateCandidateDTO interfaces
- [x] 2.2 Add CandidateResponseDTO and related response types
- [x] 2.3 Add FormErrors type (Record<string, string>) for validation error mapping

## 3. API Service Layer

- [x] 3.1 Create frontend/src/services/candidateService.ts with createCandidate function calling POST /api/candidates
- [x] 3.2 Configure axios base URL from REACT_APP_API_BASE_URL env var with localhost:3010 fallback
- [x] 3.3 Handle 400/409/500 error responses and transform them for form consumption

## 4. Form Validation

- [x] 4.1 Create frontend/src/utils/validateCandidateForm.ts with validateCandidateForm function
- [x] 4.2 Implement required field validation for personal info (firstName, lastName, email)
- [x] 4.3 Implement email format validation
- [x] 4.4 Implement max length validation for all text fields
- [x] 4.5 Implement endDate > startDate validation for Education and WorkExperience entries
- [x] 4.6 Implement document fileSize positive integer validation

## 5. Fieldset Components

- [x] 5.1 Create frontend/src/components/candidates/EducationFieldset.tsx with props: value, onChange, onRemove, errors, index
- [x] 5.2 Create frontend/src/components/candidates/WorkExperienceFieldset.tsx with props: value, onChange, onRemove, errors, index
- [x] 5.3 Create frontend/src/components/candidates/DocumentFieldset.tsx with props: value, onChange, onRemove, errors, index
- [x] 5.4 Add aria-describedby linking each input to its error message element

## 6. Main Form Component

- [x] 6.1 Create frontend/src/components/candidates/AddCandidateForm.tsx with form state via useState
- [x] 6.2 Implement Personal Information section with controlled inputs and error display
- [x] 6.3 Implement dynamic Education section with add/remove functionality
- [x] 6.4 Implement dynamic Work Experience section with add/remove functionality
- [x] 6.5 Implement dynamic Documents section with add/remove functionality
- [x] 6.6 Implement form submit handler: run client validation, call API service, handle success/error
- [x] 6.7 Disable Submit button during request and show "Saving..." text
- [x] 6.8 Display success alert with candidate name after 201, then reset form
- [x] 6.9 Map 409 error to inline email field error
- [x] 6.10 Map 400 errors to corresponding form fields
- [x] 6.11 Display global alert for 500/network errors

## 7. Page and Routing

- [x] 7.1 Create frontend/src/pages/AddCandidatePage.tsx wrapping AddCandidateForm in Bootstrap Container
- [x] 7.2 Update frontend/src/App.tsx with BrowserRouter, Routes, route for /candidates/add, and redirect from /
- [x] 7.3 Verify the form renders at /candidates/add

## 8. Unit Tests

- [x] 8.1 Create frontend/src/tests/AddCandidateForm.test.tsx
- [x] 8.2 Test: renders form with all required fields and sections
- [x] 8.3 Test: shows validation errors when submitting empty form
- [x] 8.4 Test: adds and removes Education entries
- [x] 8.5 Test: adds and removes Work Experience entries
- [x] 8.6 Test: adds and removes Document entries
- [x] 8.7 Test: calls API service on valid form submission
- [x] 8.8 Test: displays success message after 201 response
- [x] 8.9 Test: displays field-level error on 409 duplicate email
- [x] 8.10 Test: displays generic error on 500
- [x] 8.11 Test: submit button disabled during submission

## 9. Verification

- [x] 9.1 Verify TypeScript compiles without errors (npx tsc --noEmit)
- [x] 9.2 Verify all tests pass with ≥90% coverage on new files
- [x] 9.3 Verify form works end-to-end with running backend (manual curl or browser test)
