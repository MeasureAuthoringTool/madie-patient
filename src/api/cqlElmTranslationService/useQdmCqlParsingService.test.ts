import axios from "axios";
import { ServiceConfig } from "../ServiceContext";
import { QdmCqlParsingService } from "./useQdmCqlParsingService";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

const mockGetAccessToken = jest.fn().mockImplementation(() => {
  return Promise.resolve("test.jwt");
});

const mockConfig: ServiceConfig = {
  measureService: {
    baseUrl: "measure.com",
  },
  testCaseService: {
    baseUrl: "testCaseService.com",
  },
  terminologyService: {
    baseUrl: "terminologyService.com",
  },
  qdmElmTranslationService: {
    baseUrl: "qdm-elm-translator.com",
  },
  fhirElmTranslationService: {
    baseUrl: "fhir-elm-translator.com",
  },
  excelExportService: {
    baseUrl: "excelExportService.com",
  },
};
jest.mock("../useServiceConfig", () => {
  return {
    useServiceConfig: jest.fn(() => Promise.resolve(mockConfig)),
  };
});

describe("Test useFhirCqlParsingService", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("Should fetch valid definition call stacks", async () => {
    const successResponse = {
      data: { json: "success response" },
      status: 200,
    };
    mockedAxios.put.mockResolvedValue(successResponse);
    const qdmCqlParsingService: QdmCqlParsingService = new QdmCqlParsingService(
      null,
      mockGetAccessToken
    );
    const response = await qdmCqlParsingService.getDefinitionCallstacks(
      "test CQL"
    );
    expect(response).toBe(successResponse.data);
  });

  it("Should throw error message while fetching definition call stacks", async () => {
    const rejectedResponse = {
      code: "ERR_NETWORK",
      message: "Network Error",
      name: "AxiosError",
    };
    mockedAxios.put.mockRejectedValueOnce(rejectedResponse);
    const qdmCqlParsingService: QdmCqlParsingService = new QdmCqlParsingService(
      null,
      mockGetAccessToken
    );
    try {
      await qdmCqlParsingService.getDefinitionCallstacks("test CQL");
    } catch (error) {
      expect(error.message).toBe(
        "Unable to retrieve used definition references"
      );
    }
  });
});
