import React, { useState } from "react";
import { Form, Button, Alert, Row, Col } from "react-bootstrap";
import {
  CreateCandidateDTO,
  EducationDTO,
  WorkExperienceDTO,
  DocumentDTO,
  FormErrors,
} from "../../types/candidate";
import {
  candidateService,
  CandidateServiceError,
} from "../../services/candidateService";
import { validateCandidateForm } from "../../utils/validateCandidateForm";
import EducationFieldset from "./EducationFieldset";
import WorkExperienceFieldset from "./WorkExperienceFieldset";
import DocumentFieldset from "./DocumentFieldset";

const EMPTY_EDUCATION: EducationDTO = {
  institution: "",
  degree: "",
  fieldOfStudy: "",
  startDate: "",
  endDate: "",
};

const EMPTY_WORK_EXPERIENCE: WorkExperienceDTO = {
  company: "",
  position: "",
  description: "",
  startDate: "",
  endDate: "",
};

const EMPTY_DOCUMENT: DocumentDTO = {
  fileName: "",
  fileType: "CV_PDF",
  filePath: "",
  fileSize: 0,
};

const INITIAL_FORM: CreateCandidateDTO = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address: "",
  educations: [],
  workExperiences: [],
  documents: [],
};

const AddCandidateForm: React.FC = () => {
  const [formData, setFormData] = useState<CreateCandidateDTO>(INITIAL_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [globalError, setGlobalError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [saving, setSaving] = useState(false);

  // --- Personal info handlers ---
  const handlePersonalChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  // --- Education handlers ---
  const handleAddEducation = () => {
    setFormData((prev) => ({
      ...prev,
      educations: [...(prev.educations ?? []), { ...EMPTY_EDUCATION }],
    }));
  };

  const handleEducationChange = (
    index: number,
    field: keyof EducationDTO,
    value: string,
  ) => {
    setFormData((prev) => {
      const updated = [...(prev.educations ?? [])];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, educations: updated };
    });
    const key = `educations[${index}].${field}`;
    if (errors[key]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  };

  const handleRemoveEducation = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      educations: (prev.educations ?? []).filter((_, i) => i !== index),
    }));
  };

  // --- Work experience handlers ---
  const handleAddWorkExperience = () => {
    setFormData((prev) => ({
      ...prev,
      workExperiences: [
        ...(prev.workExperiences ?? []),
        { ...EMPTY_WORK_EXPERIENCE },
      ],
    }));
  };

  const handleWorkExperienceChange = (
    index: number,
    field: keyof WorkExperienceDTO,
    value: string,
  ) => {
    setFormData((prev) => {
      const updated = [...(prev.workExperiences ?? [])];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, workExperiences: updated };
    });
    const key = `workExperiences[${index}].${field}`;
    if (errors[key]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  };

  const handleRemoveWorkExperience = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      workExperiences: (prev.workExperiences ?? []).filter(
        (_, i) => i !== index,
      ),
    }));
  };

  // --- Document handlers ---
  const handleAddDocument = () => {
    setFormData((prev) => ({
      ...prev,
      documents: [...(prev.documents ?? []), { ...EMPTY_DOCUMENT }],
    }));
  };

  const handleDocumentChange = (
    index: number,
    field: keyof DocumentDTO,
    value: string | number,
  ) => {
    setFormData((prev) => {
      const updated = [...(prev.documents ?? [])];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, documents: updated };
    });
    const key = `documents[${index}].${field}`;
    if (errors[key]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  };

  const handleRemoveDocument = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      documents: (prev.documents ?? []).filter((_, i) => i !== index),
    }));
  };

  // --- Submit ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGlobalError("");
    setSuccessMessage("");

    // Sanitize optional empty strings to undefined before sending
    const payload: CreateCandidateDTO = {
      ...formData,
      phone: formData.phone?.trim() || undefined,
      address: formData.address?.trim() || undefined,
      educations: (formData.educations ?? []).map((edu) => ({
        ...edu,
        fieldOfStudy: edu.fieldOfStudy?.trim() || undefined,
        endDate: edu.endDate?.trim() || undefined,
      })),
      workExperiences: (formData.workExperiences ?? []).map((work) => ({
        ...work,
        description: work.description?.trim() || undefined,
        endDate: work.endDate?.trim() || undefined,
      })),
      documents: formData.documents ?? [],
    };

    const validationErrors = validateCandidateForm(payload);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSaving(true);
    try {
      const created = await candidateService.createCandidate(payload);
      setSuccessMessage(
        `Candidate ${created.firstName} ${created.lastName} created successfully`,
      );
      setFormData(INITIAL_FORM);
      setErrors({});
    } catch (err: unknown) {
      const serviceError = err as CandidateServiceError;

      if (serviceError.type === "validation" && serviceError.fieldErrors) {
        const fieldErrors: FormErrors = {};
        serviceError.fieldErrors.forEach(({ field, message }) => {
          fieldErrors[field] = message;
        });
        setErrors(fieldErrors);
      } else if (serviceError.type === "conflict") {
        setErrors({ email: serviceError.message });
      } else {
        setGlobalError(
          serviceError.message ??
            "An unexpected error occurred. Please try again.",
        );
      }
    } finally {
      setSaving(false);
    }
  };

  const fieldId = (name: string) => `personal-${name}`;
  const errorId = (name: string) => `personal-${name}-error`;

  return (
    <Form onSubmit={handleSubmit} noValidate>
      {successMessage && (
        <Alert
          variant="success"
          dismissible
          onClose={() => setSuccessMessage("")}
        >
          {successMessage}
        </Alert>
      )}
      {globalError && (
        <Alert variant="danger" dismissible onClose={() => setGlobalError("")}>
          {globalError}
        </Alert>
      )}

      {/* Personal Information */}
      <h5 className="mb-3">Personal Information</h5>
      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label htmlFor={fieldId("firstName")}>
              First Name <span aria-hidden="true">*</span>
            </Form.Label>
            <Form.Control
              id={fieldId("firstName")}
              name="firstName"
              type="text"
              value={formData.firstName}
              onChange={handlePersonalChange}
              isInvalid={!!errors["firstName"]}
              aria-describedby={
                errors["firstName"] ? errorId("firstName") : undefined
              }
              aria-required="true"
            />
            {errors["firstName"] && (
              <Form.Control.Feedback type="invalid" id={errorId("firstName")}>
                {errors["firstName"]}
              </Form.Control.Feedback>
            )}
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label htmlFor={fieldId("lastName")}>
              Last Name <span aria-hidden="true">*</span>
            </Form.Label>
            <Form.Control
              id={fieldId("lastName")}
              name="lastName"
              type="text"
              value={formData.lastName}
              onChange={handlePersonalChange}
              isInvalid={!!errors["lastName"]}
              aria-describedby={
                errors["lastName"] ? errorId("lastName") : undefined
              }
              aria-required="true"
            />
            {errors["lastName"] && (
              <Form.Control.Feedback type="invalid" id={errorId("lastName")}>
                {errors["lastName"]}
              </Form.Control.Feedback>
            )}
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label htmlFor={fieldId("email")}>
              Email <span aria-hidden="true">*</span>
            </Form.Label>
            <Form.Control
              id={fieldId("email")}
              name="email"
              type="email"
              value={formData.email}
              onChange={handlePersonalChange}
              isInvalid={!!errors["email"]}
              aria-describedby={errors["email"] ? errorId("email") : undefined}
              aria-required="true"
            />
            {errors["email"] && (
              <Form.Control.Feedback type="invalid" id={errorId("email")}>
                {errors["email"]}
              </Form.Control.Feedback>
            )}
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label htmlFor={fieldId("phone")}>Phone</Form.Label>
            <Form.Control
              id={fieldId("phone")}
              name="phone"
              type="tel"
              value={formData.phone ?? ""}
              onChange={handlePersonalChange}
              isInvalid={!!errors["phone"]}
              aria-describedby={errors["phone"] ? errorId("phone") : undefined}
            />
            {errors["phone"] && (
              <Form.Control.Feedback type="invalid" id={errorId("phone")}>
                {errors["phone"]}
              </Form.Control.Feedback>
            )}
          </Form.Group>
        </Col>
      </Row>

      <Form.Group className="mb-4">
        <Form.Label htmlFor={fieldId("address")}>Address</Form.Label>
        <Form.Control
          id={fieldId("address")}
          name="address"
          as="textarea"
          rows={2}
          value={formData.address ?? ""}
          onChange={handlePersonalChange}
          isInvalid={!!errors["address"]}
          aria-describedby={errors["address"] ? errorId("address") : undefined}
        />
        {errors["address"] && (
          <Form.Control.Feedback type="invalid" id={errorId("address")}>
            {errors["address"]}
          </Form.Control.Feedback>
        )}
      </Form.Group>

      {/* Education */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">Education</h5>
        <Button
          variant="outline-primary"
          size="sm"
          onClick={handleAddEducation}
        >
          + Add Education
        </Button>
      </div>
      {(formData.educations ?? []).map((edu, i) => (
        <EducationFieldset
          key={i}
          value={edu}
          index={i}
          onChange={handleEducationChange}
          onRemove={handleRemoveEducation}
          errors={errors}
        />
      ))}

      {/* Work Experience */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">Work Experience</h5>
        <Button
          variant="outline-primary"
          size="sm"
          onClick={handleAddWorkExperience}
        >
          + Add Work Experience
        </Button>
      </div>
      {(formData.workExperiences ?? []).map((work, i) => (
        <WorkExperienceFieldset
          key={i}
          value={work}
          index={i}
          onChange={handleWorkExperienceChange}
          onRemove={handleRemoveWorkExperience}
          errors={errors}
        />
      ))}

      {/* Documents */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">Documents</h5>
        <Button variant="outline-primary" size="sm" onClick={handleAddDocument}>
          + Add Document
        </Button>
      </div>
      {(formData.documents ?? []).map((doc, i) => (
        <DocumentFieldset
          key={i}
          value={doc}
          index={i}
          onChange={handleDocumentChange}
          onRemove={handleRemoveDocument}
          errors={errors}
        />
      ))}

      <div className="mt-4">
        <Button type="submit" variant="primary" disabled={saving}>
          {saving ? "Saving..." : "Save Candidate"}
        </Button>
      </div>
    </Form>
  );
};

export default AddCandidateForm;
