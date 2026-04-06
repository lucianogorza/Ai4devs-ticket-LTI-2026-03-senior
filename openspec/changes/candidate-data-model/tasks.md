## 1. Prisma Schema

- [x] 1.1 Add DocumentType enum to schema.prisma
- [x] 1.2 Add Candidate model with personal information fields
- [x] 1.3 Add Education model with foreign key to Candidate
- [x] 1.4 Add WorkExperience model with foreign key to Candidate
- [x] 1.5 Add Document model with foreign key and DocumentType enum
- [x] 1.6 Add database indexes on all candidateId foreign keys

## 2. Database Migration

- [x] 2.1 Generate Prisma migration with `npx prisma migrate dev --name add_candidate_model`
- [x] 2.2 Verify generated SQL migration is correct
- [x] 2.3 Generate Prisma client with `npx prisma generate`

## 3. Documentation

- [x] 3.1 Update data-model.instructions.md with Candidate entity description
- [x] 3.2 Update data-model.instructions.md with Education entity description
- [x] 3.3 Update data-model.instructions.md with WorkExperience entity description
- [x] 3.4 Update data-model.instructions.md with Document entity description
- [x] 3.5 Update Entity-Relationship diagram in Mermaid syntax

## 4. Verification

- [x] 4.1 Verify all models compile without TypeScript errors
- [x] 4.2 Verify Prisma client generates successfully
- [x] 4.3 Test cascade delete behavior works correctly
