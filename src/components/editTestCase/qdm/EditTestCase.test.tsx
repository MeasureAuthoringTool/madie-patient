import * as React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import EditTestCase from "./EditTestCase";
import {
  Measure,
  MeasureScoring,
  Model,
  PopulationType,
  TestCase,
} from "@madie/madie-models";
import { MemoryRouter } from "react-router-dom";
import { act } from "react-dom/test-utils";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import { test } from "@jest/globals";

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
  '   "_id":"646628cb235ff80000718c1a"\n' +
  "}";

const measureOwner = "testUser";

const testCase: TestCase = {
  id: "1",
  title: "TC1",
  series: "",
  description: "",
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
  id: "m1234",
  scoring: MeasureScoring.COHORT,
  model: Model.QDM_5_6,
  createdBy: "testUserOwner",
  patientBasis: true,
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

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: () => ({
    measureId: "m1234",
    id: "1",
  }),

  useNavigate: () => mockNavigate,
}));

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

describe("LeftPanel", () => {
  const { findByTestId, findByText } = screen;
  test("LeftPanel navigation works as expected.", async () => {
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

describe("EditTestCase QDM Component", () => {
  const { getByRole, findByTestId, findByText } = screen;

  beforeEach(() => {
    mockedAxios.get.mockImplementation((args) => {
      if (args && args.endsWith("test-cases/1")) {
        return Promise.resolve({ data: testCase });
      }
    });
  });

  it("should render qdm edit test case component along with action buttons", async () => {
    await render(
      <MemoryRouter>
        <EditTestCase />
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
        <EditTestCase />
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
    mockedAxios.get.mockRejectedValue("404");
    render(
      <MemoryRouter>
        <EditTestCase />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalled();
    });
  });

  it("should render group populations from DB and able to update the values and save test case", async () => {
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

    expect(saveButton).not.toBeDisabled();
    userEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByTestId("success-toast")).toHaveTextContent(
        "Test Case Updated Successfully"
      );
    });
  });

  it("should render qdm edit Demographics component with default values", () => {
    render(
      <MemoryRouter>
        <EditTestCase />
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
  });

  it.skip("should render qdm edit Demographics component with values from TestCase JSON", async () => {
    testCase.json = testCaseJson;
    render(
      <MemoryRouter>
        <EditTestCase />
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
  });

  it.skip("test change dropwdown values", () => {
    testCase.json = testCaseJson;
    render(
      <MemoryRouter>
        <EditTestCase />
      </MemoryRouter>
    );

    const raceInput = screen.getByTestId(
      "demographics-race-input"
    ) as HTMLInputElement;
    expect(raceInput).toBeInTheDocument();
    expect(raceInput.value).toBe("Asian");

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
  });

  it("test update test case successfully with success toast", async () => {
    mockedAxios.put.mockResolvedValueOnce(testCase);
    render(
      <MemoryRouter>
        <EditTestCase />
      </MemoryRouter>
    );

    const saveTestCaseButton = await getByRole("button", {
      name: "Save",
    });
    expect(saveTestCaseButton).toBeInTheDocument();
    const expectedId = `qdm-header-content-Demographics`;
    const foundTitle = await findByText("Demographics");
    // open
    expect(foundTitle).toBeInTheDocument();
    const foundBody = await findByTestId(expectedId);
    expect(foundBody).toBeInTheDocument();

    const raceInput = screen.getByTestId(
      "demographics-race-input"
    ) as HTMLInputElement;
    expect(raceInput).toBeInTheDocument();
    expect(raceInput.value).toBe("American Indian or Alaska Native");
    const genderInput = screen.getByTestId(
      "demographics-gender-input"
    ) as HTMLInputElement;
    expect(genderInput).toBeInTheDocument();
    fireEvent.change(genderInput, {
      target: { value: "Male" },
    });
    expect(genderInput.value).toBe("Male");
    expect(saveTestCaseButton).toBeEnabled();

    userEvent.click(saveTestCaseButton);

    await waitFor(() => {
      expect(screen.getByTestId("success-toast")).toHaveTextContent(
        "Test Case Updated Successfully"
      );
    });
  });

  it("test update test case fails with failure toast", async () => {
    mockedAxios.put.mockRejectedValueOnce({
      data: {
        error: "error",
      },
    });

    render(
      <MemoryRouter>
        <EditTestCase />
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
    expect(saveTestCaseButton).toBeEnabled();

    userEvent.click(saveTestCaseButton);

    await waitFor(() => {
      expect(screen.getByTestId("error-toast")).toHaveTextContent(
        "Error updating Test Case "
      );
      const closeToastBtn = screen.getByTestId("close-toast-button");
      userEvent.click(closeToastBtn);
      expect(
        screen.queryByText("Error updating Test Case")
      ).not.toBeInTheDocument();
    });
  });
});
