## 1. Domain Layer

- [x] 1.1 Create Candidate entity class in src/domain/models/Candidate.ts
- [x] 1.2 Create Education entity class in src/domain/models/Education.ts
- [x] 1.3 Create WorkExperience entity class in src/domain/models/WorkExperience.ts
- [x] 1.4 Create Document entity class in src/domain/models/Document.ts
- [x] 1.5 Create ICandidateRepository interface in src/domain/repositories/ICandidateRepository.ts

## 2. Application Layer - DTOs

- [x] 2.1 Create CreateCandidateDTO interface in src/application/dtos/CandidateDTO.ts
- [x] 2.2 Create EducationDTO interface
- [x] 2.3 Create WorkExperienceDTO interface
- [x] 2.4 Create DocumentDTO interface
- [x] 2.5 Create CandidateResponseDTO interface

## 3. Application Layer - Validation

- [x] 3.1 Create CandidateValidator class in src/application/validators/CandidateValidator.ts
- [x] 3.2 Implement required field validation (firstName, lastName, email)
- [x] 3.3 Implement email format validation
- [x] 3.4 Implement field length validations
- [x] 3.5 Implement date constraint validation (endDate > startDate)
- [x] 3.6 Implement document fileType enum validation
- [x] 3.7 Implement document fileSize positive integer validation

## 4. Application Layer - Service

- [x] 4.1 Create CandidateService class in src/application/services/CandidateService.ts
- [x] 4.2 Implement createCandidate method with validation
- [x] 4.3 Handle unique constraint error for duplicate email

## 5. Infrastructure Layer

- [x] 5.1 Create CandidateRepository class in src/infrastructure/repositories/CandidateRepository.ts
- [x] 5.2 Implement create method with Prisma nested create for atomic transaction
- [x] 5.3 Export PrismaClient instance for dependency injection

## 6. Presentation Layer

- [x] 6.1 Create CandidateController class in src/presentation/controllers/CandidateController.ts
- [x] 6.2 Implement create method handling HTTP request/response
- [x] 6.3 Map validation errors to 400 response with structured format
- [x] 6.4 Map duplicate email error to 409 response

## 7. Routes and App Configuration

- [x] 7.1 Create candidateRoutes.ts in src/routes/ with POST /api/candidates route
- [x] 7.2 Update src/index.ts to add express.json() middleware
- [x] 7.3 Update src/index.ts to register candidate routes

## 8. Unit Tests

- [x] 8.1 Create unit tests for Candidate entity
- [x] 8.2 Create unit tests for Education entity
- [x] 8.3 Create unit tests for WorkExperience entity
- [x] 8.4 Create unit tests for Document entity
- [x] 8.5 Create unit tests for CandidateValidator
- [x] 8.6 Create unit tests for CandidateService with mocked repository
- [x] 8.7 Create unit tests for CandidateController with mocked service

## 9. Integration Tests

- [x] 9.1 Create integration test for POST /api/candidates successful creation
- [x] 9.2 Create integration test for validation error responses
- [x] 9.3 Create integration test for duplicate email conflict response
- [x] 9.4 Create integration test for candidate with all related entities

## 10. Verification

- [x] 10.1 Verify TypeScript compiles without errors
- [x] 10.2 Verify all tests pass with ≥90% coverage
- [x] 10.3 Test endpoint manually with curl
