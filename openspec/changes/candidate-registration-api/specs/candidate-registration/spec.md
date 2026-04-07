## ADDED Requirements

### Requirement: Create candidate with personal information

The system SHALL provide a POST /api/candidates endpoint that creates a new candidate with personal information.

The endpoint SHALL accept a JSON body with the following fields:

- `firstName`: Required, max 100 characters
- `lastName`: Required, max 100 characters
- `email`: Required, unique, valid email format, max 255 characters
- `phone`: Optional, max 20 characters
- `address`: Optional, max 500 characters

#### Scenario: Successful candidate creation with required fields only

- **WHEN** a POST request is sent to /api/candidates with valid firstName, lastName, and email
- **THEN** the system SHALL return HTTP 201 Created
- **THEN** the response body SHALL include the created candidate with id, createdAt, updatedAt, and empty arrays for educations, workExperiences, and documents

#### Scenario: Successful candidate creation with all personal fields

- **WHEN** a POST request is sent to /api/candidates with firstName, lastName, email, phone, and address
- **THEN** the system SHALL return HTTP 201 Created
- **THEN** the response body SHALL include all provided fields

### Requirement: Create candidate with education records

The system SHALL allow creating education records along with the candidate in a single request.

The educations array SHALL accept objects with:

- `institution`: Required, max 200 characters
- `degree`: Required, max 200 characters
- `fieldOfStudy`: Optional, max 200 characters
- `startDate`: Required, ISO 8601 date format
- `endDate`: Optional, ISO 8601 date format (must be after startDate)

#### Scenario: Candidate creation with education records

- **WHEN** a POST request includes an educations array with valid education objects
- **THEN** the system SHALL create the candidate and all education records atomically
- **THEN** the response body SHALL include the educations array with all created records including their ids

#### Scenario: Multiple education records

- **WHEN** a POST request includes multiple education objects in the educations array
- **THEN** the system SHALL create all education records linked to the candidate

### Requirement: Create candidate with work experience records

The system SHALL allow creating work experience records along with the candidate in a single request.

The workExperiences array SHALL accept objects with:

- `company`: Required, max 200 characters
- `position`: Required, max 200 characters
- `description`: Optional, text
- `startDate`: Required, ISO 8601 date format
- `endDate`: Optional, ISO 8601 date format (must be after startDate)

#### Scenario: Candidate creation with work experience records

- **WHEN** a POST request includes a workExperiences array with valid work experience objects
- **THEN** the system SHALL create the candidate and all work experience records atomically
- **THEN** the response body SHALL include the workExperiences array with all created records including their ids

#### Scenario: Current job without end date

- **WHEN** a work experience object is provided without an endDate
- **THEN** the system SHALL accept it as a current position with endDate as null

### Requirement: Create candidate with document metadata

The system SHALL allow creating document metadata records along with the candidate in a single request.

The documents array SHALL accept objects with:

- `fileName`: Required, max 255 characters
- `fileType`: Required, must be CV_PDF or CV_DOCX
- `filePath`: Required, max 500 characters
- `fileSize`: Required, positive integer (bytes)

#### Scenario: Candidate creation with document records

- **WHEN** a POST request includes a documents array with valid document objects
- **THEN** the system SHALL create the candidate and all document records atomically
- **THEN** the response body SHALL include the documents array with all created records including their ids and uploadedAt

#### Scenario: Document with CV_PDF type

- **WHEN** a document object has fileType "CV_PDF"
- **THEN** the system SHALL accept and store the document with CV_PDF type

#### Scenario: Document with CV_DOCX type

- **WHEN** a document object has fileType "CV_DOCX"
- **THEN** the system SHALL accept and store the document with CV_DOCX type

### Requirement: Validate required fields

The system SHALL validate that all required fields are present and non-empty.

#### Scenario: Missing firstName

- **WHEN** a POST request is sent without a firstName field
- **THEN** the system SHALL return HTTP 400 Bad Request
- **THEN** the response body SHALL include an error with field "firstName" and message indicating it is required

#### Scenario: Missing lastName

- **WHEN** a POST request is sent without a lastName field
- **THEN** the system SHALL return HTTP 400 Bad Request
- **THEN** the response body SHALL include an error with field "lastName" and message indicating it is required

#### Scenario: Missing email

- **WHEN** a POST request is sent without an email field
- **THEN** the system SHALL return HTTP 400 Bad Request
- **THEN** the response body SHALL include an error with field "email" and message indicating it is required

#### Scenario: Empty required fields

- **WHEN** a POST request is sent with empty strings for required fields
- **THEN** the system SHALL return HTTP 400 Bad Request with appropriate error details

### Requirement: Validate email format

The system SHALL validate that the email field contains a valid email format.

#### Scenario: Invalid email format

- **WHEN** a POST request is sent with an email that does not match email format (e.g., "notanemail")
- **THEN** the system SHALL return HTTP 400 Bad Request
- **THEN** the response body SHALL include an error with field "email" and message indicating invalid format

#### Scenario: Valid email format

- **WHEN** a POST request is sent with a valid email format (e.g., "user@example.com")
- **THEN** the system SHALL accept the email field

### Requirement: Enforce email uniqueness

The system SHALL enforce that no two candidates can have the same email address.

#### Scenario: Duplicate email

- **WHEN** a POST request is sent with an email that already exists in the database
- **THEN** the system SHALL return HTTP 409 Conflict
- **THEN** the response body SHALL include an error message indicating the email already exists

### Requirement: Validate field lengths

The system SHALL validate that all string fields do not exceed their maximum allowed length.

#### Scenario: firstName exceeds max length

- **WHEN** a POST request is sent with a firstName longer than 100 characters
- **THEN** the system SHALL return HTTP 400 Bad Request with an appropriate error message

#### Scenario: email exceeds max length

- **WHEN** a POST request is sent with an email longer than 255 characters
- **THEN** the system SHALL return HTTP 400 Bad Request with an appropriate error message

### Requirement: Validate date constraints

The system SHALL validate that endDate is after startDate when both are provided.

#### Scenario: Education endDate before startDate

- **WHEN** an education object has an endDate that is before or equal to startDate
- **THEN** the system SHALL return HTTP 400 Bad Request
- **THEN** the response body SHALL indicate that endDate must be after startDate

#### Scenario: Work experience endDate before startDate

- **WHEN** a work experience object has an endDate that is before or equal to startDate
- **THEN** the system SHALL return HTTP 400 Bad Request
- **THEN** the response body SHALL indicate that endDate must be after startDate

### Requirement: Validate document file type

The system SHALL validate that document fileType is a valid enum value.

#### Scenario: Invalid document fileType

- **WHEN** a document object has a fileType that is not CV_PDF or CV_DOCX
- **THEN** the system SHALL return HTTP 400 Bad Request
- **THEN** the response body SHALL indicate that fileType must be CV_PDF or CV_DOCX

### Requirement: Validate document file size

The system SHALL validate that document fileSize is a positive integer.

#### Scenario: Negative fileSize

- **WHEN** a document object has a negative fileSize
- **THEN** the system SHALL return HTTP 400 Bad Request
- **THEN** the response body SHALL indicate that fileSize must be a positive integer

#### Scenario: Zero fileSize

- **WHEN** a document object has a fileSize of 0
- **THEN** the system SHALL return HTTP 400 Bad Request
- **THEN** the response body SHALL indicate that fileSize must be a positive integer

### Requirement: Return structured error responses

The system SHALL return error responses in a consistent JSON format.

The error response format SHALL be:

```json
{
  "error": "<error type>",
  "message": "<human readable message>",
  "details": [{ "field": "<field name>", "message": "<field-specific error>" }]
}
```

#### Scenario: Multiple validation errors

- **WHEN** a POST request has multiple validation errors (e.g., missing firstName and invalid email)
- **THEN** the system SHALL return HTTP 400 Bad Request
- **THEN** the response body SHALL include all validation errors in the details array

### Requirement: Atomic transaction for candidate creation

The system SHALL create the candidate and all related entities (educations, workExperiences, documents) within a single atomic transaction.

#### Scenario: Rollback on partial failure

- **WHEN** the candidate is valid but one of the related records fails at database level
- **THEN** the system SHALL NOT create the candidate or any of the related records
- **THEN** the system SHALL return an appropriate error response
