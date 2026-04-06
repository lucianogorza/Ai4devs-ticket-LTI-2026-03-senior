## ADDED Requirements

### Requirement: Candidate entity stores personal information

The system SHALL store candidate personal information including firstName, lastName, email, phone, and address in a Candidate database entity.

The Candidate entity SHALL have the following fields:

- `id`: Auto-incremented primary key
- `firstName`: Required, max 100 characters
- `lastName`: Required, max 100 characters
- `email`: Required, unique, max 255 characters
- `phone`: Optional, max 20 characters
- `address`: Optional, max 500 characters
- `createdAt`: Auto-generated timestamp on creation
- `updatedAt`: Auto-updated timestamp on modification

#### Scenario: Candidate created with required fields

- **WHEN** a candidate record is created with firstName, lastName, and email
- **THEN** the system SHALL persist the candidate with an auto-generated id
- **THEN** the system SHALL set createdAt and updatedAt to current timestamp

#### Scenario: Email uniqueness enforced

- **WHEN** a candidate record is created with an email that already exists
- **THEN** the system SHALL reject the record with a unique constraint violation

#### Scenario: Optional fields can be null

- **WHEN** a candidate record is created without phone and address
- **THEN** the system SHALL persist the candidate with phone and address as null

### Requirement: Education entity stores candidate education history

The system SHALL store candidate education history in an Education database entity with a many-to-one relationship to Candidate.

The Education entity SHALL have the following fields:

- `id`: Auto-incremented primary key
- `institution`: Required, max 200 characters
- `degree`: Required, max 200 characters
- `fieldOfStudy`: Optional, max 200 characters
- `startDate`: Required, date type
- `endDate`: Optional, date type
- `candidateId`: Required, foreign key to Candidate

#### Scenario: Education record linked to candidate

- **WHEN** an education record is created with a valid candidateId
- **THEN** the system SHALL persist the education record linked to the candidate

#### Scenario: Multiple education records per candidate

- **WHEN** multiple education records are created for the same candidateId
- **THEN** the system SHALL persist all education records linked to that candidate

#### Scenario: Education cascade deleted with candidate

- **WHEN** a candidate is deleted
- **THEN** the system SHALL automatically delete all associated education records

### Requirement: WorkExperience entity stores candidate work history

The system SHALL store candidate work history in a WorkExperience database entity with a many-to-one relationship to Candidate.

The WorkExperience entity SHALL have the following fields:

- `id`: Auto-incremented primary key
- `company`: Required, max 200 characters
- `position`: Required, max 200 characters
- `description`: Optional, text type (unlimited length)
- `startDate`: Required, date type
- `endDate`: Optional, date type
- `candidateId`: Required, foreign key to Candidate

#### Scenario: Work experience record linked to candidate

- **WHEN** a work experience record is created with a valid candidateId
- **THEN** the system SHALL persist the work experience record linked to the candidate

#### Scenario: Multiple work experience records per candidate

- **WHEN** multiple work experience records are created for the same candidateId
- **THEN** the system SHALL persist all work experience records linked to that candidate

#### Scenario: Current job without end date

- **WHEN** a work experience record is created without an endDate
- **THEN** the system SHALL persist the record with endDate as null (indicating current position)

#### Scenario: Work experience cascade deleted with candidate

- **WHEN** a candidate is deleted
- **THEN** the system SHALL automatically delete all associated work experience records

### Requirement: Document entity stores candidate CV files

The system SHALL store candidate document metadata in a Document database entity with a many-to-one relationship to Candidate.

The Document entity SHALL have the following fields:

- `id`: Auto-incremented primary key
- `fileName`: Required, max 255 characters
- `fileType`: Required, enum type (CV_PDF or CV_DOCX)
- `filePath`: Required, max 500 characters
- `fileSize`: Required, integer (bytes)
- `uploadedAt`: Auto-generated timestamp on creation
- `candidateId`: Required, foreign key to Candidate

#### Scenario: PDF document record created

- **WHEN** a document record is created with fileType CV_PDF
- **THEN** the system SHALL persist the document with type CV_PDF

#### Scenario: DOCX document record created

- **WHEN** a document record is created with fileType CV_DOCX
- **THEN** the system SHALL persist the document with type CV_DOCX

#### Scenario: Invalid document type rejected

- **WHEN** a document record is created with a fileType not in the enum
- **THEN** the system SHALL reject the record with a validation error

#### Scenario: Document cascade deleted with candidate

- **WHEN** a candidate is deleted
- **THEN** the system SHALL automatically delete all associated document records

### Requirement: Database indexes optimize queries

The system SHALL create database indexes on foreign key columns to optimize query performance.

#### Scenario: Index on Education candidateId

- **WHEN** querying education records by candidateId
- **THEN** the system SHALL use the index on candidateId for efficient lookup

#### Scenario: Index on WorkExperience candidateId

- **WHEN** querying work experience records by candidateId
- **THEN** the system SHALL use the index on candidateId for efficient lookup

#### Scenario: Index on Document candidateId

- **WHEN** querying document records by candidateId
- **THEN** the system SHALL use the index on candidateId for efficient lookup
