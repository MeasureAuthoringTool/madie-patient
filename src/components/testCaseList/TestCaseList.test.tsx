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
import TestCase, {
  GroupPopulation,
  PopulationValue,
} from "../../models/TestCase";
import useTestCaseServiceApi, {
  TestCaseServiceApi,
} from "../../api/useTestCaseServiceApi";
import useMeasureServiceApi, {
  MeasureServiceApi,
} from "../../api/useMeasureServiceApi";
import Measure from "../../../../madie-measure/src/models/Measure";

const serviceConfig: ServiceConfig = {
  testCaseService: {
    baseUrl: "base.url",
  },
  measureService: {
    baseUrl: "base.url",
  },
};

jest.mock("../../hooks/useOktaTokens", () =>
  jest.fn(() => ({
    getAccessToken: () => "test.jwt",
  }))
);

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

// mocking calculationService
jest.mock("../../api/CalculationService");
const calculationServiceMock =
  calculationService as jest.Mock<CalculationService>;

const calculationServiceMockResolved = {
  calculateTestCases: jest.fn().mockResolvedValue(executionResults),
} as unknown as CalculationService;

// mock data for list of testCases retrieved from testCaseService
const testCases = [
  {
    id: "1",
    description: "Test IPP",
    title: "WhenAllGood",
    series: "IPP_Pass",
    groupPopulations: [
      {
        populationValues: [
          {
            name: "initial-population",
            expected: false,
          },
          {
            name: "denominator",
            expected: false,
          },
          {
            name: "numerator",
            expected: false,
          },
        ] as PopulationValue[],
      },
    ] as GroupPopulation[],
  },
  {
    id: "2",
    description: "Test IPP Fail when something is wrong",
    title: "WhenSomethingIsWrong",
    series: "IPP_Fail",
    groupPopulations: [
      {
        populationValues: [
          {
            name: "initial-population",
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
        ] as PopulationValue[],
      },
    ] as GroupPopulation[],
  },
] as TestCase[];

// mocking testCaseService
jest.mock("../../api/useTestCaseServiceApi");
const useTestCaseServiceMock =
  useTestCaseServiceApi as jest.Mock<TestCaseServiceApi>;

const useTestCaseServiceMockResolved = {
  getTestCasesByMeasureId: jest.fn().mockResolvedValue(testCases),
} as unknown as TestCaseServiceApi;

// Mock data for Measure retrieved from MeasureService
const measure = {
  id: "1",
  measureName: "measureName",
} as Measure;

// mocking measureService
jest.mock("../../api/useMeasureServiceApi");
const useMeasureServiceMock =
  useMeasureServiceApi as jest.Mock<MeasureServiceApi>;

const useMeasureServiceMockResolved = {
  fetchMeasure: jest.fn().mockResolvedValue(measure),
} as unknown as MeasureServiceApi;

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

  it("should render list of test cases", async () => {
    render(
      <MemoryRouter>
        <ApiContextProvider value={serviceConfig}>
          <TestCaseList />
        </ApiContextProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      const table = screen.getByTestId("test-case-tbl");

      const tableHeaders = table.querySelectorAll("thead th");

      expect(tableHeaders[1]).toHaveTextContent("Title");
      expect(tableHeaders[2]).toHaveTextContent("Series");
      expect(tableHeaders[3]).toHaveTextContent("Status");

      const tableRows = table.querySelectorAll("tbody tr");

      expect(tableRows[0]).toHaveTextContent(testCases[0].title);
      expect(tableRows[0]).toHaveTextContent(testCases[0].series);
      expect(
        screen.getByTestId(`edit-test-case-${testCases[0].id}`)
      ).toBeInTheDocument();

      expect(tableRows[2]).toHaveTextContent(testCases[1].title);
      expect(tableRows[2]).toHaveTextContent(testCases[1].series);
      expect(
        screen.getByTestId(`edit-test-case-${testCases[1].id}`)
      ).toBeInTheDocument();
    });
  });

  it("should display error message when fetch test cases fails", async () => {
    const error = {
      message: "Unable to retrieve test cases, please try later.",
    };

    const useTestCaseServiceMockRejected = {
      getTestCasesByMeasureId: jest.fn().mockRejectedValue(error),
    } as unknown as TestCaseServiceApi;

    useTestCaseServiceMock.mockImplementation(() => {
      return useTestCaseServiceMockRejected;
    });

    render(
      <MemoryRouter>
        <ApiContextProvider value={serviceConfig}>
          <TestCaseList />
        </ApiContextProvider>
      </MemoryRouter>
    );
    await waitFor(() => {
      const errorMessage = screen.getByTestId("display-tests-error");
      expect(errorMessage).toHaveTextContent(
        "Unable to retrieve test cases, please try later."
      );
    });
  });

  it("should navigate to the Test Case details page on edit button click", async () => {
    const { getByTestId } = render(
      <MemoryRouter>
        <ApiContextProvider value={serviceConfig}>
          <TestCaseList />
        </ApiContextProvider>
      </MemoryRouter>
    );
    await waitFor(() => {
      const editButton = getByTestId(`edit-test-case-${testCases[0].id}`);
      fireEvent.click(editButton);
      expect(mockedUsedNavigate).toHaveBeenCalled();
    });
  });

  it("should execute test cases", async () => {
    const { getByTestId } = render(<TestCaseList />);

    await waitFor(async () => {
      const table = getByTestId("test-case-tbl");
      const tableRows = table.querySelectorAll("tbody tr");
      const executeAllTestCasesButton = getByTestId(
        "execute-test-cases-button"
      );
      fireEvent.click(executeAllTestCasesButton);
      await expect(tableRows[0]).toHaveTextContent("pass");
      await expect(tableRows[2]).toHaveTextContent("fail");
    });
  });

  it("should display error message when test cases calculation fails", async () => {
    const error = {
      message: "Unable to calculate test case.",
    };

    const calculationServiceMockRejected = {
      calculateTestCases: jest.fn().mockRejectedValue(error),
    } as unknown as CalculationService;

    calculationServiceMock.mockImplementation(() => {
      return calculationServiceMockRejected;
    });

    const { getByTestId } = render(<TestCaseList />);

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

  it("should display error message when fetch measure fails", async () => {
    const error = {
      message: `Unable to fetch measure ${measure.id}`,
    };
    const useMeasureServiceMockRejected = {
      fetchMeasure: jest.fn().mockRejectedValue(error),
    } as unknown as MeasureServiceApi;

    useMeasureServiceMock.mockImplementation(() => {
      return useMeasureServiceMockRejected;
    });

    const { getByTestId } = render(<TestCaseList />);

    await waitFor(async () => {
      const errorMessage = getByTestId("display-tests-error");
      await expect(errorMessage).toHaveTextContent(
        `Unable to fetch measure ${measure.id}`
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
    } as unknown as TestCaseServiceApi;

    useTestCaseServiceMock.mockImplementation(() => {
      return useTestCaseServiceMockResolved;
    });

    render(
      <MemoryRouter>
        <ApiContextProvider value={serviceConfig}>
          <TestCaseList />
        </ApiContextProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      const table = screen.getByTestId("test-case-tbl");

      const tableHeaders = table.querySelectorAll("thead th");

      expect(tableHeaders[1]).toHaveTextContent("Title");
      expect(tableHeaders[2]).toHaveTextContent("Series");
      expect(tableHeaders[3]).toHaveTextContent("Status");

      const tableRows = table.querySelectorAll("tbody tr");
      expect(tableRows[0]).toHaveTextContent(
        testCases[0].title.substring(0, 59)
      );
      expect(tableRows[0]).toHaveTextContent(
        testCases[0].series.substring(0, 59)
      );

      const titleButton = screen.getByTestId(
        `test-case-title-${testCases[0].id}`
      );
      expect(titleButton).toBeInTheDocument();
      fireEvent.mouseOver(titleButton);
      expect(
        screen.getByRole("button", {
          name: testCases[0].title,
          hidden: true,
        })
      ).toBeVisible();
      expect(screen.getByText(testCases[0].title)).toBeInTheDocument();

      const seriesButton = screen.getByTestId(
        `test-case-series-${testCases[0].id}`
      );
      expect(seriesButton).toBeInTheDocument();
      fireEvent.mouseOver(seriesButton);
      expect(
        screen.getByRole("button", {
          name: testCases[0].series,
          hidden: true,
        })
      ).toBeVisible();
    });
  });
});
