import * as React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import EditTestCase from "./EditTestCase";
import { Measure, TestCase } from "@madie/madie-models";
import { MemoryRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import axios from "axios";

const testcase: TestCase = {
  id: "1",
  title: "Test Case",
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
testcase.json = testCaseJson;
const testMeasure: Measure = {
  id: "testMeasureId",
} as Measure;

jest.mock("axios");
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
        //set({} as Measure);
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

describe("EditTestCase QDM Component", () => {
  beforeEach(() => {
    mockedAxios.get.mockResolvedValueOnce(testcase);
  });

  it("should render qdm edit test case component along with run execution button", async () => {
    render(
      <MemoryRouter>
        <EditTestCase />
      </MemoryRouter>
    );
    const runTestCaseButton = await screen.getByRole("button", {
      name: "Run Test",
    });
    expect(runTestCaseButton).toBeInTheDocument();
  });

  it("test update test case successfully with success toast", async () => {
    mockedAxios.put.mockResolvedValueOnce(testcase);
    render(
      <MemoryRouter>
        <EditTestCase />
      </MemoryRouter>
    );

    const saveTestCaseButton = await screen.getByRole("button", {
      name: "Save",
    });
    expect(saveTestCaseButton).toBeInTheDocument();

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
