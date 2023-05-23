import * as React from "react";
import {
  render,
  screen,
  waitFor,
  fireEvent,
  within,
} from "@testing-library/react";
import EditTestCase from "./EditTestCase";
import { Measure, TestCase } from "@madie/madie-models";
import Router, { MemoryRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import { act } from "react-dom/test-utils";
import useTestCaseServiceApi, {
  TestCaseServiceApi,
} from "../../../api/useTestCaseServiceApi";
const testcase: TestCase = {
  id: "1",
  title: "Test Case",
  createdBy: "test",
  createdAt: "test",
  series: "test series",
  description: "test description",
  lastModifiedAt: "test",
  lastModifiedBy: "test",
  validResource: false,
  name: "",
} as TestCase;
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
const testMeasure: Measure = {
  id: "testMeasureId",
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
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: jest.fn(),
}));

jest.mock("../../../api/useTestCaseServiceApi");
const useTestCaseServiceMock =
  useTestCaseServiceApi as jest.Mock<TestCaseServiceApi>;
const useTestCaseServiceMockResolved = {
  getTestCase: jest.fn().mockResolvedValue(testcase),
  getTestCaseSeriesForMeasure: jest
    .fn()
    .mockResolvedValue(["Series 1", "Series 2"]),
  updateTestCase: jest.fn().mockResolvedValue(testcase),
} as unknown as TestCaseServiceApi;

const useTestCaseServiceMockRejected = {
  getTestCase: jest.fn().mockResolvedValue(testcase),
  getTestCaseSeriesForMeasure: jest
    .fn()
    .mockResolvedValue(["Series 1", "Series 2"]),
  updateTestCase: jest.fn().mockRejectedValueOnce({
    data: {
      error: "error",
    },
  }),
} as unknown as TestCaseServiceApi;

const mockedAxios = axios as jest.Mocked<typeof axios>;

let mockApplyDefaults = false;
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));
jest.mock("@madie/madie-util", () => {
  return {
    useDocumentTitle: jest.fn(),
    useFeatureFlags: () => {
      return { applyDefaults: mockApplyDefaults };
    },
    measureStore: {
      updateMeasure: jest.fn((measure) => measure),
      state: null,
      initialState: null,
      subscribe: (set) => {
        set(testMeasure);
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
  };
});

describe("LeftPanel", () => {
  jest
    .spyOn(Router, "useParams")
    .mockReturnValue({ id: "testid", measureId: "testmeasureid" });
  const { findByTestId, findByText } = screen;
  useTestCaseServiceMock.mockImplementation(() => {
    return useTestCaseServiceMockResolved;
  });
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
    useTestCaseServiceMock.mockImplementation(() => {
      return useTestCaseServiceMockResolved;
    });
    jest
      .spyOn(Router, "useParams")
      .mockReturnValue({ id: "testid", measureId: "testmeasureid" });
  });

  it("should render qdm edit test case component along with run execution button", async () => {
    render(
      <MemoryRouter>
        <EditTestCase />
      </MemoryRouter>
    );
    const runTestCaseButton = await getByRole("button", {
      name: "Run Test",
    });
    expect(runTestCaseButton).toBeInTheDocument();
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
    testcase.json = testCaseJson;
    mockedAxios.put.mockResolvedValueOnce(testcase);
    await render(
      <MemoryRouter>
        <EditTestCase />
      </MemoryRouter>
    );

    const expectedId = `qdm-header-content-Demographics`;
    const foundTitle = await findByText("Demographics");

    expect(foundTitle).toBeInTheDocument();
    const foundBody = await findByTestId(expectedId);
    expect(foundBody).toBeInTheDocument();

    const raceInput = screen.getByTestId(
      "demographics-race-input"
    ) as HTMLInputElement;
    expect(raceInput).toBeInTheDocument();
    expect(raceInput.value).toBe("Asian");
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
    const saveTestCasebtn = await findByTestId("qdm-test-case-save-button");
    expect(saveTestCasebtn).toBeEnabled();
    act(() => {
      fireEvent.click(saveTestCasebtn);
    });

    await waitFor(() => {
      expect(screen.getByTestId("success-toast")).toHaveTextContent(
        "Test Case Updated Successfully"
      );
    });
  });

  it("test update test case fails with failure toast", async () => {
    useTestCaseServiceMock.mockImplementation(() => {
      return useTestCaseServiceMockRejected;
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
    expect(saveTestCaseButton).toBeEnabled();

    act(() => {
      userEvent.click(saveTestCaseButton);
    });

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
    await render(
      <MemoryRouter>
        <EditTestCase />
      </MemoryRouter>
    );
    // navigate
    const detailsTab = await findByText("Details");
    act(() => {
      fireEvent.click(detailsTab);
    });
    await waitFor(() => {
      expect(detailsTab).toHaveAttribute("aria-selected", "true");
    });
    // check title is as expected
    const tcTitle = await screen.findByTestId("test-case-title");
    expect(tcTitle).toHaveValue(testcase.title);

    const descriptionInput = screen.getByTestId("test-case-description");
    expect(descriptionInput).toHaveTextContent(testcase.description);

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

    const saveTestCasebtn = await findByTestId("qdm-test-case-save-button");
    expect(saveTestCasebtn).toBeEnabled();
    act(() => {
      fireEvent.click(saveTestCasebtn);
    });

    await waitFor(() => {
      expect(screen.getByTestId("success-toast")).toHaveTextContent(
        "Test Case Updated Successfully"
      );
    });
  }, 30000);
});
