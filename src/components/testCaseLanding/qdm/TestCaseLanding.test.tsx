import * as React from "react";
import { render, screen } from "@testing-library/react";
import TestCaseLanding from "./TestCaseLanding";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { ApiContextProvider, ServiceConfig } from "../../../api/ServiceContext";
import { Measure, Model } from "@madie/madie-models";
import { CqmMeasure, ValueSet } from "cqm-models";
import { QdmExecutionContextProvider } from "../../routes/qdm/QdmExecutionContext";
import { checkUserCanEdit } from "@madie/madie-util";
import useQdmCqlParsingService, {
  CqlParsingService,
} from "../../../api/useQdmCqlParsingService";
import { qdmCallStack } from "../../editTestCase/groupCoverage/_mocks_/QdmCallStack";

const serviceConfig: ServiceConfig = {
  measureService: {
    baseUrl: "measure.url",
  },
  testCaseService: {
    baseUrl: "base.url",
  },
  terminologyService: {
    baseUrl: "http.com",
  },
  excelExportService: {
    baseUrl: "excelexport.com",
  },
};

jest.mock("../../../api/useQdmCqlParsingService");
const useCqlParsingServiceMock =
  useQdmCqlParsingService as jest.Mock<CqlParsingService>;

const useCqlParsingServiceMockResolved = {
  getAllDefinitionsAndFunctions: jest.fn().mockResolvedValue(qdmCallStack),
  getDefinitionCallstacks: jest.fn().mockResolvedValue(qdmCallStack),
} as unknown as CqlParsingService;

const MEASURE_CREATEDBY = "testuser";

const measure = {
  id: "m1234",
  createdBy: MEASURE_CREATEDBY,
  measurementPeriodStart: "2023-01-01",
  measurementPeriodEnd: "2023-12-31",
  model: Model.QDM_5_6,
} as unknown as Measure;

const cqmMeasure = {} as CqmMeasure;
const valueSets = [] as ValueSet[];
const setMeasure = jest.fn();
const setCqmMeasure = jest.fn();
const setValueSets = jest.fn();
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
              valueSetsState: [valueSets, setValueSets],
              executionContextReady: true,
              executing: false,
              setExecuting: setExecuting,
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
    const newTestCase = await screen.queryByRole("button", {
      name: "New Test Case",
    });
    expect(newTestCase).not.toBeInTheDocument();
  });
});
