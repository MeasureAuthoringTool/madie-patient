import * as React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import TestCaseRoutes from "./TestCaseRoutes";
import axios from "axios";
import { ApiContextProvider, ServiceConfig } from "../../../api/ServiceContext";
import { Model, PopulationType } from "@madie/madie-models";

// mock the editor cause we don't care for this test and it gets rid of errors
// jest.mock("../../editor/Editor", () => () => <div>editor contents</div>);

jest.mock("axios");
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));
const mockedAxios = axios as jest.Mocked<typeof axios>;
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
const mockMeasure = {
  id: "m1234",
  model: Model.QDM_5_6,
  cqlLibraryName: "CM527Library",
  measurementPeriodStart: "01/05/2022",
  measurementPeriodEnd: "03/07/2022",
  active: true,
  cqlErrors: false,
  errors: [],
  elmJson: "Fak3",
  groups: [
    {
      id: "63d953802ac2a77f7fec4e5b",
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
    qdmTestCases: true,
  })),
  useOktaTokens: () => ({
    getAccessToken: () => "test.jwt",
    getUserName: () => MEASURE_CREATEDBY,
  }),
  checkUserCanEdit: jest.fn(() => {
    return true;
  }),
  routeHandlerStore: {
    subscribe: () => {
      return { unsubscribe: () => null };
    },
    updateRouteHandlerState: () => null,
    state: { canTravel: false, pendingPath: "" },
    initialState: { canTravel: false, pendingPath: "" },
  },
}));

jest.mock("use-resize-observer", () => {
  return jest.requireActual("use-resize-observer/polyfilled");
});

describe("TestCaseRoutes", () => {
  it("should render the test case list component", async () => {
    mockedAxios.get.mockImplementation(() => {
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

  it("should render the Edit test case component", async () => {
    mockedAxios.get.mockImplementation(() => {
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
      <MemoryRouter initialEntries={["/measures/m1234/edit/test-cases/m1234"]}>
        <ApiContextProvider value={serviceConfig}>
          <TestCaseRoutes />
        </ApiContextProvider>
      </MemoryRouter>
    );

    const runTestCaseButton = await screen.getByRole("button", {
      name: "Run Test",
    });
    expect(runTestCaseButton).toBeInTheDocument();
  });
});
