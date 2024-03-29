import * as React from "react";
import {
  render,
  screen,
  waitFor,
  fireEvent,
  within,
} from "@testing-library/react";
import EditTestCase from "./EditTestCase";
import {
  Measure,
  MeasureScoring,
  Model,
  PopulationType,
  TestCase,
  AggregateFunctionType,
} from "@madie/madie-models";
import { act } from "react-dom/test-utils";
import { MemoryRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import { test } from "@jest/globals";
import { mockCqlWithAllCategoriesPresent } from "./mockCql";
import { ApiContextProvider, ServiceConfig } from "../../../api/ServiceContext";
import useTestCaseServiceApi, {
  TestCaseServiceApi,
} from "../../../api/useTestCaseServiceApi";
import { useFeatureFlags } from "@madie/madie-util";

import useCqmConversionService, {
  CqmConversionService,
} from "../../../api/CqmModelConversionService";
import { QdmExecutionContextProvider } from "../../routes/qdm/QdmExecutionContext";
import { QdmPatientProvider } from "../../../util/QdmPatientContext";
import { MadieError } from "../../../util/Utils";
import qdmCalculationService, {
  QdmCalculationService,
} from "../../../api/QdmCalculationService";
import useCqlParsingService, {
  CqlParsingService,
} from "../../../api/useCqlParsingService";
import { qdmCallStack } from "../groupCoverage/_mocks_/QdmCallStack";

const serviceConfig = {
  testCaseService: {
    baseUrl: "base.url",
  },
  measureService: {
    baseUrl: "base.url",
  },
  terminologyService: {
    baseUrl: "http.com",
  },
} as ServiceConfig;

const testCaseJson =
  "{\n" +
  '  "qdmVersion": "5.6",\n' +
  '  "dataElements": [\n' +
  "    {\n" +
  '      "dataElementCodes": [\n' +
  "        {\n" +
  '          "code": "F",\n' +
  '          "system": "2.16.840.1.113883.5.1",\n' +
  '          "version": "2022-11",\n' +
  '          "display": "Female"\n' +
  "        }\n" +
  "      ],\n" +
  '      "_id": "64de40efbaf96ab41f3c6092",\n' +
  '      "qdmTitle": "Patient Characteristic Sex",\n' +
  '      "hqmfOid": "2.16.840.1.113883.10.20.28.4.55",\n' +
  '      "qdmCategory": "patient_characteristic",\n' +
  '      "qdmStatus": "gender",\n' +
  '      "qdmVersion": "5.6",\n' +
  '      "_type": "QDM::PatientCharacteristicSex",\n' +
  '      "description": "Patient Characteristic Sex: ONCAdministrativeSex",\n' +
  '      "codeListId": "2.16.840.1.113762.1.4.1",\n' +
  '      "id": "64de40efbaf96ab41f3c6092"\n' +
  "    },\n" +
  "    {\n" +
  '      "dataElementCodes": [\n' +
  "        {\n" +
  '          "code": "21112-8",\n' +
  '          "system": "2.16.840.1.113883.6.1",\n' +
  '          "version": "2022-11",\n' +
  '          "display": "Birth date"\n' +
  "        }\n" +
  "      ],\n" +
  '      "_id": "64de40efbaf96ab41f3c6094",\n' +
  '      "qdmTitle": "Patient Characteristic Birthdate",\n' +
  '      "hqmfOid": "2.16.840.1.113883.10.20.28.4.54",\n' +
  '      "qdmCategory": "patient_characteristic",\n' +
  '      "qdmStatus": "birthdate",\n' +
  '      "qdmVersion": "5.6",\n' +
  '      "_type": "QDM::PatientCharacteristicBirthdate",\n' +
  '      "description": "Patient Characteristic Birthdate: Birth date",\n' +
  '      "birthDatetime": "1985-01-01T08:00:00.000+00:00",\n' +
  '      "codeListId": "drc-c48426f721cede4d865df946157d5e2dc90bd32763ffcb982ca45b3bd97a29db",\n' +
  '      "id": "64de40efbaf96ab41f3c6094"\n' +
  "    },\n" +
  "    {\n" +
  '      "dataElementCodes": [\n' +
  "        {\n" +
  '          "code": "2135-2",\n' +
  '          "system": "2.16.840.1.113883.6.238",\n' +
  '          "version": "1.2",\n' +
  '          "display": "Hispanic or Latino"\n' +
  "        }\n" +
  "      ],\n" +
  '      "_id": "64de40efbaf96ab41f3c6096",\n' +
  '      "qdmTitle": "Patient Characteristic Ethnicity",\n' +
  '      "hqmfOid": "2.16.840.1.113883.10.20.28.4.56",\n' +
  '      "qdmCategory": "patient_characteristic",\n' +
  '      "qdmStatus": "ethnicity",\n' +
  '      "qdmVersion": "5.6",\n' +
  '      "_type": "QDM::PatientCharacteristicEthnicity",\n' +
  '      "description": "Patient Characteristic Ethnicity: Ethnicity",\n' +
  '      "codeListId": "2.16.840.1.114222.4.11.837",\n' +
  '      "id": "64de40efbaf96ab41f3c6096"\n' +
  "    },\n" +
  "    {\n" +
  '      "dataElementCodes": [\n' +
  "        {\n" +
  '          "code": "2028-9",\n' +
  '          "system": "2.16.840.1.113883.6.238",\n' +
  '          "version": "1.2",\n' +
  '          "display": "Asian"\n' +
  "        }\n" +
  "      ],\n" +
  '      "_id": "64de40efbaf96ab41f3c6098",\n' +
  '      "qdmTitle": "Patient Characteristic Race",\n' +
  '      "hqmfOid": "2.16.840.1.113883.10.20.28.4.59",\n' +
  '      "qdmCategory": "patient_characteristic",\n' +
  '      "qdmStatus": "race",\n' +
  '      "qdmVersion": "5.6",\n' +
  '      "_type": "QDM::PatientCharacteristicRace",\n' +
  '      "description": "Patient Characteristic Race: Race",\n' +
  '      "codeListId": "2.16.840.1.114222.4.11.836",\n' +
  '      "id": "64de40efbaf96ab41f3c6098"\n' +
  "    }\n" +
  "  ],\n" +
  '  "_id": "646628cb235ff80000718c1a",\n' +
  '  "birthDatetime": "1985-01-01T08:00:00.000+00:00"\n' +
  "}";

const measureOwner = "testUser";

const testCase: TestCase = {
  id: "testid",
  title: "Test Case",
  series: "test series",
  description: "test description",
  createdBy: measureOwner,
  validResource: true,
  groupPopulations: [
    {
      groupId: "test_groupId",
      scoring: MeasureScoring.COHORT,
      populationBasis: "true",
      populationValues: [
        {
          id: "4f0a1989-205f-45df-a476-8e19999d21c7",
          name: PopulationType.INITIAL_POPULATION,
          expected: true,
        },
      ],
      stratificationValues: [],
    },
  ],
} as unknown as TestCase;

const mockMeasure = {
  id: "testmeasureid",
  scoring: MeasureScoring.COHORT,
  model: Model.QDM_5_6,
  createdBy: "testUserOwner",
  patientBasis: true,
  cql: mockCqlWithAllCategoriesPresent,
  groups: [
    {
      id: "test_groupId",
      scoring: MeasureScoring.COHORT,
      populations: [
        {
          id: "4f0a1989-205f-45df-a476-8e19999d21c7",
          name: PopulationType.INITIAL_POPULATION,
          definition: "IP",
        },
      ],
      populationBasis: "true",
      stratifications: [
        {
          cqlDefinition: "Initial Population",
          description: "",
          id: "strat-1",
        },
      ],
      measureObservations: [
        {
          aggregateMethod: AggregateFunctionType.AVERAGE,
          criteriaReference: "id-2",
          definition: "test",
          description: "",
          id: "observ-1",
        },
      ],
    },
  ],
} as Measure;

const testTitle = async (title: string, clear = false) => {
  const tcTitle = await screen.findByTestId("test-case-title");
  expect(tcTitle).toBeInTheDocument();
  if (clear) {
    userEvent.clear(tcTitle);
    await waitFor(() => {
      expect(tcTitle).toHaveValue("");
    });
  }
  userEvent.type(tcTitle, title);
  await waitFor(() => {
    expect(tcTitle).toHaveValue(title);
  });
};

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: () => ({
    measureId: "testmeasureid",
    id: "testid",
  }),
  useNavigate: () => mockNavigate,
}));
// mocking cqm api
jest.mock("../../../api/CqmModelConversionService");
const CQMConversionMock =
  useCqmConversionService as unknown as jest.Mock<TestCaseServiceApi>;
const useCqmConversionServiceMockResolved = {
  fetchRelevantDataElements: jest.fn().mockResolvedValue([
    {
      qdmCategory: "symptom",
      _type: "",
      qdmStatus: "Encounter",
      description: "Allergy/Intolerance: Observation Services",
    },
    {
      _type: "QDM::AllergyIntolerance",
      qdmCategory: "allergy",
      qdmStatus: "Encounter",
      description: "Allergy/Intolerance: Observation Services",
    },
    {
      _type: "QDM::EncounterPerformed",
      qdmCategory: "device",
      qdmStatus: "Encounter",
      description: "Allergy/Intolerance: Observation Services",
    },
  ]),
} as unknown as TestCaseServiceApi;

jest.mock("../../../api/useTestCaseServiceApi");
const useTestCaseServiceMock =
  useTestCaseServiceApi as jest.Mock<TestCaseServiceApi>;
const useTestCaseServiceMockResolved = {
  getTestCase: jest.fn().mockResolvedValue(testCase),
  getTestCaseSeriesForMeasure: jest
    .fn()
    .mockResolvedValue(["Series 1", "Series 2"]),
  updateTestCase: jest.fn().mockResolvedValue(testCase),
} as unknown as TestCaseServiceApi;

const useTestCaseServiceMockRejectedGetTestCase = {
  getTestCase: jest.fn().mockRejectedValue("404"),
} as unknown as TestCaseServiceApi;

const useTestCaseServiceMockResolvedWithTestCaseJson = {
  getTestCase: jest.fn().mockResolvedValue({ ...testCase, json: testCaseJson }),
  updateTestCase: jest.fn().mockResolvedValue(testCase),
} as unknown as TestCaseServiceApi;

const useTestCaseServiceMockRejected = {
  getTestCase: jest.fn().mockResolvedValue(testCase),
  getTestCaseSeriesForMeasure: jest
    .fn()
    .mockResolvedValue(["Series 1", "Series 2"]),
  updateTestCase: jest.fn().mockRejectedValueOnce({
    data: {
      error: "error",
    },
  }),
} as unknown as TestCaseServiceApi;
const nonUniqNameData: MadieError = new MadieError("Error Msg");

const useTestCaseServiceMockRejectedNonUniqueName = {
  getTestCase: jest.fn().mockResolvedValue(testCase),
  getTestCaseSeriesForMeasure: jest
    .fn()
    .mockResolvedValue(["Series 1", "Series 2"]),
  updateTestCase: jest.fn().mockRejectedValueOnce(nonUniqNameData),
} as unknown as TestCaseServiceApi;
let mockApplyDefaults = false;
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

jest.mock("../../../api/QdmCalculationService");
const qdmCalculationServiceMock =
  qdmCalculationService as jest.Mock<QdmCalculationService>;

const qdmExecutionResults = {
  // patient with id "1"
  testid: {
    // group / population set with id "1"
    test_groupId: {
      IPP: 1,
      episodeResults: {},
    },
  },
};

jest.mock("../../../api/useCqlParsingService");
const useCqlParsingServiceMock =
  useCqlParsingService as jest.Mock<CqlParsingService>;

const useCqlParsingServiceMockResolved = {
  getAllDefinitionsAndFunctions: jest.fn().mockResolvedValue(qdmCallStack),
  getDefinitionCallstacks: jest.fn().mockResolvedValue(qdmCallStack),
} as unknown as CqlParsingService;

const mockProcessTestCaseResults = jest.fn().mockImplementation(() => {
  return {
    ...testCase,
    groupPopulations: [
      {
        groupId: "test_groupId",
        scoring: MeasureScoring.COHORT,
        populationBasis: "true",
        populationValues: [
          {
            id: "4f0a1989-205f-45df-a476-8e19999d21c7",
            name: PopulationType.INITIAL_POPULATION,
            expected: true,
            actual: true,
          },
        ],
        stratificationValues: [],
      },
    ],
  };
});

const qdmCalculationServiceMockResolved = {
  calculateQdmTestCases: jest.fn().mockResolvedValue(qdmExecutionResults),
  processTestCaseResults: mockProcessTestCaseResults,
  qdmFakeFunction: jest.fn(),
} as unknown as QdmCalculationService;

jest.mock("@madie/madie-util", () => ({
  useDocumentTitle: jest.fn(),
  useFeatureFlags: jest.fn(() => {
    return {
      applyDefaults: mockApplyDefaults,
      qdmHideJson: false,
    };
  }),
  measureStore: {
    updateMeasure: jest.fn((measure) => measure),
    state: jest.fn().mockImplementation(() => mockMeasure),
    initialState: null,
    subscribe: (set) => {
      set(mockMeasure);
      return { unsubscribe: () => null };
    },
    unsubscribe: () => null,
  },
  useOktaTokens: jest.fn(() => ({
    getAccessToken: () => "test.jwt",
  })),
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

const { findByTestId, findByText, queryByTestId, queryByText } = screen;
const measure = mockMeasure;
const setMeasure = jest.fn();
const setCqmMeasure = jest.fn;
const getAccessToken = jest.fn();
let cqmConversionService = new CqmConversionService("url", getAccessToken);
const cqmMeasure = cqmConversionService.convertToCqmMeasure(mockMeasure);

const renderEditTestCaseComponent = () => {
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
          }}
        >
          <EditTestCase />
        </QdmExecutionContextProvider>
      </ApiContextProvider>
    </MemoryRouter>
  );
};

describe("ElementsTab", () => {
  useTestCaseServiceMock.mockImplementation(() => {
    return useTestCaseServiceMockResolved;
  });
  useCqlParsingServiceMock.mockImplementation(() => {
    return useCqlParsingServiceMockResolved;
  });

  test("Icons present and navigate correctly.", async () => {
    CQMConversionMock.mockImplementation(() => {
      return useCqmConversionServiceMockResolved;
    });
    await waitFor(() => renderEditTestCaseComponent());
    const json = await findByText("JSON");
    // const elements = await findByText("Elements"); // this doesn't work?
    const elements = await findByTestId("json-tab");

    act(() => {
      fireEvent.click(elements);
    });
    await waitFor(() => {
      expect(elements).toHaveAttribute("aria-selected", "true");
    });

    act(() => {
      fireEvent.click(json);
    });
    await waitFor(() => {
      expect(json).toHaveAttribute("aria-selected", "true");
    });
  });

  test("JSON tab is disabled with feature flag qdmHideJson being true", async () => {
    CQMConversionMock.mockImplementation(() => {
      return useCqmConversionServiceMockResolved;
    });
    (useFeatureFlags as jest.Mock).mockClear().mockImplementation(() => {
      return {
        qdmHideJson: true,
      };
    });
    await waitFor(() => renderEditTestCaseComponent());
    const json = await queryByText("JSON");
    const elements = await queryByTestId("json-tab");
    expect(json).not.toBeInTheDocument();
    expect(elements).not.toBeInTheDocument();
  });
});

test("LeftPanel navigation works as expected.", async () => {
  CQMConversionMock.mockImplementation(() => {
    return useCqmConversionServiceMockResolved;
  });
  useCqlParsingServiceMock.mockImplementation(() => {
    return useCqlParsingServiceMockResolved;
  });
  await waitFor(() => renderEditTestCaseComponent());
  const symptom = await findByTestId("elements-tab-symptom");
  await waitFor(() => {
    expect(symptom).toBeInTheDocument();
  });

  const allergy = await findByText("Allergy");
  await waitFor(() => {
    expect(allergy).toBeInTheDocument();
  });
  // elements-tab-allergy

  const device = await findByText("Device");
  await waitFor(() => {
    expect(device).toBeInTheDocument();
  });
  expect(allergy).toHaveAttribute("aria-selected", "true");
  act(() => {
    fireEvent.click(device);
  });
  await waitFor(() => {
    expect(device).toHaveAttribute("aria-selected", "true");
  });
});

describe("EditTestCase QDM Component", () => {
  const { getByRole, findByTestId, findByText } = screen;

  beforeEach(() => {
    useTestCaseServiceMock.mockImplementation(() => {
      return useTestCaseServiceMockResolved;
    });
    qdmCalculationServiceMock.mockImplementation(() => {
      return qdmCalculationServiceMockResolved;
    });
    CQMConversionMock.mockImplementation(() => {
      return useCqmConversionServiceMockResolved;
    });
    useCqlParsingServiceMock.mockImplementation(() => {
      return useCqlParsingServiceMockResolved;
    });

    (useFeatureFlags as jest.Mock).mockClear().mockImplementation(() => {
      return {
        applyDefaults: mockApplyDefaults,
      };
    });
  });

  it("should run qdm test case", async () => {
    await waitFor(() => renderEditTestCaseComponent());
    const runTestCaseButton = await getByRole("button", {
      name: "Run Test",
    });
    expect(runTestCaseButton).toBeInTheDocument();

    expect(runTestCaseButton).not.toBeDisabled();
    expect(getByRole("button", { name: "Save" })).toBeDisabled();
    expect(getByRole("button", { name: "Discard Changes" })).toBeDisabled();

    userEvent.click(runTestCaseButton);

    userEvent.click(getByRole("tab", { name: "Expected or Actual tab panel" }));
    expect(
      await screen.findByText("Measure Group 1", {}, { timeout: 3000 })
    ).toBeInTheDocument();

    const actualResult = await screen.findByTestId(
      "test-population-initialPopulation-actual"
    ); // it has no name
    await waitFor(() => expect(actualResult).toBeChecked());
  });

  it("should see that the JSON changed", async () => {
    await waitFor(() => renderEditTestCaseComponent());
    const runTestCaseButton = await getByRole("button", {
      name: "Run Test",
    });
    expect(runTestCaseButton).toBeInTheDocument();
    expect(getByRole("button", { name: "Save" })).toBeDisabled();
    expect(getByRole("button", { name: "Discard Changes" })).toBeDisabled();
    const raceInput = screen.getByTestId(
      "demographics-race-input"
    ) as HTMLInputElement;
    expect(raceInput).toBeInTheDocument();
    expect(raceInput.value).not.toBe("White");
    fireEvent.change(raceInput, {
      target: { value: "White" },
    });
    expect(raceInput.value).toBe("White");
    await waitFor(() =>
      expect(getByRole("button", { name: "Save" })).not.toBeDisabled()
    );
    expect(getByRole("button", { name: "Discard Changes" })).not.toBeDisabled();
    expect(runTestCaseButton).not.toBeDisabled();
    userEvent.click(runTestCaseButton);
  });

  it("should render qdm edit test case component along with action buttons", async () => {
    await waitFor(() => renderEditTestCaseComponent());
    const runTestCaseButton = await getByRole("button", {
      name: "Run Test",
    });
    expect(runTestCaseButton).toBeInTheDocument();

    expect(getByRole("button", { name: "Save" })).toBeDisabled();
    expect(getByRole("button", { name: "Discard Changes" })).toBeDisabled();
  });

  it("should render group populations from DB", async () => {
    await waitFor(() => renderEditTestCaseComponent());

    const expectedActualTab = getByRole("tab", {
      name: "Expected or Actual tab panel",
    });
    userEvent.click(expectedActualTab);
    const ipCheckbox = (await findByTestId(
      "test-population-initialPopulation-expected"
    )) as HTMLInputElement;
    await waitFor(() => expect(ipCheckbox).toBeChecked());
  });

  it("should throw 404 when fetching a test case that doesn't exists in DB", async () => {
    useTestCaseServiceMock.mockImplementation(() => {
      return useTestCaseServiceMockRejectedGetTestCase;
    });

    await waitFor(() => renderEditTestCaseComponent());

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalled();
    });
  });

  it("should render group populations from DB and able to update the values and save test case", async () => {
    // line breaks in JSON cause Formik to think JSON has changed so use stringify to get rid of those
    testCase.json = JSON.stringify(JSON.parse(testCaseJson));
    mockedAxios.put.mockResolvedValueOnce(testCase);
    renderEditTestCaseComponent();

    const saveButton = getByRole("button", { name: "Save" });
    const expectedActualTab = getByRole("tab", {
      name: "Expected or Actual tab panel",
    });
    userEvent.click(expectedActualTab);
    const ipCheckbox = (await findByTestId(
      "test-population-initialPopulation-expected"
    )) as HTMLInputElement;
    await waitFor(() => expect(ipCheckbox).toBeChecked());

    userEvent.click(ipCheckbox);
    await waitFor(() => expect(ipCheckbox).not.toBeChecked());

    expect(saveButton).toBeEnabled();
    userEvent.click(saveButton);

    await waitFor(
      () => {
        expect(screen.getByTestId("success-toast")).toHaveTextContent(
          "Test Case Updated Successfully"
        );
      },
      { timeout: 1500 }
    );
  });

  it("should render qdm edit Demographics component with default values", () => {
    renderEditTestCaseComponent();

    const raceInput = screen.getByTestId(
      "demographics-race-input"
    ) as HTMLInputElement;
    expect(raceInput).toBeInTheDocument();
    expect(raceInput.value).toBe("");
    const genderInput = screen.getByTestId(
      "demographics-gender-input"
    ) as HTMLInputElement;
    expect(genderInput).toBeInTheDocument();
    expect(genderInput.value).toBe("");
    const livingStatusInput = screen.getByTestId(
      "demographics-living-status-input"
    ) as HTMLInputElement;
    expect(livingStatusInput).toBeInTheDocument();
    expect(livingStatusInput.value).toBe("Living");
  });

  it("should render qdm edit Demographics component with values from TestCase JSON", async () => {
    testCase.json = testCaseJson;
    renderEditTestCaseComponent();

    const raceInput = screen.getByTestId(
      "demographics-race-input"
    ) as HTMLInputElement;
    expect(raceInput).toBeInTheDocument();
    await waitFor(() => {
      expect(raceInput.value).toBe("Asian");
    });
    const genderInput = screen.getByTestId(
      "demographics-gender-input"
    ) as HTMLInputElement;
    expect(genderInput).toBeInTheDocument();
    expect(genderInput.value).toBe("Female");
    const livingStatusInput = screen.getByTestId(
      "demographics-living-status-input"
    ) as HTMLInputElement;
    expect(livingStatusInput).toBeInTheDocument();
    expect(livingStatusInput.value).toBe("Living");
  });

  it("discard button resets form", async () => {
    testCase.json = "";
    renderEditTestCaseComponent();
    const raceInput = screen.getByTestId(
      "demographics-race-input"
    ) as HTMLInputElement;
    expect(raceInput).toBeInTheDocument();
    expect(raceInput.value).toBe("");

    fireEvent.change(raceInput, {
      target: { value: "White" },
    });
    expect(raceInput.value).toBe("White");

    const genderInput = screen.getByTestId(
      "demographics-gender-input"
    ) as HTMLInputElement;
    expect(genderInput).toBeInTheDocument();
    expect(genderInput.value).toBe("");

    fireEvent.change(genderInput, {
      target: { value: "Male" },
    });
    expect(genderInput.value).toBe("Male");

    const discardButton = screen.getByTestId("ds-btn");
    expect(discardButton).toBeInTheDocument();
    expect(discardButton).not.toBeDisabled();
    fireEvent.click(discardButton);

    const discardConfirm = screen.getByTestId("discard-dialog-continue-button");
    expect(discardConfirm).toBeInTheDocument();
    expect(discardConfirm).not.toBeDisabled();
    fireEvent.click(discardConfirm);

    await waitFor(() => expect(raceInput.value).toBe(""));
    await waitFor(() => expect(genderInput.value).toBe(""));
    // expect(raceInput.value).toBe("");
    // expect(genderInput.value).toBe("");
  });

  it("test change dropwdown values", () => {
    renderEditTestCaseComponent();

    const raceInput = screen.getByTestId(
      "demographics-race-input"
    ) as HTMLInputElement;
    expect(raceInput).toBeInTheDocument();
    expect(raceInput.value).toBe("");

    fireEvent.change(raceInput, {
      target: { value: "White" },
    });
    expect(raceInput.value).toBe("White");

    const genderInput = screen.getByTestId(
      "demographics-gender-input"
    ) as HTMLInputElement;
    expect(genderInput).toBeInTheDocument();
    expect(genderInput.value).toBe("");

    fireEvent.change(genderInput, {
      target: { value: "Male" },
    });
    expect(genderInput.value).toBe("Male");

    const livingStatusInput = screen.getByTestId(
      "demographics-living-status-input"
    ) as HTMLInputElement;
    expect(livingStatusInput).toBeInTheDocument();
    expect(livingStatusInput.value).toBe("Living");

    fireEvent.change(livingStatusInput, {
      target: { value: "Expired" },
    });
    expect(livingStatusInput.value).toBe("Expired");
  });

  it("test update test case successfully with success toast", async () => {
    useTestCaseServiceMock.mockImplementation(() => {
      return useTestCaseServiceMockResolvedWithTestCaseJson;
    });

    await waitFor(() => renderEditTestCaseComponent());

    const raceInput = screen.getByTestId(
      "demographics-race-input"
    ) as HTMLInputElement;
    expect(raceInput).toBeInTheDocument();
    await waitFor(() => {
      expect(raceInput.value).toBe("Asian");
    });

    act(() => {
      fireEvent.change(raceInput, {
        target: { value: "White" },
      });
    });
    await waitFor(() => {
      expect(raceInput.value).toBe("White");
    });
    const genderInput = screen.getByTestId(
      "demographics-gender-input"
    ) as HTMLInputElement;
    expect(genderInput).toBeInTheDocument();
    fireEvent.change(genderInput, {
      target: { value: "Male" },
    });
    expect(genderInput.value).toBe("Male");

    const livingStatusInput = screen.getByTestId(
      "demographics-living-status-input"
    ) as HTMLInputElement;
    expect(livingStatusInput).toBeInTheDocument();
    expect(livingStatusInput.value).toBe("Living");

    fireEvent.change(livingStatusInput, {
      target: { value: "Expired" },
    });
    expect(livingStatusInput.value).toBe("Expired");

    const saveButton = getByRole("button", { name: "Save" });
    expect(saveButton).toBeEnabled();
    act(() => {
      fireEvent.click(saveButton);
    });

    await waitFor(() => {
      expect(screen.getByTestId("success-toast")).toHaveTextContent(
        "Test Case Updated Successfully"
      );
    });
  });
  it("test update test case fails with non-unique test name failure toast", async () => {
    testCase.json = testCaseJson;
    useTestCaseServiceMock.mockImplementation(() => {
      return useTestCaseServiceMockRejectedNonUniqueName;
    });
    renderEditTestCaseComponent();
    const saveTestCaseButton = await screen.getByRole("button", {
      name: "Save",
    });

    expect(saveTestCaseButton).toBeInTheDocument();
    const raceInput = screen.getByTestId(
      "demographics-race-input"
    ) as HTMLInputElement;
    expect(raceInput).toBeInTheDocument();
    expect(raceInput.value).toBe("");

    act(() => {
      fireEvent.change(raceInput, {
        target: { value: "Asian" },
      });
    });
    expect(raceInput.value).toBe("Asian");

    const genderInput = screen.getByTestId(
      "demographics-gender-input"
    ) as HTMLInputElement;
    expect(genderInput).toBeInTheDocument();
    expect(genderInput.value).toBe("Female");

    act(() => {
      fireEvent.change(genderInput, {
        target: { value: "Male" },
      });
    });
    expect(genderInput.value).toBe("Male");

    const livingStatusInput = screen.getByTestId(
      "demographics-living-status-input"
    ) as HTMLInputElement;
    expect(livingStatusInput).toBeInTheDocument();
    expect(livingStatusInput.value).toBe("Living");

    act(() => {
      fireEvent.change(livingStatusInput, {
        target: { value: "Expired" },
      });
    });
    expect(livingStatusInput.value).toBe("Expired");

    expect(saveTestCaseButton).toBeEnabled();
    act(() => {
      userEvent.click(saveTestCaseButton);
    });

    await waitFor(
      () => {
        expect(screen.getByTestId("error-toast")).toHaveTextContent(
          'Error updating Test Case "undefined": Error Msg'
        );
        const closeToastBtn = screen.getByTestId("close-toast-button");
        userEvent.click(closeToastBtn);
        expect(
          screen.queryByText("Error updating Test Case")
        ).not.toBeInTheDocument();
      },
      { timeout: 1500 }
    );
  });
  it("test update test case fails with failure toast", async () => {
    testCase.json = testCaseJson;
    useTestCaseServiceMock.mockImplementation(() => {
      return useTestCaseServiceMockRejected;
    });
    renderEditTestCaseComponent();
    const saveTestCaseButton = await screen.getByRole("button", {
      name: "Save",
    });

    expect(saveTestCaseButton).toBeInTheDocument();
    const raceInput = screen.getByTestId(
      "demographics-race-input"
    ) as HTMLInputElement;
    expect(raceInput).toBeInTheDocument();
    expect(raceInput.value).toBe("");

    act(() => {
      fireEvent.change(raceInput, {
        target: { value: "Asian" },
      });
    });
    expect(raceInput.value).toBe("Asian");

    const genderInput = screen.getByTestId(
      "demographics-gender-input"
    ) as HTMLInputElement;
    expect(genderInput).toBeInTheDocument();
    expect(genderInput.value).toBe("Female");

    act(() => {
      fireEvent.change(genderInput, {
        target: { value: "Male" },
      });
    });
    expect(genderInput.value).toBe("Male");

    const livingStatusInput = screen.getByTestId(
      "demographics-living-status-input"
    ) as HTMLInputElement;
    expect(livingStatusInput).toBeInTheDocument();
    expect(livingStatusInput.value).toBe("Living");

    act(() => {
      fireEvent.change(livingStatusInput, {
        target: { value: "Expired" },
      });
    });
    expect(livingStatusInput.value).toBe("Expired");

    expect(saveTestCaseButton).toBeEnabled();
    act(() => {
      userEvent.click(saveTestCaseButton);
    });

    await waitFor(
      () => {
        expect(screen.getByTestId("error-toast")).toHaveTextContent(
          "Error updating Test Case "
        );
        const closeToastBtn = screen.getByTestId("close-toast-button");
        userEvent.click(closeToastBtn);
        expect(
          screen.queryByText("Error updating Test Case")
        ).not.toBeInTheDocument();
      },
      { timeout: 1500 }
    );
  });

  it("RightPanel navigation works as expected.", async () => {
    renderEditTestCaseComponent();
    const highlighting = await findByText("Highlighting");
    const measureCql = await findByText("Measure CQL (View Only)");
    const expectedActual = await findByText("Expected / Actual");
    const details = await findByText("Details");

    act(() => {
      fireEvent.click(highlighting);
    });
    await waitFor(() => {
      expect(highlighting).toHaveAttribute("aria-selected", "true");
    });

    act(() => {
      fireEvent.click(expectedActual);
    });
    await waitFor(() => {
      expect(expectedActual).toHaveAttribute("aria-selected", "true");
    });

    act(() => {
      fireEvent.click(measureCql);
    });
    await waitFor(() => {
      expect(measureCql).toHaveAttribute("aria-selected", "true");
    });

    act(() => {
      fireEvent.click(details);
    });
    await waitFor(() => {
      expect(details).toHaveAttribute("aria-selected", "true");
    });
  });

  it("Should render the details tab with relevant information", async () => {
    testCase.json = testCaseJson;
    await waitFor(() => renderEditTestCaseComponent());

    const detailsTab = getByRole("tab", { name: "Details tab panel" });
    act(() => {
      fireEvent.click(detailsTab);
    });
    await waitFor(() => {
      expect(detailsTab).toHaveAttribute("aria-selected", "true");
    });
    // check title is as expected
    const tcTitle = await screen.findByTestId("test-case-title");
    expect(tcTitle).toHaveValue(testCase.title);

    const descriptionInput = screen.getByTestId("test-case-description");
    expect(descriptionInput).toHaveTextContent(testCase.description);

    const seriesInput = screen
      .getByTestId("test-case-series")
      .querySelector("input");
    expect(seriesInput).toHaveValue("test series");

    act(() => {
      userEvent.click(seriesInput);
    });
    const list = await screen.findByRole("listbox");
    expect(list).toBeInTheDocument();
    const listItems = within(list).getAllByRole("option");
    expect(listItems[1]).toHaveTextContent("Series 2");
    act(() => {
      userEvent.click(listItems[1]);
    });

    await testTitle("newtesttitle1", true);
    await waitFor(() => {
      const descriptionInput = screen.getByTestId("test-case-description");
      userEvent.type(descriptionInput, "testtestsetse");
    });

    const saveButton = getByRole("button", { name: "Save" });
    expect(saveButton).toBeEnabled();
    act(() => {
      fireEvent.click(saveButton);
    });

    await waitFor(() => {
      expect(screen.getByTestId("success-toast")).toHaveTextContent(
        "Test Case Updated Successfully"
      );
    });
  }, 30000);
});
