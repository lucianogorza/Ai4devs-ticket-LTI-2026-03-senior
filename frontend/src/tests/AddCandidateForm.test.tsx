import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import AddCandidateForm from "../components/candidates/AddCandidateForm";
import * as candidateServiceModule from "../services/candidateService";

// Mock the service module
jest.mock("../services/candidateService");
const mockedService = candidateServiceModule.candidateService as jest.Mocked<
  typeof candidateServiceModule.candidateService
>;

const renderForm = () =>
  render(
    <MemoryRouter>
      <AddCandidateForm />
    </MemoryRouter>,
  );

describe("AddCandidateForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // 8.2 — renders form with all required fields and sections
  it("renders all personal info fields and section headers", () => {
    renderForm();
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/address/i)).toBeInTheDocument();
    expect(screen.getAllByText(/education/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/work experience/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/documents/i).length).toBeGreaterThan(0);
  });

  // 8.3 — shows validation errors when submitting empty form
  it("shows validation errors when submitting empty required fields", async () => {
    renderForm();
    fireEvent.click(screen.getByRole("button", { name: /save candidate/i }));
    await waitFor(() => {
      expect(screen.getByText(/first name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/last name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    });
    expect(mockedService.createCandidate).not.toHaveBeenCalled();
  });

  it("shows email format error for invalid email", async () => {
    renderForm();
    await userEvent.type(screen.getByLabelText(/first name/i), "John");
    await userEvent.type(screen.getByLabelText(/last name/i), "Doe");
    await userEvent.type(screen.getByLabelText(/email/i), "notanemail");
    fireEvent.click(screen.getByRole("button", { name: /save candidate/i }));
    await waitFor(() => {
      expect(screen.getByText(/invalid email format/i)).toBeInTheDocument();
    });
    expect(mockedService.createCandidate).not.toHaveBeenCalled();
  });

  // 8.4 — adds and removes Education entries
  it("adds an education entry when Add Education is clicked", async () => {
    renderForm();
    expect(screen.queryByTestId("education-0")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /add education/i }));
    expect(screen.getByTestId("education-0")).toBeInTheDocument();
  });

  it("removes an education entry when Remove is clicked", async () => {
    renderForm();
    fireEvent.click(screen.getByRole("button", { name: /add education/i }));
    expect(screen.getByTestId("education-0")).toBeInTheDocument();
    fireEvent.click(
      screen.getByRole("button", { name: /remove education 1/i }),
    );
    expect(screen.queryByTestId("education-0")).not.toBeInTheDocument();
  });

  // 8.5 — adds and removes Work Experience entries
  it("adds a work experience entry when Add Work Experience is clicked", () => {
    renderForm();
    expect(screen.queryByTestId("workExperience-0")).not.toBeInTheDocument();
    fireEvent.click(
      screen.getByRole("button", { name: /add work experience/i }),
    );
    expect(screen.getByTestId("workExperience-0")).toBeInTheDocument();
  });

  it("removes a work experience entry when Remove is clicked", () => {
    renderForm();
    fireEvent.click(
      screen.getByRole("button", { name: /add work experience/i }),
    );
    expect(screen.getByTestId("workExperience-0")).toBeInTheDocument();
    fireEvent.click(
      screen.getByRole("button", { name: /remove work experience 1/i }),
    );
    expect(screen.queryByTestId("workExperience-0")).not.toBeInTheDocument();
  });

  // 8.6 — adds and removes Document entries
  it("adds a document entry when Add Document is clicked", () => {
    renderForm();
    expect(screen.queryByTestId("document-0")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /add document/i }));
    expect(screen.getByTestId("document-0")).toBeInTheDocument();
  });

  it("removes a document entry when Remove is clicked", () => {
    renderForm();
    fireEvent.click(screen.getByRole("button", { name: /add document/i }));
    expect(screen.getByTestId("document-0")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /remove document 1/i }));
    expect(screen.queryByTestId("document-0")).not.toBeInTheDocument();
  });

  // 8.7 — calls API service on valid submission
  it("calls createCandidate with correct payload on valid submission", async () => {
    mockedService.createCandidate = jest.fn().mockResolvedValue({
      id: 1,
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      phone: null,
      address: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      educations: [],
      workExperiences: [],
      documents: [],
    });

    renderForm();
    await userEvent.type(screen.getByLabelText(/first name/i), "John");
    await userEvent.type(screen.getByLabelText(/last name/i), "Doe");
    await userEvent.type(screen.getByLabelText(/email/i), "john@example.com");
    fireEvent.click(screen.getByRole("button", { name: /save candidate/i }));

    await waitFor(() => {
      expect(mockedService.createCandidate).toHaveBeenCalledWith(
        expect.objectContaining({
          firstName: "John",
          lastName: "Doe",
          email: "john@example.com",
        }),
      );
    });
  });

  // 8.8 — displays success message after 201 response
  it("displays success message and resets form after successful submission", async () => {
    mockedService.createCandidate = jest.fn().mockResolvedValue({
      id: 1,
      firstName: "Jane",
      lastName: "Smith",
      email: "jane@example.com",
      phone: null,
      address: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      educations: [],
      workExperiences: [],
      documents: [],
    });

    renderForm();
    await userEvent.type(screen.getByLabelText(/first name/i), "Jane");
    await userEvent.type(screen.getByLabelText(/last name/i), "Smith");
    await userEvent.type(screen.getByLabelText(/email/i), "jane@example.com");
    fireEvent.click(screen.getByRole("button", { name: /save candidate/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/candidate jane smith created successfully/i),
      ).toBeInTheDocument();
    });

    // Form should be reset
    expect(screen.getByLabelText(/first name/i)).toHaveValue("");
  });

  // 8.9 — displays field-level error on 409 duplicate email
  it("displays inline email error on 409 conflict", async () => {
    const conflictError: candidateServiceModule.CandidateServiceError = {
      type: "conflict",
      message: "A candidate with this email already exists",
    };
    mockedService.createCandidate = jest.fn().mockRejectedValue(conflictError);

    renderForm();
    await userEvent.type(screen.getByLabelText(/first name/i), "John");
    await userEvent.type(screen.getByLabelText(/last name/i), "Doe");
    await userEvent.type(screen.getByLabelText(/email/i), "john@example.com");
    fireEvent.click(screen.getByRole("button", { name: /save candidate/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/a candidate with this email already exists/i),
      ).toBeInTheDocument();
    });
  });

  // 8.10 — displays generic error on 500
  it("displays global error alert on server error", async () => {
    const serverError: candidateServiceModule.CandidateServiceError = {
      type: "server",
      message: "An unexpected error occurred. Please try again.",
    };
    mockedService.createCandidate = jest.fn().mockRejectedValue(serverError);

    renderForm();
    await userEvent.type(screen.getByLabelText(/first name/i), "John");
    await userEvent.type(screen.getByLabelText(/last name/i), "Doe");
    await userEvent.type(screen.getByLabelText(/email/i), "john@example.com");
    fireEvent.click(screen.getByRole("button", { name: /save candidate/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/an unexpected error occurred/i),
      ).toBeInTheDocument();
    });
  });

  // 8.11 — submit button disabled during submission
  it("disables submit button and shows Saving... during submission", async () => {
    mockedService.createCandidate = jest.fn(
      () => new Promise((resolve) => setTimeout(resolve, 500)),
    ) as unknown as typeof mockedService.createCandidate;

    renderForm();
    await userEvent.type(screen.getByLabelText(/first name/i), "John");
    await userEvent.type(screen.getByLabelText(/last name/i), "Doe");
    await userEvent.type(screen.getByLabelText(/email/i), "john@example.com");
    fireEvent.click(screen.getByRole("button", { name: /save candidate/i }));

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /saving/i })).toBeDisabled();
    });
  });

  it("clears field error when user types in that field after a validation failure", async () => {
    renderForm();
    // Trigger validation errors
    fireEvent.click(screen.getByRole("button", { name: /save candidate/i }));
    await waitFor(() => {
      expect(screen.getByText(/first name is required/i)).toBeInTheDocument();
    });
    // Now type in the First Name field — error should clear
    await userEvent.type(screen.getByLabelText(/first name/i), "J");
    await waitFor(() => {
      expect(
        screen.queryByText(/first name is required/i),
      ).not.toBeInTheDocument();
    });
  });

  it("clears education field error when user changes the field", async () => {
    renderForm();
    // Add education, then submit to generate error
    fireEvent.click(screen.getByRole("button", { name: /add education/i }));
    fireEvent.click(screen.getByRole("button", { name: /save candidate/i }));
    await waitFor(() => {
      expect(screen.getByText(/institution is required/i)).toBeInTheDocument();
    });
    // Type in institution field — error should clear
    fireEvent.change(screen.getByLabelText(/institution/i), {
      target: { value: "MIT" },
    });
    await waitFor(() => {
      expect(
        screen.queryByText(/institution is required/i),
      ).not.toBeInTheDocument();
    });
  });

  it("clears work experience field error when user changes the field", async () => {
    renderForm();
    fireEvent.click(
      screen.getByRole("button", { name: /add work experience/i }),
    );
    fireEvent.click(screen.getByRole("button", { name: /save candidate/i }));
    await waitFor(() => {
      expect(screen.getByText(/company is required/i)).toBeInTheDocument();
    });
    fireEvent.change(screen.getByLabelText(/company/i), {
      target: { value: "Acme" },
    });
    await waitFor(() => {
      expect(
        screen.queryByText(/company is required/i),
      ).not.toBeInTheDocument();
    });
  });

  it("clears document field error when user changes the field", async () => {
    renderForm();
    fireEvent.click(screen.getByRole("button", { name: /add document/i }));
    fireEvent.click(screen.getByRole("button", { name: /save candidate/i }));
    await waitFor(() => {
      expect(screen.getByText(/file name is required/i)).toBeInTheDocument();
    });
    fireEvent.change(screen.getByLabelText(/file name/i), {
      target: { value: "cv.pdf" },
    });
    await waitFor(() => {
      expect(
        screen.queryByText(/file name is required/i),
      ).not.toBeInTheDocument();
    });
  });

  it("renders phone and address fields and handles changes", async () => {
    renderForm();
    await userEvent.type(screen.getByLabelText(/phone/i), "+1234567890");
    await userEvent.type(screen.getByLabelText(/address/i), "123 Main St");
    expect(screen.getByLabelText(/phone/i)).toHaveValue("+1234567890");
    expect(screen.getByLabelText(/address/i)).toHaveValue("123 Main St");
  });

  it("maps 400 validation errors from backend to form fields", async () => {
    const validationError: candidateServiceModule.CandidateServiceError = {
      type: "validation",
      message: "Validation failed",
      fieldErrors: [{ field: "email", message: "Email already taken" }],
    };
    mockedService.createCandidate = jest
      .fn()
      .mockRejectedValue(validationError);

    renderForm();
    await userEvent.type(screen.getByLabelText(/first name/i), "John");
    await userEvent.type(screen.getByLabelText(/last name/i), "Doe");
    await userEvent.type(screen.getByLabelText(/email/i), "john@example.com");
    fireEvent.click(screen.getByRole("button", { name: /save candidate/i }));

    await waitFor(() => {
      expect(screen.getByText(/email already taken/i)).toBeInTheDocument();
    });
  });
});
