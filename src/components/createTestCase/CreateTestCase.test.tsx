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
import {
  Measure,
  MeasurePopulation,
  MeasureScoring,
  TestCase,
} from "@madie/madie-models";
import TestCaseRoutes from "../routes/TestCaseRoutes";
import { act } from "react-dom/test-utils";
import calculationService from "../../api/CalculationService";
import { simpleMeasureFixture } from "./__mocks__/simpleMeasureFixture";
import { testCaseFixture } from "./__mocks__/testCaseFixture";
import { ExecutionResult } from "fqm-execution/build/types/Calculator";
import {
  buildMeasureBundle,
  getExampleValueSet,
} from "../../util/CalculationTestHelpers";
import { ExecutionContextProvider } from "../routes/ExecutionContext";
import { ChangeEvent } from "react";

//temporary solution (after jest updated to version 27) for error: thrown: "Exceeded timeout of 5000 ms for a test.
jest.setTimeout(60000);

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

// mock editor to reduce errors and warnings
const mockEditor = { resize: jest.fn() };
jest.mock("../editor/Editor", () => ({ setEditor, value, onChange }) => {
  const React = require("react");
  React.useEffect(() => {
    if (setEditor) {
      setEditor(mockEditor);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <input
      data-testid="test-case-editor"
      value={value}
      onChange={(e: ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value);
      }}
    />
  );
});

const serviceConfig: ServiceConfig = {
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
jest.mock("../../hooks/useOktaTokens", () =>
  jest.fn(() => ({
    getAccessToken: () => "test.jwt",
    getUserName: () => MEASURE_CREATEDBY,
  }))
);

const defaultMeasure = {
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
} as unknown as Measure;
const measureBundle = buildMeasureBundle(simpleMeasureFixture);
const valueSets = [getExampleValueSet()];
const setMeasure = jest.fn();
const setMeasureBundle = jest.fn();
const setValueSets = jest.fn();

const renderWithRouter = (
  initialEntries = [],
  routePath: string,
  measure: Measure = defaultMeasure
) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <ApiContextProvider value={serviceConfig}>
        <ExecutionContextProvider
          value={{
            measureState: [measure, setMeasure],
            bundleState: [measureBundle, setMeasureBundle],
            valueSetsState: [valueSets, setValueSets],
          }}
        >
          <Routes>
            <Route path={routePath} element={<CreateTestCase />} />
          </Routes>
        </ExecutionContextProvider>
      </ApiContextProvider>
    </MemoryRouter>
  );
};

describe("CreateTestCase component", () => {
  beforeEach(() => {
    mockedAxios.get.mockImplementation((args) => {
      if (args && args.endsWith("series")) {
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
      "/measures/:measureId/edit/test-cases/create"
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
      "/measures/:measureId/edit/test-cases/create"
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

  it("should give a warning message when Id is present in the JSON while creating a test case", async () => {
    renderWithRouter(
      ["/measures/m1234/edit/test-cases/create"],
      "/measures/:measureId/edit/test-cases/create"
    );

    const testCaseDescription = "TestCase123";
    const testCaseTitle = "TestTitle";
    const testCaseJson = JSON.stringify({
      resourceType: "Bundle",
      id: "43",
      meta: {
        versionId: "1",
        lastUpdated: "2022-06-03T12:33:15.459+00:00",
      },
      type: "collection",
      entry: [
        {
          fullUrl: "http://local/Encounter",
          resource: {
            resourceType: "Encounter",
            meta: {
              versionId: "1",
              lastUpdated: "2021-10-13T03:34:10.160+00:00",
              source: "#nEcAkGd8PRwPP5fA",
            },
            text: {
              status: "generated",
              div: '<div xmlns="http://www.w3.org/1999/xhtml">Sep 9th 2021 for Asthma<a name="mm"/></div>',
            },
            status: "finished",
            class: {
              system: "http://terminology.hl7.org/CodeSystem/v3-ActCode",
              code: "IMP",
              display: "inpatient encounter",
            },
            type: [
              {
                text: "OutPatient",
              },
            ],
            subject: {
              reference: "Patient/1",
            },
            participant: [
              {
                individual: {
                  reference: "Practitioner/30164",
                  display: "Dr John Doe",
                },
              },
            ],
            period: {
              start: "2023-09-10T03:34:10.054Z",
            },
          },
        },
        {
          fullUrl: "http://local/Patient",
          resource: {
            resourceType: "Patient",
            text: {
              status: "generated",
              div: '<div xmlns="http://www.w3.org/1999/xhtml">Lizzy Health</div>',
            },
            identifier: [
              {
                system: "http://clinfhir.com/fhir/NamingSystem/identifier",
                value: "20181011LizzyHealth",
              },
            ],
            name: [
              {
                use: "official",
                text: "Lizzy Health",
                family: "Health",
                given: ["Lizzy"],
              },
            ],
            gender: "female",
            birthDate: "2000-10-11",
          },
        },
      ],
    });

    mockedAxios.post.mockResolvedValue({
      data: {
        id: "testID",
        createdBy: MEASURE_CREATEDBY,
        description: testCaseDescription,
        title: testCaseTitle,
        json: testCaseJson,
        hapiOperationOutcome: {
          code: 200,
        },
      },
    });

    const editor = screen.getByTestId("test-case-editor");
    userEvent.paste(editor, testCaseJson);
    expect(editor).toHaveValue(testCaseJson);

    const createBtn = await screen.findByRole("button", {
      name: "Create Test Case",
    });
    userEvent.click(createBtn);

    const debugOutput = await screen.findByText(
      "Test case created successfully! Bundle IDs are auto generated on save. MADiE has over written the ID provided"
    );
    expect(debugOutput).toBeInTheDocument();
  });

  it("should give a warning message when Id is not present in the JSON while creating a test case", async () => {
    renderWithRouter(
      ["/measures/m1234/edit/test-cases/create"],
      "/measures/:measureId/edit/test-cases/create"
    );

    const testCaseDescription = "TestCase123";
    const testCaseTitle = "TestTitle";
    const testCaseJson = JSON.stringify({
      resourceType: "Bundle",
      meta: {
        versionId: "1",
        lastUpdated: "2022-06-03T12:33:15.459+00:00",
      },
      type: "collection",
      entry: [
        {
          fullUrl: "http://local/Encounter",
          resource: {
            resourceType: "Encounter",
            meta: {
              versionId: "1",
              lastUpdated: "2021-10-13T03:34:10.160+00:00",
              source: "#nEcAkGd8PRwPP5fA",
            },
            text: {
              status: "generated",
              div: '<div xmlns="http://www.w3.org/1999/xhtml">Sep 9th 2021 for Asthma<a name="mm"/></div>',
            },
            status: "finished",
            class: {
              system: "http://terminology.hl7.org/CodeSystem/v3-ActCode",
              code: "IMP",
              display: "inpatient encounter",
            },
            type: [
              {
                text: "OutPatient",
              },
            ],
            subject: {
              reference: "Patient/1",
            },
            participant: [
              {
                individual: {
                  reference: "Practitioner/30164",
                  display: "Dr John Doe",
                },
              },
            ],
            period: {
              start: "2023-09-10T03:34:10.054Z",
            },
          },
        },
        {
          fullUrl: "http://local/Patient",
          resource: {
            resourceType: "Patient",
            text: {
              status: "generated",
              div: '<div xmlns="http://www.w3.org/1999/xhtml">Lizzy Health</div>',
            },
            identifier: [
              {
                system: "http://clinfhir.com/fhir/NamingSystem/identifier",
                value: "20181011LizzyHealth",
              },
            ],
            name: [
              {
                use: "official",
                text: "Lizzy Health",
                family: "Health",
                given: ["Lizzy"],
              },
            ],
            gender: "female",
            birthDate: "2000-10-11",
          },
        },
      ],
    });

    mockedAxios.post.mockResolvedValue({
      data: {
        id: "testID",
        createdBy: MEASURE_CREATEDBY,
        description: testCaseDescription,
        title: testCaseTitle,
        json: testCaseJson,
        hapiOperationOutcome: {
          code: 200,
        },
      },
    });

    const editor = screen.getByTestId("test-case-editor");
    userEvent.paste(editor, testCaseJson);
    expect(editor).toHaveValue(testCaseJson);

    const createBtn = await screen.findByRole("button", {
      name: "Create Test Case",
    });
    userEvent.click(createBtn);

    const debugOutput = await screen.findByText(
      "Test case created successfully! Bundle ID has been auto generated"
    );
    expect(debugOutput).toBeInTheDocument();
  });

  it("should provide user alert when create test case fails", async () => {
    renderWithRouter(
      ["/measures/m1234/edit/test-cases/create"],
      "/measures/:measureId/edit/test-cases/create"
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
      "/measures/:measureId/edit/test-cases/create"
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
      "/measures/:measureId/edit/test-cases/create"
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
      "/measures/:measureId/edit/test-cases/:id"
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
    } as unknown as TestCase;
    const testCaseDescription = "modified description";
    mockedAxios.get.mockClear().mockImplementation((args) => {
      if (args && args.endsWith("series")) {
        return Promise.resolve({ data: ["SeriesA", "SeriesB", "SeriesC"] });
      }
      return Promise.resolve({ data: testCase });
    });
    const measure = {
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
    } as Measure;

    renderWithRouter(
      ["/measures/m1234/edit/test-cases/1234"],
      "/measures/:measureId/edit/test-cases/:id",
      measure
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
      "/measures/:measureId/edit/test-cases/:id"
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
      "/measures/:measureId/edit/test-cases/:id"
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

    expect(
      screen.getByRole("button", { name: "Update Test Case" })
    ).toBeEnabled();

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
      "/measures/:measureId/edit/test-cases/:id"
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
      "/measures/:measureId/edit/test-cases/create"
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
      "/measures/:measureId/edit/test-cases/create"
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
      "/measures/:measureId/edit/test-cases/create"
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
          },
        });
      } else if (args && args.endsWith("series")) {
        return Promise.reject(axiosError);
      }
      return Promise.resolve({ data: null });
    });

    renderWithRouter(
      ["/measures/m1234/edit/test-cases/create"],
      "/measures/:measureId/edit/test-cases/create"
    );

    const debugOutput = await screen.findByText(
      "Measure does not exist, unable to load test case series!"
    );
    expect(debugOutput).toBeInTheDocument();
  });

  it("should generate field level error for test case title more than 250 characters", async () => {
    renderWithRouter(
      ["/measures/m1234/edit/test-cases/create"],
      "/measures/:measureId/edit/test-cases/create"
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
      "/measures/:measureId/edit/test-cases/create"
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
      "/measures/:measureId/edit/test-cases/create"
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
      "/measures/:measureId/edit/test-cases/create"
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
      "/measures/:measureId/edit/test-cases/:id"
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
      "/measures/:measureId/edit/test-cases/:id"
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
          },
        });
      } else if (args && args.endsWith("series")) {
        return Promise.resolve({ data: ["SeriesA", "SeriesB", "SeriesC"] });
      }
      return Promise.resolve({ data: testCase });
    });

    renderWithRouter(
      ["/measures/m1234/edit/test-cases/1234"],
      "/measures/:measureId/edit/test-cases/:id"
    );

    const ippRow = await screen.findByTestId(
      "test-row-population-id-initialPopulation"
    );
    expect(ippRow).toBeInTheDocument();
  });

  it("should show message and disable run button when no groups are present", async () => {
    const testCase = {
      id: "1234",
      description: "Test IPP",
      series: "SeriesA",
      json: `{"test":"test"}`,
      groupPopulations: null,
    } as TestCase;
    mockedAxios.get.mockClear().mockImplementation((args) => {
      if (args && args.endsWith("series")) {
        return Promise.resolve({ data: ["SeriesA", "SeriesB", "SeriesC"] });
      }
      return Promise.resolve({ data: testCase });
    });
    const measure = { ...defaultMeasure, groups: null };
    renderWithRouter(
      ["/measures/m1234/edit/test-cases/1234"],
      "/measures/:measureId/edit/test-cases/:id",
      measure
    );

    const errorMessage = await screen.findByText(
      "No populations for current scoring. Please make sure at least one measure group has been created."
    );
    expect(errorMessage).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Run Test" })).toBeDisabled();
  });

  it("should render 404 page", async () => {
    mockedAxios.get.mockClear().mockImplementation(() => {
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
      if (args && args.endsWith("series")) {
        return Promise.resolve({ data: ["SeriesA"] });
      }
      return Promise.resolve({ data: null });
    });

    const measure = { ...defaultMeasure, createdBy: "AnotherUser" };

    renderWithRouter(
      ["/measures/m1234/edit/test-cases/create"],
      "/measures/:measureId/edit/test-cases/create",
      measure
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
describe("Measure Calculation ", () => {
  it("calculates a measure against a test case", async () => {
    const calculationSrv = calculationService();
    const calculationResults: ExecutionResult<any>[] =
      await calculationSrv.calculateTestCases(
        simpleMeasureFixture,
        [testCaseFixture],
        buildMeasureBundle(simpleMeasureFixture),
        []
      );
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

  it("executes a test case and shows the errors for invalid test case json", async () => {
    const testCase = {
      id: "1234",
      title: "A Test Case",
      description: "Test IPP",
      series: "SeriesA",
      createdBy: MEASURE_CREATEDBY,
      json: '{ "resourceType": "Bundle", "type": "collection", "entry": [] }',
      groupPopulations: null,
    } as TestCase;
    mockedAxios.get.mockClear().mockImplementation((args) => {
      if (args && args.endsWith("/bundles")) {
        return Promise.resolve({
          data: buildMeasureBundle(simpleMeasureFixture),
        });
      } else if (
        args &&
        args.startsWith(serviceConfig.measureService.baseUrl)
      ) {
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
      "/measures/:measureId/edit/test-cases/:id"
    );
    const updateButton = await screen.findByRole("button", {
      name: "Update Test Case",
    });
    expect(updateButton).toBeInTheDocument();
    const runButton = await screen.findByRole("button", { name: "Run Test" });
    await waitFor(() => expect(runButton).toBeEnabled(), { timeout: 5000 });
    userEvent.click(runButton);
    const debugOutput = await screen.findByText(
      "No entries found in passed patient bundles"
    );
    expect(debugOutput).toBeInTheDocument();
  });

  it("executes a test case successfully when test case resources are valid", async () => {
    mockedAxios.get.mockClear().mockImplementation((args) => {
      if (args && args.endsWith("series")) {
        return Promise.resolve({ data: ["DENOM_Pass", "NUMER_Pass"] });
      }
      return Promise.resolve({
        data: { ...testCaseFixture, createdBy: MEASURE_CREATEDBY },
      });
    });
    const measure = { ...simpleMeasureFixture, createdBy: MEASURE_CREATEDBY };
    renderWithRouter(
      [
        "/measures/623cacebe74613783378c17b/edit/test-cases/623cacffe74613783378c17c",
      ],
      "/measures/:measureId/edit/test-cases/:id",
      measure
    );

    expect(
      await screen.findByRole("button", {
        name: "Update Test Case",
      })
    ).toBeInTheDocument();

    await waitFor(async () => {
      userEvent.click(await screen.findByRole("button", { name: "Run Test" }));
    });
    expect(
      await screen.findByText("Population Group: population-group-1")
    ).toBeInTheDocument();

    expect(
      await screen.findByTestId("test-population-initialPopulation-actual")
    ).toBeChecked();
    expect(
      screen.getByTestId("test-population-numerator-actual")
    ).not.toBeChecked();
  });

  it("disables button to run the test case when Measure CQL errors exist", async () => {
    // measure with cqlErrors flag
    const testCase = {
      id: "623cacffe74613783378c17c",
      description: "Test IPP",
      series: "SeriesA",
      createdBy: MEASURE_CREATEDBY,
      json: '{ "resourceType": "Bundle", "type": "collection", "entry": [] }',
      groupPopulations: null,
    } as TestCase;
    mockedAxios.get.mockClear().mockImplementation((args) => {
      if (args && args.endsWith("series")) {
        return Promise.resolve({ data: ["DENOM_Pass", "NUMER_Pass"] });
      }
      return Promise.resolve({
        data: testCase,
      });
    });
    const measure = { ...simpleMeasureFixture, cqlErrors: true };
    renderWithRouter(
      [
        "/measures/623cacebe74613783378c17b/edit/test-cases/623cacffe74613783378c17c",
      ],
      "/measures/:measureId/edit/test-cases/:id",
      measure
    );

    expect(
      await screen.findByRole("button", {
        name: "Update Test Case",
      })
    ).toBeInTheDocument();
    const runButton = await screen.findByRole("button", { name: "Run Test" });
    expect(runButton).toBeDisabled();
  });
});
