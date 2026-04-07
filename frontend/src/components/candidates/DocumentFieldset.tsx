import React from "react";
import { Row, Col, Form, Button } from "react-bootstrap";
import { DocumentDTO, DocumentType, FormErrors } from "../../types/candidate";

type DocumentFieldsetProps = {
  value: DocumentDTO;
  index: number;
  onChange: (
    index: number,
    field: keyof DocumentDTO,
    value: string | number,
  ) => void;
  onRemove: (index: number) => void;
  errors: FormErrors;
};

const DocumentFieldset: React.FC<DocumentFieldsetProps> = ({
  value,
  index,
  onChange,
  onRemove,
  errors,
}) => {
  const prefix = `documents[${index}]`;

  const fieldId = (field: string) => `document-${index}-${field}`;
  const errorId = (field: string) => `document-${index}-${field}-error`;
  const fieldError = (field: string) => errors[`${prefix}.${field}`];

  return (
    <div className="border rounded p-3 mb-3" data-testid={`document-${index}`}>
      <div className="d-flex justify-content-between align-items-center mb-2">
        <strong>Document #{index + 1}</strong>
        <Button
          variant="outline-danger"
          size="sm"
          onClick={() => onRemove(index)}
          aria-label={`Remove document ${index + 1}`}
        >
          Remove
        </Button>
      </div>

      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label htmlFor={fieldId("fileName")}>
              File Name <span aria-hidden="true">*</span>
            </Form.Label>
            <Form.Control
              id={fieldId("fileName")}
              type="text"
              value={value.fileName}
              onChange={(e) => onChange(index, "fileName", e.target.value)}
              isInvalid={!!fieldError("fileName")}
              aria-describedby={
                fieldError("fileName") ? errorId("fileName") : undefined
              }
              aria-required="true"
            />
            {fieldError("fileName") && (
              <Form.Control.Feedback type="invalid" id={errorId("fileName")}>
                {fieldError("fileName")}
              </Form.Control.Feedback>
            )}
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label htmlFor={fieldId("fileType")}>
              File Type <span aria-hidden="true">*</span>
            </Form.Label>
            <Form.Select
              id={fieldId("fileType")}
              value={value.fileType}
              onChange={(e) =>
                onChange(index, "fileType", e.target.value as DocumentType)
              }
              isInvalid={!!fieldError("fileType")}
              aria-describedby={
                fieldError("fileType") ? errorId("fileType") : undefined
              }
              aria-required="true"
            >
              <option value="CV_PDF">CV PDF</option>
              <option value="CV_DOCX">CV DOCX</option>
            </Form.Select>
            {fieldError("fileType") && (
              <Form.Control.Feedback type="invalid" id={errorId("fileType")}>
                {fieldError("fileType")}
              </Form.Control.Feedback>
            )}
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col md={8}>
          <Form.Group className="mb-3">
            <Form.Label htmlFor={fieldId("filePath")}>
              File Path <span aria-hidden="true">*</span>
            </Form.Label>
            <Form.Control
              id={fieldId("filePath")}
              type="text"
              value={value.filePath}
              onChange={(e) => onChange(index, "filePath", e.target.value)}
              isInvalid={!!fieldError("filePath")}
              aria-describedby={
                fieldError("filePath") ? errorId("filePath") : undefined
              }
              aria-required="true"
            />
            {fieldError("filePath") && (
              <Form.Control.Feedback type="invalid" id={errorId("filePath")}>
                {fieldError("filePath")}
              </Form.Control.Feedback>
            )}
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group className="mb-3">
            <Form.Label htmlFor={fieldId("fileSize")}>
              File Size (bytes) <span aria-hidden="true">*</span>
            </Form.Label>
            <Form.Control
              id={fieldId("fileSize")}
              type="number"
              min={1}
              value={value.fileSize === 0 ? "" : value.fileSize}
              onChange={(e) =>
                onChange(index, "fileSize", parseInt(e.target.value, 10) || 0)
              }
              isInvalid={!!fieldError("fileSize")}
              aria-describedby={
                fieldError("fileSize") ? errorId("fileSize") : undefined
              }
              aria-required="true"
            />
            {fieldError("fileSize") && (
              <Form.Control.Feedback type="invalid" id={errorId("fileSize")}>
                {fieldError("fileSize")}
              </Form.Control.Feedback>
            )}
          </Form.Group>
        </Col>
      </Row>
    </div>
  );
};

export default DocumentFieldset;
