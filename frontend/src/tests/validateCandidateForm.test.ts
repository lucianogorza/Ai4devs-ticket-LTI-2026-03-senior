import { validateCandidateForm } from "../utils/validateCandidateForm";
import { CreateCandidateDTO } from "../types/candidate";

const validBase: CreateCandidateDTO = {
  firstName: "John",
  lastName: "Doe",
  email: "john@example.com",
};

describe("validateCandidateForm", () => {
  describe("personal info - required fields", () => {
    it("returns no errors for valid base data", () => {
      expect(validateCandidateForm(validBase)).toEqual({});
    });

    it("errors on empty firstName", () => {
      const errors = validateCandidateForm({ ...validBase, firstName: "" });
      expect(errors["firstName"]).toBeDefined();
    });

    it("errors on whitespace-only firstName", () => {
      const errors = validateCandidateForm({ ...validBase, firstName: "   " });
      expect(errors["firstName"]).toBeDefined();
    });

    it("errors on firstName > 100 chars", () => {
      const errors = validateCandidateForm({
        ...validBase,
        firstName: "a".repeat(101),
      });
      expect(errors["firstName"]).toBeDefined();
    });

    it("errors on empty lastName", () => {
      const errors = validateCandidateForm({ ...validBase, lastName: "" });
      expect(errors["lastName"]).toBeDefined();
    });

    it("errors on lastName > 100 chars", () => {
      const errors = validateCandidateForm({
        ...validBase,
        lastName: "a".repeat(101),
      });
      expect(errors["lastName"]).toBeDefined();
    });

    it("errors on empty email", () => {
      const errors = validateCandidateForm({ ...validBase, email: "" });
      expect(errors["email"]).toBeDefined();
    });

    it("errors on invalid email format", () => {
      const errors = validateCandidateForm({
        ...validBase,
        email: "notanemail",
      });
      expect(errors["email"]).toBeDefined();
    });

    it("errors on email > 255 chars", () => {
      const errors = validateCandidateForm({
        ...validBase,
        email: "a".repeat(250) + "@x.com",
      });
      expect(errors["email"]).toBeDefined();
    });

    it("errors on phone > 20 chars", () => {
      const errors = validateCandidateForm({
        ...validBase,
        phone: "1".repeat(21),
      });
      expect(errors["phone"]).toBeDefined();
    });

    it("no error on phone within 20 chars", () => {
      const errors = validateCandidateForm({
        ...validBase,
        phone: "1234567890",
      });
      expect(errors["phone"]).toBeUndefined();
    });

    it("errors on address > 500 chars", () => {
      const errors = validateCandidateForm({
        ...validBase,
        address: "a".repeat(501),
      });
      expect(errors["address"]).toBeDefined();
    });

    it("no error on address within 500 chars", () => {
      const errors = validateCandidateForm({
        ...validBase,
        address: "Main Street 123",
      });
      expect(errors["address"]).toBeUndefined();
    });
  });

  describe("education validation", () => {
    it("no error for valid education entry", () => {
      const errors = validateCandidateForm({
        ...validBase,
        educations: [
          { institution: "MIT", degree: "BSc", startDate: "2020-01-01" },
        ],
      });
      expect(Object.keys(errors)).toHaveLength(0);
    });

    it("errors on empty institution", () => {
      const errors = validateCandidateForm({
        ...validBase,
        educations: [
          { institution: "", degree: "BSc", startDate: "2020-01-01" },
        ],
      });
      expect(errors["educations[0].institution"]).toBeDefined();
    });

    it("errors on institution > 200 chars", () => {
      const errors = validateCandidateForm({
        ...validBase,
        educations: [
          {
            institution: "a".repeat(201),
            degree: "BSc",
            startDate: "2020-01-01",
          },
        ],
      });
      expect(errors["educations[0].institution"]).toBeDefined();
    });

    it("errors on empty degree", () => {
      const errors = validateCandidateForm({
        ...validBase,
        educations: [
          { institution: "MIT", degree: "", startDate: "2020-01-01" },
        ],
      });
      expect(errors["educations[0].degree"]).toBeDefined();
    });

    it("errors on degree > 200 chars", () => {
      const errors = validateCandidateForm({
        ...validBase,
        educations: [
          {
            institution: "MIT",
            degree: "a".repeat(201),
            startDate: "2020-01-01",
          },
        ],
      });
      expect(errors["educations[0].degree"]).toBeDefined();
    });

    it("errors on fieldOfStudy > 200 chars", () => {
      const errors = validateCandidateForm({
        ...validBase,
        educations: [
          {
            institution: "MIT",
            degree: "BSc",
            fieldOfStudy: "a".repeat(201),
            startDate: "2020-01-01",
          },
        ],
      });
      expect(errors["educations[0].fieldOfStudy"]).toBeDefined();
    });

    it("errors on missing startDate", () => {
      const errors = validateCandidateForm({
        ...validBase,
        educations: [{ institution: "MIT", degree: "BSc", startDate: "" }],
      });
      expect(errors["educations[0].startDate"]).toBeDefined();
    });

    it("errors when endDate is before startDate", () => {
      const errors = validateCandidateForm({
        ...validBase,
        educations: [
          {
            institution: "MIT",
            degree: "BSc",
            startDate: "2022-01-01",
            endDate: "2020-01-01",
          },
        ],
      });
      expect(errors["educations[0].endDate"]).toBeDefined();
    });

    it("errors when endDate equals startDate", () => {
      const errors = validateCandidateForm({
        ...validBase,
        educations: [
          {
            institution: "MIT",
            degree: "BSc",
            startDate: "2020-01-01",
            endDate: "2020-01-01",
          },
        ],
      });
      expect(errors["educations[0].endDate"]).toBeDefined();
    });

    it("no error when endDate is after startDate", () => {
      const errors = validateCandidateForm({
        ...validBase,
        educations: [
          {
            institution: "MIT",
            degree: "BSc",
            startDate: "2020-01-01",
            endDate: "2022-01-01",
          },
        ],
      });
      expect(errors["educations[0].endDate"]).toBeUndefined();
    });
  });

  describe("work experience validation", () => {
    it("no error for valid work experience entry", () => {
      const errors = validateCandidateForm({
        ...validBase,
        workExperiences: [
          { company: "Acme", position: "Dev", startDate: "2020-01-01" },
        ],
      });
      expect(Object.keys(errors)).toHaveLength(0);
    });

    it("errors on empty company", () => {
      const errors = validateCandidateForm({
        ...validBase,
        workExperiences: [
          { company: "", position: "Dev", startDate: "2020-01-01" },
        ],
      });
      expect(errors["workExperiences[0].company"]).toBeDefined();
    });

    it("errors on company > 200 chars", () => {
      const errors = validateCandidateForm({
        ...validBase,
        workExperiences: [
          {
            company: "a".repeat(201),
            position: "Dev",
            startDate: "2020-01-01",
          },
        ],
      });
      expect(errors["workExperiences[0].company"]).toBeDefined();
    });

    it("errors on empty position", () => {
      const errors = validateCandidateForm({
        ...validBase,
        workExperiences: [
          { company: "Acme", position: "", startDate: "2020-01-01" },
        ],
      });
      expect(errors["workExperiences[0].position"]).toBeDefined();
    });

    it("errors on empty startDate", () => {
      const errors = validateCandidateForm({
        ...validBase,
        workExperiences: [{ company: "Acme", position: "Dev", startDate: "" }],
      });
      expect(errors["workExperiences[0].startDate"]).toBeDefined();
    });

    it("errors when endDate is before startDate", () => {
      const errors = validateCandidateForm({
        ...validBase,
        workExperiences: [
          {
            company: "Acme",
            position: "Dev",
            startDate: "2023-01-01",
            endDate: "2022-01-01",
          },
        ],
      });
      expect(errors["workExperiences[0].endDate"]).toBeDefined();
    });
  });

  describe("document validation", () => {
    const validDoc = {
      fileName: "cv.pdf",
      fileType: "CV_PDF" as const,
      filePath: "/tmp/cv.pdf",
      fileSize: 1024,
    };

    it("no error for valid document", () => {
      const errors = validateCandidateForm({
        ...validBase,
        documents: [validDoc],
      });
      expect(Object.keys(errors)).toHaveLength(0);
    });

    it("errors on empty fileName", () => {
      const errors = validateCandidateForm({
        ...validBase,
        documents: [{ ...validDoc, fileName: "" }],
      });
      expect(errors["documents[0].fileName"]).toBeDefined();
    });

    it("errors on fileName > 255 chars", () => {
      const errors = validateCandidateForm({
        ...validBase,
        documents: [{ ...validDoc, fileName: "a".repeat(256) }],
      });
      expect(errors["documents[0].fileName"]).toBeDefined();
    });

    it("errors on invalid fileType", () => {
      const errors = validateCandidateForm({
        ...validBase,
        documents: [{ ...validDoc, fileType: "CV_TXT" as any }],
      });
      expect(errors["documents[0].fileType"]).toBeDefined();
    });

    it("errors on empty filePath", () => {
      const errors = validateCandidateForm({
        ...validBase,
        documents: [{ ...validDoc, filePath: "" }],
      });
      expect(errors["documents[0].filePath"]).toBeDefined();
    });

    it("errors on filePath > 500 chars", () => {
      const errors = validateCandidateForm({
        ...validBase,
        documents: [{ ...validDoc, filePath: "a".repeat(501) }],
      });
      expect(errors["documents[0].filePath"]).toBeDefined();
    });

    it("errors on fileSize = 0", () => {
      const errors = validateCandidateForm({
        ...validBase,
        documents: [{ ...validDoc, fileSize: 0 }],
      });
      expect(errors["documents[0].fileSize"]).toBeDefined();
    });

    it("errors on negative fileSize", () => {
      const errors = validateCandidateForm({
        ...validBase,
        documents: [{ ...validDoc, fileSize: -1 }],
      });
      expect(errors["documents[0].fileSize"]).toBeDefined();
    });

    it("errors on non-integer fileSize", () => {
      const errors = validateCandidateForm({
        ...validBase,
        documents: [{ ...validDoc, fileSize: 1.5 }],
      });
      expect(errors["documents[0].fileSize"]).toBeDefined();
    });
  });
});
