import React from "react";
import { Row, Col, Form, Button } from "react-bootstrap";
import { EducationDTO, FormErrors } from "../../types/candidate";

type EducationFieldsetProps = {
  value: EducationDTO;
  index: number;
  onChange: (index: number, field: keyof EducationDTO, value: string) => void;
  onRemove: (index: number) => void;
  errors: FormErrors;
};

const EducationFieldset: React.FC<EducationFieldsetProps> = ({
  value,
  index,
  onChange,
  onRemove,
  errors,
}) => {
  const prefix = `educations[${index}]`;

  const fieldId = (field: string) => `education-${index}-${field}`;
  const errorId = (field: string) => `education-${index}-${field}-error`;
  const fieldError = (field: string) => errors[`${prefix}.${field}`];

  return (
    <div className="border rounded p-3 mb-3" data-testid={`education-${index}`}>
      <div className="d-flex justify-content-between align-items-center mb-2">
        <strong>Education #{index + 1}</strong>
        <Button
          variant="outline-danger"
          size="sm"
          onClick={() => onRemove(index)}
          aria-label={`Remove education ${index + 1}`}
        >
          Remove
        </Button>
      </div>

      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label htmlFor={fieldId("institution")}>
              Institution <span aria-hidden="true">*</span>
            </Form.Label>
            <Form.Control
              id={fieldId("institution")}
              type="text"
              value={value.institution}
              onChange={(e) => onChange(index, "institution", e.target.value)}
              isInvalid={!!fieldError("institution")}
              aria-describedby={
                fieldError("institution") ? errorId("institution") : undefined
              }
              aria-required="true"
            />
            {fieldError("institution") && (
              <Form.Control.Feedback type="invalid" id={errorId("institution")}>
                {fieldError("institution")}
              </Form.Control.Feedback>
            )}
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label htmlFor={fieldId("degree")}>
              Degree <span aria-hidden="true">*</span>
            </Form.Label>
            <Form.Control
              id={fieldId("degree")}
              type="text"
              value={value.degree}
              onChange={(e) => onChange(index, "degree", e.target.value)}
              isInvalid={!!fieldError("degree")}
              aria-describedby={
                fieldError("degree") ? errorId("degree") : undefined
              }
              aria-required="true"
            />
            {fieldError("degree") && (
              <Form.Control.Feedback type="invalid" id={errorId("degree")}>
                {fieldError("degree")}
              </Form.Control.Feedback>
            )}
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col md={4}>
          <Form.Group className="mb-3">
            <Form.Label htmlFor={fieldId("fieldOfStudy")}>
              Field of Study
            </Form.Label>
            <Form.Control
              id={fieldId("fieldOfStudy")}
              type="text"
              value={value.fieldOfStudy ?? ""}
              onChange={(e) => onChange(index, "fieldOfStudy", e.target.value)}
              isInvalid={!!fieldError("fieldOfStudy")}
              aria-describedby={
                fieldError("fieldOfStudy") ? errorId("fieldOfStudy") : undefined
              }
            />
            {fieldError("fieldOfStudy") && (
              <Form.Control.Feedback
                type="invalid"
                id={errorId("fieldOfStudy")}
              >
                {fieldError("fieldOfStudy")}
              </Form.Control.Feedback>
            )}
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group className="mb-3">
            <Form.Label htmlFor={fieldId("startDate")}>
              Start Date <span aria-hidden="true">*</span>
            </Form.Label>
            <Form.Control
              id={fieldId("startDate")}
              type="date"
              value={value.startDate}
              onChange={(e) => onChange(index, "startDate", e.target.value)}
              isInvalid={!!fieldError("startDate")}
              aria-describedby={
                fieldError("startDate") ? errorId("startDate") : undefined
              }
              aria-required="true"
            />
            {fieldError("startDate") && (
              <Form.Control.Feedback type="invalid" id={errorId("startDate")}>
                {fieldError("startDate")}
              </Form.Control.Feedback>
            )}
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group className="mb-3">
            <Form.Label htmlFor={fieldId("endDate")}>End Date</Form.Label>
            <Form.Control
              id={fieldId("endDate")}
              type="date"
              value={value.endDate ?? ""}
              onChange={(e) => onChange(index, "endDate", e.target.value)}
              isInvalid={!!fieldError("endDate")}
              aria-describedby={
                fieldError("endDate") ? errorId("endDate") : undefined
              }
            />
            {fieldError("endDate") && (
              <Form.Control.Feedback type="invalid" id={errorId("endDate")}>
                {fieldError("endDate")}
              </Form.Control.Feedback>
            )}
          </Form.Group>
        </Col>
      </Row>
    </div>
  );
};

export default EducationFieldset;
