import { Education } from './Education';
import { WorkExperience } from './WorkExperience';
import { Document } from './Document';

export class Candidate {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  address?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  educations: Education[];
  workExperiences: WorkExperience[];
  documents: Document[];

  constructor(data: any) {
    this.id = data.id;
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.email = data.email;
    this.phone = data.phone ?? null;
    this.address = data.address ?? null;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
    this.educations = data.educations?.map((e: any) => new Education(e)) ?? [];
    this.workExperiences = data.workExperiences?.map((w: any) => new WorkExperience(w)) ?? [];
    this.documents = data.documents?.map((d: any) => new Document(d)) ?? [];
  }
}
