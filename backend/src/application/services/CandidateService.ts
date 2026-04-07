import { ICandidateRepository } from '../../domain/repositories/ICandidateRepository';
import { Candidate } from '../../domain/models/Candidate';
import { Education } from '../../domain/models/Education';
import { WorkExperience } from '../../domain/models/WorkExperience';
import { Document } from '../../domain/models/Document';
import { CandidateValidator } from '../validators/CandidateValidator';
import { CreateCandidateDTO, CandidateResponseDTO } from '../dtos/CandidateDTO';

export class CandidateService {
  private readonly repository: ICandidateRepository;
  private readonly validator: CandidateValidator;

  constructor(
    repository: ICandidateRepository,
    validator?: CandidateValidator,
  ) {
    this.repository = repository;
    this.validator = validator ?? new CandidateValidator();
  }

  async createCandidate(
    dto: CreateCandidateDTO,
  ): Promise<CandidateResponseDTO> {
    const errors = this.validator.validate(dto);
    if (errors.length > 0) {
      const err = new Error('Validation failed') as any;
      err.type = 'ValidationError';
      err.details = errors;
      throw err;
    }

    const candidate = new Candidate({
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email,
      phone: dto.phone ?? null,
      address: dto.address ?? null,
      educations: dto.educations?.map((e) => new Education(e)) ?? [],
      workExperiences:
        dto.workExperiences?.map((w) => new WorkExperience(w)) ?? [],
      documents: dto.documents?.map((d) => new Document(d)) ?? [],
    });

    try {
      const created = await this.repository.create(candidate);
      return this.toResponseDTO(created);
    } catch (error: any) {
      // Prisma unique constraint violation code
      if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
        const err = new Error(
          'A candidate with this email already exists',
        ) as any;
        err.type = 'ConflictError';
        throw err;
      }
      throw error;
    }
  }

  private toResponseDTO(candidate: Candidate): CandidateResponseDTO {
    return {
      id: candidate.id!,
      firstName: candidate.firstName,
      lastName: candidate.lastName,
      email: candidate.email,
      phone: candidate.phone ?? null,
      address: candidate.address ?? null,
      createdAt: candidate.createdAt!,
      updatedAt: candidate.updatedAt!,
      educations: candidate.educations.map((e) => ({
        id: e.id!,
        institution: e.institution,
        degree: e.degree,
        fieldOfStudy: e.fieldOfStudy ?? null,
        startDate: e.startDate,
        endDate: e.endDate ?? null,
      })),
      workExperiences: candidate.workExperiences.map((w) => ({
        id: w.id!,
        company: w.company,
        position: w.position,
        description: w.description ?? null,
        startDate: w.startDate,
        endDate: w.endDate ?? null,
      })),
      documents: candidate.documents.map((d) => ({
        id: d.id!,
        fileName: d.fileName,
        fileType: d.fileType,
        filePath: d.filePath,
        fileSize: d.fileSize,
        uploadedAt: d.uploadedAt!,
      })),
    };
  }
}
