import { Request, Response } from 'express';
import { CandidateService } from '../../application/services/CandidateService';
import { CreateCandidateDTO } from '../../application/dtos/CandidateDTO';

export class CandidateController {
  private readonly service: CandidateService;

  constructor(service: CandidateService) {
    this.service = service;
  }

  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const dto: CreateCandidateDTO = req.body;
      const result = await this.service.createCandidate(dto);
      res.status(201).json(result);
    } catch (error: any) {
      if (error.type === 'ValidationError') {
        res.status(400).json({
          error: 'Validation Error',
          message: 'Invalid input data',
          details: error.details,
        });
        return;
      }

      if (error.type === 'ConflictError') {
        res.status(409).json({
          error: 'Conflict',
          message: error.message,
        });
        return;
      }

      console.error('Unexpected error creating candidate:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'An unexpected error occurred',
      });
    }
  };
}
