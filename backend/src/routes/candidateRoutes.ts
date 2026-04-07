import { Router } from 'express';
import { CandidateController } from '../presentation/controllers/CandidateController';
import { CandidateService } from '../application/services/CandidateService';
import { CandidateRepository } from '../infrastructure/repositories/CandidateRepository';

const router = Router();

const repository = new CandidateRepository();
const service = new CandidateService(repository);
const controller = new CandidateController(service);

router.post('/', controller.create);

export default router;
