import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import EducationFieldset from "../components/candidates/EducationFieldset";
import WorkExperienceFieldset from "../components/candidates/WorkExperienceFieldset";
import DocumentFieldset from "../components/candidates/DocumentFieldset";
import {
  EducationDTO,
  WorkExperienceDTO,
  DocumentDTO,
} from "../types/candidate";

const noOp = jest.fn();

describe("EducationFieldset", () => {
  const baseEdu: EducationDTO = {
    institution: "MIT",
    degree: "BSc",
    fieldOfStudy: "CS",
    startDate: "2020-01-01",
    endDate: "2024-01-01",
  };

  it("renders all education fields", () => {
    render(
      <EducationFieldset
        value={baseEdu}
        index={0}
        onChange={noOp}
        onRemove={noOp}
        errors={{}}
      />,
    );
    expect(screen.getByLabelText(/institution/i)).toHaveValue("MIT");
    expect(screen.getByLabelText(/degree/i)).toHaveValue("BSc");
    expect(screen.getByLabelText(/field of study/i)).toHaveValue("CS");
    expect(screen.getByLabelText(/start date/i)).toHaveValue("2020-01-01");
    expect(screen.getByLabelText(/end date/i)).toHaveValue("2024-01-01");
  });

  it("calls onChange when institution changes", () => {
    const onChange = jest.fn();
    render(
      <EducationFieldset
        value={baseEdu}
        index={0}
        onChange={onChange}
        onRemove={noOp}
        errors={{}}
      />,
    );
    fireEvent.change(screen.getByLabelText(/institution/i), {
      target: { value: "Harvard" },
    });
    expect(onChange).toHaveBeenCalledWith(0, "institution", "Harvard");
  });

  it("calls onRemove when Remove is clicked", () => {
    const onRemove = jest.fn();
    render(
      <EducationFieldset
        value={baseEdu}
        index={1}
        onChange={noOp}
        onRemove={onRemove}
        errors={{}}
      />,
    );
    fireEvent.click(
      screen.getByRole("button", { name: /remove education 2/i }),
    );
    expect(onRemove).toHaveBeenCalledWith(1);
  });

  it("shows error messages for failing fields", () => {
    render(
      <EducationFieldset
        value={baseEdu}
        index={0}
        onChange={noOp}
        onRemove={noOp}
        errors={{
          "educations[0].institution": "Institution is required",
          "educations[0].endDate": "End date must be after start date",
        }}
      />,
    );
    expect(screen.getByText(/institution is required/i)).toBeInTheDocument();
    expect(
      screen.getByText(/end date must be after start date/i),
    ).toBeInTheDocument();
  });

  it("calls onChange for degree, fieldOfStudy, startDate, endDate", () => {
    const onChange = jest.fn();
    render(
      <EducationFieldset
        value={baseEdu}
        index={0}
        onChange={onChange}
        onRemove={noOp}
        errors={{}}
      />,
    );
    fireEvent.change(screen.getByLabelText(/degree/i), {
      target: { value: "MSc" },
    });
    expect(onChange).toHaveBeenCalledWith(0, "degree", "MSc");

    fireEvent.change(screen.getByLabelText(/field of study/i), {
      target: { value: "AI" },
    });
    expect(onChange).toHaveBeenCalledWith(0, "fieldOfStudy", "AI");

    fireEvent.change(screen.getByLabelText(/start date/i), {
      target: { value: "2021-01-01" },
    });
    expect(onChange).toHaveBeenCalledWith(0, "startDate", "2021-01-01");

    fireEvent.change(screen.getByLabelText(/end date/i), {
      target: { value: "2025-01-01" },
    });
    expect(onChange).toHaveBeenCalledWith(0, "endDate", "2025-01-01");
  });
});

describe("WorkExperienceFieldset", () => {
  const baseWork: WorkExperienceDTO = {
    company: "Acme",
    position: "Dev",
    description: "Built stuff",
    startDate: "2020-01-01",
    endDate: "2023-01-01",
  };

  it("renders all work experience fields", () => {
    render(
      <WorkExperienceFieldset
        value={baseWork}
        index={0}
        onChange={noOp}
        onRemove={noOp}
        errors={{}}
      />,
    );
    expect(screen.getByLabelText(/company/i)).toHaveValue("Acme");
    expect(screen.getByLabelText(/position/i)).toHaveValue("Dev");
    expect(screen.getByLabelText(/description/i)).toHaveValue("Built stuff");
    expect(screen.getByLabelText(/start date/i)).toHaveValue("2020-01-01");
    expect(screen.getByLabelText(/end date/i)).toHaveValue("2023-01-01");
  });

  it("calls onChange when company changes", () => {
    const onChange = jest.fn();
    render(
      <WorkExperienceFieldset
        value={baseWork}
        index={0}
        onChange={onChange}
        onRemove={noOp}
        errors={{}}
      />,
    );
    fireEvent.change(screen.getByLabelText(/company/i), {
      target: { value: "BigCorp" },
    });
    expect(onChange).toHaveBeenCalledWith(0, "company", "BigCorp");
  });

  it("calls onRemove", () => {
    const onRemove = jest.fn();
    render(
      <WorkExperienceFieldset
        value={baseWork}
        index={2}
        onChange={noOp}
        onRemove={onRemove}
        errors={{}}
      />,
    );
    fireEvent.click(
      screen.getByRole("button", { name: /remove work experience 3/i }),
    );
    expect(onRemove).toHaveBeenCalledWith(2);
  });

  it("shows error messages", () => {
    render(
      <WorkExperienceFieldset
        value={baseWork}
        index={0}
        onChange={noOp}
        onRemove={noOp}
        errors={{
          "workExperiences[0].company": "Company is required",
          "workExperiences[0].endDate": "End date must be after start date",
        }}
      />,
    );
    expect(screen.getByText(/company is required/i)).toBeInTheDocument();
    expect(
      screen.getByText(/end date must be after start date/i),
    ).toBeInTheDocument();
  });

  it("calls onChange for position, description, startDate, endDate", () => {
    const onChange = jest.fn();
    render(
      <WorkExperienceFieldset
        value={baseWork}
        index={0}
        onChange={onChange}
        onRemove={noOp}
        errors={{}}
      />,
    );
    fireEvent.change(screen.getByLabelText(/position/i), {
      target: { value: "Lead" },
    });
    expect(onChange).toHaveBeenCalledWith(0, "position", "Lead");

    fireEvent.change(screen.getByLabelText(/description/i), {
      target: { value: "Led team" },
    });
    expect(onChange).toHaveBeenCalledWith(0, "description", "Led team");

    fireEvent.change(screen.getByLabelText(/start date/i), {
      target: { value: "2021-01-01" },
    });
    expect(onChange).toHaveBeenCalledWith(0, "startDate", "2021-01-01");

    fireEvent.change(screen.getByLabelText(/end date/i), {
      target: { value: "2024-01-01" },
    });
    expect(onChange).toHaveBeenCalledWith(0, "endDate", "2024-01-01");
  });
});

describe("DocumentFieldset", () => {
  const baseDoc: DocumentDTO = {
    fileName: "cv.pdf",
    fileType: "CV_PDF",
    filePath: "/tmp/cv.pdf",
    fileSize: 1024,
  };

  it("renders all document fields", () => {
    render(
      <DocumentFieldset
        value={baseDoc}
        index={0}
        onChange={noOp}
        onRemove={noOp}
        errors={{}}
      />,
    );
    expect(screen.getByLabelText(/file name/i)).toHaveValue("cv.pdf");
    expect(screen.getByLabelText(/file type/i)).toHaveValue("CV_PDF");
    expect(screen.getByLabelText(/file path/i)).toHaveValue("/tmp/cv.pdf");
    expect(screen.getByLabelText(/file size/i)).toHaveValue(1024);
  });

  it("calls onChange when file name changes", () => {
    const onChange = jest.fn();
    render(
      <DocumentFieldset
        value={baseDoc}
        index={0}
        onChange={onChange}
        onRemove={noOp}
        errors={{}}
      />,
    );
    fireEvent.change(screen.getByLabelText(/file name/i), {
      target: { value: "resume.pdf" },
    });
    expect(onChange).toHaveBeenCalledWith(0, "fileName", "resume.pdf");
  });

  it("calls onChange when file type changes", () => {
    const onChange = jest.fn();
    render(
      <DocumentFieldset
        value={baseDoc}
        index={0}
        onChange={onChange}
        onRemove={noOp}
        errors={{}}
      />,
    );
    fireEvent.change(screen.getByLabelText(/file type/i), {
      target: { value: "CV_DOCX" },
    });
    expect(onChange).toHaveBeenCalledWith(0, "fileType", "CV_DOCX");
  });

  it("calls onRemove", () => {
    const onRemove = jest.fn();
    render(
      <DocumentFieldset
        value={baseDoc}
        index={0}
        onChange={noOp}
        onRemove={onRemove}
        errors={{}}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: /remove document 1/i }));
    expect(onRemove).toHaveBeenCalledWith(0);
  });

  it("shows error messages", () => {
    render(
      <DocumentFieldset
        value={baseDoc}
        index={0}
        onChange={noOp}
        onRemove={noOp}
        errors={{
          "documents[0].fileName": "File name is required",
          "documents[0].fileSize": "File size must be a positive integer",
        }}
      />,
    );
    expect(screen.getByText(/file name is required/i)).toBeInTheDocument();
    expect(
      screen.getByText(/file size must be a positive integer/i),
    ).toBeInTheDocument();
  });

  it("calls onChange for filePath and fileSize", () => {
    const onChange = jest.fn();
    render(
      <DocumentFieldset
        value={baseDoc}
        index={0}
        onChange={onChange}
        onRemove={noOp}
        errors={{}}
      />,
    );
    fireEvent.change(screen.getByLabelText(/file path/i), {
      target: { value: "/docs/cv.pdf" },
    });
    expect(onChange).toHaveBeenCalledWith(0, "filePath", "/docs/cv.pdf");

    fireEvent.change(screen.getByLabelText(/file size/i), {
      target: { value: "2048" },
    });
    expect(onChange).toHaveBeenCalledWith(0, "fileSize", 2048);
  });

  it("renders CV_DOCX option", () => {
    render(
      <DocumentFieldset
        value={{ ...baseDoc, fileType: "CV_DOCX" }}
        index={0}
        onChange={noOp}
        onRemove={noOp}
        errors={{}}
      />,
    );
    expect(screen.getByLabelText(/file type/i)).toHaveValue("CV_DOCX");
  });

  it("handles zero fileSize display as empty", () => {
    render(
      <DocumentFieldset
        value={{ ...baseDoc, fileSize: 0 }}
        index={0}
        onChange={noOp}
        onRemove={noOp}
        errors={{}}
      />,
    );
    expect(screen.getByLabelText(/file size/i)).toHaveValue(null);
  });
});
