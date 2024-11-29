// import fetchMocks, { enableFetchMocks } from "jest-fetch-mock";
// enableFetchMocks();
import * as React from "react";
import {
  prettyDOM,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import axios from "../../../api/axios-instance";
import { ApiContextProvider, ServiceConfig } from "../../../api/ServiceContext";
import { Measure, Model, PopulationType } from "@madie/madie-models";
import useCqmConversionService, {
  CqmConversionService,
} from "../../../api/CqmModelConversionService";
import RedirectToList from "../RedirectToList";
import EditTestCase from "../../editTestCase/qdm/EditTestCase";
import TestCaseLandingWrapper from "../../testCaseLanding/common/TestCaseLandingWrapper";
import SDEPage from "../../testCaseConfiguration/sde/SDEPage";
import Expansion from "../../testCaseConfiguration/expansion/Expansion";
import TestCaseData from "../../testCaseConfiguration/testCaseData/TestCaseData";
import NotFound from "../../notfound/NotFound";
import { QdmExecutionContextProvider } from "./QdmExecutionContext";
import useTerminologyServiceApi, {
  TerminologyServiceApi,
} from "../../../api/useTerminologyServiceApi";
import TestCaseLandingQdm from "../../testCaseLanding/qdm/TestCaseLanding";
import { wait } from "@testing-library/user-event/dist/utils";
import TestCaseRoutes from "./TestCaseRoutes";

jest.mock("../../../api/axios-instance");
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));
const mockedAxios = axios as jest.Mocked<typeof axios>;
export const serviceConfig: ServiceConfig = {
  measureService: {
    baseUrl: "measure.url",
  },
  testCaseService: {
    baseUrl: "base.url",
  },
  terminologyService: {
    baseUrl: "something.com",
  },
  qdmElmTranslationService: {
    baseUrl: "qdm-elmTranslationService.com",
  },
  fhirElmTranslationService: {
    baseUrl: "fhir-elmTranslationService.com",
  },
  fhirService: {
    baseUrl: "fhirService.com",
  },
  excelExportService: {
    baseUrl: "excelexport.com",
  },
};

const MEASURE_CREATEDBY = "testuser";
const mockMeasure = {
  id: "m1234",
  model: Model.QDM_5_6,
  cqlLibraryName: "CM527Library",
  measurementPeriodStart: new Date("01/05/2022"),
  measurementPeriodEnd: new Date("03/07/2022"),
  active: true,
  cqlErrors: false,
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
} as Measure;

jest.mock("@madie/madie-util", () => ({
  useDocumentTitle: jest.fn(),
  measureStore: {
    updateMeasure: jest.fn((measure) => measure),
    updateTestCases: jest.fn().mockImplementation(() => {}),
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
    updateRouteHandlerState: () => jest.fn(),
    state: { canTravel: true, pendingPath: "" },
    initialState: { canTravel: true, pendingPath: "" },
  },
}));

jest.mock("use-resize-observer", () => {
  return jest.requireActual("use-resize-observer/polyfilled");
});

jest.mock("../../../api/CqmModelConversionService");
const CQMConversionMock =
  useCqmConversionService as jest.Mock<CqmConversionService>;
const useCqmConversionServiceMockResolved = {
  convertToCqmMeasure: jest.fn().mockResolvedValue(mockMeasure),
} as unknown as CqmConversionService;
CQMConversionMock.mockImplementation(() => {
  return useCqmConversionServiceMockResolved;
});

const renderComponentViaRouter = (
  initialEntry = "/measures/m1234/edit/test-cases/list-page"
) => {
  return render(
    <ApiContextProvider value={serviceConfig}>
      <QdmExecutionContextProvider
        value={{
          measureState: [mockMeasure, jest.fn()],
          cqmMeasureState: [{}, jest.fn()],
          executionContextReady: true,
          setExecutionContextReady: jest.fn(),
          executing: false,
          setExecuting: jest.fn(),
          contextFailure: false,
        }}
      >
        <TestCaseRoutes initialEntry={initialEntry} />
      </QdmExecutionContextProvider>
    </ApiContextProvider>
  );
};

describe("QDM TestCaseRoutes", () => {
  it("should render the test case list component", async () => {
    mockedAxios.get.mockImplementation((args) => {
      if (
        args &&
        args.startsWith(
          serviceConfig.testCaseService.baseUrl + "/measures/m1234/test-cases"
        )
      ) {
        return Promise.resolve({
          data: [
            {
              id: "id1",
              title: "TC1",
              description: "Desc1",
              series: "IPP_Pass",
              lastModifiedAt: "2024-09-10T09:19:14.382Z",
              status: null,
            },
          ],
        });
      } else {
        return null;
      }
    });

    renderComponentViaRouter("/measures/m1234/edit/test-cases/list-page");
    const testCaseListTable = (await screen.findByTestId(
      "test-case-tbl"
    )) as HTMLTableElement;
    const tBody = testCaseListTable.tBodies.item(0);
    expect(tBody.rows.length).toBe(1);
    expect(tBody.rows.item(0).cells[0]).toHaveTextContent("Invalid");
    expect(tBody.rows.item(0).cells[1]).toHaveTextContent("IPP_Pass");
    expect(tBody.rows.item(0).cells[2]).toHaveTextContent("TC1");
    expect(tBody.rows.item(0).cells[3]).toHaveTextContent("Desc1");
    expect(tBody.rows.item(0).cells[4]).toHaveTextContent("09/10/2024");
    expect(
      within(tBody.rows.item(0).cells[5]).getByRole("button", {
        name: "select-action-TC1",
      })
    ).toBeInTheDocument();
  });

  it("should render the SDEPage", async () => {
    mockedAxios.get.mockImplementation(() => {
      return Promise.resolve({
        data: [
          {
            id: "id1",
            title: "TC12",
            description: "Desc1",
            series: "IPP_Pass",
            status: null,
          },
        ],
      });
    });
    renderComponentViaRouter("/measures/m1234/edit/test-cases/list-page/sde");
    expect(
      screen.getByTestId("sde-option-radio-buttons-group")
    ).toBeInTheDocument();
  });

  it("should render the Expansion Component", async () => {
    mockedAxios.get.mockImplementation(() => {
      return Promise.resolve({
        data: [
          {
            id: "id1",
            title: "TC12",
            description: "Desc1",
            series: "IPP_Pass",
            status: null,
          },
        ],
      });
    });
    renderComponentViaRouter(
      "/measures/m1234/edit/test-cases/list-page/expansion"
    );
    expect(screen.getByTestId("manifest-expansion-form")).toBeInTheDocument();
  });

  it("should render the Test case data Component", async () => {
    mockedAxios.get.mockImplementation(() => {
      return Promise.resolve({
        data: [
          {
            id: "id1",
            title: "TC12",
            description: "Desc1",
            series: "IPP_Pass",
            status: null,
          },
        ],
      });
    });
    renderComponentViaRouter(
      "/measures/m1234/edit/test-cases/list-page/test-case-data"
    );
    expect(
      await screen.findByTestId("test-case-data-form")
    ).toBeInTheDocument();
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
    renderComponentViaRouter("/measures/m1234/edit/test-cases/m1234");

    expect(screen.getByTestId("edit-test-case-form")).toBeInTheDocument();
  });

  it("test error convertToCqmMeasure", async () => {
    const useCqmConversionServiceMockRejected = {
      convertToCqmMeasure: jest.fn().mockRejectedValueOnce({
        error: {
          message: "error convert to qdm measure",
        },
      }),
    } as unknown as CqmConversionService;

    CQMConversionMock.mockImplementation(() => {
      return useCqmConversionServiceMockRejected;
    });
    renderComponentViaRouter("/measures/m1234/edit/test-cases/m1234");

    const runTestCaseButton = screen.getByRole("button", {
      name: "Run Test",
    });
    expect(runTestCaseButton).toBeDisabled();
  });
});
