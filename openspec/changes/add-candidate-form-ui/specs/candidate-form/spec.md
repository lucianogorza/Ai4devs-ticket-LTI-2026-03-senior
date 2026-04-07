## ADDED Requirements

### Requirement: Form renders at /candidates/add with all sections

The application SHALL render the Add Candidate form at the `/candidates/add` route. The form SHALL contain four visible sections: Personal Information, Education, Work Experience, and Documents. The root route (`/`) SHALL redirect to `/candidates/add`.

#### Scenario: Navigate to the form route

- **WHEN** the user navigates to `/candidates/add`
- **THEN** the form renders with the Personal Information section and empty dynamic sections for Education, Work Experience, and Documents

#### Scenario: Root redirect

- **WHEN** the user navigates to `/`
- **THEN** the browser redirects to `/candidates/add`

### Requirement: Personal Information fields with validation

The form SHALL include the following personal information fields: First Name (text, required, max 100), Last Name (text, required, max 100), Email (email, required, valid format, max 255), Phone (tel, optional, max 20), Address (textarea, optional, max 500). All inputs SHALL have associated `<label>` elements.

#### Scenario: Submit with empty required fields

- **WHEN** the user clicks Submit with First Name, Last Name, or Email left empty
- **THEN** the form displays an inline error message on each empty required field and does NOT submit to the API

#### Scenario: Submit with invalid email format

- **WHEN** the user enters an invalid email (e.g., "notanemail") and clicks Submit
- **THEN** the form displays an inline error "Invalid email format" on the Email field and does NOT submit

#### Scenario: Submit with fields exceeding max length

- **WHEN** the user enters a First Name longer than 100 characters and clicks Submit
- **THEN** the form displays an inline error on the First Name field indicating the maximum length

### Requirement: Dynamic Education section

The form SHALL allow adding 0 to N Education entries. Each entry SHALL contain: Institution (text, required, max 200), Degree (text, required, max 200), Field of Study (text, optional, max 200), Start Date (date, required), End Date (date, optional, must be after Start Date). Users SHALL be able to add new entries and remove existing entries.

#### Scenario: Add an education entry

- **WHEN** the user clicks "Add Education"
- **THEN** a new Education fieldset appears with empty fields

#### Scenario: Remove an education entry

- **WHEN** the user clicks "Remove" on an existing Education entry
- **THEN** that entry is removed from the form

#### Scenario: End date before start date

- **WHEN** the user enters an End Date earlier than the Start Date in an Education entry and clicks Submit
- **THEN** the form displays an inline error on that entry's End Date field

### Requirement: Dynamic Work Experience section

The form SHALL allow adding 0 to N Work Experience entries. Each entry SHALL contain: Company (text, required, max 200), Position (text, required, max 200), Description (textarea, optional), Start Date (date, required), End Date (date, optional, must be after Start Date). Users SHALL be able to add new entries and remove existing entries.

#### Scenario: Add a work experience entry

- **WHEN** the user clicks "Add Work Experience"
- **THEN** a new Work Experience fieldset appears with empty fields

#### Scenario: Remove a work experience entry

- **WHEN** the user clicks "Remove" on an existing Work Experience entry
- **THEN** that entry is removed from the form

#### Scenario: End date before start date in work experience

- **WHEN** the user enters an End Date earlier than the Start Date in a Work Experience entry and clicks Submit
- **THEN** the form displays an inline error on that entry's End Date field

### Requirement: Dynamic Documents section

The form SHALL allow adding 0 to N Document entries. Each entry SHALL contain: File Name (text, required, max 255), File Type (select, required, values: CV_PDF or CV_DOCX), File Path (text, required, max 500), File Size (number, required, positive integer). Users SHALL be able to add new entries and remove existing entries.

#### Scenario: Add a document entry

- **WHEN** the user clicks "Add Document"
- **THEN** a new Document fieldset appears with empty fields and File Type defaulting to CV_PDF

#### Scenario: Remove a document entry

- **WHEN** the user clicks "Remove" on an existing Document entry
- **THEN** that entry is removed from the form

#### Scenario: Invalid file size

- **WHEN** the user enters a file size of 0 or a negative number and clicks Submit
- **THEN** the form displays an inline error on that entry's File Size field

### Requirement: Successful form submission

The form SHALL call `POST /api/candidates` with the form data serialized as `CreateCandidateDTO` when all client-side validations pass. On a 201 response, the form SHALL display a success alert containing the created candidate's name and reset all fields to their initial empty state.

#### Scenario: Successful creation

- **WHEN** the user fills in all required fields with valid data and clicks Submit
- **THEN** the form sends a POST request to the API, displays a success message (e.g., "Candidate John Doe created successfully"), and resets to its initial empty state

#### Scenario: Submit button disabled during request

- **WHEN** the form submission is in flight
- **THEN** the Submit button is disabled and displays "Saving..." text

### Requirement: Backend error handling

The form SHALL handle API error responses as follows: 400 errors map each `{ field, message }` in the response to the corresponding form field as an inline error. 409 errors display "A candidate with this email already exists" as an inline error on the Email field. 500 or network errors display a global alert: "An unexpected error occurred. Please try again."

#### Scenario: Duplicate email (409)

- **WHEN** the API returns a 409 status
- **THEN** the form displays "A candidate with this email already exists" as an inline error on the Email field

#### Scenario: Validation errors from backend (400)

- **WHEN** the API returns a 400 status with `{ errors: [{ field: "email", message: "Invalid" }] }`
- **THEN** the form displays "Invalid" as an inline error on the Email field

#### Scenario: Server error (500)

- **WHEN** the API returns a 500 status or the request fails due to a network error
- **THEN** the form displays a global alert: "An unexpected error occurred. Please try again."

### Requirement: Responsive layout

The form SHALL use React Bootstrap Container, Row, and Col components for layout. The form SHALL be usable on viewports ≥768px wide.

#### Scenario: Form on tablet viewport

- **WHEN** the user views the form on a 768px-wide viewport
- **THEN** all form fields are visible and usable without horizontal scrolling

### Requirement: Accessibility

All form inputs SHALL have associated `<label>` elements or `aria-label` attributes. Error messages SHALL be linked to their input via `aria-describedby`. The form SHALL use semantic HTML elements.

#### Scenario: Screen reader announces field errors

- **WHEN** a validation error is displayed for the First Name field
- **THEN** the error message element is linked to the input via `aria-describedby`
