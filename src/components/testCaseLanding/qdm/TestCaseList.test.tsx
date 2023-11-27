import * as React from "react";
import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
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
  AggregateFunctionType,
} from "@madie/madie-models";
import useTestCaseServiceApi, {
  TestCaseServiceApi,
} from "../../../api/useTestCaseServiceApi";
import useMeasureServiceApi, {
  MeasureServiceApi,
} from "../../../api/useMeasureServiceApi";
import userEvent from "@testing-library/user-event";
import { buildMeasureBundle } from "../../../util/CalculationTestHelpers";
import { QdmExecutionContextProvider } from "../../routes/qdm/QdmExecutionContext";
import { checkUserCanEdit, useFeatureFlags } from "@madie/madie-util";
import { CqmConversionService } from "../../../api/CqmModelConversionService";
import { ValueSet } from "cqm-models";
import qdmCalculationService, {
  QdmCalculationService,
} from "../../../api/QdmCalculationService";
import { measureCql } from "../../editTestCase/groupCoverage/_mocks_/QdmMeasureCql";

const serviceConfig: ServiceConfig = {
  elmTranslationService: { baseUrl: "translator.url" },
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
const mappedCql = {
  initialPopulation: {
    id: "0223850b-df35-4d0d-98f1-df993f7de328",
    text: 'define "Initial Population":\r\n  ["Encounter, Performed": "Emergency Department Visit"]',
  },
  denominator: {
    id: "91ae58e2-aa5a-4163-ad39-835ff7d0822b",
    text: 'define "IP2":\r\n    ["Encounter, Performed"] E',
  },
  numerator: {
    id: "dc788738-8c66-4538-990c-7a57430c55e3",
    text: 'define "IP2":\r\n    ["Encounter, Performed"] E',
  },
};
const MEASURE_CREATEDBY = "testuser";
// Mock data for Measure retrieved from MeasureService
const measure = {
  id: "1",
  measureName: "measureName",
  createdBy: MEASURE_CREATEDBY,
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
  acls: [{ userId: "othertestuser@example.com", roles: ["SHARED_WITH"] }],
  cql: { measureCql },
} as unknown as Measure;

jest.mock("@madie/madie-util", () => ({
  checkUserCanEdit: jest.fn().mockImplementation(() => true),
  measureStore: {
    updateMeasure: jest.fn((measure) => measure),
  },
  useFeatureFlags: jest.fn().mockImplementation(() => ({
    applyDefaults: false,
    importTestCases: false,
    disableRunTestCaseWithObservStrat: true,
  })),
}));

jest.mock("../../../util/GroupCoverageHelpers", () => ({
  mapCoverageCql: jest.fn().mockImplementation(() => mappedCql),
}));
let importingTestCases = [];
jest.mock(
  "../common/import/TestCaseImportFromBonnieDialogQDM",
  () =>
    ({ open, handleClose, onImport }) => {
      return open ? (
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
            type="button"
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
jest.mock("react-router-dom", () => ({
  ...(jest.requireActual("react-router-dom") as any),
  useNavigate: () => mockedUsedNavigate,
}));

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

const qdmExecutionResults = {
  // patient with id "1"
  "1": {
    // group / population set with id "1"
    "1": {
      IPP: true,
      DENOM: false,
      NUMER: true,
      episodeResults: {},
    },
  },
  "2": {
    "2": {
      IPP: false,
      DENOM: false,
      NUMER: false,
      episodeResults: {},
    },
  },
};

// mock data for list of testCases retrieved from testCaseService
const testCases = [
  {
    id: "1",
    description: "Test IPP",
    title: "WhenAllGood",
    series: "IPP_Pass",
    validResource: true,
    json: "{}",
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
    validResource: true,
    json: "{}",
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
    validResource: false,
    json: "{}",
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

jest.mock("../../../api/QdmCalculationService");
const qdmCalculationServiceMock =
  qdmCalculationService as jest.Mock<QdmCalculationService>;

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
  fakeFunction: jest.fn(),
  getPassingPercentageForTestCases: mockGetPassingPercentageForTestCases,
} as unknown as CalculationService;

const qdmCalculationServiceMockResolved = {
  calculateQdmTestCases: jest.fn().mockResolvedValue(qdmExecutionResults),
  processTestCaseResults: mockProcessTestCaseResults,
  qdmFakeFunction: jest.fn(),
  getPassingPercentageForTestCases: mockGetPassingPercentageForTestCases,
} as unknown as QdmCalculationService;

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
} as unknown as TestCaseServiceApi;

// mocking measureService
jest.mock("../../../api/useMeasureServiceApi");
const useMeasureServiceMock =
  useMeasureServiceApi as jest.Mock<MeasureServiceApi>;

const useMeasureServiceMockResolved = {
  fetchMeasure: jest.fn().mockResolvedValue(measure),
  fetchMeasureBundle: jest.fn().mockResolvedValue(buildMeasureBundle(measure)),
} as unknown as MeasureServiceApi;

const getAccessToken = jest.fn();
let cqmConversionService = new CqmConversionService("url", getAccessToken);
const cqmMeasure = {};
const valueSets = [] as ValueSet[];
const setMeasure = jest.fn();
const setCqmMeasure = jest.fn();
const setValueSets = jest.fn();
const setError = jest.fn();

describe("TestCaseList component", () => {
  beforeEach(() => {
    calculationServiceMock.mockImplementation(() => {
      return calculationServiceMockResolved;
    });
    qdmCalculationServiceMock.mockImplementation(() => {
      return qdmCalculationServiceMockResolved;
    });
    useTestCaseServiceMock.mockImplementation(() => {
      return useTestCaseServiceMockResolved;
    });
    useMeasureServiceMock.mockImplementation(() => {
      return useMeasureServiceMockResolved;
    });
    (checkUserCanEdit as jest.Mock).mockClear().mockImplementation(() => true);
    (useFeatureFlags as jest.Mock).mockClear().mockImplementation(() => ({
      applyDefaults: false,
      importTestCases: false,
      qdmTestCases: true,
      disableRunTestCaseWithObservStrat: true,
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
      <MemoryRouter>
        <ApiContextProvider value={serviceConfig}>
          <QdmExecutionContextProvider
            value={{
              measureState: [measure, setMeasure],
              cqmMeasureState: [cqmMeasure, setCqmMeasure],
              executionContextReady: true,
              executing: false,
              setExecuting: jest.fn(),
              contextFailure: contextFailure,
            }}
          >
            <TestCaseList errors={errors} setErrors={setError} />
          </QdmExecutionContextProvider>
        </ApiContextProvider>
      </MemoryRouter>
    );
  }

  it("should disable Run QDM test case button, if execution context failed", async () => {
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
      expect(tableHeaders[4]).toHaveTextContent("Action");

      const tableRows = table.querySelectorAll("tbody tr");

      expect(tableRows[0]).toHaveTextContent(testCases[0].title);
      expect(tableRows[0]).toHaveTextContent(testCases[0].series);
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

  it("should navigate to the Test Case details page on edit button click", async () => {
    const { getByTestId } = renderTestCaseListComponent();
    await waitFor(() => {
      const selectButton = getByTestId(`select-action-${testCases[0].id}`);
      expect(selectButton).toBeInTheDocument();
      fireEvent.click(selectButton);
      const editButton = getByTestId(`view-edit-test-case-${testCases[0].id}`);
      fireEvent.click(editButton);
      expect(mockedUsedNavigate).toHaveBeenCalled();
    });
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

  it("should navigate to the Test Case details page on edit button click for shared user", async () => {
    const { getByTestId } = renderTestCaseListComponent();
    await waitFor(() => {
      const selectButton = getByTestId(`select-action-${testCases[0].id}`);
      expect(selectButton).toBeInTheDocument();
      fireEvent.click(selectButton);
      const editButton = getByTestId(`view-edit-test-case-${testCases[0].id}`);
      fireEvent.click(editButton);
      expect(mockedUsedNavigate).toHaveBeenCalled();
    });
  });

  it("should navigate to the Test Case details page on view button click for non-owner", async () => {
    measure.createdBy = "AnotherUser";
    const { getByTestId } = renderTestCaseListComponent();
    await waitFor(() => {
      const selectButton = getByTestId(`select-action-${testCases[0].id}`);
      expect(selectButton).toBeInTheDocument();
      fireEvent.click(selectButton);
      const viewButton = getByTestId(`view-edit-test-case-${testCases[0].id}`);
      fireEvent.click(viewButton);
      expect(mockedUsedNavigate).toHaveBeenCalled();
    });
  });

  it("should execute test cases", async () => {
    measure.createdBy = MEASURE_CREATEDBY;
    renderTestCaseListComponent();

    const table = await screen.findByTestId("test-case-tbl");
    const tableRows = table.querySelectorAll("tbody tr");
    await waitFor(() => {
      expect(tableRows[0]).toHaveTextContent("N/A");
      expect(tableRows[1]).toHaveTextContent("N/A");
      expect(tableRows[2]).toHaveTextContent("Invalid");
    });

    const executeAllTestCasesButton = screen.getByRole("button", {
      name: "Run Test(s)",
    });

    userEvent.click(executeAllTestCasesButton);
    await waitFor(() => {
      expect(tableRows[0]).toHaveTextContent("Pass");
      expect(tableRows[1]).toHaveTextContent("Fail");
      expect(tableRows[2]).toHaveTextContent("Invalid");
    });

    userEvent.click(screen.getByTestId("coverage-tab"));
    userEvent.click(screen.getByTestId("passing-tab"));
    expect(screen.getByTestId("test-case-tbl")).toBeInTheDocument();
  });

  it("accordions for cql parts", async () => {
    measure.createdBy = MEASURE_CREATEDBY;
    renderTestCaseListComponent();

    const table = await screen.findByTestId("test-case-tbl");

    userEvent.click(screen.getByTestId("coverage-tab"));
    const coverageTabList = await screen.findByTestId("coverage-tab-list");
    expect(coverageTabList).toBeInTheDocument();
    const allAccordions = await screen.findAllByTestId("accordion");
    expect(allAccordions[0]).toBeInTheDocument();
    const firstAccordion = await screen.queryByText("initialPopulation");
    expect(firstAccordion).toBeInTheDocument();
  });

  it("Run Test Cases button should be disabled if no valid test cases", async () => {
    measure.createdBy = MEASURE_CREATEDBY;
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
    measure.createdBy = "AnotherUser";
    renderTestCaseListComponent();
    const executeAllTestCasesButton = screen.queryByText(
      "execute-test-cases-button"
    );
    expect(executeAllTestCasesButton).not.toBeInTheDocument();
  });

  it("should not display error message when test cases calculation fails", async () => {
    measure.createdBy = MEASURE_CREATEDBY;
    const error = {
      message: "Unable to calculate test case.",
    };

    const qdmCalculationServiceMockRejected = {
      calculateTestCases: jest.fn().mockRejectedValue(error),
    } as unknown as QdmCalculationService;

    qdmCalculationServiceMock.mockImplementation(() => {
      return qdmCalculationServiceMockRejected;
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
    measure.createdBy = "AnotherUser";
    renderTestCaseListComponent();
    const createNewTestCaseButton = screen.queryByText(
      "create-new-test-case-button"
    );
    expect(createNewTestCaseButton).not.toBeInTheDocument();
  });

  it("disables execute button when trying to execute test cases when Measure CQL errors exist", async () => {
    measure.createdBy = MEASURE_CREATEDBY;
    measure.cqlErrors = true;
    renderTestCaseListComponent();

    expect(await screen.findByText("WhenAllGood")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Run Test(s)" })).toBeDisabled();
  });

  it("defaults pop criteria nav link to first pop criteria on load", async () => {
    measure.cqlErrors = false;
    measure.groups = [
      ...measure.groups,
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
    await waitFor(() => expect(screen.getByText("0%")).toBeInTheDocument());

    const table = await screen.findByTestId("test-case-tbl");
    const tableRows = table.querySelectorAll("tbody tr");
    await waitFor(() => {
      expect(tableRows[0]).toHaveTextContent("Pass");
      expect(tableRows[1]).toHaveTextContent("Fail");
      expect(tableRows[2]).toHaveTextContent("Invalid");
    });
  });

  it("updates all results when pop criteria tab is changed", async () => {
    measure.cqlErrors = false;
    measure.groups = [
      ...measure.groups,
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
    await waitFor(() => expect(screen.getByText("50%")).toBeInTheDocument());

    const table = await screen.findByTestId("test-case-tbl");
    const tableRows = table.querySelectorAll("tbody tr");
    await waitFor(() => {
      expect(tableRows[0]).toHaveTextContent("Pass");
      expect(tableRows[1]).toHaveTextContent("Fail");
      expect(tableRows[2]).toHaveTextContent("Invalid");
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
      expect(tableRows2[0]).toHaveTextContent("Pass");
      expect(tableRows2[1]).toHaveTextContent("Pass");
      expect(tableRows2[2]).toHaveTextContent("Invalid");
    });

    expect(screen.getByText("Passing (2/3)")).toBeInTheDocument();
    expect(screen.getByText("0%")).toBeInTheDocument();
    expect(screen.getByTestId("sr-div")).toBeInTheDocument();
  });

  it("should hide the button for import test cases when feature is disabled", async () => {
    (checkUserCanEdit as jest.Mock).mockClear().mockImplementation(() => true);
    (useFeatureFlags as jest.Mock).mockClear().mockImplementation(() => ({
      importTestCases: false,
    }));

    renderTestCaseListComponent();
    const importBtn = await screen.queryByRole("button", {
      name: /import test cases/i,
    });
    expect(importBtn).not.toBeInTheDocument();
  });

  it("should have a disabled button for import test cases when feature is enabled but user cannot edit", async () => {
    (checkUserCanEdit as jest.Mock).mockClear().mockImplementation(() => false);
    (useFeatureFlags as jest.Mock).mockClear().mockImplementation(() => ({
      importTestCases: true,
    }));

    renderTestCaseListComponent();
    const importBtn = await screen.findByRole("button", {
      name: /import test cases/i,
    });
    expect(importBtn).toBeInTheDocument();
    expect(importBtn).toBeDisabled();
  });

  it("should have a enabled button for import test cases when feature is enabled and user can edit", async () => {
    (checkUserCanEdit as jest.Mock).mockClear().mockImplementation(() => true);
    (useFeatureFlags as jest.Mock).mockClear().mockImplementation(() => ({
      importTestCases: true,
    }));

    renderTestCaseListComponent();
    const importBtn = await screen.findByRole("button", {
      name: /import test cases/i,
    });
    expect(importBtn).toBeInTheDocument();
    await waitFor(() => expect(importBtn).not.toBeDisabled());
  });

  it("should display import dialog when import button is clicked", async () => {
    (checkUserCanEdit as jest.Mock).mockClear().mockImplementation(() => true);
    (useFeatureFlags as jest.Mock).mockClear().mockImplementation(() => ({
      importTestCases: true,
    }));

    let nextState;
    setError.mockImplementation((callback) => {
      nextState = callback([IMPORT_ERROR]);
    });

    renderTestCaseListComponent();
    const showImportBtn = await screen.findByRole("button", {
      name: /import test cases/i,
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
      importTestCases: true,
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
      name: /import test cases/i,
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
      importTestCases: true,
    }));

    let nextState;
    setError.mockImplementation((callback) => {
      nextState = callback([]);
    });
    renderTestCaseListComponent([IMPORT_ERROR]);
    const showImportBtn = await screen.findByRole("button", {
      name: /import test cases/i,
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

    await waitFor(() => {
      expect(
        screen.queryByTestId("test-case-import-dialog")
      ).not.toBeInTheDocument();
    });
    expect(setError).toHaveBeenCalled();
    expect(nextState).toEqual([]);
  });

  it("should disable execute button if CQL Return type mismatch error exists on measure", async () => {
    measure.createdBy = MEASURE_CREATEDBY;
    measure.errors = [MeasureErrorType.MISMATCH_CQL_POPULATION_RETURN_TYPES];
    renderTestCaseListComponent();

    const table = await screen.findByTestId("test-case-tbl");
    const tableRows = table.querySelectorAll("tbody tr");
    await waitFor(() => {
      expect(tableRows[0]).toHaveTextContent("N/A");
      expect(tableRows[1]).toHaveTextContent("N/A");
      expect(tableRows[2]).toHaveTextContent("Invalid");
    });

    const executeAllTestCasesButton = screen.getByRole("button", {
      name: "Run Test(s)",
    });

    await waitFor(() => expect(executeAllTestCasesButton).toBeDisabled());
  });

  it("Execution button should be disabled for stratifiation", async () => {
    measure.cqlErrors = false;
    measure.groups = [
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
        stratifications: [
          {
            id: "strata1",
            cqlDefinition: "strat1Def",
            association: PopulationType.INITIAL_POPULATION,
          },
        ],
      },
    ];
    renderTestCaseListComponent();

    // wait for pop criteria to load
    await waitFor(() => {
      const popCriteria1 = screen.getByText("Population Criteria 1");
      expect(popCriteria1).toBeInTheDocument();

      const executeButton = screen.getByRole("button", {
        name: "Run Test(s)",
      });
      expect(executeButton).toBeDisabled();
    });
  });

  it("Execution button should be disabled for observation", async () => {
    measure.cqlErrors = false;
    measure.groups = [
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
        measureObservations: [
          {
            id: "7e20f14a-3659-4a87-9692-5ec35391e8f6",
            definition: "boolFunc",
            criteriaReference: "79349c30-791c-41c7-9463-81872a0dbed1",
            aggregateMethod: AggregateFunctionType.AVERAGE,
          },
        ],
      },
    ];
    renderTestCaseListComponent();

    // wait for pop criteria to load
    await waitFor(() => {
      const popCriteria1 = screen.getByText("Population Criteria 1");
      expect(popCriteria1).toBeInTheDocument();

      const executeButton = screen.getByRole("button", {
        name: "Run Test(s)",
      });
      expect(executeButton).toBeDisabled();
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
