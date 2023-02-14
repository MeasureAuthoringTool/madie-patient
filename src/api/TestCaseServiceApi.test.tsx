import axios, { AxiosError, AxiosResponse } from "axios";
import { TestCaseServiceApi } from "./useTestCaseServiceApi";
import { ScanValidationDto } from "./models/ScanValidationDto";
import { TestCase } from "@madie/madie-models";
import { waitFor } from "@testing-library/react";
import { addValues } from "../util/DefaultValueProcessor";

jest.mock("axios");

describe("TestCaseServiceApi Tests", () => {
  let testCaseService: TestCaseServiceApi;
  beforeEach(() => {
    const getAccessToken = jest.fn();
    testCaseService = new TestCaseServiceApi("test.url", getAccessToken);
  });

  it("should handle positive file validation", async () => {
    const responseDto: ScanValidationDto = {
      fileName: "fakefile.json",
      valid: true,
      error: null,
    };

    axios.post = jest.fn().mockResolvedValueOnce({ data: responseDto });

    const response = await testCaseService.scanImportFile({});
    expect(response).toBeTruthy();
    expect(response.fileName).toEqual("fakefile.json");
    expect(response.valid).toBe(true);
    expect(response.error).toBeFalsy();
  });

  it("should handle negative file validation", async () => {
    const responseDto: ScanValidationDto = {
      fileName: "fakefile.json",
      valid: false,
      error: {
        codes: ["V100"],
        defaultMessage: "File validation failed with error code V100.",
        objectName: "fakefile.json",
      },
    };

    axios.post = jest.fn().mockResolvedValueOnce({ data: responseDto });

    const response = await testCaseService.scanImportFile({});
    expect(response).toBeTruthy();
    expect(response.fileName).toEqual("fakefile.json");
    expect(response.valid).toBe(false);
    expect(response.error).toBeTruthy();
    expect(response.error.codes).toEqual(["V100"]);
    expect(response.error.defaultMessage).toEqual(
      "File validation failed with error code V100."
    );
  });

  it("should handle error calling file validation", async () => {
    const axiosError: AxiosError = {
      response: {
        status: 500,
        data: {},
      } as AxiosResponse,
      toJSON: jest.fn(),
    } as unknown as AxiosError;

    axios.post = jest.fn().mockRejectedValueOnce(axiosError);
    await expect(async () => {
      await testCaseService.scanImportFile({});
    }).rejects.toThrowError(
      "Unable to scan the import file. Please try again later."
    );
  });

  it("should handle successfully saving multiple test cases", async () => {
    const responseDto: TestCase[] = [
      {
        id: "1234",
        title: "TestCase1",
        validResource: false,
      } as TestCase,
      {
        id: "2345",
        title: "TestCase2",
        validResource: false,
      } as TestCase,
    ];

    axios.post = jest.fn().mockResolvedValueOnce({ data: responseDto });

    const testCases: TestCase[] = [
      {
        title: "TestCase1",
      } as TestCase,
      {
        title: "TestCase2",
      } as TestCase,
    ];

    const response = await testCaseService.createTestCases("M123", testCases);
    expect(response).toBeTruthy();
    expect(response).toEqual(responseDto);
  });

  it("should handle error calling saving multiple test cases", async () => {
    const axiosError: AxiosError = {
      response: {
        status: 404,
        data: {},
      } as AxiosResponse,
      toJSON: jest.fn(),
    } as unknown as AxiosError;

    const testCases: TestCase[] = [
      {
        title: "TestCase1",
      } as TestCase,
      {
        title: "TestCase2",
      } as TestCase,
    ];

    axios.post = jest.fn().mockRejectedValueOnce(axiosError);
    await expect(async () => {
      await testCaseService.createTestCases("M123", testCases);
    }).rejects.toThrowError("Unable to create new test cases");
  });

  it("should read file successfully", async () => {
    const testcase = {
      id: "601adb9198086b165a47f550",
      resourceType: "Bundle",
      type: "collection",
      entry: [
        {
          fullUrl: "601adb9198086b165a47f550",
          resource: {
            id: "601adb9198086b165a47f550",
            resourceType: "Patient",
          },
        },
      ],
    };
    const file = new File([JSON.stringify(testcase)], "testcase.json", {
      type: "application/json",
    });
    const readTestCaseCb = jest.fn();
    testCaseService.readTestCaseFile(file, readTestCaseCb);
    await waitFor(() => {
      expect(readTestCaseCb).toHaveBeenCalledWith(addValues(testcase), null);
    });
  });

  it("should read file successfully when no resources found and report error", async () => {
    const testcase = {
      id: "601adb9198086b165a47f550",
      resourceType: "Bundle",
      entry: [],
    };
    const file = new File([JSON.stringify(testcase)], "testcase.json", {
      type: "application/json",
    });
    const readTestCaseCb = jest.fn();
    testCaseService.readTestCaseFile(file, readTestCaseCb);
    await waitFor(() => {
      expect(readTestCaseCb).toHaveBeenCalledWith(
        testcase,
        "No test case resources were found in imported file."
      );
    });
  });

  it("should read file and report if it is invalid", async () => {
    const file = new File([new ArrayBuffer(1)], "file.jpg");
    const readTestCaseCb = jest.fn();
    testCaseService.readTestCaseFile(file, readTestCaseCb);
    await waitFor(() => {
      expect(readTestCaseCb).toHaveBeenCalledWith(
        null,
        "An error occurred while reading the file. Please make sure the test case file is valid."
      );
    });
  });
});
