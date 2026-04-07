export interface EducationDTO {
  institution: string;
  degree: string;
  fieldOfStudy?: string;
  startDate: string;
  endDate?: string;
}

export interface WorkExperienceDTO {
  company: string;
  position: string;
  description?: string;
  startDate: string;
  endDate?: string;
}

export type DocumentType = "CV_PDF" | "CV_DOCX";

export interface DocumentDTO {
  fileName: string;
  fileType: DocumentType;
  filePath: string;
  fileSize: number;
}

export interface CreateCandidateDTO {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  educations?: EducationDTO[];
  workExperiences?: WorkExperienceDTO[];
  documents?: DocumentDTO[];
}

export interface EducationResponseDTO {
  id: number;
  institution: string;
  degree: string;
  fieldOfStudy: string | null;
  startDate: string;
  endDate: string | null;
}

export interface WorkExperienceResponseDTO {
  id: number;
  company: string;
  position: string;
  description: string | null;
  startDate: string;
  endDate: string | null;
}

export interface DocumentResponseDTO {
  id: number;
  fileName: string;
  fileType: DocumentType;
  filePath: string;
  fileSize: number;
  uploadedAt: string;
}

export interface CandidateResponseDTO {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  address: string | null;
  createdAt: string;
  updatedAt: string;
  educations: EducationResponseDTO[];
  workExperiences: WorkExperienceResponseDTO[];
  documents: DocumentResponseDTO[];
}

export type FormErrors = Record<string, string>;
