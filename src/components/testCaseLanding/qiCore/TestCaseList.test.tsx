import * as React from "react";
import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { ApiContextProvider, ServiceConfig } from "../../../api/ServiceContext";
import TestCaseList, {
  getCoverageValueFromHtml,
  IMPORT_ERROR,
  removeHtmlCoverageHeader,
} from "./TestCaseList";
import calculationService, {
  CalculationService,
} from "../../../api/CalculationService";
import {
  GroupPopulation,
  Measure,
  MeasureErrorType,
  MeasureScoring,
  Model,
  PopulationExpectedValue,
  PopulationType,
  TestCase,
  TestCaseImportOutcome,
} from "@madie/madie-models";
import useTestCaseServiceApi, {
  TestCaseServiceApi,
} from "../../../api/useTestCaseServiceApi";
import useMeasureServiceApi, {
  MeasureServiceApi,
} from "../../../api/useMeasureServiceApi";
import userEvent from "@testing-library/user-event";
import {
  buildMeasureBundle,
  getExampleValueSet,
} from "../../../util/CalculationTestHelpers";
import { ExecutionContextProvider } from "../../routes/qiCore/ExecutionContext";
// @ts-ignore
import {
  checkUserCanEdit,
  useFeatureFlags,
  measureStore,
  useDocumentTitle,
} from "@madie/madie-util";
import { ScanValidationDto } from "../../../api/models/ScanValidationDto";
// @ts-ignore
import JSZip from "jszip";
import TestCaseLandingWrapper from "../common/TestCaseLandingWrapper";
import TestCaseLanding from "../qiCore/TestCaseLanding";
import dotMadieFile from "./testDataImport/dotMadie.json";

const createZipFile = async (
  patientIds: string[],
  jsonBundle?: string[],
  jsonFileName?: string[],
  zipFileName = "CMS136FHIR-v0.0.000-FHIR4-TestCases"
) => {
  try {
    const zip = new JSZip();
    zip.file(".madie", JSON.stringify(dotMadieFile));

    patientIds.forEach((patientId, index) => {
      const subFolderEntry = zip.folder(patientId);
      subFolderEntry.file(
        jsonFileName ? jsonFileName[index] : "testcaseExample.json",
        jsonBundle[index]
      );
    });
    const zipContent = await zip.generateAsync({ type: "nodebuffer" });
    const blob = new Blob([zipContent], { type: "application/zip" });
    return new File([blob], "CMS136FHIR-v0.0.000-FHIR4-TestCases", {
      type: "application/zip",
    });
  } catch (error) {
    throw error;
  }
};

const serviceConfig: ServiceConfig = {
  elmTranslationService: { baseUrl: "base.url" },
  excelExportService: {
    baseUrl: "excelexport.com",
  },
  testCaseService: {
    baseUrl: "base.url",
  },
  measureService: {
    baseUrl: "base.url",
  },
  terminologyService: {
    baseUrl: "http.com",
  },
};

const MEASURE_CREATEDBY = "testuser";
// Mock data for Measure retrieved from MeasureService
const mockMeasure = {
  id: "1",
  measureName: "measureName",
  createdBy: MEASURE_CREATEDBY,
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
  model: Model.QICORE,
  acls: [{ userId: "othertestuser@example.com", roles: ["SHARED_WITH"] }], //#nosec
} as Measure;
jest.mock("@madie/madie-util", () => ({
  useDocumentTitle: jest.fn(),
  measureStore: {
    updateMeasure: jest.fn((measure) => measure),
    updateTestCases: jest.fn().mockImplementation(() => {}),
    state: jest.fn().mockImplementation(() => mockMeasure),
    initialState: null,
    subscribe: (set) => {
      set(mockMeasure);
      return { unsubscribe: () => null };
    },
    unsubscribe: () => null,
  },
  useOktaTokens: () => ({
    getAccessToken: () => "test.jwt",
    getUserName: () => MEASURE_CREATEDBY,
  }),
  checkUserCanEdit: jest.fn().mockImplementation(() => true),
  useFeatureFlags: jest.fn().mockImplementation(() => ({
    applyDefaults: false,
    qiCoreBonnieTestCases: false,
  })),
  routeHandlerStore: {
    subscribe: (set) => {
      return { unsubscribe: () => null };
    },
    updateRouteHandlerState: () => null,
    state: { canTravel: false, pendingPath: "" },
    initialState: { canTravel: false, pendingPath: "" },
  },
}));
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));
let importingTestCases = [];
jest.mock(
  "../common/import/TestCaseImportFromBonnieDialog",
  () =>
    ({ openDialog, handleClose, onImport }) => {
      return openDialog ? (
        <div data-testid="test-case-import-dialog">
          <button
            data-testid="test-case-import-cancel-btn"
            onClick={handleClose}
          >
            Cancel
          </button>
          <button
            onClick={() => onImport(importingTestCases)}
            data-testid="test-case-import-import-btn"
          >
            Import
          </button>
        </div>
      ) : (
        <></>
      );
    }
);

const mockedUsedNavigate = jest.fn();
// output from calculationService
const executionResults = {
  results: [
    {
      patientId: "1",
      detailedResults: [
        {
          groupId: "1",
          populationResults: [
            {
              populationType: "initial-population",
              result: true,
            },
            {
              populationType: "denominator",
              result: false,
            },
            {
              populationType: "numerator",
              result: true,
            },
          ],
        },
      ],
    },
    {
      patientId: "2",
      detailedResults: [
        {
          groupId: "2",
          populationResults: [
            {
              populationType: "initial-population",
              result: false,
            },
            {
              populationType: "denominator",
              result: false,
            },
            {
              populationType: "numerator",
              result: false,
            },
          ],
        },
      ],
    },
  ],
  groupClauseCoverageHTML: {
    1: `<div><h2> a345sda45 Clause Coverage: 75.0%</h2></div>`,
    2: `<div><h2> a345sda45 Clause Coverage: 100%</h2></div>`,
  },
};

// mock data for list of testCases retrieved from testCaseService
const testCases = [
  {
    id: "1",
    description: "Test IPP",
    title: "WhenAllGood",
    series: "IPP_Pass",
    lastModifiedAt: "2024-09-10T09:56:14.382Z",
    validResource: true,
    groupPopulations: [
      {
        groupId: "1",
        scoring: MeasureScoring.PROPORTION,
        populationValues: [
          {
            name: "initialPopulation",
            expected: true,
          },
          {
            name: "denominator",
            expected: false,
          },
          {
            name: "numerator",
            expected: true,
          },
        ] as PopulationExpectedValue[],
      },
    ] as GroupPopulation[],
  },
  {
    id: "2",
    description: "Test IPP Fail when something is wrong",
    title: "WhenSomethingIsWrong",
    series: "IPP_Fail",
    lastModifiedAt: "2024-09-10T09:57:14.382Z",
    validResource: true,
    groupPopulations: [
      {
        groupId: "1",
        scoring: MeasureScoring.PROPORTION,
        populationValues: [
          {
            name: "initialPopulation",
            expected: false,
          },
          {
            name: "denominator",
            expected: false,
          },
          {
            name: "numerator",
            expected: true,
          },
        ] as PopulationExpectedValue[],
      },
    ] as GroupPopulation[],
  },
  {
    id: "3",
    description: "Invalid test case",
    title: "WhenJsonIsInvalid",
    series: "IPP_Fail",
    lastModifiedAt: "2024-09-10T09:58:14.382Z",
    validResource: false,
    groupPopulations: [
      {
        groupId: "1",
        scoring: MeasureScoring.PROPORTION,
        populationValues: [
          {
            name: "initialPopulation",
            expected: false,
          },
          {
            name: "denominator",
            expected: false,
          },
          {
            name: "numerator",
            expected: true,
          },
        ] as PopulationExpectedValue[],
      },
    ] as GroupPopulation[],
  },
] as TestCase[];

const failingTestCaseResults = [
  {
    id: "1",
    description: "Test IPP",
    title: "WhenAllGood",
    series: "IPP_Pass",
    lastModifiedAt: "2024-09-10T09:56:14.382Z",
    validResource: true,
    executionStatus: "pass",
    groupPopulations: [
      {
        groupId: "1",
        scoring: MeasureScoring.PROPORTION,
        populationValues: [
          {
            name: "initialPopulation",
            expected: true,
            actual: true,
          },
          {
            name: "denominator",
            expected: false,
            actual: false,
          },
          {
            name: "numerator",
            expected: true,
            actual: true,
          },
        ] as PopulationExpectedValue[],
      },
      {
        groupId: "2",
        scoring: MeasureScoring.COHORT,
        populationBasis: "boolean",
        populationValues: [
          {
            id: "id-1",
            name: PopulationType.INITIAL_POPULATION,
            expected: true,
            actual: true,
          },
        ] as PopulationExpectedValue[],
      },
    ] as GroupPopulation[],
  },
  {
    id: "2",
    description: "Test IPP Fail when something is wrong",
    title: "WhenSomethingIsWrong",
    series: "IPP_Fail",
    lastModifiedAt: "2024-09-10T09:57:14.382Z",
    validResource: true,
    executionStatus: "fail",
    groupPopulations: [
      {
        groupId: "1",
        scoring: MeasureScoring.PROPORTION,
        populationValues: [
          {
            name: "initialPopulation",
            expected: false,
            actual: false,
          },
          {
            name: "denominator",
            expected: false,
            actual: false,
          },
          {
            name: "numerator",
            expected: true,
            actual: false,
          },
        ] as PopulationExpectedValue[],
      },
      {
        groupId: "2",
        scoring: MeasureScoring.COHORT,
        populationBasis: "boolean",
        populationValues: [
          {
            id: "id-1",
            name: PopulationType.INITIAL_POPULATION,
            expected: true,
            actual: true,
          },
        ] as PopulationExpectedValue[],
      },
    ] as GroupPopulation[],
  },
  {
    id: "3",
    description: "Invalid test case",
    title: "WhenJsonIsInvalid",
    series: "IPP_Fail",
    lastModifiedAt: "2024-09-10T09:58:14.382Z",
    validResource: false,
    groupPopulations: [
      {
        groupId: "1",
        scoring: MeasureScoring.PROPORTION,
        populationValues: [
          {
            name: "initialPopulation",
            expected: false,
          },
          {
            name: "denominator",
            expected: false,
          },
          {
            name: "numerator",
            expected: true,
          },
        ] as PopulationExpectedValue[],
      },
      {
        groupId: "2",
        scoring: MeasureScoring.COHORT,
        populationBasis: "boolean",
        populationValues: [
          {
            id: "id-1",
            name: PopulationType.INITIAL_POPULATION,
            expected: true,
            actual: true,
          },
        ] as PopulationExpectedValue[],
      },
    ] as GroupPopulation[],
  },
] as TestCase[];

// mocking calculationService
jest.mock("../../../api/CalculationService");
const calculationServiceMock =
  calculationService as jest.Mock<CalculationService>;

const mockProcessTestCaseResults = jest
  .fn()
  .mockImplementation((testCase, groups, results) => {
    return failingTestCaseResults.find((tc) => tc.id === testCase.id);
  });
const mockGetPassingPercentageForTestCases = jest
  .fn()
  .mockReturnValue({ passPercentage: 50, passFailRatio: "1/2" });

const calculationServiceMockResolved = {
  calculateTestCases: jest.fn().mockResolvedValue(executionResults),
  processTestCaseResults: mockProcessTestCaseResults,
  getPassingPercentageForTestCases: mockGetPassingPercentageForTestCases,
} as unknown as CalculationService;

// mocking testCaseService
jest.mock("../../../api/useTestCaseServiceApi");
const useTestCaseServiceMock =
  useTestCaseServiceApi as jest.Mock<TestCaseServiceApi>;

const useTestCaseServiceMockResolved = {
  getTestCasesByMeasureId: jest.fn().mockResolvedValue(testCases),
  getTestCaseSeriesForMeasure: jest
    .fn()
    .mockResolvedValue(["Series 1", "Series 2"]),
  createTestCases: jest.fn().mockResolvedValue([]),
  exportTestCase: jest.fn().mockResolvedValue(
    new Blob([JSON.stringify("exported test data")], {
      type: "application/json",
    })
  ),
  exportTestCases: jest.fn().mockResolvedValue(
    new Blob([JSON.stringify("exported test cases data")], {
      type: "application/json",
    })
  ),
} as unknown as TestCaseServiceApi;

// mocking measureService
jest.mock("../../../api/useMeasureServiceApi");
const useMeasureServiceMock =
  useMeasureServiceApi as jest.Mock<MeasureServiceApi>;

const measureBundle = buildMeasureBundle(mockMeasure);
const valueSets = [getExampleValueSet()];
const setMeasure = jest.fn();
const setMeasureBundle = jest.fn();
const setValueSets = jest.fn();
const setError = jest.fn();
const setWarnings = jest.fn();

// Test Case import related
const jsonBundle = JSON.stringify({
  resourceType: "Bundle",
  id: "test.id",
  entry: [
    {
      resourceType: "Patient",
      id: "a648e724-ce72-4cac-b0a7-3c4d52784f73",
    },
  ],
});

const mockScanResult: ScanValidationDto = {
  fileName: "testcaseExample.json",
  valid: true,
  error: null,
};

const patientId1 = "8cdd6a96-732f-41da-9902-d680ca68157c";
const patientId2 = "a648e724-ce72-4cac-b0a7-3c4d52784f73";

describe("TestCaseList component", () => {
  const useMeasureServiceMockResolved = {
    fetchMeasure: jest.fn().mockResolvedValue(mockMeasure),
    fetchMeasureBundle: jest
      .fn()
      .mockResolvedValue(buildMeasureBundle(mockMeasure)),
  } as unknown as MeasureServiceApi;
  beforeEach(() => {
    calculationServiceMock.mockImplementation(() => {
      return calculationServiceMockResolved;
    });
    useTestCaseServiceMock.mockReset().mockImplementation(() => {
      return useTestCaseServiceMockResolved;
    });
    useMeasureServiceMock.mockImplementation(() => {
      return useMeasureServiceMockResolved;
    });
    (checkUserCanEdit as jest.Mock).mockClear().mockImplementation(() => true);
    (useFeatureFlags as jest.Mock).mockClear().mockImplementation(() => ({
      applyDefaults: false,
      qiCoreBonnieTestCases: false,
    }));
    setError.mockClear();

    testCases[0].validResource = true;
    testCases[1].validResource = true;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  function renderTestCaseListComponent(
    errors: string[] = [],
    contextFailure = false
  ) {
    return render(
      <MemoryRouter
        initialEntries={[
          `/measures/${mockMeasure.id}/edit/test-cases/list-page`,
        ]}
      >
        <ApiContextProvider value={serviceConfig}>
          <ExecutionContextProvider
            value={{
              measureState: [mockMeasure, setMeasure],
              bundleState: [measureBundle, setMeasureBundle],
              valueSetsState: [valueSets, setValueSets],
              executionContextReady: true,
              executing: false,
              setExecuting: jest.fn(),
              contextFailure: contextFailure,
            }}
          >
            <Routes>
              <Route path="/measures/:measureId/edit/test-cases/list-page">
                <Route
                  index
                  element={
                    <TestCaseLandingWrapper
                      qdm={false}
                      children={
                        <TestCaseLanding
                          errors={errors}
                          setErrors={setError}
                          setWarnings={setWarnings}
                        />
                      }
                    />
                  }
                />
                <Route
                  path=":criteriaId"
                  element={
                    <TestCaseLandingWrapper
                      qdm={false}
                      children={
                        <TestCaseLanding
                          errors={errors}
                          setErrors={setError}
                          setWarnings={setWarnings}
                        />
                      }
                    />
                  }
                />
              </Route>
              <Route path="/measures/:measureId/edit/test-cases/:id">
                <Route index element={<div data-testid="edit-page" />} />
                <Route
                  path=":id"
                  index
                  element={<div data-testid="edit-page" />}
                />
              </Route>
            </Routes>
          </ExecutionContextProvider>
        </ApiContextProvider>
      </MemoryRouter>
    );
  }

  it("should disable Run QICore test case button, if execution context failed", async () => {
    renderTestCaseListComponent([], true);
    await waitFor(() => {
      const executeButton = screen.getByTestId("execute-test-cases-button");
      expect(executeButton).toHaveProperty("disabled", true);
    });
  });

  it("should render list of test cases", async () => {
    renderTestCaseListComponent();
    await waitFor(() => {
      const table = screen.getByTestId("test-case-tbl");

      const tableHeaders = table.querySelectorAll("thead th");

      expect(tableHeaders[0]).toHaveTextContent("Status");
      expect(tableHeaders[1]).toHaveTextContent("Group");
      expect(tableHeaders[2]).toHaveTextContent("Title");
      expect(tableHeaders[3]).toHaveTextContent("Description");
      expect(tableHeaders[4]).toHaveTextContent("Last Saved");
      expect(tableHeaders[5]).toHaveTextContent("Action");

      const tableRows = table.querySelectorAll("tbody tr");

      expect(tableRows[0]).toHaveTextContent(testCases[2].title);
      expect(tableRows[0]).toHaveTextContent(testCases[2].series);
      expect(
        screen.getByTestId(`select-action-${testCases[0].id}`)
      ).toBeInTheDocument();

      expect(tableRows[1]).toHaveTextContent(testCases[1].title);
      expect(tableRows[1]).toHaveTextContent(testCases[1].series);
      expect(
        screen.getByTestId(`select-action-${testCases[1].id}`)
      ).toBeInTheDocument();
    });
  }, 15000);

  it("should not display error message when fetch test cases fails", async () => {
    const error = {
      message: "Unable to retrieve test cases, please try later.",
    };

    const useTestCaseServiceMockRejected = {
      getTestCasesByMeasureId: jest.fn().mockRejectedValue(error),
      getTestCaseSeriesForMeasure: jest
        .fn()
        .mockResolvedValue(["Series 1", "Series 2"]),
    } as unknown as TestCaseServiceApi;

    useTestCaseServiceMock.mockImplementation(() => {
      return useTestCaseServiceMockRejected;
    });

    renderTestCaseListComponent();
    expect(
      await screen.queryByTestId("display-tests-error")
    ).not.toBeInTheDocument();
  });

  it("should render delete dialogue on Test Case list page when delete button is clicked", async () => {
    const { getByTestId } = renderTestCaseListComponent();
    await waitFor(() => {
      const selectButton = getByTestId(`select-action-${testCases[0].id}`);
      expect(selectButton).toBeInTheDocument();
      fireEvent.click(selectButton);
    });
    const deleteButton = getByTestId(`delete-test-case-btn-${testCases[0].id}`);
    fireEvent.click(deleteButton);

    expect(screen.getByTestId("delete-dialog")).toBeInTheDocument();
    expect(
      screen.getByTestId("delete-dialog-continue-button")
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("delete-dialog-cancel-button")
    ).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("delete-dialog-cancel-button"));
    await waitFor(() => {
      const submitButton = screen.queryByText("Yes, Delete");
      expect(submitButton).not.toBeInTheDocument();
    });
  });

  it("should handle delete error on Test Case list page when delete button is clicked", async () => {
    useTestCaseServiceMock.mockImplementation(() => {
      return {
        ...useTestCaseServiceMockResolved,
        deleteTestCaseByTestCaseId: jest
          .fn()
          .mockRejectedValue(new Error("BAD THINGS")),
      } as unknown as TestCaseServiceApi;
    });

    let nextState;
    setError.mockImplementation((callback) => {
      nextState = callback([]);
    });

    const { getByTestId } = renderTestCaseListComponent();
    await waitFor(() => {
      const selectButton = getByTestId(`select-action-${testCases[0].id}`);
      expect(selectButton).toBeInTheDocument();
      fireEvent.click(selectButton);
    });
    const deleteButton = getByTestId(`delete-test-case-btn-${testCases[0].id}`);
    fireEvent.click(deleteButton);

    expect(screen.getByTestId("delete-dialog")).toBeInTheDocument();
    const confirmDeleteBtn = screen.getByTestId(
      "delete-dialog-continue-button"
    );
    expect(confirmDeleteBtn).toBeInTheDocument();
    expect(
      screen.getByTestId("delete-dialog-cancel-button")
    ).toBeInTheDocument();

    userEvent.click(confirmDeleteBtn);
    await waitFor(() => expect(setError).toHaveBeenCalled());
    expect(nextState).toEqual(["BAD THINGS"]);
  });

  it("Should delete all existing test cases", async () => {
    useTestCaseServiceMock.mockImplementation(() => {
      return {
        ...useTestCaseServiceMockResolved,
        deleteTestCases: jest
          .fn()
          .mockResolvedValue("All Test cases are deleted successfully"),
      } as unknown as TestCaseServiceApi;
    });
    renderTestCaseListComponent();

    const table = await screen.findByTestId("test-case-tbl");
    const tableRows = table.querySelectorAll("tbody tr");
    expect(tableRows.length).toBe(3);

    const deleteAllButton = screen.getByRole("button", { name: "Delete All" });
    userEvent.click(deleteAllButton);
    expect(screen.getByTestId("delete-dialog")).toBeInTheDocument();

    const continueButton = screen.getByRole("button", { name: "Yes, Delete" });
    userEvent.click(continueButton);

    const toastMessage = await screen.findByTestId("test-case-list-success");
    expect(toastMessage).toHaveTextContent("Test cases successfully deleted");
    expect(screen.queryByTestId("delete-dialog-body")).toBeNull();
  });

  it("Should throw error message for delete all existing test cases", async () => {
    useTestCaseServiceMock.mockReset().mockImplementation(() => {
      return {
        ...useTestCaseServiceMockResolved,
        deleteTestCases: jest.fn().mockRejectedValue({
          response: {
            data: {
              message: "Unable to delete test cases.",
            },
          },
        }),
      } as unknown as TestCaseServiceApi;
    });

    let nextState;
    setError.mockImplementation((callback) => {
      nextState = callback([]);
    });

    renderTestCaseListComponent();

    const table = await screen.findByTestId("test-case-tbl");
    const tableRows = table.querySelectorAll("tbody tr");
    expect(tableRows.length).toBe(3);

    const deleteAllButton = screen.getByRole("button", { name: "Delete All" });
    userEvent.click(deleteAllButton);
    expect(await screen.findByTestId("delete-dialog")).toBeInTheDocument();

    const continueButton = screen.getByRole("button", { name: "Yes, Delete" });
    userEvent.click(continueButton);

    expect(screen.queryByTestId("delete-dialog-body")).toBeNull();

    await waitFor(() => expect(setError).toHaveBeenCalled());
    expect(nextState).toEqual(["Unable to delete test cases."]);
  });

  it("Should disable delete all button", async () => {
    mockMeasure.testCases = [];
    renderTestCaseListComponent();

    expect(
      await screen.findByRole("button", {
        name: "Delete All",
      })
    ).toBeDisabled();
  });

  it("should execute test cases", async () => {
    mockMeasure.createdBy = MEASURE_CREATEDBY;
    renderTestCaseListComponent();

    const table = await screen.findByTestId("test-case-tbl");
    const tableRows = table.querySelectorAll("tbody tr");
    await waitFor(() => {
      expect(tableRows[2]).toHaveTextContent("N/A");
      expect(tableRows[1]).toHaveTextContent("N/A");
      expect(tableRows[0]).toHaveTextContent("Invalid");
    });

    const executeAllTestCasesButton = screen.getByRole("button", {
      name: "Run Test(s)",
    });

    userEvent.click(executeAllTestCasesButton);
    await waitFor(() => {
      expect(tableRows[2]).toHaveTextContent("Pass");
      expect(tableRows[1]).toHaveTextContent("Fail");
      expect(tableRows[0]).toHaveTextContent("Invalid");
    });

    userEvent.click(screen.getByTestId("coverage-tab"));
    await waitFor(() => {
      expect(
        screen.getByTestId("code-coverage-highlighting")
      ).toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId("passing-tab"));
    expect(screen.getByTestId("test-case-tbl")).toBeInTheDocument();
  });

  it("Run Test Cases button should be disabled if no valid test cases", async () => {
    mockMeasure.createdBy = MEASURE_CREATEDBY;
    testCases[0].validResource = false;
    testCases[1].validResource = false;

    let nextState;
    setError.mockImplementation((callback) => {
      nextState = callback([]);
    });

    renderTestCaseListComponent();

    const table = await screen.findByTestId("test-case-tbl");
    const tableRows = table.querySelectorAll("tbody tr");
    await waitFor(() => {
      expect(tableRows[0]).toHaveTextContent("Invalid");
      expect(tableRows[1]).toHaveTextContent("Invalid");
      expect(tableRows[2]).toHaveTextContent("Invalid");
    });

    const executeAllTestCasesButton = screen.getByRole("button", {
      name: "Run Test(s)",
    });

    expect(executeAllTestCasesButton).toBeDisabled();
  });

  it("should not render execute button for user who is not the owner of the measure", () => {
    mockMeasure.createdBy = "AnotherUser";
    renderTestCaseListComponent();
    const executeAllTestCasesButton = screen.queryByText(
      "execute-test-cases-button"
    );
    expect(executeAllTestCasesButton).not.toBeInTheDocument();
  });

  it("should not display error message when test cases calculation fails", async () => {
    mockMeasure.createdBy = MEASURE_CREATEDBY;
    const error = {
      message: "Unable to calculate test case.",
    };

    const calculationServiceMockRejected = {
      calculateTestCases: jest.fn().mockRejectedValue(error),
    } as unknown as CalculationService;

    calculationServiceMock.mockImplementation(() => {
      return calculationServiceMockRejected;
    });

    const { getByTestId } = renderTestCaseListComponent();

    await waitFor(async () => {
      const executeAllTestCasesButton = getByTestId(
        "execute-test-cases-button"
      );
      fireEvent.click(executeAllTestCasesButton);

      const errorMessage = screen.queryByTestId("display-tests-error");
      await expect(errorMessage).not.toBeInTheDocument();
    });
  });

  it("should render list of test cases and truncate title and series", async () => {
    const testCases = [
      {
        id: "9010",
        description: "Test IPP",
        title:
          "1bcdefghijklmnopqrstuvwxyabcdefghijklmnopqrstuvwxyabcdefghijklmnopqrstuvwxyabcdefghijklmnopqrstuvwxyabcdefghijklmnopqrstuvwxyabcdefghijklmnopqrstuvwxyabcdefghijklmnopqrstuvwxyabcdefghijklmnopqrstuvwxyabcdefghijklmnopqrstuvwxyabcdefghijklmnopqrstuvwxy",
        series:
          "2bcdefghijklmnopqrstuvwxyabcdefghijklmnopqrstuvwxyabcdefghijklmnopqrstuvwxyabcdefghijklmnopqrstuvwxyabcdefghijklmnopqrstuvwxyabcdefghijklmnopqrstuvwxyabcdefghijklmnopqrstuvwxyabcdefghijklmnopqrstuvwxyabcdefghijklmnopqrstuvwxyabcdefghijklmnopqrstuvwxy",
        lastModifiedAt: "2024-09-10T10:09:14.382Z",
      },
    ];

    const useTestCaseServiceMockResolved = {
      getTestCasesByMeasureId: jest.fn().mockResolvedValue(testCases),
      getTestCaseSeriesForMeasure: jest
        .fn()
        .mockResolvedValue(["Series 1", "Series 2"]),
    } as unknown as TestCaseServiceApi;

    useTestCaseServiceMock.mockImplementation(() => {
      return useTestCaseServiceMockResolved;
    });

    renderTestCaseListComponent();

    const table = await screen.findByTestId("test-case-tbl");
    const tableHeaders = table.querySelectorAll("thead th");

    expect(tableHeaders[0]).toHaveTextContent("Status");
    expect(tableHeaders[1]).toHaveTextContent("Group");
    expect(tableHeaders[2]).toHaveTextContent("Title");
    expect(tableHeaders[3]).toHaveTextContent("Description");

    const tableRows = table.querySelectorAll("tbody tr");
    expect(tableRows[0]).toHaveTextContent(testCases[0].title.substring(0, 59));
    expect(tableRows[0]).toHaveTextContent(
      testCases[0].series.substring(0, 59)
    );

    const seriesButton = await screen.findByTestId(
      `test-case-series-${testCases[0].id}-button`
    );
    expect(seriesButton).toBeInTheDocument();
    fireEvent.mouseOver(seriesButton);
    expect(
      await screen.findByRole("button", {
        name: testCases[0].series,
        hidden: true,
      })
    ).toBeVisible();

    const titleButton = screen.getByTestId(
      `test-case-title-${testCases[0].id}-button`
    );
    expect(titleButton).toBeInTheDocument();
    fireEvent.mouseOver(titleButton);
    expect(
      await screen.findByRole(
        "button",
        {
          name: testCases[0].title,
          hidden: true,
        },
        { timeout: 3000 }
      )
    ).toBeVisible();
    await waitFor(() =>
      expect(screen.getByText(testCases[0].title)).toBeInTheDocument()
    );
  });

  it("should render New Test Case button and navigate to the Create New Test Case page when button clicked", async () => {
    const { getByTestId } = renderTestCaseListComponent();

    const codeCoverageTabs = await screen.findByTestId("code-coverage-tabs");
    expect(codeCoverageTabs).toBeInTheDocument();
    const passingTab = await screen.findByTestId("passing-tab");
    expect(passingTab).toBeInTheDocument();
    const testCaseList = await screen.findByTestId("test-case-tbl");
    expect(testCaseList).toBeInTheDocument();

    await waitFor(() => {
      const createNewButton = getByTestId("create-new-test-case-button");
      fireEvent.click(createNewButton);

      expect(getByTestId("create-test-case-dialog")).toBeInTheDocument();
    });

    const coverageTab = await screen.findByTestId("coverage-tab");
    expect(coverageTab).toBeInTheDocument();
  });

  it("should not render New Test Case button for user who is not the owner of the measure", () => {
    mockMeasure.createdBy = "AnotherUser";
    renderTestCaseListComponent();
    const createNewTestCaseButton = screen.queryByText(
      "create-new-test-case-button"
    );
    expect(createNewTestCaseButton).not.toBeInTheDocument();
  });

  it("disables execute button when trying to execute test cases when Measure CQL errors exist", async () => {
    mockMeasure.createdBy = MEASURE_CREATEDBY;
    mockMeasure.cqlErrors = true;
    renderTestCaseListComponent();

    expect(await screen.findByText("WhenAllGood")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Run Test(s)" })).toBeDisabled();
  });

  it("defaults pop criteria nav link to first pop criteria on load", async () => {
    mockMeasure.cqlErrors = false;
    mockMeasure.groups = [
      ...mockMeasure.groups,
      {
        id: "2",
        scoring: MeasureScoring.COHORT,
        populationBasis: "boolean",
        populations: [
          {
            id: "id-1",
            name: PopulationType.INITIAL_POPULATION,
            definition: "ipp",
          },
        ],
        measureGroupTypes: [],
      },
    ];
    renderTestCaseListComponent();

    // wait for pop criteria to load
    await waitFor(() => {
      expect(screen.getByText("Population Criteria 1")).toBeInTheDocument();
      expect(screen.getByText("Population Criteria 2")).toBeInTheDocument();
    });

    // wait for test cases to load
    await waitFor(() => {
      expect(screen.getAllByText("N/A").length).toEqual(2);
    });

    // wait for execution context to be ready
    const executeButton = screen.getByRole("button", {
      name: "Run Test(s)",
    });
    await waitFor(() => {
      expect(executeButton).not.toBeDisabled();
    });

    userEvent.click(executeButton);
    await waitFor(() => expect(screen.getByText("75%")).toBeInTheDocument());

    const table = await screen.findByTestId("test-case-tbl");
    const tableRows = table.querySelectorAll("tbody tr");
    await waitFor(() => {
      expect(tableRows[2]).toHaveTextContent("Pass");
      expect(tableRows[1]).toHaveTextContent("Fail");
      expect(tableRows[0]).toHaveTextContent("Invalid");
    });
  });

  it("updates all results when pop criteria tab is changed", async () => {
    mockMeasure.cqlErrors = false;
    mockMeasure.groups = [
      ...mockMeasure.groups,
      {
        id: "2",
        scoring: MeasureScoring.COHORT,
        populationBasis: "boolean",
        populations: [
          {
            id: "id-1",
            name: PopulationType.INITIAL_POPULATION,
            definition: "ipp",
          },
        ],
        measureGroupTypes: [],
      },
    ];
    renderTestCaseListComponent();

    // wait for pop criteria to load
    await waitFor(() => {
      expect(screen.getByText("Population Criteria 1")).toBeInTheDocument();
      expect(screen.getAllByText("N/A").length).toEqual(2);
    });

    // wait for execution context to be ready
    const executeButton = screen.getByRole("button", {
      name: "Run Test(s)",
    });

    await waitFor(() => expect(executeButton).not.toBeDisabled());

    userEvent.click(executeButton);
    await waitFor(() => expect(screen.getByText("75%")).toBeInTheDocument());
    const table = await screen.findByTestId("test-case-tbl");
    const tableRows = table.querySelectorAll("tbody tr");
    await waitFor(() => {
      expect(tableRows[2]).toHaveTextContent("Pass");
      expect(tableRows[1]).toHaveTextContent("Fail");
      expect(tableRows[0]).toHaveTextContent("Invalid");
    });

    mockProcessTestCaseResults
      .mockClear()
      .mockImplementation((testCase, groups, results) => {
        return {
          ...failingTestCaseResults.find((tc) => tc.id === testCase.id),
          executionStatus: "pass",
        };
      });

    mockGetPassingPercentageForTestCases
      .mockClear()
      .mockReturnValue({ passPercentage: 66, passFailRatio: "2/3" });

    const popCriteria2 = screen.getByText("Population Criteria 2");
    expect(popCriteria2).toBeInTheDocument();
    userEvent.click(popCriteria2);

    const table2 = await screen.findByTestId("test-case-tbl");
    const tableRows2 = table2.querySelectorAll("tbody tr");
    await waitFor(() => {
      expect(tableRows2[2]).toHaveTextContent("Pass");
      screen.debug();
      expect(tableRows2[1]).toHaveTextContent("Fail");
      screen.debug();
      expect(tableRows2[0]).toHaveTextContent("Invalid");
    });

    expect(screen.getByText("Passing (2/3)")).toBeInTheDocument();
    expect(screen.getByText("100%")).toBeInTheDocument();
    expect(screen.getByTestId("sr-div")).toBeInTheDocument();
  });

  it("should hide the button for import test cases from bonnie when feature is disabled", async () => {
    (checkUserCanEdit as jest.Mock).mockClear().mockImplementation(() => true);
    (useFeatureFlags as jest.Mock).mockClear().mockImplementation(() => ({
      qiCoreBonnieTestCases: false,
    }));

    renderTestCaseListComponent();
    const importBtn = await screen.queryByRole("button", {
      name: /Import From Bonnie/i,
    });
    expect(importBtn).not.toBeInTheDocument();
  });

  it("should have a disabled button for import test cases from bonnie when feature is enabled but user cannot edit", async () => {
    (checkUserCanEdit as jest.Mock).mockClear().mockImplementation(() => false);
    (useFeatureFlags as jest.Mock).mockClear().mockImplementation(() => ({
      qiCoreBonnieTestCases: true,
    }));

    renderTestCaseListComponent();
    const importBtn = await screen.findByRole("button", {
      name: /Import From Bonnie/i,
    });
    expect(importBtn).toBeInTheDocument();
    expect(importBtn).toBeDisabled();
  });

  it("should have a enabled button for import test cases when feature is enabled and user can edit", async () => {
    (checkUserCanEdit as jest.Mock).mockClear().mockImplementation(() => true);
    (useFeatureFlags as jest.Mock).mockClear().mockImplementation(() => ({
      qiCoreBonnieTestCases: true,
    }));

    renderTestCaseListComponent();
    const importBtn = await screen.findByRole("button", {
      name: /Import From Bonnie/i,
    });
    expect(importBtn).toBeInTheDocument();
    await waitFor(() => expect(importBtn).not.toBeDisabled());
  });

  it("should display import dialog when import button is clicked", async () => {
    (checkUserCanEdit as jest.Mock).mockClear().mockImplementation(() => true);
    (useFeatureFlags as jest.Mock).mockClear().mockImplementation(() => ({
      qiCoreBonnieTestCases: true,
    }));

    let nextState;
    setError.mockImplementation((callback) => {
      nextState = callback([IMPORT_ERROR]);
    });

    renderTestCaseListComponent();
    const showImportBtn = await screen.findByRole("button", {
      name: /Import From Bonnie/i,
    });
    expect(showImportBtn).toBeInTheDocument();
    await waitFor(() => expect(showImportBtn).not.toBeDisabled());
    userEvent.click(showImportBtn);
    const importDialog = await screen.findByTestId("test-case-import-dialog");
    expect(importDialog).toBeInTheDocument();
    const importBtn = within(importDialog).getByRole("button", {
      name: "Import",
    });
    expect(importBtn).toBeInTheDocument();
    userEvent.click(importBtn);
    const removedImportDialog = await screen.queryByTestId(
      "test-case-import-dialog"
    );
    expect(removedImportDialog).not.toBeInTheDocument();
    expect(nextState).toEqual([]);
  });

  it("should display import error when createTestCases call fails", async () => {
    (checkUserCanEdit as jest.Mock).mockClear().mockImplementation(() => true);
    (useFeatureFlags as jest.Mock).mockClear().mockImplementation(() => ({
      qiCoreBonnieTestCases: true,
    }));

    const useTestCaseServiceMockRejected = {
      getTestCasesByMeasureId: jest.fn().mockResolvedValue(testCases),
      getTestCaseSeriesForMeasure: jest
        .fn()
        .mockResolvedValue(["Series 1", "Series 2"]),
      createTestCases: jest.fn().mockRejectedValueOnce(new Error("BAD THINGS")),
    } as unknown as TestCaseServiceApi;

    useTestCaseServiceMock.mockImplementation(() => {
      return useTestCaseServiceMockRejected;
    });

    let nextState;
    setError.mockImplementation((callback) => {
      nextState = callback([]);
    });

    renderTestCaseListComponent();
    const showImportBtn = await screen.findByRole("button", {
      name: /Import From Bonnie/i,
    });
    await waitFor(() => expect(showImportBtn).not.toBeDisabled());
    userEvent.click(showImportBtn);
    const importDialog = await screen.findByTestId("test-case-import-dialog");
    expect(importDialog).toBeInTheDocument();
    const importBtn = within(importDialog).getByRole("button", {
      name: "Import",
    });
    userEvent.click(importBtn);
    const removedImportDialog = await screen.queryByTestId(
      "test-case-import-dialog"
    );
    expect(removedImportDialog).not.toBeInTheDocument();
    await waitFor(() => expect(setError).toHaveBeenCalledTimes(2));
    expect(nextState).toEqual([IMPORT_ERROR]);
  });

  it("should close import dialog when cancel button is clicked", async () => {
    (checkUserCanEdit as jest.Mock).mockClear().mockImplementation(() => true);
    (useFeatureFlags as jest.Mock).mockClear().mockImplementation(() => ({
      qiCoreBonnieTestCases: true,
    }));

    let nextState;
    setError.mockImplementation((callback) => {
      nextState = callback([]);
    });
    renderTestCaseListComponent([IMPORT_ERROR]);
    const showImportBtn = await screen.findByRole("button", {
      name: /Import From Bonnie/i,
    });
    expect(showImportBtn).toBeInTheDocument();
    await waitFor(() => expect(showImportBtn).not.toBeDisabled());
    userEvent.click(showImportBtn);
    const importDialog = await screen.findByTestId("test-case-import-dialog");
    expect(importDialog).toBeInTheDocument();
    const cancelBtn = within(importDialog).getByRole("button", {
      name: "Cancel",
    });
    expect(cancelBtn).toBeInTheDocument();
    userEvent.click(cancelBtn);
    const removedImportDialog = await screen.queryByTestId(
      "test-case-import-dialog"
    );
    expect(removedImportDialog).not.toBeInTheDocument();
    expect(setError).toHaveBeenCalled();
    expect(nextState).toEqual([]);
  });

  it("should disable execute button if CQL Return type mismatch error exists on measure", async () => {
    mockMeasure.createdBy = MEASURE_CREATEDBY;
    mockMeasure.errors = [
      MeasureErrorType.MISMATCH_CQL_POPULATION_RETURN_TYPES,
    ];
    renderTestCaseListComponent();

    const table = await screen.findByTestId("test-case-tbl");
    const tableRows = table.querySelectorAll("tbody tr");
    await waitFor(() => {
      expect(tableRows[2]).toHaveTextContent("N/A");
      expect(tableRows[1]).toHaveTextContent("N/A");
      expect(tableRows[0]).toHaveTextContent("Invalid");
    });

    const executeAllTestCasesButton = screen.getByRole("button", {
      name: "Run Test(s)",
    });

    await waitFor(() => expect(executeAllTestCasesButton).toBeDisabled());
  });

  it("should export a test case", async () => {
    renderTestCaseListComponent();

    window.URL.createObjectURL = jest
      .fn()
      .mockReturnValueOnce("http://fileurl");

    await waitFor(() => {
      const selectButton = screen.getByTestId(
        `select-action-${testCases[0].id}`
      );
      expect(selectButton).toBeInTheDocument();
      fireEvent.click(selectButton);
    });
    const exportButton = screen.getByTestId(
      `export-collection-bundle-${testCases[0].id}`
    );
    fireEvent.click(exportButton);

    await waitFor(() => {
      expect(
        screen.getByText("Test case exported successfully")
      ).toBeInTheDocument();
    });
  });

  it("should throw error while exporting a test case", async () => {
    useTestCaseServiceMock.mockImplementation(() => {
      return {
        getTestCasesByMeasureId: jest.fn().mockResolvedValue(testCases),
        getTestCaseSeriesForMeasure: jest
          .fn()
          .mockResolvedValue(["Series 1", "Series 2"]),
        exportTestCase: jest.fn().mockRejectedValue(new Error("BAD THINGS")),
      } as unknown as TestCaseServiceApi;
    });
    window.URL.createObjectURL = jest
      .fn()
      .mockReturnValueOnce("http://fileurl");

    renderTestCaseListComponent();

    await waitFor(() => {
      const selectButton = screen.getByTestId(
        `select-action-${testCases[0].id}`
      );
      expect(selectButton).toBeInTheDocument();
      fireEvent.click(selectButton);
    });
    const exportButton = screen.getByTestId(
      `export-collection-bundle-${testCases[0].id}`
    );
    fireEvent.click(exportButton);

    await waitFor(() => {
      expect(
        screen.getByText(
          `Unable to export test cases for ${mockMeasure?.measureName}. Please try again and contact the Help Desk if the problem persists.`
        )
      ).toBeInTheDocument();
    });
  });

  it("should navigate to the Test Case details page on edit button click", async () => {
    renderTestCaseListComponent();

    await waitFor(() => {
      const selectButton = screen.getByTestId(
        `select-action-${testCases[0].id}`
      );
      expect(selectButton).toBeInTheDocument();
      fireEvent.click(selectButton);
    });
    const editButton = screen.getByTestId(
      `view-edit-test-case-${testCases[0].id}`
    );
    fireEvent.click(editButton);
    const editPage = await screen.findByTestId("edit-page");
    expect(editPage).toBeInTheDocument();
  });

  it("should navigate to the Test Case details page on edit button click for shared user", async () => {
    renderTestCaseListComponent();
    await waitFor(() => {
      const selectButton = screen.getByTestId(
        `select-action-${testCases[0].id}`
      );
      expect(selectButton).toBeInTheDocument();
      fireEvent.click(selectButton);
    });
    const editButton = screen.getByTestId(
      `view-edit-test-case-${testCases[0].id}`
    );
    fireEvent.click(editButton);
    const editPage = await screen.findByTestId("edit-page");
    expect(editPage).toBeInTheDocument();
  });

  it("should navigate to the Test Case details page on view button click for non-owner", async () => {
    mockMeasure.createdBy = "AnotherUser";
    renderTestCaseListComponent();

    await waitFor(() => {
      const selectButton = screen.getByTestId(
        `select-action-${testCases[0].id}`
      );
      expect(selectButton).toBeInTheDocument();
      fireEvent.click(selectButton);
    });
    const viewButton = screen.getByTestId(
      `view-edit-test-case-${testCases[0].id}`
    );
    fireEvent.click(viewButton);
    const editPage = await screen.findByTestId("edit-page");
    expect(editPage).toBeInTheDocument();
  });

  it("should throw 404 error while exporting a test case", async () => {
    const error = {
      response: {
        status: 404,
      },
    };

    useTestCaseServiceMock.mockImplementation(() => {
      return {
        getTestCasesByMeasureId: jest.fn().mockResolvedValue(testCases),
        getTestCaseSeriesForMeasure: jest
          .fn()
          .mockResolvedValue(["Series 1", "Series 2"]),
        exportTestCases: jest.fn().mockRejectedValue(error),
      } as unknown as TestCaseServiceApi;
    });
    window.URL.createObjectURL = jest
      .fn()
      .mockReturnValueOnce("http://fileurl");

    renderTestCaseListComponent();

    await waitFor(() => {
      const selectButton = screen.getByTestId(
        `select-action-${testCases[0].id}`
      );
      expect(selectButton).toBeInTheDocument();
      fireEvent.click(selectButton);
    });
    const exportButton = screen.getByTestId(
      `export-collection-bundle-${testCases[0].id}`
    );
    fireEvent.click(exportButton);

    await waitFor(() => {
      expect(
        screen.getByText(
          "Test Case(s) are empty or contain errors. Please update your Test Case(s) and export again."
        )
      ).toBeInTheDocument();
    });
  });

  it("should render Export Test Cases button and export test cases successfully", async () => {
    window.URL.createObjectURL = jest
      .fn()
      .mockReturnValueOnce("http://fileurl");
    const { getByTestId } = renderTestCaseListComponent();

    const codeCoverageTabs = await screen.findByTestId("code-coverage-tabs");
    expect(codeCoverageTabs).toBeInTheDocument();
    const passingTab = await screen.findByTestId("passing-tab");
    expect(passingTab).toBeInTheDocument();
    const testCaseList = await screen.findByTestId("test-case-tbl");
    expect(testCaseList).toBeInTheDocument();

    const exportTestCasesButton = getByTestId("export-test-cases-button");
    fireEvent.click(exportTestCasesButton);
    userEvent.click(screen.getByText("Collection Bundle"));

    await waitFor(() => {
      expect(
        screen.getByText("Test cases exported successfully")
      ).toBeInTheDocument();
    });
  });

  it("should render options for exporting bundle types when Export Test Cases button is clicked", async () => {
    (useFeatureFlags as jest.Mock).mockClear().mockImplementation(() => ({}));

    const { getByTestId } = renderTestCaseListComponent();
    const codeCoverageTabs = await screen.findByTestId("code-coverage-tabs");
    expect(codeCoverageTabs).toBeInTheDocument();
    const passingTab = await screen.findByTestId("passing-tab");
    expect(passingTab).toBeInTheDocument();
    const testCaseList = await screen.findByTestId("test-case-tbl");
    expect(testCaseList).toBeInTheDocument();

    const exportTestCasesButton = getByTestId("export-test-cases-button");
    fireEvent.click(exportTestCasesButton);
    expect(screen.getByText("Transaction Bundle")).toBeInTheDocument();
    expect(screen.getByText("Collection Bundle")).toBeInTheDocument();
  });

  it("should render Export Test Cases button and export partial test cases successfully", async () => {
    useTestCaseServiceMock.mockImplementation(() => {
      return {
        getTestCasesByMeasureId: jest.fn().mockResolvedValue(testCases),
        getTestCaseSeriesForMeasure: jest
          .fn()
          .mockResolvedValue(["Series 1", "Series 2"]),
        exportTestCases: jest.fn().mockResolvedValue({
          body: new Blob([JSON.stringify("exported test data")], {
            type: "application/json",
          }),
          status: 206,
        }),
      } as unknown as TestCaseServiceApi;
    });
    window.URL.createObjectURL = jest
      .fn()
      .mockReturnValueOnce("http://fileurl");
    const { getByTestId } = renderTestCaseListComponent();

    const codeCoverageTabs = await screen.findByTestId("code-coverage-tabs");
    expect(codeCoverageTabs).toBeInTheDocument();
    const passingTab = await screen.findByTestId("passing-tab");
    expect(passingTab).toBeInTheDocument();
    const testCaseList = await screen.findByTestId("test-case-tbl");
    expect(testCaseList).toBeInTheDocument();

    const exportTestCasesButton = getByTestId("export-test-cases-button");
    fireEvent.click(exportTestCasesButton);
    userEvent.click(screen.getByText("Collection Bundle"));

    await waitFor(() => {
      expect(
        screen.getByText(
          "Test Case Export has successfully been generated. Some Test Cases were invalid and could not be exported."
        )
      ).toBeInTheDocument();
    });
  });

  it("should throw exceptions when exporting bulk test cases", async () => {
    useTestCaseServiceMock.mockImplementation(() => {
      return {
        getTestCasesByMeasureId: jest.fn().mockResolvedValue(testCases),
        getTestCaseSeriesForMeasure: jest
          .fn()
          .mockResolvedValue(["Series 1", "Series 2"]),
        exportTestCases: jest
          .fn()
          .mockRejectedValueOnce(new Error("error exporting bulk test cases")),
      } as unknown as TestCaseServiceApi;
    });
    const { getByTestId } = renderTestCaseListComponent();

    const codeCoverageTabs = await screen.findByTestId("code-coverage-tabs");
    expect(codeCoverageTabs).toBeInTheDocument();
    const passingTab = await screen.findByTestId("passing-tab");
    expect(passingTab).toBeInTheDocument();
    const testCaseList = await screen.findByTestId("test-case-tbl");
    expect(testCaseList).toBeInTheDocument();

    const exportTestCasesButton = getByTestId("export-test-cases-button");
    fireEvent.click(exportTestCasesButton);
    userEvent.click(screen.getByText("Collection Bundle"));

    await waitFor(() => {
      expect(
        screen.getByText(
          "Unable to export test cases for measureName. Please try again and contact the Help Desk if the problem persists."
        )
      ).toBeInTheDocument();
    });
  });

  it("should throw 404 exception when exporting bulk test cases", async () => {
    const error = {
      response: {
        status: 404,
      },
    };

    useTestCaseServiceMock.mockImplementation(() => {
      return {
        getTestCasesByMeasureId: jest.fn().mockResolvedValue(testCases),
        getTestCaseSeriesForMeasure: jest
          .fn()
          .mockResolvedValue(["Series 1", "Series 2"]),
        exportTestCases: jest.fn().mockRejectedValueOnce(error),
      } as unknown as TestCaseServiceApi;
    });
    const { getByTestId } = renderTestCaseListComponent();

    const codeCoverageTabs = await screen.findByTestId("code-coverage-tabs");
    expect(codeCoverageTabs).toBeInTheDocument();
    const passingTab = await screen.findByTestId("passing-tab");
    expect(passingTab).toBeInTheDocument();
    const testCaseList = await screen.findByTestId("test-case-tbl");
    expect(testCaseList).toBeInTheDocument();

    const exportTestCasesButton = getByTestId("export-test-cases-button");
    fireEvent.click(exportTestCasesButton);
    userEvent.click(screen.getByText("Collection Bundle"));

    await waitFor(() => {
      expect(
        screen.getByText(
          "Test Case(s) are empty or contain errors. Please update your Test Case(s) and export again."
        )
      ).toBeInTheDocument();
    });
  });

  it("should display import test case button", async () => {
    renderTestCaseListComponent();
    const importButton = await screen.findByRole("button", {
      name: /Import from MADiE/i,
    });
    expect(importButton).toBeInTheDocument();
    expect(importButton).toBeEnabled();
  });

  it("should disable import test case button for unauthorized users", async () => {
    (checkUserCanEdit as jest.Mock).mockClear().mockImplementation(() => false);
    renderTestCaseListComponent();
    const importButton = await screen.findByRole("button", {
      name: /Import from MADiE/i,
    });
    expect(importButton).toBeDisabled();
  });

  it("should succesfully import test cases", async () => {
    const zipFile = await createZipFile(
      [patientId1, patientId2],
      [jsonBundle, jsonBundle]
    );

    const mockedOutcome: TestCaseImportOutcome[] = [
      {
        patientId: patientId1,
        message: null,
        successful: true,
      },
      {
        patientId: patientId2,
        message: null,
        successful: true,
      },
    ];

    useTestCaseServiceMock.mockImplementation(() => {
      return {
        getTestCasesByMeasureId: jest.fn().mockResolvedValue(testCases),
        getTestCaseSeriesForMeasure: jest
          .fn()
          .mockResolvedValue(["Series 1", "Series 2"]),
        scanImportFile: jest.fn().mockResolvedValue(mockScanResult),
        importTestCases: jest.fn().mockResolvedValue({ data: mockedOutcome }),
      } as unknown as TestCaseServiceApi;
    });

    renderTestCaseListComponent();
    // on test case list page
    const importTestCasesButton = await screen.findByRole("button", {
      name: /Import from MADiE/i,
    });
    expect(importTestCasesButton).toBeInTheDocument();
    expect(importTestCasesButton).toBeEnabled();
    userEvent.click(importTestCasesButton);

    expect(screen.getByText("Test Case Import")).toBeInTheDocument();
    // on Import Dialog
    const importButton = await screen.findByRole("button", {
      name: /Import/i,
    });
    expect(importButton).toBeDisabled();

    const dropZone = screen.getByTestId("file-drop-input");
    userEvent.upload(dropZone, zipFile);
    await waitFor(async () => {
      expect(importButton).toBeEnabled();
      userEvent.click(importButton);
      expect(screen.getByText("(2) Test cases imported successfully"));
    });
  });

  it("should throw import error message when failed to import test cases", async () => {
    const zipFile = await createZipFile(
      [patientId1, patientId2],
      [jsonBundle, jsonBundle]
    );

    useTestCaseServiceMock.mockImplementation(() => {
      return {
        getTestCasesByMeasureId: jest.fn().mockResolvedValue(testCases),
        getTestCaseSeriesForMeasure: jest
          .fn()
          .mockResolvedValue(["Series 1", "Series 2"]),
        scanImportFile: jest.fn().mockResolvedValue(mockScanResult),
        importTestCases: jest.fn().mockRejectedValue({}),
      } as unknown as TestCaseServiceApi;
    });

    renderTestCaseListComponent();
    // on test case list page
    const importTestCasesButton = await screen.findByRole("button", {
      name: /Import from MADiE/i,
    });
    expect(importTestCasesButton).toBeInTheDocument();
    expect(importTestCasesButton).toBeEnabled();
    userEvent.click(importTestCasesButton);

    expect(screen.getByText("Test Case Import")).toBeInTheDocument();
    // on Import Dialog
    const importButton = await screen.findByRole("button", {
      name: /Import/i,
    });
    expect(importButton).toBeDisabled();

    const dropZone = screen.getByTestId("file-drop-input");
    userEvent.upload(dropZone, zipFile);

    await waitFor(async () => {
      expect(importButton).toBeEnabled();
      userEvent.click(importButton);
      expect(setError).toHaveBeenCalled();
    });
  });

  it("should should display warnings if one or more test cases were not imported", async () => {
    const zipFile = await createZipFile(
      [patientId1, patientId2],
      [jsonBundle, jsonBundle]
    );

    const mockedOutcome: TestCaseImportOutcome[] = [
      {
        patientId: patientId1,
        message: "Malformed Json",
        successful: false,
      },
      {
        patientId: patientId2,
        message: null,
        successful: true,
      },
    ];

    useTestCaseServiceMock.mockImplementation(() => {
      return {
        getTestCasesByMeasureId: jest.fn().mockResolvedValue(testCases),
        getTestCaseSeriesForMeasure: jest
          .fn()
          .mockResolvedValue(["Series 1", "Series 2"]),
        scanImportFile: jest.fn().mockResolvedValue(mockScanResult),
        importTestCases: jest.fn().mockResolvedValue({ data: mockedOutcome }),
      } as unknown as TestCaseServiceApi;
    });

    renderTestCaseListComponent();
    // on test case list page
    const importTestCasesButton = await screen.findByRole("button", {
      name: /Import from MADiE/i,
    });
    expect(importTestCasesButton).toBeInTheDocument();
    expect(importTestCasesButton).toBeEnabled();
    userEvent.click(importTestCasesButton);

    expect(screen.getByText("Test Case Import")).toBeInTheDocument();
    // on Import Dialog
    const importButton = await screen.findByRole("button", {
      name: /Import/i,
    });
    expect(importButton).toBeDisabled();

    const dropZone = screen.getByTestId("file-drop-input");
    userEvent.upload(dropZone, zipFile);

    await waitFor(async () => {
      expect(importButton).toBeEnabled();
      userEvent.click(importButton);
      expect(setWarnings).toHaveBeenCalledWith(mockedOutcome);
    });
  });
  describe("clone test case", () => {
    it("should clone a test case when the clone button is clicked", async () => {
      const createTestCaseApiMock = jest.fn().mockResolvedValue({});
      const getTestCasesByMeasureIdMock = jest
        .fn()
        .mockResolvedValue(testCases);
      useTestCaseServiceMock.mockImplementation(() => {
        return {
          ...useTestCaseServiceMockResolved,
          getTestCasesByMeasureId: getTestCasesByMeasureIdMock,
          createTestCase: createTestCaseApiMock,
        } as unknown as TestCaseServiceApi;
      });
      renderTestCaseListComponent();
      await waitFor(() => {
        expect(getTestCasesByMeasureIdMock).toHaveBeenCalled();
        const selectButton = screen.getByTestId(
          `select-action-${testCases[0].id}`
        );
        expect(selectButton).toBeInTheDocument();
        userEvent.click(selectButton);
      });
      const cloneButton = screen.getByTestId(
        `clone-test-case-btn-${testCases[0].id}`
      );
      userEvent.click(cloneButton);

      await waitFor(() => {
        expect(createTestCaseApiMock).toHaveBeenCalled();
        expect(getTestCasesByMeasureIdMock).toHaveBeenCalled();
        expect(
          screen.getByText("Test case cloned successfully")
        ).toBeInTheDocument();
      });
    });
  });
});

describe("retrieve coverage value from HTML coverage", () => {
  it("should retrieve the numeric coverage value for decimal percentages", () => {
    const coverageHtml: Record<string, string> = {
      a345sda45: `<div><h2> a345sda45 Clause Coverage: 50.0%</h2></div>`,
    };
    const coverageValue = getCoverageValueFromHtml(coverageHtml, "a345sda45");
    expect(coverageValue).toEqual(expect.any(Number));
    expect(coverageValue).toEqual(50);
  });

  it("should retrieve the numeric coverage value for whole numbers", () => {
    const coverageHtml: Record<string, string> = {
      a345sda45: `<div><h2> a345sda45 Clause Coverage: 100%</h2></div>`,
    };
    const coverageValue = getCoverageValueFromHtml(coverageHtml, "a345sda45");
    expect(coverageValue).toEqual(100);
  });

  it("should return 0 for NaN percentages", () => {
    const coverageHtml: Record<string, string> = {
      a345sda45: `<div><h2> a345sda45 Clause Coverage: NaN%</h2></div>`,
    };
    const coverageValue = getCoverageValueFromHtml(coverageHtml, "a345sda45");
    expect(coverageValue).toEqual(0);
  });

  it("should return 0 for missing percentages", () => {
    const coverageHtml: Record<string, string> = {
      a345sda45: `<div><h2> a345sda45 Clause Coverage: %</h2></div>`,
    };
    const coverageValue = getCoverageValueFromHtml(coverageHtml, "a345sda45");
    expect(coverageValue).toEqual(0);
  });
});

describe("removeHtmlCoverageHeader", () => {
  it("should remove header with numeric percentage", () => {
    const coverage: Record<string, string> = {
      a345sda45: `
      <div><h2> a345sda45 Clause Coverage: 50.0%</h2><pre style="tab-size: 2; border-bottom-width: 4px; line-height: 1.4">
        <code>
        <span data-ref-id="55" style="background-color:#daeaf5;color:#004e82;border-bottom-color:#006cb4;border-bottom-style:dashed"><span>define &quot;boolIpp&quot;:
        </span><span data-ref-id="54" style="background-color:#daeaf5;color:#004e82;border-bottom-color:#006cb4;border-bottom-style:dashed"><span><span data-ref-id="48" style="background-color:#daeaf5;color:#004e82;border-bottom-color:#006cb4;border-bottom-style:dashed"><span data-ref-id="47" style="background-color:#daeaf5;color:#004e82;border-bottom-color:#006cb4;border-bottom-style:dashed"><span data-ref-id="47" style="background-color:#daeaf5;color:#004e82;border-bottom-color:#006cb4;border-bottom-style:dashed"><span>[&quot;Encounter&quot;]</span></span></span><span> E</span></span></span><span> </span><span data-ref-id="53" style="background-color:#daeaf5;color:#004e82;border-bottom-color:#006cb4;border-bottom-style:dashed"><span>where </span><span data-ref-id="53" style="background-color:#daeaf5;color:#004e82;border-bottom-color:#006cb4;border-bottom-style:dashed"><span data-ref-id="51" style="background-color:#daeaf5;color:#004e82;border-bottom-color:#006cb4;border-bottom-style:dashed"><span data-ref-id="50" style="background-color:#daeaf5;color:#004e82;border-bottom-color:#006cb4;border-bottom-style:dashed"><span data-ref-id="49" style="background-color:#daeaf5;color:#004e82;border-bottom-color:#006cb4;border-bottom-style:dashed"><span>E</span></span><span>.</span><span data-ref-id="50" style="background-color:#daeaf5;color:#004e82;border-bottom-color:#006cb4;border-bottom-style:dashed"><span>period</span></span></span><span>.</span><span data-ref-id="51" style="background-color:#daeaf5;color:#004e82;border-bottom-color:#006cb4;border-bottom-style:dashed"><span>start</span></span></span><span data-ref-id="53" style="background-color:#daeaf5;color:#004e82;border-bottom-color:#006cb4;border-bottom-style:dashed"> during </span><span data-ref-id="52" style="background-color:#daeaf5;color:#004e82;border-bottom-color:#006cb4;border-bottom-style:dashed"><span>&quot;Measurement Period&quot;</span></span></span></span></span></span></code>
        </pre><pre style="tab-size: 2; border-bottom-width: 4px; line-height: 1.4">
        <code>
        <span data-ref-id="1719" style=""><span>define function ToDateTime(value </span><span data-ref-id="1716" style=""><span>dateTime</span></span><span>): </span><span data-ref-id="1718" style=""><span data-ref-id="1718" style=""><span data-ref-id="1717" style=""><span>value</span></span><span>.</span><span data-ref-id="1718" style=""><span>value</span></span></span></span></span></code>
        </pre>
       </div>
      `,
    };
    const htmlCoverage = removeHtmlCoverageHeader(coverage);
    expect(htmlCoverage["a345sda45"]).toEqual(`
      <div><pre style="tab-size: 2; border-bottom-width: 4px; line-height: 1.4">
        <code>
        <span data-ref-id="55" style="background-color:#daeaf5;color:#004e82;border-bottom-color:#006cb4;border-bottom-style:dashed"><span>define &quot;boolIpp&quot;:
        </span><span data-ref-id="54" style="background-color:#daeaf5;color:#004e82;border-bottom-color:#006cb4;border-bottom-style:dashed"><span><span data-ref-id="48" style="background-color:#daeaf5;color:#004e82;border-bottom-color:#006cb4;border-bottom-style:dashed"><span data-ref-id="47" style="background-color:#daeaf5;color:#004e82;border-bottom-color:#006cb4;border-bottom-style:dashed"><span data-ref-id="47" style="background-color:#daeaf5;color:#004e82;border-bottom-color:#006cb4;border-bottom-style:dashed"><span>[&quot;Encounter&quot;]</span></span></span><span> E</span></span></span><span> </span><span data-ref-id="53" style="background-color:#daeaf5;color:#004e82;border-bottom-color:#006cb4;border-bottom-style:dashed"><span>where </span><span data-ref-id="53" style="background-color:#daeaf5;color:#004e82;border-bottom-color:#006cb4;border-bottom-style:dashed"><span data-ref-id="51" style="background-color:#daeaf5;color:#004e82;border-bottom-color:#006cb4;border-bottom-style:dashed"><span data-ref-id="50" style="background-color:#daeaf5;color:#004e82;border-bottom-color:#006cb4;border-bottom-style:dashed"><span data-ref-id="49" style="background-color:#daeaf5;color:#004e82;border-bottom-color:#006cb4;border-bottom-style:dashed"><span>E</span></span><span>.</span><span data-ref-id="50" style="background-color:#daeaf5;color:#004e82;border-bottom-color:#006cb4;border-bottom-style:dashed"><span>period</span></span></span><span>.</span><span data-ref-id="51" style="background-color:#daeaf5;color:#004e82;border-bottom-color:#006cb4;border-bottom-style:dashed"><span>start</span></span></span><span data-ref-id="53" style="background-color:#daeaf5;color:#004e82;border-bottom-color:#006cb4;border-bottom-style:dashed"> during </span><span data-ref-id="52" style="background-color:#daeaf5;color:#004e82;border-bottom-color:#006cb4;border-bottom-style:dashed"><span>&quot;Measurement Period&quot;</span></span></span></span></span></span></code>
        </pre><pre style="tab-size: 2; border-bottom-width: 4px; line-height: 1.4">
        <code>
        <span data-ref-id="1719" style=""><span>define function ToDateTime(value </span><span data-ref-id="1716" style=""><span>dateTime</span></span><span>): </span><span data-ref-id="1718" style=""><span data-ref-id="1718" style=""><span data-ref-id="1717" style=""><span>value</span></span><span>.</span><span data-ref-id="1718" style=""><span>value</span></span></span></span></span></code>
        </pre>
       </div>
      `);
  });

  it("should remove header with NaN percentage", () => {
    const htmlCoverage = removeHtmlCoverageHeader({
      ab4c23fd5f: `<div><h2> ab4c23fd5f Clause Coverage: NaN%</h2></div>`,
    });
    expect(htmlCoverage["ab4c23fd5f"]).toEqual(`<div></div>`);
  });

  it("should remove header with 100 percentage", () => {
    const htmlCoverage = removeHtmlCoverageHeader({
      ab4c23fd5f: `<div><h2> ab4c23fd5f Clause Coverage: 100%</h2></div>`,
    });
    expect(htmlCoverage["ab4c23fd5f"]).toEqual(`<div></div>`);
  });

  it("should leave regular HTML alone", () => {
    const htmlCoverage = removeHtmlCoverageHeader({
      ab4c23fd5f: `
      <div><h2>Different Header</h2><pre style="tab-size: 2; border-bottom-width: 4px; line-height: 1.4">
        <code>
        <span data-ref-id="55" style="background-color:#daeaf5;color:#004e82;border-bottom-color:#006cb4;border-bottom-style:dashed"><span>define &quot;boolIpp&quot;:
        </span><span data-ref-id="54" style="background-color:#daeaf5;color:#004e82;border-bottom-color:#006cb4;border-bottom-style:dashed"><span><span data-ref-id="48" style="background-color:#daeaf5;color:#004e82;border-bottom-color:#006cb4;border-bottom-style:dashed"><span data-ref-id="47" style="background-color:#daeaf5;color:#004e82;border-bottom-color:#006cb4;border-bottom-style:dashed"><span data-ref-id="47" style="background-color:#daeaf5;color:#004e82;border-bottom-color:#006cb4;border-bottom-style:dashed"><span>[&quot;Encounter&quot;]</span></span></span><span> E</span></span></span><span> </span><span data-ref-id="53" style="background-color:#daeaf5;color:#004e82;border-bottom-color:#006cb4;border-bottom-style:dashed"><span>where </span><span data-ref-id="53" style="background-color:#daeaf5;color:#004e82;border-bottom-color:#006cb4;border-bottom-style:dashed"><span data-ref-id="51" style="background-color:#daeaf5;color:#004e82;border-bottom-color:#006cb4;border-bottom-style:dashed"><span data-ref-id="50" style="background-color:#daeaf5;color:#004e82;border-bottom-color:#006cb4;border-bottom-style:dashed"><span data-ref-id="49" style="background-color:#daeaf5;color:#004e82;border-bottom-color:#006cb4;border-bottom-style:dashed"><span>E</span></span><span>.</span><span data-ref-id="50" style="background-color:#daeaf5;color:#004e82;border-bottom-color:#006cb4;border-bottom-style:dashed"><span>period</span></span></span><span>.</span><span data-ref-id="51" style="background-color:#daeaf5;color:#004e82;border-bottom-color:#006cb4;border-bottom-style:dashed"><span>start</span></span></span><span data-ref-id="53" style="background-color:#daeaf5;color:#004e82;border-bottom-color:#006cb4;border-bottom-style:dashed"> during </span><span data-ref-id="52" style="background-color:#daeaf5;color:#004e82;border-bottom-color:#006cb4;border-bottom-style:dashed"><span>&quot;Measurement Period&quot;</span></span></span></span></span></span></code>
        </pre><pre style="tab-size: 2; border-bottom-width: 4px; line-height: 1.4">
        <code>
        <span data-ref-id="1719" style=""><span>define function ToDateTime(value </span><span data-ref-id="1716" style=""><span>dateTime</span></span><span>): </span><span data-ref-id="1718" style=""><span data-ref-id="1718" style=""><span data-ref-id="1717" style=""><span>value</span></span><span>.</span><span data-ref-id="1718" style=""><span>value</span></span></span></span></span></code>
        </pre>
       </div>
    `,
    });
    expect(htmlCoverage["ab4c23fd5f"]).toEqual(`
      <div><h2>Different Header</h2><pre style="tab-size: 2; border-bottom-width: 4px; line-height: 1.4">
        <code>
        <span data-ref-id="55" style="background-color:#daeaf5;color:#004e82;border-bottom-color:#006cb4;border-bottom-style:dashed"><span>define &quot;boolIpp&quot;:
        </span><span data-ref-id="54" style="background-color:#daeaf5;color:#004e82;border-bottom-color:#006cb4;border-bottom-style:dashed"><span><span data-ref-id="48" style="background-color:#daeaf5;color:#004e82;border-bottom-color:#006cb4;border-bottom-style:dashed"><span data-ref-id="47" style="background-color:#daeaf5;color:#004e82;border-bottom-color:#006cb4;border-bottom-style:dashed"><span data-ref-id="47" style="background-color:#daeaf5;color:#004e82;border-bottom-color:#006cb4;border-bottom-style:dashed"><span>[&quot;Encounter&quot;]</span></span></span><span> E</span></span></span><span> </span><span data-ref-id="53" style="background-color:#daeaf5;color:#004e82;border-bottom-color:#006cb4;border-bottom-style:dashed"><span>where </span><span data-ref-id="53" style="background-color:#daeaf5;color:#004e82;border-bottom-color:#006cb4;border-bottom-style:dashed"><span data-ref-id="51" style="background-color:#daeaf5;color:#004e82;border-bottom-color:#006cb4;border-bottom-style:dashed"><span data-ref-id="50" style="background-color:#daeaf5;color:#004e82;border-bottom-color:#006cb4;border-bottom-style:dashed"><span data-ref-id="49" style="background-color:#daeaf5;color:#004e82;border-bottom-color:#006cb4;border-bottom-style:dashed"><span>E</span></span><span>.</span><span data-ref-id="50" style="background-color:#daeaf5;color:#004e82;border-bottom-color:#006cb4;border-bottom-style:dashed"><span>period</span></span></span><span>.</span><span data-ref-id="51" style="background-color:#daeaf5;color:#004e82;border-bottom-color:#006cb4;border-bottom-style:dashed"><span>start</span></span></span><span data-ref-id="53" style="background-color:#daeaf5;color:#004e82;border-bottom-color:#006cb4;border-bottom-style:dashed"> during </span><span data-ref-id="52" style="background-color:#daeaf5;color:#004e82;border-bottom-color:#006cb4;border-bottom-style:dashed"><span>&quot;Measurement Period&quot;</span></span></span></span></span></span></code>
        </pre><pre style="tab-size: 2; border-bottom-width: 4px; line-height: 1.4">
        <code>
        <span data-ref-id="1719" style=""><span>define function ToDateTime(value </span><span data-ref-id="1716" style=""><span>dateTime</span></span><span>): </span><span data-ref-id="1718" style=""><span data-ref-id="1718" style=""><span data-ref-id="1717" style=""><span>value</span></span><span>.</span><span data-ref-id="1718" style=""><span>value</span></span></span></span></span></code>
        </pre>
       </div>
    `);
  });
});
