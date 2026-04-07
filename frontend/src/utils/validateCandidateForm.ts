import { CreateCandidateDTO, FormErrors } from "../types/candidate";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateCandidateForm(data: CreateCandidateDTO): FormErrors {
  const errors: FormErrors = {};

  // Required: firstName
  if (!data.firstName || data.firstName.trim() === "") {
    errors["firstName"] = "First name is required";
  } else if (data.firstName.length > 100) {
    errors["firstName"] = "First name must not exceed 100 characters";
  }

  // Required: lastName
  if (!data.lastName || data.lastName.trim() === "") {
    errors["lastName"] = "Last name is required";
  } else if (data.lastName.length > 100) {
    errors["lastName"] = "Last name must not exceed 100 characters";
  }

  // Required: email
  if (!data.email || data.email.trim() === "") {
    errors["email"] = "Email is required";
  } else if (!EMAIL_REGEX.test(data.email)) {
    errors["email"] = "Invalid email format";
  } else if (data.email.length > 255) {
    errors["email"] = "Email must not exceed 255 characters";
  }

  // Optional: phone
  if (data.phone && data.phone.length > 20) {
    errors["phone"] = "Phone must not exceed 20 characters";
  }

  // Optional: address
  if (data.address && data.address.length > 500) {
    errors["address"] = "Address must not exceed 500 characters";
  }

  // Educations
  (data.educations ?? []).forEach((edu, i) => {
    const prefix = `educations[${i}]`;

    if (!edu.institution || edu.institution.trim() === "") {
      errors[`${prefix}.institution`] = "Institution is required";
    } else if (edu.institution.length > 200) {
      errors[`${prefix}.institution`] =
        "Institution must not exceed 200 characters";
    }

    if (!edu.degree || edu.degree.trim() === "") {
      errors[`${prefix}.degree`] = "Degree is required";
    } else if (edu.degree.length > 200) {
      errors[`${prefix}.degree`] = "Degree must not exceed 200 characters";
    }

    if (edu.fieldOfStudy && edu.fieldOfStudy.length > 200) {
      errors[`${prefix}.fieldOfStudy`] =
        "Field of study must not exceed 200 characters";
    }

    if (!edu.startDate) {
      errors[`${prefix}.startDate`] = "Start date is required";
    }

    if (edu.endDate && edu.startDate && edu.endDate <= edu.startDate) {
      errors[`${prefix}.endDate`] = "End date must be after start date";
    }
  });

  // Work experiences
  (data.workExperiences ?? []).forEach((work, i) => {
    const prefix = `workExperiences[${i}]`;

    if (!work.company || work.company.trim() === "") {
      errors[`${prefix}.company`] = "Company is required";
    } else if (work.company.length > 200) {
      errors[`${prefix}.company`] = "Company must not exceed 200 characters";
    }

    if (!work.position || work.position.trim() === "") {
      errors[`${prefix}.position`] = "Position is required";
    } else if (work.position.length > 200) {
      errors[`${prefix}.position`] = "Position must not exceed 200 characters";
    }

    if (!work.startDate) {
      errors[`${prefix}.startDate`] = "Start date is required";
    }

    if (work.endDate && work.startDate && work.endDate <= work.startDate) {
      errors[`${prefix}.endDate`] = "End date must be after start date";
    }
  });

  // Documents
  (data.documents ?? []).forEach((doc, i) => {
    const prefix = `documents[${i}]`;

    if (!doc.fileName || doc.fileName.trim() === "") {
      errors[`${prefix}.fileName`] = "File name is required";
    } else if (doc.fileName.length > 255) {
      errors[`${prefix}.fileName`] = "File name must not exceed 255 characters";
    }

    if (!doc.fileType || !["CV_PDF", "CV_DOCX"].includes(doc.fileType)) {
      errors[`${prefix}.fileType`] = "File type must be CV_PDF or CV_DOCX";
    }

    if (!doc.filePath || doc.filePath.trim() === "") {
      errors[`${prefix}.filePath`] = "File path is required";
    } else if (doc.filePath.length > 500) {
      errors[`${prefix}.filePath`] = "File path must not exceed 500 characters";
    }

    if (!doc.fileSize || doc.fileSize <= 0 || !Number.isInteger(doc.fileSize)) {
      errors[`${prefix}.fileSize`] = "File size must be a positive integer";
    }
  });

  return errors;
}
