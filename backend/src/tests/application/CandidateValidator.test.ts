import { CandidateValidator, ValidationError } from '../../application/validators/CandidateValidator';
import { CreateCandidateDTO } from '../../application/dtos/CandidateDTO';

const validator = new CandidateValidator();
const hasField = (errors: ValidationError[], field: string) =>
  errors.some((e: ValidationError) => e.field === field);

const validBase: CreateCandidateDTO = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
};

describe('CandidateValidator', () => {
  describe('required fields', () => {
    it('passes with valid required fields', () => {
      expect(validator.validate(validBase)).toEqual([]);
    });

    it('fails when firstName is missing', () => {
      const errors = validator.validate({ ...validBase, firstName: '' });
      expect(hasField(errors, 'firstName')).toBe(true);
    });

    it('fails when lastName is missing', () => {
      const errors = validator.validate({ ...validBase, lastName: '' });
      expect(hasField(errors, 'lastName')).toBe(true);
    });

    it('fails when email is missing', () => {
      const errors = validator.validate({ ...validBase, email: '' });
      expect(hasField(errors, 'email')).toBe(true);
    });
  });

  describe('email format', () => {
    it('fails for invalid email format', () => {
      const errors = validator.validate({ ...validBase, email: 'notanemail' });
      expect(hasField(errors, 'email')).toBe(true);
    });

    it('fails for email without domain', () => {
      const errors = validator.validate({ ...validBase, email: 'user@' });
      expect(hasField(errors, 'email')).toBe(true);
    });

    it('passes for valid email', () => {
      const errors = validator.validate({ ...validBase, email: 'user@example.com' });
      expect(errors.filter((e: ValidationError) => e.field === 'email')).toHaveLength(0);
    });
  });

  describe('field lengths', () => {
    it('fails when firstName exceeds 100 chars', () => {
      const errors = validator.validate({ ...validBase, firstName: 'a'.repeat(101) });
      expect(hasField(errors, 'firstName')).toBe(true);
    });

    it('fails when email exceeds 255 chars', () => {
      const local = 'a'.repeat(250);
      const errors = validator.validate({ ...validBase, email: `${local}@x.com` });
      expect(hasField(errors, 'email')).toBe(true);
    });

    it('fails when phone exceeds 20 chars', () => {
      const errors = validator.validate({ ...validBase, phone: '1'.repeat(21) });
      expect(hasField(errors, 'phone')).toBe(true);
    });

    it('fails when address exceeds 500 chars', () => {
      const errors = validator.validate({ ...validBase, address: 'a'.repeat(501) });
      expect(hasField(errors, 'address')).toBe(true);
    });
  });

  describe('education validation', () => {
    it('passes with valid education', () => {
      const errors = validator.validate({
        ...validBase,
        educations: [{ institution: 'MIT', degree: 'BSc', startDate: '2020-01-01' }],
      });
      expect(errors).toHaveLength(0);
    });

    it('fails when institution is missing', () => {
      const errors = validator.validate({
        ...validBase,
        educations: [{ institution: '', degree: 'BSc', startDate: '2020-01-01' }],
      });
      expect(hasField(errors, 'educations[0].institution')).toBe(true);
    });

    it('fails when endDate is before startDate', () => {
      const errors = validator.validate({
        ...validBase,
        educations: [{ institution: 'MIT', degree: 'BSc', startDate: '2022-01-01', endDate: '2020-01-01' }],
      });
      expect(hasField(errors, 'educations[0].endDate')).toBe(true);
    });
  });

  describe('workExperience validation', () => {
    it('passes with valid work experience', () => {
      const errors = validator.validate({
        ...validBase,
        workExperiences: [{ company: 'Acme', position: 'Dev', startDate: '2022-01-01' }],
      });
      expect(errors).toHaveLength(0);
    });

    it('fails when company is missing', () => {
      const errors = validator.validate({
        ...validBase,
        workExperiences: [{ company: '', position: 'Dev', startDate: '2022-01-01' }],
      });
      expect(hasField(errors, 'workExperiences[0].company')).toBe(true);
    });

    it('fails when endDate is before startDate', () => {
      const errors = validator.validate({
        ...validBase,
        workExperiences: [{ company: 'Acme', position: 'Dev', startDate: '2023-01-01', endDate: '2022-01-01' }],
      });
      expect(hasField(errors, 'workExperiences[0].endDate')).toBe(true);
    });
  });

  describe('document validation', () => {
    it('passes with valid document', () => {
      const errors = validator.validate({
        ...validBase,
        documents: [{ fileName: 'cv.pdf', fileType: 'CV_PDF', filePath: '/tmp/cv.pdf', fileSize: 1024 }],
      });
      expect(errors).toHaveLength(0);
    });

    it('fails with invalid fileType', () => {
      const errors = validator.validate({
        ...validBase,
        documents: [{ fileName: 'cv.txt', fileType: 'CV_TXT' as any, filePath: '/tmp/cv.txt', fileSize: 1024 }],
      });
      expect(hasField(errors, 'documents[0].fileType')).toBe(true);
    });

    it('fails when fileSize is zero', () => {
      const errors = validator.validate({
        ...validBase,
        documents: [{ fileName: 'cv.pdf', fileType: 'CV_PDF', filePath: '/tmp/cv.pdf', fileSize: 0 }],
      });
      expect(hasField(errors, 'documents[0].fileSize')).toBe(true);
    });

    it('fails when fileSize is negative', () => {
      const errors = validator.validate({
        ...validBase,
        documents: [{ fileName: 'cv.pdf', fileType: 'CV_PDF', filePath: '/tmp/cv.pdf', fileSize: -1 }],
      });
      expect(hasField(errors, 'documents[0].fileSize')).toBe(true);
    });
  });

  describe('multiple errors', () => {
    it('returns multiple errors at once', () => {
      const errors = validator.validate({ firstName: '', lastName: '', email: 'bad' });
      expect(errors.length).toBeGreaterThan(1);
    });
  });
});
