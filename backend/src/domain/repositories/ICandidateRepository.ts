import { Candidate } from '../models/Candidate';

export interface ICandidateRepository {
  create(candidate: Candidate): Promise<Candidate>;
}
