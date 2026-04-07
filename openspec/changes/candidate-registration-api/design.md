## Context

The LTI backend is a Node.js/TypeScript/Express application using Prisma ORM with PostgreSQL. It follows Domain-Driven Design (DDD) principles with a layered architecture. The Candidate data model and related entities (Education, WorkExperience, Document) already exist in Prisma schema. The current `src/index.ts` is minimal with only a root endpoint.

**Current state:**

- Prisma models: Candidate, Education, WorkExperience, Document exist with proper relations
- DocumentType enum: CV_PDF, CV_DOCX defined
- No domain entities, services, or repositories implemented
- No API endpoints for candidate management
- Express app lacks JSON body parsing middleware

## Goals / Non-Goals

**Goals:**

- Implement POST /api/candidates endpoint following DDD layered architecture
- Create atomic transactions for candidate + all related entities
- Provide clear validation errors with field-level detail
- Handle unique constraint violations (email) gracefully
- Achieve 90% test coverage

**Non-Goals:**

- GET/PUT/DELETE endpoints (separate change)
- File upload functionality (Document stores metadata only)
- Authentication/authorization (separate change)
- Frontend integration (separate change)

## Decisions

### 1. DDD Layered Architecture

**Decision:** Implement four distinct layers: Domain, Application, Infrastructure, Presentation.

**Rationale:** Follows project standards in backend.instructions.md. Separates concerns: domain logic isolated from HTTP and database details.

**Alternatives Considered:**

- Flat structure with routes/controllers only → Rejected: Violates project standards, poor testability

### 2. Validation Strategy

**Decision:** Use a dedicated CandidateValidator class in Application layer with method-based validation.

**Rationale:** Keeps validation logic centralized and testable. Returns structured error objects with field names for client-friendly messages.

**Alternatives Considered:**

- Class-validator decorators → Adds dependency, more implicit behavior
- Validation in controller → Violates SRP

### 3. Repository Pattern with Prisma

**Decision:** Define ICandidateRepository interface in Domain layer, implement with Prisma in Infrastructure layer.

**Rationale:** Allows easy mocking in tests, abstracts database operations, follows Dependency Inversion Principle.

### 4. Atomic Transaction for Nested Creates

**Decision:** Use Prisma's nested create within a transaction for candidate + educations + workExperiences + documents.

**Rationale:** Ensures all-or-nothing creation. If any part fails, entire operation rolls back. Maintains data integrity.

### 5. Error Response Format

**Decision:** Use consistent JSON error format: `{ error: string, message: string, details?: array }`.

**Rationale:** Follows REST best practices, provides actionable information to clients, matches existing patterns.

## Risks / Trade-offs

| Risk                                                | Mitigation                                                     |
| --------------------------------------------------- | -------------------------------------------------------------- |
| Validation logic may drift from Prisma constraints  | Unit tests verify alignment; use same max lengths as DB schema |
| Nested transactions may be slower than flat inserts | Acceptable for data integrity; optimize later if needed        |
| Error messages may leak internal details            | Sanitize all error messages; never expose stack traces         |
| Large request payloads with many nested records     | Add reasonable limits (e.g., max 10 educations) in validation  |

## File Structure

```
backend/src/
├── domain/
│   ├── models/
│   │   ├── Candidate.ts
│   │   ├── Education.ts
│   │   ├── WorkExperience.ts
│   │   └── Document.ts
│   └── repositories/
│       └── ICandidateRepository.ts
├── application/
│   ├── dtos/
│   │   └── CandidateDTO.ts
│   ├── services/
│   │   └── CandidateService.ts
│   └── validators/
│       └── CandidateValidator.ts
├── infrastructure/
│   └── repositories/
│       └── CandidateRepository.ts
├── presentation/
│   └── controllers/
│       └── CandidateController.ts
├── routes/
│   └── candidateRoutes.ts
└── index.ts (modified)
```
