import axios from "axios";
import { candidateService } from "../services/candidateService";
import { CreateCandidateDTO } from "../types/candidate";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

const validDTO: CreateCandidateDTO = {
  firstName: "John",
  lastName: "Doe",
  email: "john@example.com",
};

const mockResponse = {
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
};

describe("candidateService.createCandidate", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (mockedAxios as any).isAxiosError = jest.fn();
  });

  it("returns the created candidate on 201", async () => {
    mockedAxios.post = jest.fn().mockResolvedValue({ data: mockResponse });
    const result = await candidateService.createCandidate(validDTO);
    expect(result).toEqual(mockResponse);
    expect(mockedAxios.post).toHaveBeenCalledWith(
      expect.stringContaining("/api/candidates"),
      validDTO,
    );
  });

  it("throws validation error on 400", async () => {
    const axiosError = {
      response: {
        status: 400,
        data: { errors: [{ field: "email", message: "Invalid" }] },
      },
    };
    mockedAxios.post = jest.fn().mockRejectedValue(axiosError);
    (mockedAxios.isAxiosError as unknown as jest.Mock).mockReturnValue(true);

    await expect(
      candidateService.createCandidate(validDTO),
    ).rejects.toMatchObject({
      type: "validation",
      fieldErrors: [{ field: "email", message: "Invalid" }],
    });
  });

  it("throws conflict error on 409", async () => {
    const axiosError = {
      response: {
        status: 409,
        data: { message: "A candidate with this email already exists" },
      },
    };
    mockedAxios.post = jest.fn().mockRejectedValue(axiosError);
    (mockedAxios.isAxiosError as unknown as jest.Mock).mockReturnValue(true);

    await expect(
      candidateService.createCandidate(validDTO),
    ).rejects.toMatchObject({
      type: "conflict",
      message: "A candidate with this email already exists",
    });
  });

  it("throws server error on 500", async () => {
    const axiosError = { response: { status: 500, data: {} } };
    mockedAxios.post = jest.fn().mockRejectedValue(axiosError);
    (mockedAxios.isAxiosError as unknown as jest.Mock).mockReturnValue(true);

    await expect(
      candidateService.createCandidate(validDTO),
    ).rejects.toMatchObject({
      type: "server",
    });
  });

  it("throws network error on non-axios error", async () => {
    mockedAxios.post = jest.fn().mockRejectedValue(new Error("Network fail"));
    (mockedAxios.isAxiosError as unknown as jest.Mock).mockReturnValue(false);

    await expect(
      candidateService.createCandidate(validDTO),
    ).rejects.toMatchObject({
      type: "network",
    });
  });

  it("handles 400 with empty errors array", async () => {
    const axiosError = { response: { status: 400, data: {} } };
    mockedAxios.post = jest.fn().mockRejectedValue(axiosError);
    (mockedAxios.isAxiosError as unknown as jest.Mock).mockReturnValue(true);

    await expect(
      candidateService.createCandidate(validDTO),
    ).rejects.toMatchObject({
      type: "validation",
      fieldErrors: [],
    });
  });

  it("handles 409 with default message when none provided", async () => {
    const axiosError = { response: { status: 409, data: {} } };
    mockedAxios.post = jest.fn().mockRejectedValue(axiosError);
    (mockedAxios.isAxiosError as unknown as jest.Mock).mockReturnValue(true);

    await expect(
      candidateService.createCandidate(validDTO),
    ).rejects.toMatchObject({
      type: "conflict",
      message: "A candidate with this email already exists",
    });
  });
});
