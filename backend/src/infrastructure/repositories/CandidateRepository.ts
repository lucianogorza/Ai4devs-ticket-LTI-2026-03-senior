import { PrismaClient } from '@prisma/client';
import { ICandidateRepository } from '../../domain/repositories/ICandidateRepository';
import { Candidate } from '../../domain/models/Candidate';

const prisma = new PrismaClient();

export { prisma };

export class CandidateRepository implements ICandidateRepository {
  private readonly client: PrismaClient;

  constructor(client?: PrismaClient) {
    this.client = client ?? prisma;
  }

  async create(candidate: Candidate): Promise<Candidate> {
    const data = await this.client.candidate.create({
      data: {
        firstName: candidate.firstName,
        lastName: candidate.lastName,
        email: candidate.email,
        phone: candidate.phone ?? undefined,
        address: candidate.address ?? undefined,
        educations: {
          create: candidate.educations.map((e) => ({
            institution: e.institution,
            degree: e.degree,
            fieldOfStudy: e.fieldOfStudy ?? undefined,
            startDate: e.startDate,
            endDate: e.endDate ?? undefined,
          })),
        },
        workExperiences: {
          create: candidate.workExperiences.map((w) => ({
            company: w.company,
            position: w.position,
            description: w.description ?? undefined,
            startDate: w.startDate,
            endDate: w.endDate ?? undefined,
          })),
        },
        documents: {
          create: candidate.documents.map((d) => ({
            fileName: d.fileName,
            fileType: d.fileType,
            filePath: d.filePath,
            fileSize: d.fileSize,
          })),
        },
      },
      include: {
        educations: true,
        workExperiences: true,
        documents: true,
      },
    });

    return new Candidate(data);
  }
}
