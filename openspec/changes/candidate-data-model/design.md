## Context

The LTI backend is a Node.js/TypeScript/Express application using Prisma ORM with PostgreSQL. It follows Domain-Driven Design (DDD) principles with a layered architecture (Presentation, Application, Domain, Infrastructure).

Currently, the database has only a `User` model. The system needs a robust `Candidate` data model to support the ATS core functionality of managing job applicants.

**Constraints:**

- Must follow existing DDD layered architecture patterns
- Must use Prisma ORM for database access
- PostgreSQL as the database provider
- All code and documentation in English
- 90% test coverage requirement

## Goals / Non-Goals

**Goals:**

- Define comprehensive Prisma schema for Candidate and related entities
- Support one-to-many relationships for education, work experience, and documents
- Enable CV document storage with type constraints (PDF/DOCX only)
- Create database migrations with proper indexes and referential integrity
- Update data model documentation with entity descriptions and ER diagram

**Non-Goals:**

- API endpoints implementation (separate change)
- Frontend form implementation (separate change)
- File storage service implementation (separate change - this design covers metadata only)
- Authentication/authorization for candidate data (separate change)

## Decisions

### 1. Candidate as Aggregate Root

**Decision:** Model `Candidate` as the aggregate root with `Education`, `WorkExperience`, and `Document` as child entities.

**Rationale:** Following DDD principles, the Candidate entity is the natural aggregate root. Education, work experience, and documents only make sense in the context of a candidate. All child entities should be accessed through the Candidate aggregate.

**Alternatives Considered:**

- Separate independent entities with loose coupling → Rejected: Would lose referential integrity and make queries more complex

### 2. Document Type Enum

**Decision:** Use Prisma enum `DocumentType` with values `CV_PDF` and `CV_DOCX`.

**Rationale:** Type safety at the database level, prevents invalid document types, and makes filtering/querying by type efficient.

**Alternatives Considered:**

- String field with application-level validation → Rejected: Less type-safe, validation drift risk
- Separate table for document types → Rejected: Overkill for two fixed types

### 3. Cascade Delete on Foreign Keys

**Decision:** All child entities (Education, WorkExperience, Document) cascade delete when parent Candidate is deleted.

**Rationale:** Orphaned records have no meaning without their parent candidate. Cascade delete maintains data integrity automatically.

**Alternatives Considered:**

- Soft delete with `deletedAt` timestamp → Considered for future: May add later for audit trail, but not needed for MVP
- Restrict delete → Rejected: Would require manual cleanup

### 4. Field Length Constraints

**Decision:** Apply specific varchar lengths based on realistic data requirements:

- Names: 100 characters
- Email: 255 characters
- Phone: 20 characters (supports international formats)
- Address: 500 characters
- Institution/Company/Position/Degree: 200 characters
- Description: TEXT (unlimited)
- File paths: 500 characters

**Rationale:** Prevents data truncation issues while limiting storage waste and enabling index optimization.

### 5. Indexes on Foreign Keys

**Decision:** Add explicit indexes on all `candidateId` foreign key columns.

**Rationale:** Optimizes JOIN queries and lookups by candidate. PostgreSQL doesn't auto-index foreign keys.

## Risks / Trade-offs

| Risk                                                             | Mitigation                                                                                        |
| ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| Document storage path becomes invalid if file moves              | Store relative paths; implement file existence checks in application layer                        |
| Email uniqueness constraint may block legitimate re-applications | Business decision: For now, one candidate profile per email. Can add application versioning later |
| Large text fields (description) may impact query performance     | Only load full descriptions when needed; use projections in list queries                          |
| No audit trail for changes                                       | Add `createdAt`/`updatedAt` timestamps; consider event sourcing for future                        |

## Migration Plan

1. Create Prisma schema changes in `backend/prisma/schema.prisma`
2. Generate migration: `npx prisma migrate dev --name add_candidate_model`
3. Verify migration SQL is correct
4. Generate Prisma client: `npx prisma generate`
5. Update documentation in `.github/instructions/data-model.instructions.md`

**Rollback:** Run `npx prisma migrate reset` to rollback (dev only). For production, create reverse migration.
