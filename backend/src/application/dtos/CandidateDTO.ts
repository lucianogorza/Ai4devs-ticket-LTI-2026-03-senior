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

export interface DocumentDTO {
  fileName: string;
  fileType: 'CV_PDF' | 'CV_DOCX';
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
  startDate: Date;
  endDate: Date | null;
}

export interface WorkExperienceResponseDTO {
  id: number;
  company: string;
  position: string;
  description: string | null;
  startDate: Date;
  endDate: Date | null;
}

export interface DocumentResponseDTO {
  id: number;
  fileName: string;
  fileType: 'CV_PDF' | 'CV_DOCX';
  filePath: string;
  fileSize: number;
  uploadedAt: Date;
}

export interface CandidateResponseDTO {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  address: string | null;
  createdAt: Date;
  updatedAt: Date;
  educations: EducationResponseDTO[];
  workExperiences: WorkExperienceResponseDTO[];
  documents: DocumentResponseDTO[];
}
