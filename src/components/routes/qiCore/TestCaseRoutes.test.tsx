import * as React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import TestCaseRoutes, {
  CQL_RETURN_TYPES_MISMATCH_ERROR,
} from "./TestCaseRoutes";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import { ApiContextProvider, ServiceConfig } from "../../../api/ServiceContext";
import {
  MeasureErrorType,
  MeasureScoring,
  PopulationType,
} from "@madie/madie-models";
import { getExampleValueSet } from "../../../util/CalculationTestHelpers";
import { Bundle } from "fhir/r4";
import { act } from "react-dom/test-utils";

// mock the editor cause we don't care for this test and it gets rid of errors
jest.mock("../../editor/Editor", () => () => <div>editor contents</div>);

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

const serviceConfig: ServiceConfig = {
  elmTranslationService: { baseUrl: "translator.url" },
  measureService: {
    baseUrl: "measure.url",
  },
  testCaseService: {
    baseUrl: "base.url",
  },
  terminologyService: {
    baseUrl: "something.com",
  },
};

const MEASURE_CREATEDBY = "testuser";
const measureBundle = {} as Bundle;
const valueSets = [getExampleValueSet()];
const mockMeasure = {
  id: "m1234",
  model: "QI-Core v4.1.1",
  cqlLibraryName: "CM527Library",
  measurementPeriodStart: "01/05/2022",
  measurementPeriodEnd: "03/07/2022",
  active: true,
  cqlErrors: false,
  errors: [],
  elmJson: "Fak3",
  groups: [
    {
      id: null,
      scoring: "Cohort",
      populations: [
        {
          id: "id-1",
          name: PopulationType.INITIAL_POPULATION,
          definition: "Initial Population",
        },
      ],
      groupDescription: "",
      measureGroupTypes: [],
      populationBasis: "boolean",
      scoringUnit: "",
    },
  ],
  createdBy: MEASURE_CREATEDBY,
};

jest.mock("@madie/madie-util", () => ({
  useDocumentTitle: jest.fn(),
  measureStore: {
    updateMeasure: jest.fn((measure) => measure),
    state: null,
    initialState: null,
    subscribe: (set) => {
      set(mockMeasure);
      return { unsubscribe: () => null };
    },
    unsubscribe: () => null,
  },
  useFeatureFlags: jest.fn().mockImplementation(() => ({
    applyDefaults: false,
    importTestCases: false,
  })),
  useOktaTokens: () => ({
    getAccessToken: () => "test.jwt",
    getUserName: () => MEASURE_CREATEDBY,
  }),
  checkUserCanEdit: jest.fn(() => {
    return true;
  }),
  routeHandlerStore: {
    subscribe: (set) => {
      return { unsubscribe: () => null };
    },
    updateRouteHandlerState: () => null,
    state: { canTravel: false, pendingPath: "" },
    initialState: { canTravel: false, pendingPath: "" },
  },
}));

describe("TestCaseRoutes", () => {
  afterEach(() => {
    jest.clearAllMocks();
    mockMeasure.errors = [];
    measureBundle.entry = undefined;
  });

  it("should render the landing component first", async () => {
    mockedAxios.get.mockImplementation((args) => {
      return Promise.resolve({
        data: [
          {
            id: "id1",
            title: "TC1",
            description: "Desc1",
            series: "IPP_Pass",
            status: null,
          },
        ],
      });
    });
    render(
      <MemoryRouter initialEntries={["/measures/m1234/edit/test-cases"]}>
        <ApiContextProvider value={serviceConfig}>
          <TestCaseRoutes />
        </ApiContextProvider>
      </MemoryRouter>
    );

    const testCaseTitle = await screen.findByText("TC1");
    expect(testCaseTitle).toBeInTheDocument();
    const testCaseSeries = await screen.findByText("IPP_Pass");
    expect(testCaseSeries).toBeInTheDocument();
    const editBtn = screen.getByRole("button", { name: "select-action-TC1" });
    expect(editBtn).toBeInTheDocument();
  });

  it("should show error message for CQL return type error on measure", async () => {
    mockMeasure.errors = [
      MeasureErrorType.MISMATCH_CQL_POPULATION_RETURN_TYPES,
    ];
    mockedAxios.get.mockImplementation((args) => {
      return Promise.resolve({
        data: [
          {
            id: "id1",
            title: "TC1",
            description: "Desc1",
            series: "IPP_Pass",
            status: null,
          },
        ],
      });
    });
    render(
      <MemoryRouter initialEntries={["/measures/m1234/edit/test-cases"]}>
        <ApiContextProvider value={serviceConfig}>
          <TestCaseRoutes />
        </ApiContextProvider>
      </MemoryRouter>
    );

    const testCaseTitle = await screen.findByText("TC1");
    expect(testCaseTitle).toBeInTheDocument();
    expect(
      await screen.findByText(CQL_RETURN_TYPES_MISMATCH_ERROR)
    ).toBeInTheDocument();
  });

  it("should allow navigation to create test case dialog from landing page ", async () => {
    mockedAxios.get.mockImplementation((args) => {
      if (args && args.endsWith("series")) {
        return Promise.resolve({ data: ["SeriesA"] });
      } else if (
        args &&
        args.startsWith(serviceConfig.measureService.baseUrl)
      ) {
        return Promise.resolve({
          data: {
            id: "m1234",
            createdBy: MEASURE_CREATEDBY,
            measureScoring: MeasureScoring.COHORT,
            measurementPeriodStart: "2023-01-01",
            measurementPeriodEnd: "2023-12-31",
          },
        });
      } else if (args && args.endsWith("test-cases")) {
        return Promise.resolve({
          data: [
            {
              id: "id1",
              title: "TC1",
              description: "Desc1",
              series: "IPP_Pass",
              status: null,
            },
          ],
        });
      }
      return Promise.resolve({ data: null });
    });

    render(
      <MemoryRouter initialEntries={["/measures/m1234/edit/test-cases"]}>
        <ApiContextProvider value={serviceConfig}>
          <TestCaseRoutes />
        </ApiContextProvider>
      </MemoryRouter>
    );

    expect(await screen.findByTestId("code-coverage-tabs")).toBeInTheDocument();

    const testCaseTitle = await screen.findByText("TC1");
    expect(testCaseTitle).toBeInTheDocument();
    const newBtn = await screen.findByRole("button", { name: "New Test Case" });
    userEvent.click(newBtn);

    const createTestCaseDialog = await screen.findByTestId(
      "create-test-case-dialog"
    );
    expect(createTestCaseDialog).toBeInTheDocument();
    const testcaseTitle = await screen.findByTestId(
      "create-test-case-title-input"
    );
    expect(testcaseTitle).toBeInTheDocument();
    const testcaseDescription = await screen.findByTestId(
      "create-test-case-description"
    );
    expect(testcaseDescription).toBeInTheDocument();
    const testcaseSeries = await screen.findByTestId("test-case-series");
    expect(testcaseSeries).toBeInTheDocument();
    const saveButton = await screen.findByTestId(
      "create-test-case-save-button"
    );
    expect(saveButton).toBeInTheDocument();
    const cancelButton = await screen.findByTestId(
      "create-test-case-cancel-button"
    );
    expect(cancelButton).toBeInTheDocument();

    const newBtn2 = screen.queryByRole("button", { name: "New Test Case" });
    expect(newBtn2).not.toBeInTheDocument();
  });

  it("should allow navigation to create test case dialog page, then back to landing page ", async () => {
    mockedAxios.get.mockImplementation((args) => {
      if (args && args.endsWith("series")) {
        return Promise.resolve({ data: ["SeriesA"] });
      } else if (
        args &&
        args.startsWith(serviceConfig.measureService.baseUrl)
      ) {
        return Promise.resolve({
          data: {
            id: "m1234",
            createdBy: MEASURE_CREATEDBY,
            measureScoring: MeasureScoring.COHORT,
            measurementPeriodStart: "2023-01-01",
            measurementPeriodEnd: "2023-12-31",
          },
        });
      } else if (args && args.endsWith("test-cases")) {
        return Promise.resolve({
          data: [
            {
              id: "id1",
              title: "TC1",
              description: "Desc1",
              series: "IPP_Pass",
              status: null,
            },
          ],
        });
      }
      return Promise.resolve({ data: null });
    });

    render(
      <MemoryRouter initialEntries={["/measures/m1234/edit/test-cases"]}>
        <ApiContextProvider value={serviceConfig}>
          <TestCaseRoutes />
        </ApiContextProvider>
      </MemoryRouter>
    );

    const testCaseTitle = await screen.findByText("TC1");
    expect(testCaseTitle).toBeInTheDocument();

    const newBtn = await screen.findByRole("button", { name: "New Test Case" });
    userEvent.click(newBtn);

    const createTestCaseDialog = await screen.findByTestId(
      "create-test-case-dialog"
    );
    expect(createTestCaseDialog).toBeInTheDocument();
    const testcaseTitle = await screen.findByTestId(
      "create-test-case-title-input"
    );
    expect(testcaseTitle).toBeInTheDocument();
    const testcaseDescription = await screen.findByTestId(
      "create-test-case-description"
    );
    expect(testcaseDescription).toBeInTheDocument();
    const testcaseSeries = await screen.findByTestId("test-case-series");
    expect(testcaseSeries).toBeInTheDocument();
    const saveButton = await screen.findByTestId(
      "create-test-case-save-button"
    );
    expect(saveButton).toBeInTheDocument();
    const cancelButton = await screen.findByTestId(
      "create-test-case-cancel-button"
    );
    expect(cancelButton).toBeInTheDocument();

    userEvent.click(cancelButton);

    const newBtn2 = await screen.findByRole("button", {
      name: "New Test Case",
    });
    expect(newBtn2).toBeInTheDocument();
  });

  it("should save test case successfully", async () => {
    jest.useFakeTimers("modern");
    mockedAxios.get.mockImplementation((args) => {
      if (args && args.endsWith("series")) {
        return Promise.resolve({ data: ["SeriesA"] });
      } else if (args && args.endsWith("test-cases")) {
        return Promise.resolve({
          data: [
            {
              id: "id1",
              title: "TC1",
              description: "Desc1",
              series: "IPP_Pass",
              status: null,
            },
          ],
        });
      } else if (args?.endsWith("/bundle")) {
        return Promise.resolve({ data: measureBundle });
      } else if (args?.endsWith("/value-sets/searches")) {
        return Promise.resolve({ data: [valueSets] });
      }
    });

    render(
      <MemoryRouter initialEntries={["/measures/m1234/edit/test-cases"]}>
        <ApiContextProvider value={serviceConfig}>
          <TestCaseRoutes />
        </ApiContextProvider>
      </MemoryRouter>
    );

    mockedAxios.post.mockResolvedValue({
      data: {
        id: "testID",
        title: "TC2",
        createdBy: MEASURE_CREATEDBY,
      },
    });

    const testCaseTitle = await screen.findByText("TC1");
    expect(testCaseTitle).toBeInTheDocument();
    const newBtn = screen.getByRole("button", { name: "New Test Case" });
    userEvent.click(newBtn);

    const createTestCaseDialog = await screen.findByTestId(
      "create-test-case-dialog"
    );
    expect(createTestCaseDialog).toBeInTheDocument();
    const testcaseTitle = await screen.findByTestId(
      "create-test-case-title-input"
    );
    expect(testcaseTitle).toBeInTheDocument();
    const testcaseDescription = await screen.findByTestId(
      "create-test-case-description"
    );
    expect(testcaseDescription).toBeInTheDocument();
    const testcaseSeries = await screen.findByTestId("test-case-series");
    expect(testcaseSeries).toBeInTheDocument();
    const saveButton = await screen.findByTestId(
      "create-test-case-save-button"
    );
    expect(saveButton).toBeInTheDocument();
    const cancelButton = await screen.findByTestId(
      "create-test-case-cancel-button"
    );
    expect(cancelButton).toBeInTheDocument();

    userEvent.type(testcaseTitle, "TC2");
    await waitFor(() => {
      expect(testcaseTitle).toHaveValue("TC2");
    });

    const createBtn = screen.getByRole("button", { name: "Save" });
    await act(async () => {
      userEvent.click(createBtn);
    });

    await waitFor(() => {
      expect(screen.queryByText("error")).not.toBeInTheDocument();
    });
  });

  it("save test case failed", async () => {
    jest.useFakeTimers("modern");
    mockedAxios.get.mockImplementation((args) => {
      if (args && args.endsWith("series")) {
        return Promise.resolve({ data: ["SeriesA"] });
      } else if (args && args.endsWith("test-cases")) {
        return Promise.resolve({
          data: [
            {
              id: "id1",
              title: "TC1",
              description: "Desc1",
              series: "IPP_Pass",
              status: null,
            },
          ],
        });
      } else if (args?.endsWith("/bundle")) {
        return Promise.resolve({ data: measureBundle });
      } else if (args?.endsWith("/value-sets/searches")) {
        return Promise.resolve({ data: [valueSets] });
      }
    });

    render(
      <MemoryRouter initialEntries={["/measures/m1234/edit/test-cases"]}>
        <ApiContextProvider value={serviceConfig}>
          <TestCaseRoutes />
        </ApiContextProvider>
      </MemoryRouter>
    );

    mockedAxios.post.mockRejectedValue({
      data: {
        error: "error",
      },
    });

    const testCaseTitle = await screen.findByText("TC1");
    expect(testCaseTitle).toBeInTheDocument();
    const newBtn = screen.getByRole("button", { name: "New Test Case" });
    await act(async () => {
      userEvent.click(newBtn);
    });

    const createTestCaseDialog = await screen.findByTestId(
      "create-test-case-dialog"
    );
    expect(createTestCaseDialog).toBeInTheDocument();
    const testcaseTitle = await screen.findByTestId(
      "create-test-case-title-input"
    );
    expect(testcaseTitle).toBeInTheDocument();
    const testcaseDescription = await screen.findByTestId(
      "create-test-case-description"
    );
    expect(testcaseDescription).toBeInTheDocument();
    const testcaseSeries = await screen.findByTestId("test-case-series");
    expect(testcaseSeries).toBeInTheDocument();
    const saveButton = await screen.findByTestId(
      "create-test-case-save-button"
    );
    expect(saveButton).toBeInTheDocument();
    const cancelButton = await screen.findByTestId(
      "create-test-case-cancel-button"
    );
    expect(cancelButton).toBeInTheDocument();

    userEvent.type(testcaseTitle, "TC2");
    await waitFor(() => {
      expect(testcaseTitle).toHaveValue("TC2");
    });

    const createBtn = screen.getByRole("button", { name: "Save" });
    await act(async () => {
      userEvent.click(createBtn);
    });

    expect(await screen.findByTestId("server-error-alerts")).toBeTruthy();
    // findBy* queries shouldn't need to be wrapped in waitFor (they already are),
    // but if removed from the next line, the suite sill fail with the following errors:
    //   TypeError: Cannot read properties of null (reading 'createEvent')
    //   Jest worker encountered 4 child process exceptions, exceeding retry limit
    await waitFor(() => {
      expect(
        screen.findByText(
          "An error occurred while creating the test case: Unable to create new test case"
        )
      ).toBeTruthy();
    });
    expect(await screen.findByTestId("close-error-button")).toBeTruthy();
  });

  it("should display duplicate test case name error", async () => {
    const errorMessage = "duplicate test case name";
    jest.useFakeTimers("modern");
    mockedAxios.get.mockImplementation((args) => {
      if (args && args.endsWith("series")) {
        return Promise.resolve({ data: ["SeriesA"] });
      } else if (args && args.endsWith("test-cases")) {
        return Promise.resolve({
          data: [
            {
              id: "id1",
              title: "TC1",
              description: "Desc1",
              series: null,
              status: null,
            },
          ],
        });
      } else if (args?.endsWith("/bundle")) {
        return Promise.resolve({ data: measureBundle });
      } else if (args?.endsWith("/value-sets/searches")) {
        return Promise.resolve({ data: [valueSets] });
      }
    });

    render(
      <MemoryRouter initialEntries={["/measures/m1234/edit/test-cases"]}>
        <ApiContextProvider value={serviceConfig}>
          <TestCaseRoutes />
        </ApiContextProvider>
      </MemoryRouter>
    );

    const testCaseTitle = await screen.findByText("TC1");
    expect(testCaseTitle).toBeInTheDocument();

    const newBtn = screen.getByRole("button", { name: "New Test Case" });
    // await act(async () => {
    userEvent.click(newBtn);
    // });
    const createTestCaseDialog = await screen.findByTestId(
      "create-test-case-dialog"
    );
    expect(createTestCaseDialog).toBeInTheDocument();

    const testcaseTitle = await screen.findByTestId(
      "create-test-case-title-input"
    );
    expect(testcaseTitle).toBeInTheDocument();

    userEvent.type(testcaseTitle, "TC1");
    await waitFor(() => {
      expect(testcaseTitle).toHaveValue("TC1");
    });

    mockedAxios.post.mockRejectedValue({
      response: {
        status: 400,
        data: {
          message: errorMessage,
        },
      },
    });

    const createBtn = screen.getByRole("button", { name: "Save" });
    await act(async () => {
      userEvent.click(createBtn);
    });

    expect(await screen.findByTestId("server-error-alerts")).toBeTruthy();
    expect(
      await screen.findByText(errorMessage, { exact: false })
    ).toBeTruthy();
  });

  it("should display value sets error", async () => {
    //entry.resource?.resourceType === "Library"
    measureBundle.entry = [
      {
        resource: {
          resourceType: "Library",
          relatedArtifact: [
            {
              type: "depends-on",
              url: "http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1029.213",
            },
          ],
        } as any,
      },
    ];

    mockedAxios.get.mockImplementation((args) => {
      if (args?.endsWith("/bundle")) {
        return Promise.resolve({ data: measureBundle });
      } else if (args?.endsWith("/value-sets/searches")) {
        return Promise.reject(new Error("VALUE SET ERRORS"));
      }
      return Promise.resolve({
        data: [
          {
            id: "id1",
            title: "TC1",
            description: "Desc1",
            series: "IPP_Pass",
            status: null,
          },
        ],
      });
    });

    mockedAxios.put.mockRejectedValue(new Error("VALUE SET ERRORS"));
    render(
      <MemoryRouter initialEntries={["/measures/m1234/edit/test-cases"]}>
        <ApiContextProvider value={serviceConfig}>
          <TestCaseRoutes />
        </ApiContextProvider>
      </MemoryRouter>
    );
    expect(
      await screen.findByText(
        "An error occurred, please try again. If the error persists, please contact the help desk."
      )
    ).toBeInTheDocument();
  });

  it("Fetch measure bundle on Routes load", async () => {
    mockedAxios.get.mockImplementation((args) => {
      if (args?.endsWith("/bundle")) {
        return Promise.resolve({ data: measureBundle });
      } else if (args?.endsWith("/value-sets/searches")) {
        return Promise.resolve({ data: [valueSets] });
      }
      return Promise.resolve({
        data: [
          {
            id: "id1",
            title: "TC1",
            description: "Desc1",
            series: "IPP_Pass",
            status: null,
          },
        ],
      });
    });
    render(
      <MemoryRouter initialEntries={["/measures/m1234/edit/test-cases"]}>
        <ApiContextProvider value={serviceConfig}>
          <TestCaseRoutes />
        </ApiContextProvider>
      </MemoryRouter>
    );

    const runAllTestsButton = await screen.findByRole("button", {
      name: "Run Test(s)",
    });
    await waitFor(() => {
      expect(runAllTestsButton).toBeInTheDocument();
    });
    expect(mockedAxios.get).toHaveBeenCalled();
    expect(mockedAxios.get).toHaveBeenCalledWith(
      "measure.url/measures/m1234/bundle",
      { headers: { Authorization: "Bearer test.jwt" } }
    );
  });

  it("should render 404 page", async () => {
    const { getByTestId } = render(
      <MemoryRouter initialEntries={["/measures/m1234/edit/test-case"]}>
        <ApiContextProvider value={serviceConfig}>
          <TestCaseRoutes />
        </ApiContextProvider>
      </MemoryRouter>
    );

    expect(getByTestId("404-page")).toBeInTheDocument();
    expect(getByTestId("404-page-link")).toBeInTheDocument();
  });

  it("should display error message when fetch test cases fails", async () => {
    mockedAxios.get.mockImplementation((args) => {
      if (args && args.endsWith("series")) {
        return Promise.resolve({ data: ["SeriesA"] });
      } else if (
        args &&
        args.startsWith(serviceConfig.measureService.baseUrl)
      ) {
        return Promise.resolve({
          data: {
            id: "m1234",
            createdBy: MEASURE_CREATEDBY,
            measureScoring: MeasureScoring.COHORT,
            measurementPeriodStart: "2023-01-01",
            measurementPeriodEnd: "2023-12-31",
          },
        });
      } else if (args && args.endsWith("test-cases")) {
        return Promise.reject({
          error: {
            message: "Unable to retrieve test cases, please try later",
          },
        });
      }
      return Promise.resolve({ data: null });
    });

    const { getByTestId } = render(
      <MemoryRouter initialEntries={["/measures/m1234/edit/test-cases"]}>
        <ApiContextProvider value={serviceConfig}>
          <TestCaseRoutes />
        </ApiContextProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      const error = getByTestId("execution_context_loading_errors");
      expect(error).toBeInTheDocument();
    });
  });
});
