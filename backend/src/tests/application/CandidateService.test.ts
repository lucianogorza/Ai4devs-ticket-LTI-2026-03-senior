import { CandidateService } from '../../application/services/CandidateService';
import { ICandidateRepository } from '../../domain/repositories/ICandidateRepository';
import { Candidate } from '../../domain/models/Candidate';
import { CreateCandidateDTO } from '../../application/dtos/CandidateDTO';

const mockRepository: jest.Mocked<ICandidateRepository> = {
  create: jest.fn(),
};

const validDTO: CreateCandidateDTO = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
};

const createdCandidate = new Candidate({
  id: 1,
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  phone: null,
  address: null,
  createdAt: new Date('2026-01-01'),
  updatedAt: new Date('2026-01-01'),
  educations: [],
  workExperiences: [],
  documents: [],
});

describe('CandidateService', () => {
  let service: CandidateService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new CandidateService(mockRepository);
  });

  describe('createCandidate', () => {
    it('creates candidate successfully and returns DTO', async () => {
      mockRepository.create.mockResolvedValue(createdCandidate);
      const result = await service.createCandidate(validDTO);
      expect(result.id).toBe(1);
      expect(result.firstName).toBe('John');
      expect(result.email).toBe('john@example.com');
      expect(result.educations).toEqual([]);
      expect(result.workExperiences).toEqual([]);
      expect(result.documents).toEqual([]);
    });

    it('throws ValidationError for invalid input', async () => {
      await expect(
        service.createCandidate({ ...validDTO, email: 'bad' }),
      ).rejects.toMatchObject({
        type: 'ValidationError',
        details: expect.arrayContaining([
          expect.objectContaining({ field: 'email' }),
        ]),
      });
      expect(mockRepository.create).not.toHaveBeenCalled();
    });

    it('throws ConflictError for duplicate email', async () => {
      const prismaError: any = new Error('Unique constraint failed');
      prismaError.code = 'P2002';
      prismaError.meta = { target: ['email'] };
      mockRepository.create.mockRejectedValue(prismaError);

      await expect(service.createCandidate(validDTO)).rejects.toMatchObject({
        type: 'ConflictError',
        message: 'A candidate with this email already exists',
      });
    });

    it('rethrows unknown errors', async () => {
      mockRepository.create.mockRejectedValue(new Error('DB down'));
      await expect(service.createCandidate(validDTO)).rejects.toThrow(
        'DB down',
      );
    });

    it('creates candidate with related entities', async () => {
      const withRelated = new Candidate({
        id: 2,
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane@example.com',
        createdAt: new Date(),
        updatedAt: new Date(),
        educations: [
          {
            id: 1,
            institution: 'MIT',
            degree: 'BSc',
            startDate: new Date(),
            endDate: null,
            fieldOfStudy: null,
          },
        ],
        workExperiences: [
          {
            id: 1,
            company: 'Acme',
            position: 'Dev',
            startDate: new Date(),
            endDate: null,
            description: null,
          },
        ],
        documents: [
          {
            id: 1,
            fileName: 'cv.pdf',
            fileType: 'CV_PDF',
            filePath: '/tmp/cv.pdf',
            fileSize: 1024,
            uploadedAt: new Date(),
          },
        ],
      });
      mockRepository.create.mockResolvedValue(withRelated);

      const dto: CreateCandidateDTO = {
        ...validDTO,
        email: 'jane@example.com',
        educations: [
          { institution: 'MIT', degree: 'BSc', startDate: '2020-01-01' },
        ],
        workExperiences: [
          { company: 'Acme', position: 'Dev', startDate: '2022-01-01' },
        ],
        documents: [
          {
            fileName: 'cv.pdf',
            fileType: 'CV_PDF',
            filePath: '/tmp/cv.pdf',
            fileSize: 1024,
          },
        ],
      };

      const result = await service.createCandidate(dto);
      expect(result.educations).toHaveLength(1);
      expect(result.workExperiences).toHaveLength(1);
      expect(result.documents).toHaveLength(1);
    });
  });
});
