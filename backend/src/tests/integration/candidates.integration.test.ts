import request from 'supertest';
import { app } from '../../index';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

afterEach(async () => {
  await prisma.document.deleteMany();
  await prisma.workExperience.deleteMany();
  await prisma.education.deleteMany();
  await prisma.candidate.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe('POST /api/candidates', () => {
  it('creates a candidate with required fields only (201)', async () => {
    const res = await request(app)
      .post('/api/candidates')
      .send({ firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com' });

    expect(res.status).toBe(201);
    expect(res.body.id).toBeDefined();
    expect(res.body.firstName).toBe('John');
    expect(res.body.email).toBe('john.doe@example.com');
    expect(res.body.educations).toEqual([]);
    expect(res.body.workExperiences).toEqual([]);
    expect(res.body.documents).toEqual([]);
  });

  it('creates a candidate with all related entities (201)', async () => {
    const res = await request(app)
      .post('/api/candidates')
      .send({
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@example.com',
        phone: '+1234567890',
        address: '123 Main St',
        educations: [{ institution: 'MIT', degree: 'BSc', fieldOfStudy: 'CS', startDate: '2018-09-01', endDate: '2022-06-01' }],
        workExperiences: [{ company: 'Acme', position: 'Engineer', startDate: '2022-07-01' }],
        documents: [{ fileName: 'cv.pdf', fileType: 'CV_PDF', filePath: '/uploads/cv.pdf', fileSize: 204800 }],
      });

    expect(res.status).toBe(201);
    expect(res.body.educations).toHaveLength(1);
    expect(res.body.workExperiences).toHaveLength(1);
    expect(res.body.documents).toHaveLength(1);
    expect(res.body.documents[0].fileType).toBe('CV_PDF');
  });

  it('returns 400 for missing required fields', async () => {
    const res = await request(app)
      .post('/api/candidates')
      .send({ firstName: '', lastName: '', email: '' });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Validation Error');
    expect(res.body.details).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ field: 'firstName' }),
        expect.objectContaining({ field: 'lastName' }),
        expect.objectContaining({ field: 'email' }),
      ])
    );
  });

  it('returns 400 for invalid email format', async () => {
    const res = await request(app)
      .post('/api/candidates')
      .send({ firstName: 'John', lastName: 'Doe', email: 'notanemail' });

    expect(res.status).toBe(400);
    expect(res.body.details).toEqual(
      expect.arrayContaining([expect.objectContaining({ field: 'email' })])
    );
  });

  it('returns 409 for duplicate email', async () => {
    await request(app)
      .post('/api/candidates')
      .send({ firstName: 'John', lastName: 'Doe', email: 'dup@example.com' });

    const res = await request(app)
      .post('/api/candidates')
      .send({ firstName: 'Jane', lastName: 'Doe', email: 'dup@example.com' });

    expect(res.status).toBe(409);
    expect(res.body.error).toBe('Conflict');
  });
});
