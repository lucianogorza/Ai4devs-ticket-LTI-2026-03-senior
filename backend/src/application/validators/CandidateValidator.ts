import {
  CreateCandidateDTO,
  EducationDTO,
  WorkExperienceDTO,
  DocumentDTO,
} from '../dtos/CandidateDTO';

export interface ValidationError {
  field: string;
  message: string;
}

const VALID_DOCUMENT_TYPES = ['CV_PDF', 'CV_DOCX'];

export class CandidateValidator {
  validate(data: CreateCandidateDTO): ValidationError[] {
    const errors: ValidationError[] = [];

    // Required fields
    if (!data.firstName || data.firstName.trim() === '') {
      errors.push({ field: 'firstName', message: 'First name is required' });
    } else if (data.firstName.length > 100) {
      errors.push({
        field: 'firstName',
        message: 'First name must not exceed 100 characters',
      });
    }

    if (!data.lastName || data.lastName.trim() === '') {
      errors.push({ field: 'lastName', message: 'Last name is required' });
    } else if (data.lastName.length > 100) {
      errors.push({
        field: 'lastName',
        message: 'Last name must not exceed 100 characters',
      });
    }

    if (!data.email || data.email.trim() === '') {
      errors.push({ field: 'email', message: 'Email is required' });
    } else if (!this.isValidEmail(data.email)) {
      errors.push({ field: 'email', message: 'Invalid email format' });
    } else if (data.email.length > 255) {
      errors.push({
        field: 'email',
        message: 'Email must not exceed 255 characters',
      });
    }

    // Optional fields length
    if (data.phone && data.phone.length > 20) {
      errors.push({
        field: 'phone',
        message: 'Phone must not exceed 20 characters',
      });
    }

    if (data.address && data.address.length > 500) {
      errors.push({
        field: 'address',
        message: 'Address must not exceed 500 characters',
      });
    }

    // Educations
    if (data.educations) {
      data.educations.forEach((edu, index) => {
        errors.push(...this.validateEducation(edu, index));
      });
    }

    // Work experiences
    if (data.workExperiences) {
      data.workExperiences.forEach((exp, index) => {
        errors.push(...this.validateWorkExperience(exp, index));
      });
    }

    // Documents
    if (data.documents) {
      data.documents.forEach((doc, index) => {
        errors.push(...this.validateDocument(doc, index));
      });
    }

    return errors;
  }

  private validateEducation(
    edu: EducationDTO,
    index: number,
  ): ValidationError[] {
    const errors: ValidationError[] = [];
    const prefix = `educations[${index}]`;

    if (!edu.institution || edu.institution.trim() === '') {
      errors.push({
        field: `${prefix}.institution`,
        message: 'Institution is required',
      });
    } else if (edu.institution.length > 200) {
      errors.push({
        field: `${prefix}.institution`,
        message: 'Institution must not exceed 200 characters',
      });
    }

    if (!edu.degree || edu.degree.trim() === '') {
      errors.push({ field: `${prefix}.degree`, message: 'Degree is required' });
    } else if (edu.degree.length > 200) {
      errors.push({
        field: `${prefix}.degree`,
        message: 'Degree must not exceed 200 characters',
      });
    }

    if (edu.fieldOfStudy && edu.fieldOfStudy.length > 200) {
      errors.push({
        field: `${prefix}.fieldOfStudy`,
        message: 'Field of study must not exceed 200 characters',
      });
    }

    if (!edu.startDate) {
      errors.push({
        field: `${prefix}.startDate`,
        message: 'Start date is required',
      });
    } else if (!this.isValidDate(edu.startDate)) {
      errors.push({
        field: `${prefix}.startDate`,
        message: 'Start date must be a valid ISO 8601 date',
      });
    }

    if (edu.endDate) {
      if (!this.isValidDate(edu.endDate)) {
        errors.push({
          field: `${prefix}.endDate`,
          message: 'End date must be a valid ISO 8601 date',
        });
      } else if (
        edu.startDate &&
        this.isValidDate(edu.startDate) &&
        new Date(edu.endDate) <= new Date(edu.startDate)
      ) {
        errors.push({
          field: `${prefix}.endDate`,
          message: 'End date must be after start date',
        });
      }
    }

    return errors;
  }

  private validateWorkExperience(
    exp: WorkExperienceDTO,
    index: number,
  ): ValidationError[] {
    const errors: ValidationError[] = [];
    const prefix = `workExperiences[${index}]`;

    if (!exp.company || exp.company.trim() === '') {
      errors.push({
        field: `${prefix}.company`,
        message: 'Company is required',
      });
    } else if (exp.company.length > 200) {
      errors.push({
        field: `${prefix}.company`,
        message: 'Company must not exceed 200 characters',
      });
    }

    if (!exp.position || exp.position.trim() === '') {
      errors.push({
        field: `${prefix}.position`,
        message: 'Position is required',
      });
    } else if (exp.position.length > 200) {
      errors.push({
        field: `${prefix}.position`,
        message: 'Position must not exceed 200 characters',
      });
    }

    if (!exp.startDate) {
      errors.push({
        field: `${prefix}.startDate`,
        message: 'Start date is required',
      });
    } else if (!this.isValidDate(exp.startDate)) {
      errors.push({
        field: `${prefix}.startDate`,
        message: 'Start date must be a valid ISO 8601 date',
      });
    }

    if (exp.endDate) {
      if (!this.isValidDate(exp.endDate)) {
        errors.push({
          field: `${prefix}.endDate`,
          message: 'End date must be a valid ISO 8601 date',
        });
      } else if (
        exp.startDate &&
        this.isValidDate(exp.startDate) &&
        new Date(exp.endDate) <= new Date(exp.startDate)
      ) {
        errors.push({
          field: `${prefix}.endDate`,
          message: 'End date must be after start date',
        });
      }
    }

    return errors;
  }

  private validateDocument(doc: DocumentDTO, index: number): ValidationError[] {
    const errors: ValidationError[] = [];
    const prefix = `documents[${index}]`;

    if (!doc.fileName || doc.fileName.trim() === '') {
      errors.push({
        field: `${prefix}.fileName`,
        message: 'File name is required',
      });
    } else if (doc.fileName.length > 255) {
      errors.push({
        field: `${prefix}.fileName`,
        message: 'File name must not exceed 255 characters',
      });
    }

    if (!doc.fileType) {
      errors.push({
        field: `${prefix}.fileType`,
        message: 'File type is required',
      });
    } else if (!VALID_DOCUMENT_TYPES.includes(doc.fileType)) {
      errors.push({
        field: `${prefix}.fileType`,
        message: 'File type must be CV_PDF or CV_DOCX',
      });
    }

    if (!doc.filePath || doc.filePath.trim() === '') {
      errors.push({
        field: `${prefix}.filePath`,
        message: 'File path is required',
      });
    } else if (doc.filePath.length > 500) {
      errors.push({
        field: `${prefix}.filePath`,
        message: 'File path must not exceed 500 characters',
      });
    }

    if (doc.fileSize === undefined || doc.fileSize === null) {
      errors.push({
        field: `${prefix}.fileSize`,
        message: 'File size is required',
      });
    } else if (!Number.isInteger(doc.fileSize) || doc.fileSize <= 0) {
      errors.push({
        field: `${prefix}.fileSize`,
        message: 'File size must be a positive integer',
      });
    }

    return errors;
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private isValidDate(dateStr: string): boolean {
    const date = new Date(dateStr);
    return !isNaN(date.getTime());
  }
}
