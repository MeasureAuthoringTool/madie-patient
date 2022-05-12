import * as React from "react";
import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import CreateTestCase from "./CreateTestCase";
import userEvent from "@testing-library/user-event";
import axios, { AxiosError, AxiosResponse } from "axios";
import { ApiContextProvider, ServiceConfig } from "../../api/ServiceContext";
import TestCase from "../../models/TestCase";
import { MeasureScoring } from "../../models/MeasureScoring";
import { MeasurePopulation } from "../../models/MeasurePopulation";
import TestCaseRoutes from "../routes/TestCaseRoutes";
import { act } from "react-dom/test-utils";
import calculationService from "../../api/CalculationService";
import { simpleMeasureFixture } from "./__mocks__/simpleMeasureFixture";
import { testCaseFixture } from "./__mocks__/testCaseFixture";
import { ExecutionResult } from "fqm-execution/build/types/Calculator";

//temporary solution (after jest updated to version 27) for error: thrown: "Exceeded timeout of 5000 ms for a test.
jest.setTimeout(60000);

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

// mock editor to reduce errors and warnings
const mockEditor = { resize: jest.fn() };
jest.mock("../editor/Editor", () => ({ setEditor }) => {
  const React = require("react");
  React.useEffect(() => {
    if (setEditor) {
      setEditor(mockEditor);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <div data-testid="test-case-editor">editor contents</div>;
});

const serviceConfig: ServiceConfig = {
  measureService: {
    baseUrl: "measure.url",
  },
  testCaseService: {
    baseUrl: "base.url",
  },
};

const MEASURE_CREATEDBY = "testuser";
jest.mock("../../hooks/useOktaTokens", () =>
  jest.fn(() => ({
    getAccessToken: () => "test.jwt",
    getUserName: () => MEASURE_CREATEDBY,
  }))
);

const renderWithRouter = (
  initialEntries = [],
  routePath: string,
  element: React.ReactElement
) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <ApiContextProvider value={serviceConfig}>
        <Routes>
          <Route path={routePath} element={element} />
        </Routes>
      </ApiContextProvider>
    </MemoryRouter>
  );
};

describe("CreateTestCase component", () => {
  beforeEach(() => {
    mockedAxios.get.mockImplementation((args) => {
      if (args && args.startsWith(serviceConfig.measureService.baseUrl)) {
        return Promise.resolve({
          data: {
            id: "m1234",
            measureScoring: MeasureScoring.COHORT,
            createdBy: MEASURE_CREATEDBY,
            groups: [
              {
                groupId: "Group1_ID",
                scoring: "Cohort",
                population: {
                  initialPopulation: "Pop1",
                },
              },
            ],
            measurementPeriodStart: "2023-01-01",
            measurementPeriodEnd: "2023-12-31",
          },
        });
      } else if (args && args.endsWith("series")) {
        return Promise.resolve({ data: ["SeriesA"] });
      }
      return Promise.resolve({ data: null });
    });
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render create test case page", async () => {
    renderWithRouter(
      ["/measures/m1234/edit/test-cases/create"],
      "/measures/:measureId/edit/test-cases/create",
      <CreateTestCase />
    );
    const editor = screen.getByTestId("test-case-editor");

    await waitFor(
      () => {
        expect(
          screen.getByTestId("create-test-case-title")
        ).toBeInTheDocument();
        expect(
          screen.getByTestId("create-test-case-description")
        ).toBeInTheDocument();
        expect(
          screen.getByRole("button", { name: "Create Test Case" })
        ).toBeInTheDocument();
      },
      { timeout: 1500 }
    );
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();

    expect(editor).toBeInTheDocument();
  });

  it("should create test case when create button is clicked", async () => {
    renderWithRouter(
      ["/measures/m1234/edit/test-cases/create"],
      "/measures/:measureId/edit/test-cases/create",
      <CreateTestCase />
    );
    const testCaseDescription = "TestCase123";
    const testCaseTitle = "TestTitle";
    mockedAxios.post.mockResolvedValue({
      data: {
        id: "testID",
        createdBy: MEASURE_CREATEDBY,
        description: testCaseDescription,
        title: testCaseTitle,
        hapiOperationOutcome: {
          code: 200,
        },
      },
    });

    await waitFor(
      () => {
        const descriptionInput = screen.getByTestId(
          "create-test-case-description"
        );
        userEvent.type(descriptionInput, testCaseDescription);
      },
      { timeout: 1500 }
    );

    const createBtn = screen.getByRole("button", { name: "Create Test Case" });
    userEvent.click(createBtn);

    const debugOutput = await screen.findByText(
      "Test case created successfully!"
    );
    expect(debugOutput).toBeInTheDocument();
  });

  it("should provide user alert when create test case fails", async () => {
    renderWithRouter(
      ["/measures/m1234/edit/test-cases/create"],
      "/measures/:measureId/edit/test-cases/create",
      <CreateTestCase />
    );
    const testCaseDescription = "TestCase123";
    mockedAxios.post.mockRejectedValue({
      data: {
        error: "Random error",
      },
    });

    await waitFor(
      () => {
        const descriptionInput = screen.getByTestId(
          "create-test-case-description"
        );
        userEvent.type(descriptionInput, testCaseDescription);
      },
      { timeout: 1500 }
    );

    const createBtn = screen.getByRole("button", { name: "Create Test Case" });
    userEvent.click(createBtn);

    const alert = await screen.findByRole("alert");
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveTextContent(
      "An error occurred while creating the test case."
    );
  });

  it("should provide user alert for a success result but response is missing ID attribute", async () => {
    renderWithRouter(
      ["/measures/m1234/edit/test-cases/create"],
      "/measures/:measureId/edit/test-cases/create",
      <CreateTestCase />
    );
    const testCaseDescription = "TestCase123";
    mockedAxios.post.mockResolvedValue({
      data: `The requested URL was rejected. Please contact soc@hcqis.org.
            
             Your support ID is: 12345678901234567890
            `,
    });

    await waitFor(
      () => {
        const descriptionInput = screen.getByTestId(
          "create-test-case-description"
        );
        userEvent.type(descriptionInput, testCaseDescription);
      },
      { timeout: 1500 }
    );

    const createBtn = screen.getByRole("button", { name: "Create Test Case" });
    userEvent.click(createBtn);

    const alert = await screen.findByRole("alert");
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveTextContent(
      "An error occurred - create did not return the expected successful result."
    );
  });

  it("should clear error alert when user clicks alert close button", async () => {
    renderWithRouter(
      ["/measures/m1234/edit/test-cases/create"],
      "/measures/:measureId/edit/test-cases/create",
      <CreateTestCase />
    );
    const testCaseDescription = "TestCase123";
    mockedAxios.post.mockRejectedValue({
      data: {
        error: "Random error",
      },
    });

    await waitFor(
      () => {
        const descriptionInput = screen.getByTestId(
          "create-test-case-description"
        );
        userEvent.type(descriptionInput, testCaseDescription);
      },
      { timeout: 1500 }
    );

    const createBtn = screen.getByRole("button", { name: "Create Test Case" });
    userEvent.click(createBtn);

    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent(
      "An error occurred while creating the test case."
    );

    const closeAlertBtn = screen.getByRole("button", { name: "Close Alert" });
    userEvent.click(closeAlertBtn);

    const dismissedAlert = await screen.queryByRole("alert");
    expect(dismissedAlert).not.toBeInTheDocument();
  });

  it("should load existing test case data when viewing specific test case", async () => {
    const testCase = {
      id: "1234",
      createdBy: MEASURE_CREATEDBY,
      description: "Test IPP",
      json: `{"test":"test"}`,
    } as TestCase;
    mockedAxios.get.mockClear().mockImplementation((args) => {
      if (args && args.endsWith("series")) {
        return Promise.resolve({ data: ["SeriesA"] });
      }
      return Promise.resolve({ data: testCase });
    });

    renderWithRouter(
      ["/measures/m1234/edit/test-cases/1234"],
      "/measures/:measureId/edit/test-cases/:id",
      <CreateTestCase />
    );

    await waitFor(
      () => {
        const descriptionTextArea = screen.getByTestId(
          "create-test-case-description"
        );
        expect(descriptionTextArea).toBeInTheDocument();
        expect(descriptionTextArea).toHaveTextContent(testCase.description);
      },
      { timeout: 1500 }
    );
    expect(
      screen.getByRole("button", { name: "Update Test Case" })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
  });

  it("should update test case when update button is clicked", async () => {
    const testCase = {
      id: "1234",
      createdBy: MEASURE_CREATEDBY,
      description: "Test IPP",
      series: "SeriesA",
      json: `{"test":"test"}`,
      groupPopulations: [
        {
          groupId: "Group1_ID",
          scoring: MeasureScoring.CONTINUOUS_VARIABLE,
          populationValues: [
            {
              name: MeasurePopulation.INITIAL_POPULATION,
              expected: true,
              actual: false,
            },
            {
              name: MeasurePopulation.MEASURE_POPULATION,
              expected: true,
              actual: false,
            },
          ],
        },
      ],
    } as TestCase;
    const testCaseDescription = "modified description";
    mockedAxios.get.mockClear().mockImplementation((args) => {
      if (args && args.startsWith(serviceConfig.measureService.baseUrl)) {
        return Promise.resolve({
          data: {
            id: "m1234",
            createdBy: MEASURE_CREATEDBY,
            measureScoring: MeasureScoring.CONTINUOUS_VARIABLE,
            groups: [
              {
                id: "Group1_ID",
                scoring: "Cohort",
                population: {
                  initialPopulation: "Pop1",
                },
              },
            ],
            measurementPeriodStart: "2023-01-01",
            measurementPeriodEnd: "2023-12-31",
          },
        });
      } else if (args && args.endsWith("series")) {
        return Promise.resolve({ data: ["SeriesA", "SeriesB", "SeriesC"] });
      }
      return Promise.resolve({ data: testCase });
    });

    renderWithRouter(
      ["/measures/m1234/edit/test-cases/1234"],
      "/measures/:measureId/edit/test-cases/:id",
      <CreateTestCase />
    );

    const g1PopulationValues = await screen.findByText(
      "Group 1 (Continuous Variable) Population Values"
    );
    expect(g1PopulationValues).toBeInTheDocument();

    mockedAxios.put.mockResolvedValue({
      data: {
        ...testCase,
        description: testCaseDescription,
        hapiOperationOutcome: {
          code: 200,
        },
      },
    });

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Update Test Case" })
      ).toBeInTheDocument();
    });

    const seriesInput = screen.getByRole("combobox", { name: "Series" });
    expect(seriesInput).toHaveValue("SeriesA");

    const descriptionInput = screen.getByTestId("create-test-case-description");
    expect(descriptionInput).toHaveTextContent(testCase.description);
    userEvent.type(descriptionInput, `{selectall}{del}${testCaseDescription}`);

    userEvent.click(seriesInput);
    const list = await screen.findByRole("listbox");
    expect(list).toBeInTheDocument();
    const listItems = within(list).getAllByRole("option");
    expect(listItems[1]).toHaveTextContent("SeriesB");
    userEvent.click(listItems[1]);

    const ippExpectedCb = await screen.findByTestId(
      "test-population-initialPopulation-expected"
    );
    expect(ippExpectedCb).toBeChecked();
    const mpExpectedCb = await screen.findByTestId(
      "test-population-measurePopulation-expected"
    );
    expect(mpExpectedCb).toBeChecked();
    userEvent.click(mpExpectedCb);

    await waitFor(() => {
      expect(descriptionInput).toHaveTextContent(testCaseDescription);
      expect(
        screen.getByRole("button", { name: "Update Test Case" })
      ).toBeEnabled();
    });
    userEvent.click(screen.getByRole("button", { name: "Update Test Case" }));

    const debugOutput = await screen.findByText(
      "Test case updated successfully!"
    );
    expect(debugOutput).toBeInTheDocument();

    const calls = mockedAxios.put.mock.calls;
    expect(calls).toBeTruthy();
    expect(calls[0]).toBeTruthy();
    const updatedTestCase = calls[0][1] as TestCase;
    expect(updatedTestCase).toBeTruthy();
    expect(updatedTestCase.series).toEqual("SeriesB");
    expect(updatedTestCase.groupPopulations).toEqual([
      {
        groupId: "Group1_ID",
        scoring: MeasureScoring.CONTINUOUS_VARIABLE,
        populationValues: [
          {
            name: MeasurePopulation.INITIAL_POPULATION,
            expected: true,
            actual: false,
          },
          {
            name: MeasurePopulation.MEASURE_POPULATION,
            expected: false,
            actual: false,
          },
        ],
      },
    ]);
  });

  it("should display an error when test case update returns no data", async () => {
    const testCase = {
      id: "1234",
      createdBy: MEASURE_CREATEDBY,
      description: "Test IPP",
      json: `{"test":"test"}`,
    } as TestCase;
    const modifiedDescription = "modified description";
    mockedAxios.get.mockClear().mockImplementation((args) => {
      if (args && args.endsWith("series")) {
        return Promise.resolve({ data: ["SeriesA"] });
      }
      return Promise.resolve({ data: testCase });
    });

    renderWithRouter(
      ["/measures/m1234/edit/test-cases/1234"],
      "/measures/:measureId/edit/test-cases/:id",
      <CreateTestCase />
    );

    mockedAxios.put.mockResolvedValue({
      data: null,
    });

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Update Test Case" })
      ).toBeInTheDocument();
    });

    const descriptionInput = screen.getByTestId("create-test-case-description");
    expect(descriptionInput).toHaveTextContent(testCase.description);
    userEvent.type(descriptionInput, `{selectall}{del}${modifiedDescription}`);

    await waitFor(() => {
      expect(descriptionInput).toHaveTextContent(modifiedDescription);
    });
    userEvent.click(screen.getByRole("button", { name: "Update Test Case" }));

    const debugOutput = await screen.findByText(
      "An error occurred - update did not return the expected successful result."
    );
    expect(debugOutput);
  });

  it("should display an error when test case update fails", async () => {
    const testCase = {
      id: "1234",
      createdBy: MEASURE_CREATEDBY,
      description: "Test IPP",
      json: `{"test":"test"}`,
    } as TestCase;
    const modifiedDescription = "modified description";
    mockedAxios.get.mockClear().mockImplementation((args) => {
      if (args && args.endsWith("series")) {
        return Promise.resolve({ data: ["SeriesA"] });
      }
      return Promise.resolve({ data: testCase });
    });

    renderWithRouter(
      ["/measures/m1234/edit/test-cases/1234"],
      "/measures/:measureId/edit/test-cases/:id",
      <CreateTestCase />
    );

    const axiosError: AxiosError = {
      response: {
        status: 404,
        data: {},
      } as AxiosResponse,
      toJSON: jest.fn(),
    } as unknown as AxiosError;

    mockedAxios.put.mockClear().mockRejectedValue(axiosError);

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Update Test Case" })
      ).toBeInTheDocument();
    });

    const descriptionInput = screen.getByTestId("create-test-case-description");
    expect(descriptionInput).toHaveTextContent(testCase.description);
    userEvent.type(descriptionInput, `{selectall}{del}${modifiedDescription}`);

    await waitFor(() => {
      expect(descriptionInput).toHaveTextContent(modifiedDescription);
    });
    userEvent.click(screen.getByRole("button", { name: "Update Test Case" }));

    const debugOutput = await screen.findByText(
      "An error occurred while updating the test case."
    );
    expect(debugOutput);
  });

  it("should ignore supplied changes when cancel button is clicked during test case edit", async () => {
    const testCase = {
      id: "1234",
      createdBy: MEASURE_CREATEDBY,
      description: "Test IPP",
      json: `{"test":"test"}`,
    } as TestCase;
    const modifiedDescription = "modified description";
    mockedAxios.get.mockClear().mockImplementation((args) => {
      if (args && args.endsWith("series")) {
        return Promise.resolve({ data: ["SeriesA"] });
      }
      return Promise.resolve({ data: testCase });
    });

    renderWithRouter(
      ["/measures/m1234/edit/test-cases/1234"],
      "/measures/:measureId/edit/test-cases/:id",
      <CreateTestCase />
    );

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Update Test Case" })
      ).toBeInTheDocument();
    });

    const descriptionInput = screen.getByTestId("create-test-case-description");
    expect(descriptionInput).toHaveTextContent(testCase.description);
    userEvent.type(descriptionInput, `{selectall}{del}${modifiedDescription}`);

    await waitFor(() => {
      expect(descriptionInput).toHaveTextContent(modifiedDescription);
    });
    userEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(mockedAxios.put).toBeCalledTimes(0);
  });

  it("should generate field level error for test case description more than 250 characters", async () => {
    renderWithRouter(
      ["/measures/m1234/edit/test-cases/create"],
      "/measures/:measureId/edit/test-cases/create",
      <CreateTestCase />
    );

    const g1PopulationValues = await screen.findByText(
      "Group 1 (Cohort) Population Values"
    );
    expect(g1PopulationValues).toBeInTheDocument();

    const testCaseDescription =
      "abcdefghijklmnopqrstuvwxyabcdefghijklmnopqrstuvwxyabcdefghijklmnopqrstuvwxyabcdefghijklmnopqrstuvwxyabcdefghijklmnopqrstuvwxyabcdefghijklmnopqrstuvwxyabcdefghijklmnopqrstuvwxyabcdefghijklmnopqrstuvwxyabcdefghijklmnopqrstuvwxyabcdefghijklmnopqrstuvwxyz";
    const descriptionInput = screen.getByTestId("create-test-case-description");
    userEvent.type(descriptionInput, testCaseDescription);

    fireEvent.blur(descriptionInput);

    const createBtn = screen.getByRole("button", { name: "Create Test Case" });
    await waitFor(() => {
      expect(createBtn).toBeDisabled;
      expect(screen.getByTestId("description-helper-text")).toHaveTextContent(
        "Test Case Description cannot be more than 250 characters."
      );
    });
  });

  it("should allow special characters for test case description", async () => {
    renderWithRouter(
      ["/measures/m1234/edit/test-cases/create"],
      "/measures/:measureId/edit/test-cases/create",
      <CreateTestCase />
    );

    const testCaseDescription =
      "{{[[{shift}{ctrl/}a{/shift}~!@#$% ^&*() _-+= }|] \\ :;,. <>?/ '\"";
    const testCaseTitle = "TestTitle";
    mockedAxios.post.mockResolvedValue({
      data: {
        id: "testID",
        createdBy: MEASURE_CREATEDBY,
        description: testCaseDescription,
        title: testCaseTitle,
        hapiOperationOutcome: {
          code: 201,
        },
      },
    });

    await waitFor(
      () => {
        const descriptionInput = screen.getByTestId(
          "create-test-case-description"
        );
        userEvent.type(descriptionInput, testCaseDescription);
      },
      { timeout: 1500 }
    );

    const createBtn = screen.getByRole("button", { name: "Create Test Case" });
    userEvent.click(createBtn);

    const debugOutput = await screen.findByText(
      "Test case created successfully!"
    );
    expect(debugOutput).toBeInTheDocument();
  });

  it("should display an error when test case series fail to load", async () => {
    mockedAxios.get.mockClear().mockImplementation((args) => {
      if (args && args.startsWith(serviceConfig.measureService.baseUrl)) {
        return Promise.resolve({
          data: {
            id: "m1234",
            measureScoring: MeasureScoring.COHORT,
            measurementPeriodStart: "2023-01-01",
            measurementPeriodEnd: "2023-12-31",
          },
        });
      } else if (args && args.endsWith("series")) {
        return Promise.reject({
          status: 500,
          data: null,
        });
      }
      return Promise.resolve({ data: null });
    });

    renderWithRouter(
      ["/measures/m1234/edit/test-cases/create"],
      "/measures/:measureId/edit/test-cases/create",
      <CreateTestCase />
    );

    const debugOutput = await screen.findByText(
      "Unable to retrieve test case series, please try later."
    );
    expect(debugOutput).toBeInTheDocument();
  });

  it("should display an error when measure doesn't exist fetching test case series", async () => {
    const axiosError: AxiosError = {
      response: {
        status: 404,
        data: {},
      } as AxiosResponse,
      toJSON: jest.fn(),
    } as unknown as AxiosError;

    mockedAxios.get.mockClear().mockImplementation((args) => {
      if (args && args.startsWith(serviceConfig.measureService.baseUrl)) {
        return Promise.resolve({
          data: {
            id: "m1234",
            measureScoring: MeasureScoring.COHORT,
            measurementPeriodStart: "2023-01-01",
            measurementPeriodEnd: "2023-12-31",
          },
        });
      } else if (args && args.endsWith("series")) {
        return Promise.reject(axiosError);
      }
      return Promise.resolve({ data: null });
    });

    renderWithRouter(
      ["/measures/m1234/edit/test-cases/create"],
      "/measures/:measureId/edit/test-cases/create",
      <CreateTestCase />
    );

    const debugOutput = await screen.findByText(
      "Measure does not exist, unable to load test case series!"
    );
    expect(debugOutput).toBeInTheDocument();
  });

  it("should generate field level error for test case title more than 250 characters", async () => {
    renderWithRouter(
      ["/measures/m1234/edit/test-cases/create"],
      "/measures/:measureId/edit/test-cases/create",
      <CreateTestCase />
    );

    const g1PopulationValues = await screen.findByText(
      "Group 1 (Cohort) Population Values"
    );
    expect(g1PopulationValues).toBeInTheDocument();

    const testCaseTitle =
      "abcdefghijklmnopqrstuvwxyabcdefghijklmnopqrstuvwxyabcdefghijklmnopqrstuvwxyabcdefghijklmnopqrstuvwxyabcdefghijklmnopqrstuvwxyabcdefghijklmnopqrstuvwxyabcdefghijklmnopqrstuvwxyabcdefghijklmnopqrstuvwxyabcdefghijklmnopqrstuvwxyabcdefghijklmnopqrstuvwxyz";
    const titleInput = screen.getByTestId("create-test-case-title");
    userEvent.type(titleInput, testCaseTitle);
    fireEvent.blur(titleInput);

    const createBtn = screen.getByRole("button", { name: "Create Test Case" });
    await waitFor(() => {
      expect(createBtn).toBeDisabled;
      expect(screen.getByTestId("title-helper-text")).toHaveTextContent(
        "Test Case Title cannot be more than 250 characters."
      );
    });
  });

  it("should allow special characters for test case title", async () => {
    renderWithRouter(
      ["/measures/m1234/edit/test-cases/create"],
      "/measures/:measureId/edit/test-cases/create",
      <CreateTestCase />
    );

    const testCaseDescription = "Test Description";
    const testCaseTitle =
      "{{[[{shift}{ctrl/}a{/shift}~!@#$% ^&*() _-+= }|] \\ :;,. <>?/ '\"";
    mockedAxios.post.mockResolvedValue({
      data: {
        id: "testID",
        createdBy: MEASURE_CREATEDBY,
        description: testCaseDescription,
        title: testCaseTitle,
        hapiOperationOutcome: {
          code: 201,
        },
      },
    });

    await waitFor(
      () => {
        const titleInput = screen.getByTestId("create-test-case-title");
        userEvent.type(titleInput, testCaseTitle);
      },
      { timeout: 1500 }
    );

    const createBtn = screen.getByRole("button", { name: "Create Test Case" });
    userEvent.click(createBtn);

    const debugOutput = await screen.findByText(
      "Test case created successfully!"
    );
    expect(debugOutput).toBeInTheDocument();
  });

  it("should allow special characters for test case series", async () => {
    renderWithRouter(
      ["/measures/m1234/edit/test-cases/create"],
      "/measures/:measureId/edit/test-cases/create",
      <CreateTestCase />
    );

    const testCaseDescription = "Test Description";
    const testCaseSeries =
      "{{[[{shift}{ctrl/}a{/shift}~!@#$% ^&*() _-+= }|] \\ :;,. <>?/ '\"";
    mockedAxios.post.mockResolvedValue({
      data: {
        id: "testID",
        createdBy: MEASURE_CREATEDBY,
        description: testCaseDescription,
        series: testCaseSeries,
        hapiOperationOutcome: {
          code: 201,
        },
      },
    });

    await waitFor(
      () => {
        const seriesInput = screen.getByTestId("create-test-case-series");
        userEvent.type(seriesInput, testCaseSeries);
      },
      { timeout: 1500 }
    );

    const createBtn = screen.getByRole("button", { name: "Create Test Case" });
    userEvent.click(createBtn);

    const debugOutput = await screen.findByText(
      "Test case created successfully!"
    );
    expect(debugOutput).toBeInTheDocument();
  }, 15000);

  it("should display HAPI validation errors after create test case", async () => {
    jest.useFakeTimers("modern");
    renderWithRouter(
      ["/measures/m1234/edit/test-cases/create"],
      "/measures/:measureId/edit/test-cases/create",
      <CreateTestCase />
    );

    const testCaseDescription = "Test Description";
    const testCaseSeries =
      "{{[[{shift}{ctrl/}a{/shift}~!@#$% ^&*() _-+= }|] \\ :;,. <>?/ '\"";
    mockedAxios.post.mockResolvedValue({
      data: {
        id: "testID",
        createdBy: MEASURE_CREATEDBY,
        description: testCaseDescription,
        series: testCaseSeries,
        hapiOperationOutcome: {
          code: 400,
          outcomeResponse: {
            resourceType: "OperationOutcome",
            issue: [
              {
                severity: "error",
                diagnostics: "Patient.name is a required field",
              },
              {
                severity: "error",
                diagnostics: "Patient.identifier is a required field",
              },
            ],
          },
        },
      },
    });

    await waitFor(
      () => {
        const seriesInput = screen.getByTestId("create-test-case-series");
        userEvent.type(seriesInput, testCaseSeries);
      },
      { timeout: 1500 }
    );

    const createBtn = screen.getByRole("button", { name: "Create Test Case" });
    userEvent.click(createBtn);

    const debugOutput = await screen.findByText(
      "An error occurred with the Test Case JSON while creating the test case"
    );
    expect(debugOutput).toBeInTheDocument();

    const showValidationErrorsBtn = screen.getByRole("button", {
      name: "Validation Errors",
    });
    expect(showValidationErrorsBtn).toBeInTheDocument();
    userEvent.click(showValidationErrorsBtn);
    jest.advanceTimersByTime(700);

    const validationErrorsList = await screen.findByTestId(
      "json-validation-errors-list"
    );
    expect(validationErrorsList).toBeInTheDocument();
    const patientNameError = await within(validationErrorsList).findByText(
      "Patient.name is a required field"
    );
    expect(patientNameError).toBeInTheDocument();
    const patientIdentifierError = within(validationErrorsList).getByText(
      "Patient.identifier is a required field"
    );
    expect(patientIdentifierError).toBeInTheDocument();
  }, 15000);

  it("should display HAPI validation errors after update test case", async () => {
    jest.useFakeTimers("modern");

    const testCase = {
      id: "1234",
      createdBy: MEASURE_CREATEDBY,
      description: "Test IPP",
      series: "SeriesA",
      json: `{"test":"test"}`,
    } as TestCase;
    const testCaseDescription = "modified description";
    mockedAxios.get.mockClear().mockImplementation((args) => {
      if (args && args.endsWith("series")) {
        return Promise.resolve({ data: ["SeriesA", "SeriesB", "SeriesC"] });
      }
      return Promise.resolve({ data: testCase });
    });

    renderWithRouter(
      ["/measures/m1234/edit/test-cases/1234"],
      "/measures/:measureId/edit/test-cases/:id",
      <CreateTestCase />
    );

    mockedAxios.put.mockResolvedValue({
      data: {
        ...testCase,
        description: testCaseDescription,
        hapiOperationOutcome: {
          code: 400,
          outcomeResponse: {
            resourceType: "OperationOutcome",
            issue: [
              {
                severity: "error",
                diagnostics: "Patient.name is a required field",
              },
              {
                severity: "error",
                diagnostics: "Patient.identifier is a required field",
              },
            ],
          },
        },
      },
    });

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Update Test Case" })
      ).toBeInTheDocument();
    });

    const seriesInput = screen.getByTestId("create-test-case-description");
    userEvent.type(seriesInput, testCaseDescription);
    const updateBtn = screen.getByRole("button", { name: "Update Test Case" });
    userEvent.click(updateBtn);

    const debugOutput = await screen.findByText(
      "An error occurred with the Test Case JSON while updating the test case"
    );
    expect(debugOutput).toBeInTheDocument();

    const showValidationErrorsBtn = screen.getByRole("button", {
      name: "Validation Errors",
    });
    expect(showValidationErrorsBtn).toBeInTheDocument();
    userEvent.click(showValidationErrorsBtn);
    jest.advanceTimersByTime(700);

    const validationErrorsList = await screen.findByTestId(
      "json-validation-errors-list"
    );
    expect(validationErrorsList).toBeInTheDocument();
    const patientNameError = await within(validationErrorsList).findByText(
      "Patient.name is a required field"
    );
    expect(patientNameError).toBeInTheDocument();
    const patientIdentifierError = within(validationErrorsList).getByText(
      "Patient.identifier is a required field"
    );
    expect(patientIdentifierError).toBeInTheDocument();
  });

  it("should alert for HAPI FHIR errors", async () => {
    jest.useFakeTimers("modern");

    const testCase = {
      id: "1234",
      createdBy: MEASURE_CREATEDBY,
      description: "Test IPP",
      series: "SeriesA",
      json: `{"test":"test"}`,
    } as TestCase;
    const testCaseDescription = "modified description";
    mockedAxios.get.mockClear().mockImplementation((args) => {
      if (args && args.endsWith("series")) {
        return Promise.resolve({ data: ["SeriesA", "SeriesB", "SeriesC"] });
      }
      return Promise.resolve({ data: testCase });
    });

    renderWithRouter(
      ["/measures/m1234/edit/test-cases/1234"],
      "/measures/:measureId/edit/test-cases/:id",
      <CreateTestCase />
    );

    const data = {
      ...testCase,
      description: testCaseDescription,
      hapiOperationOutcome: {
        code: 500,
        message: "An unknown error occurred with HAPI FHIR",
        outcomeResponse: {
          resourceType: "OperationOutcome",
          text: "Bad things happened",
        },
      },
    };

    mockedAxios.put.mockResolvedValue({
      data,
    });

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Update Test Case" })
      ).toBeInTheDocument();
    });

    const seriesInput = screen.getByTestId("create-test-case-description");
    userEvent.type(seriesInput, testCaseDescription);
    const updateBtn = screen.getByRole("button", { name: "Update Test Case" });
    userEvent.click(updateBtn);

    const debugOutput = await screen.findByText(
      "An error occurred with the Test Case JSON while updating the test case"
    );
    expect(debugOutput).toBeInTheDocument();

    const showValidationErrorsBtn = screen.getByRole("button", {
      name: "Validation Errors",
    });
    expect(showValidationErrorsBtn).toBeInTheDocument();
    userEvent.click(showValidationErrorsBtn);
    jest.advanceTimersByTime(700);

    const validationErrorsList = await screen.findByTestId(
      "json-validation-errors-list"
    );
    expect(validationErrorsList).toBeInTheDocument();
    const noErrors = await within(validationErrorsList).findByText(
      data.hapiOperationOutcome.outcomeResponse.text
    );
    expect(noErrors).toBeInTheDocument();

    const closeValidationErrorsBtn = await screen.getByRole("button", {
      name: "Validation Errors",
    });
    expect(closeValidationErrorsBtn).toBeInTheDocument();
    userEvent.click(closeValidationErrorsBtn);
    jest.advanceTimersByTime(700);
    const sideButton = await screen.findByTestId(
      "closed-json-validation-errors-aside"
    );
    expect(sideButton).toBeInTheDocument();
    const errorText = screen.queryByText(
      "data.hapiOperationOutcome.outcomeResponse.text"
    );
    expect(errorText).not.toBeInTheDocument();
    expect(mockEditor.resize).toHaveBeenCalledTimes(2);
  });

  it("should display an error when measure groups and measure info cannot be loaded", async () => {
    mockedAxios.get.mockClear().mockImplementation((args) => {
      if (args && args.endsWith("series")) {
        return Promise.resolve({ data: ["SeriesA", "SeriesB", "SeriesC"] });
      }
      return Promise.reject({
        data: {
          error: "Error with loading measure data",
        },
      });
    });

    renderWithRouter(
      ["/measures/m1234/edit/test-cases/create"],
      "/measures/:measureId/edit/test-cases/create",
      <CreateTestCase />
    );

    const alert = await screen.findByRole("alert");
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveTextContent(
      "Failed to load measure groups. An error occurred while loading the measure."
    );
  });

  it("should handle displaying a test case with null groupPopulation data", async () => {
    const testCase = {
      id: "1234",
      description: "Test IPP",
      series: "SeriesA",
      json: `{"test":"test"}`,
      groupPopulations: null,
    } as TestCase;
    mockedAxios.get.mockClear().mockImplementation((args) => {
      if (args && args.startsWith(serviceConfig.measureService.baseUrl)) {
        return Promise.resolve({
          data: {
            id: "m1234",
            measureScoring: MeasureScoring.CONTINUOUS_VARIABLE,
            groups: [
              {
                id: "Group1_ID",
                scoring: "Cohort",
                population: {
                  initialPopulation: "Pop1",
                },
              },
            ],
            measurementPeriodStart: "2023-01-01",
            measurementPeriodEnd: "2023-12-31",
          },
        });
      } else if (args && args.endsWith("series")) {
        return Promise.resolve({ data: ["SeriesA", "SeriesB", "SeriesC"] });
      }
      return Promise.resolve({ data: testCase });
    });

    renderWithRouter(
      ["/measures/m1234/edit/test-cases/1234"],
      "/measures/:measureId/edit/test-cases/:id",
      <CreateTestCase />
    );

    const ippRow = await screen.findByTestId(
      "test-row-population-id-initialPopulation"
    );
    expect(ippRow).toBeInTheDocument();
  });

  it("should show message when no groups are present", async () => {
    const testCase = {
      id: "1234",
      description: "Test IPP",
      series: "SeriesA",
      json: `{"test":"test"}`,
      groupPopulations: null,
    } as TestCase;
    mockedAxios.get.mockClear().mockImplementation((args) => {
      if (args && args.startsWith(serviceConfig.measureService.baseUrl)) {
        return Promise.resolve({
          data: {
            id: "m1234",
            measureScoring: MeasureScoring.CONTINUOUS_VARIABLE,
            groups: null,
          },
        });
      } else if (args && args.endsWith("series")) {
        return Promise.resolve({ data: ["SeriesA", "SeriesB", "SeriesC"] });
      }
      return Promise.resolve({ data: testCase });
    });

    renderWithRouter(
      ["/measures/m1234/edit/test-cases/1234"],
      "/measures/:measureId/edit/test-cases/:id",
      <CreateTestCase />
    );

    const errorMessage = await screen.findByText(
      "No populations for current scoring. Please make sure at least one measure group has been created."
    );
    expect(errorMessage).toBeInTheDocument();
  });

  it("should render 404 page", async () => {
    mockedAxios.get.mockClear().mockImplementation((args) => {
      return Promise.reject(
        new Error("Error: Request failed with status code 404")
      );
    });

    await act(async () => {
      render(
        <MemoryRouter
          initialEntries={["/measures/m1234/edit/test-cases/tc1234"]}
        >
          <ApiContextProvider value={serviceConfig}>
            <TestCaseRoutes />
          </ApiContextProvider>
        </MemoryRouter>
      );
    });

    expect(screen.getByTestId("404-page")).toBeInTheDocument();
    expect(screen.getByText("404 - Not Found!")).toBeInTheDocument();
    expect(screen.getByTestId("404-page-link")).toBeInTheDocument();
  });

  it("should render no text input and no create or update button if user is not the measure owner", async () => {
    mockedAxios.get.mockImplementation((args) => {
      if (args && args.startsWith(serviceConfig.measureService.baseUrl)) {
        return Promise.resolve({
          data: {
            id: "m1234",
            measureScoring: MeasureScoring.COHORT,
            createdBy: "AnotherUser",
            groups: [
              {
                groupId: "Group1_ID",
                scoring: "Cohort",
                population: {
                  initialPopulation: "Pop1",
                },
              },
            ],
            measurementPeriodStart: "2023-01-01",
            measurementPeriodEnd: "2023-12-31",
          },
        });
      } else if (args && args.endsWith("series")) {
        return Promise.resolve({ data: ["SeriesA"] });
      }
      return Promise.resolve({ data: null });
    });

    renderWithRouter(
      ["/measures/m1234/edit/test-cases/create"],
      "/measures/:measureId/edit/test-cases/create",
      <CreateTestCase />
    );
    const editor = screen.getByTestId("test-case-editor");

    await waitFor(
      () => {
        expect(
          screen.queryByTestId("create-test-case-title")
        ).not.toBeInTheDocument();
        expect(
          screen.queryByTestId("create-test-case-description")
        ).not.toBeInTheDocument();
        expect(
          screen.queryByTestId("create-test-case-series")
        ).not.toBeInTheDocument();
        expect(
          screen.queryByRole("button", { name: "Create Test Case" })
        ).not.toBeInTheDocument();
      },
      { timeout: 1500 }
    );
    expect(
      screen.queryByRole("button", { name: "Cancel" })
    ).not.toBeInTheDocument();

    expect(editor).toBeInTheDocument();
  });
});

describe("Measure Calculation", () => {
  it("calculates a measure against a test case", async () => {
    const calculationSrv = calculationService();
    const calculationResults: ExecutionResult[] =
      await calculationSrv.calculateTestCases(simpleMeasureFixture, [
        testCaseFixture,
      ]);
    expect(calculationResults).toHaveLength(1);
    expect(calculationResults[0].detailedResults).toHaveLength(1);

    const populationResults =
      calculationResults[0].detailedResults[0].populationResults;
    expect(populationResults).toHaveLength(3);
    expect(populationResults).toContainEqual({
      populationType: "initial-population",
      result: true,
    });
    expect(populationResults).toContainEqual({
      populationType: "denominator",
      result: true,
    });
    expect(populationResults).toContainEqual({
      populationType: "numerator",
      result: false,
    });
  });

  it("executes a test case successfully when test case resources are valid", async () => {
    mockedAxios.get.mockClear().mockImplementation((args) => {
      if (args && args.startsWith(serviceConfig.measureService.baseUrl)) {
        return Promise.resolve({ data: simpleMeasureFixture });
      } else if (args && args.endsWith("series")) {
        return Promise.resolve({ data: ["DENOM_Pass", "NUMER_Pass"] });
      }
      return Promise.resolve({ data: testCaseFixture });
    });

    renderWithRouter(
      [
        "/measures/623cacebe74613783378c17b/edit/test-cases/623cacffe74613783378c17c",
      ],
      "/measures/:measureId/edit/test-cases/:id",
      <CreateTestCase />
    );
    userEvent.click(await screen.findByRole("button", { name: "Run Test" }));
    const debugOutput = await screen.findByText(
      "Population Group: population-group-1"
    );
    expect(debugOutput).toBeInTheDocument();
  });

  it("executes a test case and shows the errors for invalid test case json", async () => {
    const testCase = {
      id: "1234",
      description: "Test IPP",
      series: "SeriesA",
      json: '{ "resourceType": "Bundle", "type": "collection", "entry": [] }',
      groupPopulations: null,
    } as TestCase;
    mockedAxios.get.mockClear().mockImplementation((args) => {
      if (args && args.startsWith(serviceConfig.measureService.baseUrl)) {
        return Promise.resolve({ data: simpleMeasureFixture });
      } else if (args && args.endsWith("series")) {
        return Promise.resolve({ data: ["DENOM_Pass", "NUMER_Pass"] });
      }
      return Promise.resolve({
        data: testCase,
      });
    });

    renderWithRouter(
      [
        "/measures/623cacebe74613783378c17b/edit/test-cases/623cacffe74613783378c17c",
      ],
      "/measures/:measureId/edit/test-cases/:id",
      <CreateTestCase />
    );
    userEvent.click(await screen.findByRole("button", { name: "Run Test" }));
    const debugOutput = await screen.findByText(
      "No entries found in passed patient bundles"
    );
    expect(debugOutput).toBeInTheDocument();
  });

  it("shows an error when trying to run the test case when Measure CQL errors exist", async () => {
    // measure with cqlErrors flag
    const testCase = {
      id: "623cacffe74613783378c17c",
      description: "Test IPP",
      series: "SeriesA",
      json: '{ "resourceType": "Bundle", "type": "collection", "entry": [] }',
      groupPopulations: null,
    } as TestCase;
    mockedAxios.get.mockClear().mockImplementation((args) => {
      if (args && args.startsWith(serviceConfig.measureService.baseUrl)) {
        return Promise.resolve({
          data: { ...simpleMeasureFixture, cqlErrors: true },
        });
      } else if (args && args.endsWith("series")) {
        return Promise.resolve({ data: ["DENOM_Pass", "NUMER_Pass"] });
      }
      return Promise.resolve({
        data: testCase,
      });
    });

    renderWithRouter(
      [
        "/measures/623cacebe74613783378c17b/edit/test-cases/623cacffe74613783378c17c",
      ],
      "/measures/:measureId/edit/test-cases/:id",
      <CreateTestCase />
    );
    userEvent.click(await screen.findByRole("button", { name: "Run Test" }));

    const debugOutput = await screen.findByText(
      "Cannot execute test case while errors exist in the measure CQL!"
    );
    expect(debugOutput).toBeInTheDocument();
  });
});
