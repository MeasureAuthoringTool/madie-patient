import * as React from "react";
import {
  fireEvent,
  getByTestId,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ApiContextProvider, ServiceConfig } from "../../api/ServiceContext";
import TestCaseList from "./TestCaseList";
import calculationService, {
  CalculationService,
} from "../../api/CalculationService";
import {
  Measure,
  TestCase,
  GroupPopulation,
  MeasureScoring,
  PopulationExpectedValue,
  PopulationType,
} from "@madie/madie-models";
import useTestCaseServiceApi, {
  TestCaseServiceApi,
} from "../../api/useTestCaseServiceApi";
import useMeasureServiceApi, {
  MeasureServiceApi,
} from "../../api/useMeasureServiceApi";
import userEvent from "@testing-library/user-event";
import {
  buildMeasureBundle,
  getExampleValueSet,
} from "../../util/CalculationTestHelpers";
import { ExecutionContextProvider } from "../routes/ExecutionContext";
import { useOktaTokens } from "@madie/madie-util";

const serviceConfig: ServiceConfig = {
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
jest.mock("@madie/madie-util", () => ({
  useOktaTokens: jest.fn(() => ({
    getUserName: jest.fn(() => MEASURE_CREATEDBY), //#nosec
    getAccessToken: () => "test.jwt",
  })),
}));

const mockedUsedNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...(jest.requireActual("react-router-dom") as any),
  useNavigate: () => mockedUsedNavigate,
}));

// output from calculationService
const executionResults = [
  {
    patientId: "1",
    detailedResults: [
      {
        groupId: "population-group-1",
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
        groupId: "population-group-1",
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
];

// mock data for list of testCases retrieved from testCaseService
const testCases = [
  {
    id: "1",
    description: "Test IPP",
    title: "WhenAllGood",
    series: "IPP_Pass",
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
    ] as GroupPopulation[],
  },
] as TestCase[];

// mocking calculationService
jest.mock("../../api/CalculationService");
const calculationServiceMock =
  calculationService as jest.Mock<CalculationService>;

const calculationServiceMockResolved = {
  calculateTestCases: jest.fn().mockResolvedValue(executionResults),
  processTestCaseResults: jest
    .fn()
    .mockImplementation((testCase, groups, results) => {
      return failingTestCaseResults.find((tc) => tc.id === testCase.id);
    }),
} as unknown as CalculationService;

// mocking testCaseService
jest.mock("../../api/useTestCaseServiceApi");
const useTestCaseServiceMock =
  useTestCaseServiceApi as jest.Mock<TestCaseServiceApi>;

const useTestCaseServiceMockResolved = {
  getTestCasesByMeasureId: jest.fn().mockResolvedValue(testCases),
  getTestCaseSeriesForMeasure: jest
    .fn()
    .mockResolvedValue(["Series 1", "Series 2"]),
} as unknown as TestCaseServiceApi;

// Mock data for Measure retrieved from MeasureService
const measure = {
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
  acls: [{ userId: "othertestuser@example.com", roles: ["SHARED_WITH"] }],
} as Measure;

// mocking measureService
jest.mock("../../api/useMeasureServiceApi");
const useMeasureServiceMock =
  useMeasureServiceApi as jest.Mock<MeasureServiceApi>;

const useMeasureServiceMockResolved = {
  fetchMeasure: jest.fn().mockResolvedValue(measure),
  fetchMeasureBundle: jest.fn().mockResolvedValue(buildMeasureBundle(measure)),
} as unknown as MeasureServiceApi;

const measureBundle = buildMeasureBundle(measure);
const valueSets = [getExampleValueSet()];
const setMeasure = jest.fn();
const setMeasureBundle = jest.fn();
const setValueSets = jest.fn();

describe("TestCaseList component", () => {
  beforeEach(() => {
    calculationServiceMock.mockImplementation(() => {
      return calculationServiceMockResolved;
    });
    useTestCaseServiceMock.mockImplementation(() => {
      return useTestCaseServiceMockResolved;
    });
    useMeasureServiceMock.mockImplementation(() => {
      return useMeasureServiceMockResolved;
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  function renderTestCaseListComponent() {
    return render(
      <MemoryRouter>
        <ApiContextProvider value={serviceConfig}>
          <ExecutionContextProvider
            value={{
              measureState: [measure, setMeasure],
              bundleState: [measureBundle, setMeasureBundle],
              valueSetsState: [valueSets, setValueSets],
              executionContextReady: true,
              executing: false,
              setExecuting: jest.fn(),
            }}
          >
            <TestCaseList />
          </ExecutionContextProvider>
        </ApiContextProvider>
      </MemoryRouter>
    );
  }
  it("should render list of test cases", async () => {
    renderTestCaseListComponent();
    await waitFor(() => {
      const table = screen.getByTestId("test-case-tbl");

      const tableHeaders = table.querySelectorAll("thead th");

      expect(tableHeaders[0]).toHaveTextContent("Pass / Fail");
      expect(tableHeaders[1]).toHaveTextContent("Group");
      expect(tableHeaders[2]).toHaveTextContent("Title");
      expect(tableHeaders[3]).toHaveTextContent("Description");
      expect(tableHeaders[4]).toHaveTextContent("Action");

      const tableRows = table.querySelectorAll("tbody tr");

      expect(tableRows[0]).toHaveTextContent(testCases[0].title);
      expect(tableRows[0]).toHaveTextContent(testCases[0].series);
      expect(
        screen.getByTestId(`view-edit-test-case-${testCases[0].id}`)
      ).toBeInTheDocument();

      expect(tableRows[1]).toHaveTextContent(testCases[1].title);
      expect(tableRows[1]).toHaveTextContent(testCases[1].series);
      expect(
        screen.getByTestId(`view-edit-test-case-${testCases[1].id}`)
      ).toBeInTheDocument();
    });
  });

  it("should render coverage tabs", async () => {
    renderTestCaseListComponent();
    expect(await screen.findByTestId("code-coverage-tabs")).toBeInTheDocument();
    expect(screen.getByTestId("passing-tab")).toBeInTheDocument();
    expect(screen.getByTestId("coverage-tab")).toBeInTheDocument();

    userEvent.click(screen.getByTestId("coverage-tab"));
    expect(
      screen.getByTestId("code-coverage-highlighting")
    ).toBeInTheDocument();

    userEvent.click(screen.getByTestId("passing-tab"));
    expect(screen.getByTestId("test-case-tbl")).toBeInTheDocument();
  });

  it("should display error message when fetch test cases fails", async () => {
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
    expect(await screen.findByTestId("display-tests-error")).toHaveTextContent(
      "Unable to retrieve test cases, please try later."
    );
  });

  it("should navigate to the Test Case details page on edit button click", async () => {
    const { getByTestId } = renderTestCaseListComponent();
    await waitFor(() => {
      const editButton = getByTestId(`view-edit-test-case-${testCases[0].id}`);
      fireEvent.click(editButton);
      expect(mockedUsedNavigate).toHaveBeenCalled();
    });
  });

  it("should navigate to the Test Case details page on edit button click for shared user", async () => {
    useOktaTokens.mockImplementationOnce(() => ({
      getUserName: () => "othertestuser@example.com", //#nosec
    }));
    const { getByTestId } = renderTestCaseListComponent();
    await waitFor(() => {
      const editButton = getByTestId(`view-edit-test-case-${testCases[0].id}`);
      fireEvent.click(editButton);
      expect(mockedUsedNavigate).toHaveBeenCalled();
    });
  });

  it("should navigate to the Test Case details page on view button click for non-owner", async () => {
    measure.createdBy = "AnotherUser";
    const { getByTestId } = renderTestCaseListComponent();
    await waitFor(() => {
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
      expect(tableRows[0]).toHaveTextContent("Pending");
      expect(tableRows[1]).toHaveTextContent("Pending");
      expect(tableRows[2]).toHaveTextContent("Invalid");
    });

    const executeAllTestCasesButton = screen.getByRole("button", {
      name: "Execute Test Cases",
    });

    userEvent.click(executeAllTestCasesButton);
    await waitFor(() => {
      expect(tableRows[0]).toHaveTextContent("Pass");
      expect(tableRows[1]).toHaveTextContent("Fail");
      expect(tableRows[2]).toHaveTextContent("Invalid");
    });
  });

  it("should not render execute button for user who is not the owner of the measure", () => {
    measure.createdBy = "AnotherUser";
    renderTestCaseListComponent();
    const executeAllTestCasesButton = screen.queryByText(
      "execute-test-cases-button"
    );
    expect(executeAllTestCasesButton).not.toBeInTheDocument();
  });

  it("should display error message when test cases calculation fails", async () => {
    measure.createdBy = MEASURE_CREATEDBY;
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
      const errorMessage = getByTestId("display-tests-error");
      await expect(errorMessage).toHaveTextContent(
        "Unable to calculate test case."
      );
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

    expect(tableHeaders[0]).toHaveTextContent("Pass / Fail");
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
    userEvent.click(screen.getByTestId("coverage-tab"));
    const codeCoverageHighlighting = await screen.findByTestId(
      "code-coverage-highlighting"
    );
    expect(codeCoverageHighlighting).toBeInTheDocument();
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
    expect(
      screen.getByRole("button", { name: "Execute Test Cases" })
    ).toBeDisabled();
  });
});
