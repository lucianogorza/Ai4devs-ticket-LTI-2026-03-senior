import axios from "axios";
import { CreateCandidateDTO, CandidateResponseDTO } from "../types/candidate";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL ?? "http://localhost:3010";

export interface ApiValidationError {
  field: string;
  message: string;
}

export interface CandidateServiceError {
  type: "validation" | "conflict" | "server" | "network";
  message: string;
  fieldErrors?: ApiValidationError[];
}

export const candidateService = {
  createCandidate: async (
    dto: CreateCandidateDTO,
  ): Promise<CandidateResponseDTO> => {
    try {
      const response = await axios.post<CandidateResponseDTO>(
        `${API_BASE_URL}/api/candidates`,
        dto,
      );
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;

        if (status === 400) {
          const serviceError: CandidateServiceError = {
            type: "validation",
            message: "Validation failed",
            fieldErrors: error.response?.data?.errors ?? [],
          };
          throw serviceError;
        }

        if (status === 409) {
          const serviceError: CandidateServiceError = {
            type: "conflict",
            message:
              error.response?.data?.message ??
              "A candidate with this email already exists",
          };
          throw serviceError;
        }

        const serviceError: CandidateServiceError = {
          type: "server",
          message: "An unexpected error occurred. Please try again.",
        };
        throw serviceError;
      }

      const serviceError: CandidateServiceError = {
        type: "network",
        message: "An unexpected error occurred. Please try again.",
      };
      throw serviceError;
    }
  },
};
