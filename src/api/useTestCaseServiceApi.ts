import axios from "axios";
import useServiceConfig from "./useServiceConfig";
import { ServiceConfig } from "./ServiceContext";
import TestCase from "../models/TestCase";

export class TestCaseServiceApi {
  constructor(private baseUrl: string) {}

  async createTestCase(testCase: TestCase) {
    try {
      const response = await axios.post<TestCase>(
        `${this.baseUrl}/patient`,
        testCase
      );
      return response.data;
    } catch (err) {
      const message = `Unable to create new test case`;
      console.error(message, err);
      throw new Error(message);
    }
  }
}

const useTestCaseServiceApi = (): TestCaseServiceApi => {
  const serviceConfig: ServiceConfig = useServiceConfig();
  return new TestCaseServiceApi(serviceConfig?.testCaseService.baseUrl);
};

export default useTestCaseServiceApi;
