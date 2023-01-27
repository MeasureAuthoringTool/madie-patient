import axios from "axios";
import useServiceConfig from "./useServiceConfig";
import { ServiceConfig } from "./ServiceContext";
import { HapiOperationOutcome, TestCase } from "@madie/madie-models";
import { useOktaTokens } from "@madie/madie-util";
import { ScanValidationDto } from "./models/ScanValidationDto";

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
