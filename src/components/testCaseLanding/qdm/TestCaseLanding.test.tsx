import * as React from "react";
import { render, screen } from "@testing-library/react";
import TestCaseLanding from "./TestCaseLanding";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { ApiContextProvider, ServiceConfig } from "../../../api/ServiceContext";
import { Measure, Model } from "@madie/madie-models";
import { CqmMeasure } from "cqm-models";
import { QdmExecutionContextProvider } from "../../routes/qdm/QdmExecutionContext";
// @ts-ignore
import { checkUserCanEdit } from "@madie/madie-util";
import useQdmCqlParsingService, {
  QdmCqlParsingService,
} from "../../../api/cqlElmTranslationService/useQdmCqlParsingService";
import { qdmCallStack } from "../../editTestCase/groupCoverage/_mocks_/QdmCallStack";

const serviceConfig: ServiceConfig = {
  measureService: {
    baseUrl: "measure.url",
  },
  testCaseService: {
    baseUrl: "base.url",
  },
  qdmElmTranslationService: {
    baseUrl: "base.url",
  },
  fhirElmTranslationService: {
    baseUrl: "base.url",
  },
  terminologyService: {
    baseUrl: "http.com",
  },
  excelExportService: {
    baseUrl: "excelexport.com",
  },
};

jest.mock("../../../api/cqlElmTranslationService/useQdmCqlParsingService");
const useCqlParsingServiceMock =
  useQdmCqlParsingService as jest.Mock<QdmCqlParsingService>;

const useCqlParsingServiceMockResolved = {
  getAllDefinitionsAndFunctions: jest.fn().mockResolvedValue(qdmCallStack),
  getDefinitionCallstacks: jest.fn().mockResolvedValue(qdmCallStack),
} as unknown as QdmCqlParsingService;

const MEASURE_CREATEDBY = "testuser";

const measure = {
  id: "m1234",
  createdBy: MEASURE_CREATEDBY,
  measurementPeriodStart: "2023-01-01",
  measurementPeriodEnd: "2023-12-31",
  model: Model.QDM_5_6,
} as unknown as Measure;

const cqmMeasure = {} as CqmMeasure;
const setMeasure = jest.fn();
const setCqmMeasure = jest.fn();
const setExecutionContextReady = jest.fn();
const setExecuting = jest.fn();
const setError = jest.fn();

jest.mock("@madie/madie-util", () => ({
  useDocumentTitle: jest.fn(),
  measureStore: {
    updateMeasure: jest.fn((measure) => measure),
  },
  useOktaTokens: () => ({
    getAccessToken: () => "test.jwt",
  }),
  checkUserCanEdit: jest.fn(() => {
    return true;
  }),
  useFeatureFlags: jest.fn().mockImplementation(() => ({
    applyDefaults: false,
  })),
}));

describe("TestCaseLanding component", () => {
  useCqlParsingServiceMock.mockImplementation(() => {
    return useCqlParsingServiceMockResolved;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  function renderTestCaseLandingComponent(measure: Measure) {
    return render(
      <MemoryRouter initialEntries={["/measures/m1234/edit/test-cases"]}>
        <ApiContextProvider value={serviceConfig}>
          <QdmExecutionContextProvider
            value={{
              measureState: [measure, setMeasure],
              cqmMeasureState: [cqmMeasure, setCqmMeasure],
              executionContextReady: true,
              setExecutionContextReady: setExecutionContextReady,
              executing: false,
              setExecuting: setExecuting,
              contextFailure: false,
            }}
          >
            <Routes>
              <Route
                path="/measures/:measureId/edit/test-cases"
                element={<TestCaseLanding errors={[]} setErrors={setError} />}
              />
            </Routes>
          </QdmExecutionContextProvider>
        </ApiContextProvider>
      </MemoryRouter>
    );
  }

  it("should render the landing component with a button to create new test case", async () => {
    renderTestCaseLandingComponent(measure);

    const newTestCase = await screen.findByRole("button", {
      name: "New Test Case",
    });
    expect(newTestCase).toBeInTheDocument();
  });

  it("should render the landing component without create new test case button if user is not the owner of the measure", async () => {
    (checkUserCanEdit as jest.Mock).mockImplementationOnce(() => {
      return false;
    });
    const readOnlyMeasure = { ...measure, createdBy: "not me" };
    renderTestCaseLandingComponent(readOnlyMeasure);
    const newTestCase = screen.queryByRole("button", {
      name: "New Test Case",
    });
    expect(newTestCase).not.toBeInTheDocument();
  });
});
