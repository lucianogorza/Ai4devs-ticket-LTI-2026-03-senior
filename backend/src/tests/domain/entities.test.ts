import { Candidate } from '../../domain/models/Candidate';
import { Education } from '../../domain/models/Education';
import { WorkExperience } from '../../domain/models/WorkExperience';
import { Document } from '../../domain/models/Document';

describe('Candidate', () => {
  it('constructs with required fields', () => {
    const candidate = new Candidate({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
    });
    expect(candidate.firstName).toBe('John');
    expect(candidate.lastName).toBe('Doe');
    expect(candidate.email).toBe('john@example.com');
    expect(candidate.phone).toBeNull();
    expect(candidate.address).toBeNull();
    expect(candidate.educations).toEqual([]);
    expect(candidate.workExperiences).toEqual([]);
    expect(candidate.documents).toEqual([]);
  });

  it('constructs with all fields', () => {
    const candidate = new Candidate({
      id: 1,
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane@example.com',
      phone: '+1234567890',
      address: '123 Main St',
    });
    expect(candidate.id).toBe(1);
    expect(candidate.phone).toBe('+1234567890');
    expect(candidate.address).toBe('123 Main St');
  });

  it('maps educations from constructor data', () => {
    const candidate = new Candidate({
      firstName: 'John',
      lastName: 'Doe',
      email: 'j@e.com',
      educations: [
        { institution: 'MIT', degree: 'BSc', startDate: '2020-01-01' },
      ],
    });
    expect(candidate.educations).toHaveLength(1);
    expect(candidate.educations[0]).toBeInstanceOf(Education);
  });

  it('maps workExperiences from constructor data', () => {
    const candidate = new Candidate({
      firstName: 'John',
      lastName: 'Doe',
      email: 'j@e.com',
      workExperiences: [
        { company: 'Acme', position: 'Dev', startDate: '2020-01-01' },
      ],
    });
    expect(candidate.workExperiences).toHaveLength(1);
    expect(candidate.workExperiences[0]).toBeInstanceOf(WorkExperience);
  });

  it('maps documents from constructor data', () => {
    const candidate = new Candidate({
      firstName: 'John',
      lastName: 'Doe',
      email: 'j@e.com',
      documents: [
        {
          fileName: 'cv.pdf',
          fileType: 'CV_PDF',
          filePath: '/tmp/cv.pdf',
          fileSize: 1024,
        },
      ],
    });
    expect(candidate.documents).toHaveLength(1);
    expect(candidate.documents[0]).toBeInstanceOf(Document);
  });
});

describe('Education', () => {
  it('constructs with required fields', () => {
    const edu = new Education({
      institution: 'MIT',
      degree: 'BSc',
      startDate: '2020-01-01',
    });
    expect(edu.institution).toBe('MIT');
    expect(edu.degree).toBe('BSc');
    expect(edu.startDate).toBeInstanceOf(Date);
    expect(edu.endDate).toBeNull();
    expect(edu.fieldOfStudy).toBeNull();
  });

  it('constructs with endDate', () => {
    const edu = new Education({
      institution: 'MIT',
      degree: 'BSc',
      startDate: '2020-01-01',
      endDate: '2024-06-01',
    });
    expect(edu.endDate).toBeInstanceOf(Date);
  });
});

describe('WorkExperience', () => {
  it('constructs with required fields', () => {
    const exp = new WorkExperience({
      company: 'Acme',
      position: 'Engineer',
      startDate: '2022-01-01',
    });
    expect(exp.company).toBe('Acme');
    expect(exp.position).toBe('Engineer');
    expect(exp.startDate).toBeInstanceOf(Date);
    expect(exp.endDate).toBeNull();
    expect(exp.description).toBeNull();
  });

  it('constructs with description and endDate', () => {
    const exp = new WorkExperience({
      company: 'Acme',
      position: 'Dev',
      startDate: '2022-01-01',
      endDate: '2023-01-01',
      description: 'Built things',
    });
    expect(exp.description).toBe('Built things');
    expect(exp.endDate).toBeInstanceOf(Date);
  });
});

describe('Document', () => {
  it('constructs with all fields', () => {
    const doc = new Document({
      fileName: 'cv.pdf',
      fileType: 'CV_PDF',
      filePath: '/tmp/cv.pdf',
      fileSize: 1024,
    });
    expect(doc.fileName).toBe('cv.pdf');
    expect(doc.fileType).toBe('CV_PDF');
    expect(doc.filePath).toBe('/tmp/cv.pdf');
    expect(doc.fileSize).toBe(1024);
  });

  it('supports CV_DOCX type', () => {
    const doc = new Document({
      fileName: 'cv.docx',
      fileType: 'CV_DOCX',
      filePath: '/tmp/cv.docx',
      fileSize: 512,
    });
    expect(doc.fileType).toBe('CV_DOCX');
  });
});
