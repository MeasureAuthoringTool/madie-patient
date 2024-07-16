import { AxiosResponse } from "axios";
import axios from "./axios-instance";
import useServiceConfig from "./useServiceConfig";
import { ServiceConfig } from "./ServiceContext";
import {
  GroupedStratificationDto,
  HapiOperationOutcome,
  Measure,
  PopulationDto,
  TestCase,
  TestCaseImportRequest,
} from "@madie/madie-models";
import { useOktaTokens } from "@madie/madie-util";
import { ScanValidationDto } from "./models/ScanValidationDto";
import { addValues } from "../util/DefaultValueProcessor";
import { MadieError } from "../util/Utils";
import { TestCaseExecutionResultDto } from "@madie/madie-models/dist/TestCaseExcelExportDto";

export interface QrdaTestCaseDTO {
  testCaseId: string;
  lastName: string;
  firstName: string;
  populations: Array<PopulationDto>;
  stratifications?: Array<GroupedStratificationDto>;
}

export interface QrdaGroupExportDTO {
  groupId: string;
  groupNumber: string;
  coverage: string;
  testCaseDTOs: QrdaTestCaseDTO[];
}

export type QrdaRequestDTO = {
  measure: Measure;
  groupDTOs: QrdaGroupExportDTO[];
};

export class TestCaseServiceApi {
  constructor(private baseUrl: string, private getAccessToken: () => string) {}

  async createTestCase(testCase: TestCase, measureId: string) {
    try {
      const response = await axios.post<TestCase>(
        `${this.baseUrl}/measures/${measureId}/test-cases`,
        testCase,
        {
          headers: {
            Authorization: `Bearer ${this.getAccessToken()}`,
          },
        }
      );
      return response.data;
    } catch (err) {
      if (err?.response?.status === 400) {
        throw new Error(err.response.data.message);
      }
      const message = `Unable to create new test case`;
      throw new Error(message);
    }
  }

  async getTestCasesByMeasureId(measureId: string): Promise<TestCase[]> {
    try {
      const response = await axios.get<TestCase[]>(
        `${this.baseUrl}/measures/${measureId}/test-cases`,
        {
          headers: {
            Authorization: `Bearer ${this.getAccessToken()}`,
          },
        }
      );
      return response.data || [];
    } catch (err) {
      const message = "Unable to retrieve test cases, please try later.";
      throw new Error(message);
    }
  }

  async getTestCase(testCaseId: string, measureId: string): Promise<TestCase> {
    try {
      const response = await axios.get<TestCase>(
        `${this.baseUrl}/measures/${measureId}/test-cases/${testCaseId}`,
        {
          headers: {
            Authorization: `Bearer ${this.getAccessToken()}`,
          },
        }
      );
      return response.data;
    } catch (err) {
      // TODO: throw err to continue to display 404 page or
      //  throw with message to swap to error message?
      const message = "Unable to retrieve test case, please try later.";
      throw new Error(err);
    }
  }

  async getTestCaseSeriesForMeasure(measureId: string): Promise<string[]> {
    try {
      const response = await axios.get<string[]>(
        `${this.baseUrl}/measures/${measureId}/test-cases/series`,
        {
          headers: {
            Authorization: `Bearer ${this.getAccessToken()}`,
          },
        }
      );
      return response.data;
    } catch (err) {
      if (err?.response?.status === 404) {
        console.warn(
          `Cannot load series for non-existent measure with id [${measureId}]`,
          err
        );
        throw new Error(
          "Measure does not exist, unable to load test case series!"
        );
      }
      const message = "Unable to retrieve test case series, please try later.";
      throw new Error(message);
    }
  }

  async updateTestCase(testCase: TestCase, measureId: string) {
    try {
      const response = await axios.put<TestCase>(
        `${this.baseUrl}/measures/${measureId}/test-cases/${testCase.id}`,
        testCase,
        {
          headers: {
            Authorization: `Bearer ${this.getAccessToken()}`,
          },
        }
      );
      return response.data;
    } catch (err) {
      if (err?.response?.status === 400) {
        throw new MadieError(err.response.data.message);
      }
      const message = `Unable to update test case`;
      throw new Error(message);
    }
  }

  async deleteTestCaseByTestCaseId(measureId: string, testCaseId: string) {
    try {
      const response = await axios.delete(
        `${this.baseUrl}/measures/${measureId}/test-cases/${testCaseId}`,
        {
          headers: {
            Authorization: `Bearer ${this.getAccessToken()}`,
          },
        }
      );
      return response.data;
    } catch (err) {
      const message = `Unable to delete test case`;
      throw new Error(message);
    }
  }

  async deleteTestCases(measureId: string, testCaseIds: string[]) {
    return await axios.delete(
      `${this.baseUrl}/measures/${measureId}/test-cases`,
      {
        data: [...testCaseIds],
        headers: {
          Authorization: `Bearer ${this.getAccessToken()}`,
        },
      }
    );
  }

  async importTestCases(
    measureId: string,
    testCasesImportRequest: TestCaseImportRequest[]
  ): Promise<AxiosResponse> {
    return await axios.put(
      `${this.baseUrl}/measures/${measureId}/test-cases/imports`,
      testCasesImportRequest,
      {
        headers: {
          Authorization: `Bearer ${this.getAccessToken()}`,
        },
      }
    );
  }

  async exportTestCases(
    measureId: string,
    bundleType: string,
    testCaseIds: string[],
    signal
  ): Promise<AxiosResponse> {
    return await axios.put(
      `${this.baseUrl}/measures/${measureId}/test-cases/exports`,
      testCaseIds,
      {
        params: { bundleType: bundleType },
        headers: {
          Authorization: `Bearer ${this.getAccessToken()}`,
        },
        responseType: "blob",
        signal,
      }
    );
  }

  async validateTestCaseBundle(bundle: any) {
    try {
      const response = await axios.post<HapiOperationOutcome>(
        `${this.baseUrl}/validations/bundles`,
        bundle,
        {
          headers: {
            Authorization: `Bearer ${this.getAccessToken()}`,
          },
        }
      );
      return response.data;
    } catch (err) {
      const message = `Unable to validate test case bundle`;
      throw new Error(message);
    }
  }

  async createTestCases(
    measureId: string,
    testCases: TestCase[]
  ): Promise<TestCase[]> {
    try {
      const response = await axios.post<TestCase[]>(
        `${this.baseUrl}/measures/${measureId}/test-cases/list`,
        testCases,
        {
          headers: {
            Authorization: `Bearer ${this.getAccessToken()}`,
          },
        }
      );
      return response.data;
    } catch (err) {
      throw new Error(`Unable to create new test cases`);
    }
  }

  async importTestCasesQDM(
    measureId: string,
    testCasesImportRequest: TestCaseImportRequest[]
  ): Promise<AxiosResponse> {
    try {
      return await axios.put(
        `${this.baseUrl}/measures/${measureId}/test-cases/imports/qdm`,
        testCasesImportRequest,
        {
          headers: {
            Authorization: `Bearer ${this.getAccessToken()}`,
          },
        }
      );
    } catch (err) {
      throw new Error(`Unable to create new test cases`);
    }
  }

  async scanImportFile(file: any): Promise<ScanValidationDto> {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await axios.post<ScanValidationDto>(
        `${this.baseUrl}/validations/files`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${this.getAccessToken()}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (err) {
      throw new Error(
        "Unable to scan the import file. Please try again later."
      );
    }
  }

  // TODO: Refactor to dedup with FhirImportHelper::readImportFile
  readTestCaseFile(file: File, onReadCallback): void {
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      const content: string = e.target.result as string;
      let testCaseBundle = null,
        errorMessage = null;
      try {
        testCaseBundle = JSON.parse(content);
        if (
          testCaseBundle.resourceType !== "Bundle" ||
          !testCaseBundle.entry ||
          testCaseBundle.entry.length === 0
        ) {
          errorMessage = "No test case resources were found in imported file.";
        } else {
          // Apply Default Values
          testCaseBundle = addValues(testCaseBundle);
        }
      } catch (error) {
        errorMessage =
          "An error occurred while reading the file. Please make sure the test case file is valid.";
      }
      onReadCallback(testCaseBundle, errorMessage);
    };
    fileReader.readAsText(file);
  }

  async exportQRDA(
    measureId: string,
    requestDto: QrdaRequestDTO
  ): Promise<Blob> {
    const response = await axios.put(
      `${this.baseUrl}/measures/${measureId}/test-cases/qrda`,
      requestDto,
      {
        headers: {
          Authorization: `Bearer ${this.getAccessToken()}`,
        },
        responseType: "blob",
      }
    );
    return response.data;
  }

  async shiftTestCaseDates(
    testCase: TestCase,
    measureId: string,
    shifted: number
  ) {
    try {
      const response = await axios.put(
        `${this.baseUrl}/measures/${measureId}/test-cases/${testCase.id}/qdm/shiftDates`,
        testCase,
        {
          headers: {
            Authorization: `Bearer ${this.getAccessToken()}`,
          },
          params: { shifted: shifted },
        }
      );
      if (!response || !response.data) {
        throw new Error(`Unable to shift test case dates`);
      }
      return response.data;
    } catch (err) {
      const message = `Unable to shift test case dates`;
      throw new Error(message);
    }
  }

  async shiftAllTestCaseDates(measureId: string, shifted: number) {
    const response = await axios.get(
      `${this.baseUrl}/measures/${measureId}/test-cases/qdm/shiftAllDates`,
      {
        params: { shifted: shifted },
        headers: {
          Authorization: `Bearer ${this.getAccessToken()}`,
        },
      }
    );
    if (!response || !response.data) {
      throw new Error(`Unable to shift test case dates`);
    }
    return response.data;
  }
}

const useTestCaseServiceApi = (): TestCaseServiceApi => {
  const serviceConfig: ServiceConfig = useServiceConfig();
  const { getAccessToken } = useOktaTokens();
  return new TestCaseServiceApi(
    serviceConfig?.testCaseService.baseUrl,
    getAccessToken
  );
};

export default useTestCaseServiceApi;
