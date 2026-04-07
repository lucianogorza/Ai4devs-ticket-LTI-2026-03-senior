## Why

The ATS system has a Candidate data model but lacks the API layer to register new candidates. Recruiters need an endpoint to create candidate profiles with complete information including personal details, education history, work experience, and CV documents in a single atomic operation.

## What Changes

- Add `POST /api/candidates` endpoint for creating new candidates with all related entities
- Implement DDD layered architecture (Domain, Application, Infrastructure, Presentation layers)
- Add input validation for all candidate fields with proper error responses
- Handle email uniqueness constraint with 409 Conflict response
- Support nested creation of Education, WorkExperience, and Document records
- Return created candidate with all related data on success (201 Created)

## Capabilities

### New Capabilities

- `candidate-registration`: API endpoint for creating candidates with personal info, education records, work experience, and document metadata. Includes input validation, error handling, atomic transactions, and proper HTTP status codes.

### Modified Capabilities

<!-- No existing capabilities are being modified -->

## Impact

- **Backend Code**: New files across all DDD layers (domain/application/infrastructure/presentation)
- **API**: New `POST /api/candidates` endpoint exposed at port 3010
- **Database**: Uses existing Candidate, Education, WorkExperience, Document tables from Prisma schema
- **Routes**: `src/index.ts` needs to register new routes and JSON middleware
- **Testing**: Unit tests required for each layer, integration test for full flow (≥90% coverage)
