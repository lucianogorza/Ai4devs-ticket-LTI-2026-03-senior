## Why

The ATS (Applicant Tracking System) needs a foundational data model for managing job candidates. Currently, there is no candidate entity in the system. Recruiters need to capture candidate information including personal details, education history, work experience, and CV documents to effectively manage the recruitment pipeline.

## What Changes

- Add `Candidate` model as the core entity for storing candidate personal information (firstName, lastName, email, phone, address)
- Add `Education` model to store candidate education history with one-to-many relationship to Candidate
- Add `WorkExperience` model to store candidate work history with one-to-many relationship to Candidate
- Add `Document` model to store CV uploads (PDF/DOCX) with one-to-many relationship to Candidate
- Add `DocumentType` enum for constraining document types to CV_PDF and CV_DOCX
- Create Prisma migration for all new models with proper indexes and cascade delete rules

## Capabilities

### New Capabilities

- `candidate-management`: Core candidate data model with personal information fields (firstName, lastName, email, phone, address), education history, work experience, and document storage support

### Modified Capabilities

<!-- No existing capabilities are being modified -->

## Impact

- **Database**: New PostgreSQL tables (Candidate, Education, WorkExperience, Document) with foreign key relationships
- **Prisma Schema**: `backend/prisma/schema.prisma` will be extended with new models and enum
- **Documentation**: `data-model.instructions.md` needs to be updated with new entity definitions and ER diagram
- **Future Dependencies**: This model will be the foundation for candidate CRUD API endpoints, application tracking, and interview scheduling features
