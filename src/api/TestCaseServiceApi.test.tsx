import { AxiosError, AxiosResponse } from "axios";
import axios from "./axios-instance";
import { TestCaseServiceApi } from "./useTestCaseServiceApi";
import { ScanValidationDto } from "./models/ScanValidationDto";
import {
  Measure,
  MeasureScoring,
  Model,
  PopulationType,
  TestCase,
  TestCaseExcelExportDto,
} from "@madie/madie-models";
import { waitFor } from "@testing-library/react";
import { addValues } from "../util/DefaultValueProcessor";
import { measureCql } from "../components/editTestCase/groupCoverage/_mocks_/QdmCovergaeMeasureCql";

jest.mock("./axios-instance");

const mockMeasure = {
  id: "1",
  measureName: "measureName",
  createdBy: "testuser",
  cqlLibraryName: "testLibrary",
  cmsId: "1234",
  measureSetId: "1234",

  scoring: MeasureScoring.PROPORTION,
  groups: [
    {
      id: "1",
      scoring: MeasureScoring.PROPORTION,
      populationBasis: "boolean",
      populations: [
        {
          id: "id-1",
          name: PopulationType.INITIAL_POPULATION,
          definition: "ipp",
        },
        {
          id: "id-2",
          name: PopulationType.DENOMINATOR,
          definition: "denom",
        },
        {
          id: "id-3",
          name: PopulationType.NUMERATOR,
          definition: "num",
        },
      ],
    },
  ],
  model: Model.QDM_5_6,
  acls: [{ userId: "othertestuseratexample.com", roles: ["SHARED_WITH"] }],
  cql: measureCql,
} as unknown as Measure;

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

  it("test exportQRDA success", async () => {
    const zippedQRDAData = {
      size: 635581,
      type: "application/octet-stream",
    };
    const resp = { status: 200, data: zippedQRDAData };
    axios.put = jest.fn().mockResolvedValueOnce(resp);

    const testCaseDtos: TestCaseExcelExportDto[] = [
      {
        groupId: "1",
      } as TestCaseExcelExportDto,
    ];
    const qrdaData = await testCaseService.exportQRDA("testMeasureId", {
      measure: mockMeasure,
      groupDTOs: testCaseDtos,
    });
    expect(axios.put).toBeCalledTimes(1);
    expect(qrdaData).toEqual(zippedQRDAData);
  });

  it("test exportQRDA failure", async () => {
    const resp = {
      status: 500,
    };
    axios.put = jest.fn().mockRejectedValueOnce(resp);

    const testCaseDtos: TestCaseExcelExportDto[] = [
      {
        groupId: "1",
      } as TestCaseExcelExportDto,
    ];
    try {
      await testCaseService.exportQRDA("testMeasureId", {
        measure: mockMeasure,
        groupDTOs: testCaseDtos,
      });
      expect(axios.put).toBeCalledTimes(1);
    } catch (error) {
      expect(error.status).toBe(500);
    }
  });

  it("test createTestCase success", async () => {
    const responseDto: TestCase = {
      id: "1234",
      title: "TestCase1",
      validResource: false,
    } as TestCase;
    axios.post = jest.fn().mockResolvedValueOnce({ data: responseDto });

    const testCase: TestCase = {
      title: "TestCase1",
    } as TestCase;

    const response = await testCaseService.createTestCase(
      testCase,
      "testMeasureId"
    );
    expect(response).toBeTruthy();
    expect(response).toEqual(responseDto);
  });

  it("test createTestCase failure", async () => {
    const resp = {
      response: {
        status: 400,
      },
    };

    axios.post = jest.fn().mockRejectedValueOnce({ err: resp });

    const testCase: TestCase = {
      title: "TestCase1",
    } as TestCase;

    try {
      await testCaseService.createTestCase(testCase, "testMeasureId");
      expect(axios.get).toBeCalledTimes(1);
    } catch (err) {
      expect(err).not.toBeNull();
    }
  });

  it("should shift all test case dates successfully", async () => {
    const responseDto: TestCase[] = [
      {
        id: "1234",
        json: "date2",
      },
    ] as TestCase[];

    axios.put = jest.fn().mockResolvedValueOnce({ data: responseDto });

    const testCases: TestCase[] = [
      {
        id: "1234",
        json: "date1",
      },
    ] as TestCase[];

    const result = await testCaseService.shiftAllTestCaseDates(
      "testMeasureId",
      1
    );
    expect(axios.put).toBeCalledTimes(1);
    expect(result[0]).not.toEqual(testCases[0]);
  });

  it("should handle shift all test case dates failure with no response", async () => {
    axios.put = jest.fn().mockResolvedValueOnce(null);

    const testCases: TestCase[] = [
      {
        id: "1234",
        json: "date1",
      },
    ] as TestCase[];

    try {
      const result = await testCaseService.shiftAllTestCaseDates(
        "testMeasureId",
        1
      );
      expect(axios.put).toBeCalledTimes(1);
      expect(result[0]).not.toEqual(testCases[0]);
    } catch (err) {
      expect(err).toEqual(new Error("Unable to shift test case dates"));
    }
  });

  it("should handle shift all test case dates failure with no response data", async () => {
    axios.put = jest
      .fn()
      .mockResolvedValueOnce({ error: "something went wrong" });

    const testCases: TestCase[] = [
      {
        id: "1234",
        json: "date1",
      },
    ] as TestCase[];

    try {
      const result = await testCaseService.shiftAllTestCaseDates(
        "testMeasureId",
        1
      );
      expect(axios.put).toBeCalledTimes(1);
      expect(result[0]).not.toEqual(testCases[0]);
    } catch (err) {
      expect(err).toEqual(new Error("Unable to shift test case dates"));
    }
  });
});
