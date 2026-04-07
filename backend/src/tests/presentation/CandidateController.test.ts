import { Request, Response } from 'express';
import { CandidateController } from '../../presentation/controllers/CandidateController';
import { CandidateService } from '../../application/services/CandidateService';

const mockService = {
  createCandidate: jest.fn(),
} as unknown as jest.Mocked<CandidateService>;

const mockResponse = (): Partial<Response> => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const candidateResponse = {
  id: 1,
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  phone: null,
  address: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  educations: [],
  workExperiences: [],
  documents: [],
};

describe('CandidateController', () => {
  let controller: CandidateController;

  beforeEach(() => {
    jest.clearAllMocks();
    controller = new CandidateController(mockService);
  });

  it('returns 201 with candidate data on success', async () => {
    (mockService.createCandidate as jest.Mock).mockResolvedValue(
      candidateResponse,
    );
    const req = {
      body: { firstName: 'John', lastName: 'Doe', email: 'john@example.com' },
    } as Request;
    const res = mockResponse() as Response;

    await controller.create(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(candidateResponse);
  });

  it('returns 400 for ValidationError', async () => {
    const err: any = new Error('Validation failed');
    err.type = 'ValidationError';
    err.details = [{ field: 'email', message: 'Invalid email format' }];
    (mockService.createCandidate as jest.Mock).mockRejectedValue(err);

    const req = { body: {} } as Request;
    const res = mockResponse() as Response;

    await controller.create(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: 'Validation Error',
        details: expect.arrayContaining([
          expect.objectContaining({ field: 'email' }),
        ]),
      }),
    );
  });

  it('returns 409 for ConflictError', async () => {
    const err: any = new Error('A candidate with this email already exists');
    err.type = 'ConflictError';
    (mockService.createCandidate as jest.Mock).mockRejectedValue(err);

    const req = { body: {} } as Request;
    const res = mockResponse() as Response;

    await controller.create(req, res);

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: 'Conflict',
      }),
    );
  });

  it('returns 500 for unexpected errors', async () => {
    (mockService.createCandidate as jest.Mock).mockRejectedValue(
      new Error('DB down'),
    );
    const req = { body: {} } as Request;
    const res = mockResponse() as Response;

    await controller.create(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: 'Internal Server Error',
      }),
    );
  });
});
