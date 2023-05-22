import * as React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import EditTestCase from "./EditTestCase";
import {
  Measure,
  MeasureScoring,
  Model,
  PopulationType,
  TestCase,
} from "@madie/madie-models";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { ApiContextProvider, ServiceConfig } from "../../../api/ServiceContext";
import { ExecutionContextProvider } from "../../routes/qiCore/ExecutionContext";
import {
  buildMeasureBundle,
  getExampleValueSet,
} from "../../../util/CalculationTestHelpers";
import { simpleMeasureFixture } from "../../createTestCase/__mocks__/simpleMeasureFixture";
import userEvent from "@testing-library/user-event";
import axios from "axios";

const measureOwner = "testUser";

let mockApplyDefaults = false;
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

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
        set({} as Measure);
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

const testCase: TestCase[] = [
  {
    id: "testCaseId",
    title: "TC1",
    description: "",
    groupPopulations: [
      {
        groupId: "Group1_ID",
        populationBasis: "true",
        populationValues: [
          {
            id: "pop1",
            name: PopulationType.INITIAL_POPULATION,
            expected: true,
          },
        ],
        scoring: MeasureScoring.COHORT,
        stratificationValues: [],
      },
    ],
    name: null,
    series: null,
    createdAt: null,
    createdBy: measureOwner,
    lastModifiedAt: null,
    lastModifiedBy: null,
    json: null,
    executionStatus: null,
    validResource: true,
    hapiOperationOutcome: null,
  },
];

const defaultMeasure = {
  id: "m1234",
  measureScoring: MeasureScoring.COHORT,
  model: Model.QDM_5_6,
  createdBy: "testUserOwner",
  patientBasis: true,
  groups: [
    {
      groupId: "Group1_ID",
      scoring: "Cohort",
      populations: [
        {
          id: "id-1",
          name: PopulationType.INITIAL_POPULATION,
          definition: "Pop1",
        },
      ],
    },
  ],
  acls: [{ userId: "othertestuser@example.com", roles: ["SHARED_WITH"] }],
} as unknown as Measure;

const measureBundle = buildMeasureBundle(simpleMeasureFixture);
const valueSets = [getExampleValueSet()];
const setMeasure = jest.fn();
const setMeasureBundle = jest.fn();
const setValueSets = jest.fn();
const setError = jest.fn();

const renderWithRouter = (
  initialEntries = [],
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
            executionContextReady: true,
            executing: false,
            setExecuting: jest.fn(),
          }}
        >
          <Routes>
            <Route
              path="/measures/:measureId/edit/test-cases/:id"
              element={<EditTestCase errors={[]} setErrors={setError} />}
            />
          </Routes>
        </ExecutionContextProvider>
      </ApiContextProvider>
    </MemoryRouter>
  );
};

describe("EditTestCase QDM Component", () => {
  it("should render qdm edit test case component along with action buttons", async () => {
    renderWithRouter(["/measures/testMeasureId/edit/test-cases/patientId"]);
    const runTestCaseButton = await screen.getByRole("button", {
      name: "Run Test",
    });
    expect(runTestCaseButton).toBeInTheDocument();

    expect(screen.getByRole("button", { name: "Save" })).toBeDisabled();
    expect(
      screen.getByRole("button", { name: "Discard Changes" })
    ).toBeDisabled();
  });

  it("should render group populations from DB", async () => {
    mockedAxios.get.mockResolvedValue({
      data: { ...testCase },
    });
    renderWithRouter(["/measures/testMeasureId/edit/test-cases/patientId"]);

    const expectedActualTab = screen.getByRole("tab", {
      name: "Expected or Actual tab panel",
    });
    userEvent.click(expectedActualTab);
    const ipCheckbox = (await screen.findByTestId(
      "test-population-initialPopulation-expected"
    )) as HTMLInputElement;
    // await waitFor(() => expect(ipCheckbox).not.toBeChecked());
    // userEvent.click(ipCheckbox);
    await waitFor(() => expect(ipCheckbox).toBeChecked());
  });
});
