import React from "react";
import { Row, Col, Form, Button } from "react-bootstrap";
import { WorkExperienceDTO, FormErrors } from "../../types/candidate";

type WorkExperienceFieldsetProps = {
  value: WorkExperienceDTO;
  index: number;
  onChange: (
    index: number,
    field: keyof WorkExperienceDTO,
    value: string,
  ) => void;
  onRemove: (index: number) => void;
  errors: FormErrors;
};

const WorkExperienceFieldset: React.FC<WorkExperienceFieldsetProps> = ({
  value,
  index,
  onChange,
  onRemove,
  errors,
}) => {
  const prefix = `workExperiences[${index}]`;

  const fieldId = (field: string) => `work-${index}-${field}`;
  const errorId = (field: string) => `work-${index}-${field}-error`;
  const fieldError = (field: string) => errors[`${prefix}.${field}`];

  return (
    <div
      className="border rounded p-3 mb-3"
      data-testid={`workExperience-${index}`}
    >
      <div className="d-flex justify-content-between align-items-center mb-2">
        <strong>Work Experience #{index + 1}</strong>
        <Button
          variant="outline-danger"
          size="sm"
          onClick={() => onRemove(index)}
          aria-label={`Remove work experience ${index + 1}`}
        >
          Remove
        </Button>
      </div>

      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label htmlFor={fieldId("company")}>
              Company <span aria-hidden="true">*</span>
            </Form.Label>
            <Form.Control
              id={fieldId("company")}
              type="text"
              value={value.company}
              onChange={(e) => onChange(index, "company", e.target.value)}
              isInvalid={!!fieldError("company")}
              aria-describedby={
                fieldError("company") ? errorId("company") : undefined
              }
              aria-required="true"
            />
            {fieldError("company") && (
              <Form.Control.Feedback type="invalid" id={errorId("company")}>
                {fieldError("company")}
              </Form.Control.Feedback>
            )}
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label htmlFor={fieldId("position")}>
              Position <span aria-hidden="true">*</span>
            </Form.Label>
            <Form.Control
              id={fieldId("position")}
              type="text"
              value={value.position}
              onChange={(e) => onChange(index, "position", e.target.value)}
              isInvalid={!!fieldError("position")}
              aria-describedby={
                fieldError("position") ? errorId("position") : undefined
              }
              aria-required="true"
            />
            {fieldError("position") && (
              <Form.Control.Feedback type="invalid" id={errorId("position")}>
                {fieldError("position")}
              </Form.Control.Feedback>
            )}
          </Form.Group>
        </Col>
      </Row>

      <Form.Group className="mb-3">
        <Form.Label htmlFor={fieldId("description")}>Description</Form.Label>
        <Form.Control
          id={fieldId("description")}
          as="textarea"
          rows={2}
          value={value.description ?? ""}
          onChange={(e) => onChange(index, "description", e.target.value)}
        />
      </Form.Group>

      <Row>
        <Col md={6}>
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
        <Col md={6}>
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

export default WorkExperienceFieldset;
