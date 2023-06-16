import * as React from "react";
import {
  render,
  screen,
  waitFor,
  fireEvent,
  within,
  // findByTestId,
} from "@testing-library/react";
import EditTestCase from "./EditTestCase";
import {
  Measure,
  MeasureScoring,
  Model,
  PopulationType,
  TestCase,
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

import useCqmConversionService, {
  CqmConversionService,
} from "../../../api/CqmModelConversionService";

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

const testCaseJson =
  "{\n" +
  '   "qdmVersion":"5.6",\n' +
  '   "dataElements":[\n' +
  "      {\n" +
  '         "dataElementCodes":[\n' +
  "            {\n" +
  '               "code":"F",\n' +
  '               "system":"2.16.840.1.113883.5.1",\n' +
  '               "version":"2022-11",\n' +
  '               "display":"Female"\n' +
  "            }\n" +
  "         ],\n" +
  '         "qdmTitle":"Patient Characteristic Sex",\n' +
  '         "hqmfOid":"2.16.840.1.113883.10.20.28.4.55",\n' +
  '         "qdmCategory":"patient_characteristic",\n' +
  '         "qdmStatus":"gender",\n' +
  '         "qdmVersion":"5.6",\n' +
  '         "_type":"QDM::PatientCharacteristicSex",\n' +
  '         "description":"Patient Characteristic Sex: ONCAdministrativeSex",\n' +
  '         "codeListId":"2.16.840.1.113762.1.4.1"\n' +
  "      },\n" +
  "      {\n" +
  '         "dataElementCodes":[\n' +
  "            {\n" +
  '               "code":"21112-8",\n' +
  '               "system":"2.16.840.1.113883.6.1",\n' +
  '               "version":"2022-11",\n' +
  '               "display":"Birth date"\n' +
  "            }\n" +
  "         ],\n" +
  '         "qdmTitle":"Patient Characteristic Birthdate",\n' +
  '         "hqmfOid":"2.16.840.1.113883.10.20.28.4.54",\n' +
  '         "qdmCategory":"patient_characteristic",\n' +
  '         "qdmStatus":"birthdate",\n' +
  '         "qdmVersion":"5.6",\n' +
  '         "_type":"QDM::PatientCharacteristicBirthdate",\n' +
  '         "description":"Patient Characteristic Birthdate: Birth date",\n' +
  '         "birthDatetime":"1985-01-01T08:00:00.000+00:00",\n' +
  '         "codeListId":"drc-c48426f721cede4d865df946157d5e2dc90bd32763ffcb982ca45b3bd97a29db"\n' +
  "      },\n" +
  "      {\n" +
  '         "dataElementCodes":[\n' +
  "            {\n" +
  '               "code":"2135-2",\n' +
  '               "system":"2.16.840.1.113883.6.238",\n' +
  '               "version":"1.2",\n' +
  '               "display":"Hispanic or Latino"\n' +
  "            }\n" +
  "         ],\n" +
  '         "qdmTitle":"Patient Characteristic Ethnicity",\n' +
  '         "hqmfOid":"2.16.840.1.113883.10.20.28.4.56",\n' +
  '         "qdmCategory":"patient_characteristic",\n' +
  '         "qdmStatus":"ethnicity",\n' +
  '         "qdmVersion":"5.6",\n' +
  '         "_type":"QDM::PatientCharacteristicEthnicity",\n' +
  '         "description":"Patient Characteristic Ethnicity: Ethnicity",\n' +
  '         "codeListId":"2.16.840.1.114222.4.11.837"\n' +
  "      },\n" +
  "      {\n" +
  '         "dataElementCodes":[\n' +
  "            {\n" +
  '               "code":"2028-9",\n' +
  '               "system":"2.16.840.1.113883.6.238",\n' +
  '               "version":"1.2",\n' +
  '               "display":"Asian"\n' +
  "            }\n" +
  "         ],\n" +
  '         "qdmTitle":"Patient Characteristic Race",\n' +
  '         "hqmfOid":"2.16.840.1.113883.10.20.28.4.59",\n' +
  '         "qdmCategory":"patient_characteristic",\n' +
  '         "qdmStatus":"race",\n' +
  '         "qdmVersion":"5.6",\n' +
  '         "_type":"QDM::PatientCharacteristicRace",\n' +
  '         "description":"Patient Characteristic Race: Race",\n' +
  '         "codeListId":"2.16.840.1.114222.4.11.836"\n' +
  "      }\n" +
  "   ],\n" +
  '   "_id":"646628cb235ff80000718c1a",\n' +
  '   "birthDatetime":"1985-01-01T08:00:00.000+00:00"\n' +
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
          id: "308d2af8-9650-49c0-a454-14a85163d9f9",
          name: PopulationType.INITIAL_POPULATION,
          definition: "IP",
        },
      ],
      populationBasis: "true",
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
  useCqmConversionService as jest.Mock<TestCaseServiceApi>;
const useCqmConversionServiceMockResolved = {
  fetchSourceDataCriteria: jest.fn().mockResolvedValue([
    {
      qdmCategory: "symptom",
      qdmStatus: "Encounter",
      description: "Allergy/Intolerance: Observation Services",
    },
    {
      qdmCategory: "allergy",
      qdmStatus: "Encounter",
      description: "Allergy/Intolerance: Observation Services",
    },
    {
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

let mockApplyDefaults = false;
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

jest.mock("@madie/madie-util", () => ({
  useDocumentTitle: jest.fn(),
  useFeatureFlags: () => {
    return { applyDefaults: mockApplyDefaults };
  },
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

const { findByTestId, findByText } = screen;
describe("ElementsTab", () => {
  useTestCaseServiceMock.mockImplementation(() => {
    return useTestCaseServiceMockResolved;
  });

  test("Icons present and navigate correctly.", async () => {
    CQMConversionMock.mockImplementation(() => {
      return useCqmConversionServiceMockResolved;
    });
    await render(
      <MemoryRouter>
        <EditTestCase />
      </MemoryRouter>
    );
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
});

test("LeftPanel navigation works as expected.", async () => {
  CQMConversionMock.mockImplementation(() => {
    return useCqmConversionServiceMockResolved;
  });
  await render(
    <MemoryRouter>
      <ApiContextProvider value={serviceConfig}>
        <EditTestCase />
      </ApiContextProvider>
    </MemoryRouter>
  );
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
    CQMConversionMock.mockImplementation(() => {
      return useCqmConversionServiceMockResolved;
    });
  });

  it("should render qdm edit test case component along with action buttons", async () => {
    await render(
      <MemoryRouter>
        <ApiContextProvider value={serviceConfig}>
          <EditTestCase />
        </ApiContextProvider>
      </MemoryRouter>
    );
    const runTestCaseButton = await getByRole("button", {
      name: "Run Test",
    });
    expect(runTestCaseButton).toBeInTheDocument();

    expect(getByRole("button", { name: "Save" })).toBeDisabled();
    expect(getByRole("button", { name: "Discard Changes" })).toBeDisabled();
  });

  it("should render group populations from DB", async () => {
    render(
      <MemoryRouter>
        <ApiContextProvider value={serviceConfig}>
          <EditTestCase />
        </ApiContextProvider>{" "}
      </MemoryRouter>
    );

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

    render(
      <MemoryRouter>
        <ApiContextProvider value={serviceConfig}>
          <EditTestCase />
        </ApiContextProvider>{" "}
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalled();
    });
  });

  it("should render group populations from DB and able to update the values and save test case", async () => {
    testCase.json = testCaseJson;
    mockedAxios.put.mockResolvedValueOnce(testCase);
    render(
      <MemoryRouter>
        <EditTestCase />
      </MemoryRouter>
    );

    const saveButton = getByRole("button", { name: "Save" });
    const expectedActualTab = getByRole("tab", {
      name: "Expected or Actual tab panel",
    });
    userEvent.click(expectedActualTab);
    const ipCheckbox = (await findByTestId(
      "test-population-initialPopulation-expected"
    )) as HTMLInputElement;
    await waitFor(() => expect(ipCheckbox).toBeChecked());
    expect(saveButton).toBeDisabled();
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
    render(
      <MemoryRouter>
        <ApiContextProvider value={serviceConfig}>
          <EditTestCase />
        </ApiContextProvider>{" "}
      </MemoryRouter>
    );

    const raceInput = screen.getByTestId(
      "demographics-race-input"
    ) as HTMLInputElement;
    expect(raceInput).toBeInTheDocument();
    expect(raceInput.value).toBe("American Indian or Alaska Native");
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

  it("should render qdm edit Demographics component with values from TestCase JSON", async () => {
    testCase.json = testCaseJson;
    render(
      <MemoryRouter>
        <ApiContextProvider value={serviceConfig}>
          <EditTestCase />
        </ApiContextProvider>{" "}
      </MemoryRouter>
    );

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

  it("test change dropwdown values", () => {
    render(
      <MemoryRouter>
        <ApiContextProvider value={serviceConfig}>
          <EditTestCase />
        </ApiContextProvider>{" "}
      </MemoryRouter>
    );

    const raceInput = screen.getByTestId(
      "demographics-race-input"
    ) as HTMLInputElement;
    expect(raceInput).toBeInTheDocument();
    expect(raceInput.value).toBe("American Indian or Alaska Native");

    fireEvent.change(raceInput, {
      target: { value: "White" },
    });
    expect(raceInput.value).toBe("White");

    const genderInput = screen.getByTestId(
      "demographics-gender-input"
    ) as HTMLInputElement;
    expect(genderInput).toBeInTheDocument();
    expect(genderInput.value).toBe("Female");

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

    await render(
      <MemoryRouter>
        <ApiContextProvider value={serviceConfig}>
          <EditTestCase />
        </ApiContextProvider>{" "}
      </MemoryRouter>
    );

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

  it("test update test case fails with failure toast", async () => {
    testCase.json = testCaseJson;
    useTestCaseServiceMock.mockImplementation(() => {
      return useTestCaseServiceMockRejected;
    });
    render(
      <MemoryRouter>
        <ApiContextProvider value={serviceConfig}>
          <EditTestCase />
        </ApiContextProvider>{" "}
      </MemoryRouter>
    );

    const saveTestCaseButton = await screen.getByRole("button", {
      name: "Save",
    });

    expect(saveTestCaseButton).toBeInTheDocument();
    const raceInput = screen.getByTestId(
      "demographics-race-input"
    ) as HTMLInputElement;
    expect(raceInput).toBeInTheDocument();
    expect(raceInput.value).toBe("American Indian or Alaska Native");

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
    render(
      <MemoryRouter>
        <EditTestCase />
      </MemoryRouter>
    );
    const highlighting = await findByText("Highlighting");
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
      fireEvent.click(details);
    });
    await waitFor(() => {
      expect(details).toHaveAttribute("aria-selected", "true");
    });
  });

  it("Should render the details tab with relevant information", async () => {
    testCase.json = testCaseJson;
    await render(
      <MemoryRouter>
        <ApiContextProvider value={serviceConfig}>
          <EditTestCase />
        </ApiContextProvider>{" "}
      </MemoryRouter>
    );

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
