import * as React from "react";
import { render, screen } from "@testing-library/react";
import TestCaseLanding from "./TestCaseLanding";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { ApiContextProvider, ServiceConfig } from "../../api/ServiceContext";
import axios from "axios";
import { Measure, MeasureScoring } from "@madie/madie-models";
import { Bundle, ValueSet } from "fhir/r4";
import { ExecutionContextProvider } from "../routes/ExecutionContext";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

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
};

const MEASURE_CREATEDBY = "testuser";
jest.mock("../../hooks/useOktaTokens", () =>
  jest.fn(() => ({
    getAccessToken: () => "test.jwt",
    getUserName: () => MEASURE_CREATEDBY,
  }))
);

const measure = {
  id: "m1234",
  createdBy: MEASURE_CREATEDBY,
  measureScoring: MeasureScoring.PROPORTION,
  measurementPeriodStart: "2023-01-01",
  measurementPeriodEnd: "2023-12-31",
} as unknown as Measure;

const measureBundle = {} as Bundle;
const valueSets = [] as ValueSet[];
const setMeasure = jest.fn();
const setMeasureBundle = jest.fn();
const setValueSets = jest.fn();

describe("TestCaseLanding component", () => {
  beforeEach(() => {
    mockedAxios.get.mockImplementation((args) => {
      if (args && args.startsWith(serviceConfig.measureService.baseUrl)) {
        return Promise.resolve({
          data: {
            id: "m1234",
            createdBy: MEASURE_CREATEDBY,
            measureScoring: MeasureScoring.PROPORTION,
            measurementPeriodStart: "2023-01-01",
            measurementPeriodEnd: "2023-12-31",
          },
        });
      }
    });
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  function renderTestCaseLandingComponent() {
    return render(
      <MemoryRouter initialEntries={["/measures/m1234/edit/test-cases"]}>
        <ApiContextProvider value={serviceConfig}>
          <ExecutionContextProvider
            value={{
              measureState: [measure, setMeasure],
              bundleState: [measureBundle, setMeasureBundle],
              valueSetsState: [valueSets, setValueSets],
            }}
          >
            <Routes>
              <Route
                path="/measures/:measureId/edit/test-cases"
                element={<TestCaseLanding />}
              />
            </Routes>
          </ExecutionContextProvider>
        </ApiContextProvider>
      </MemoryRouter>
    );
  }

  it("should render the landing component with a button to create new test case", async () => {
    renderTestCaseLandingComponent();

    const newTestCase = await screen.findByRole("button", {
      name: "New Test Case",
    });
    expect(newTestCase).toBeInTheDocument();
  });

  it("should render the landing component without create new test case button if user is not the owner of the measure", async () => {
    renderTestCaseLandingComponent();
    screen.debug();
    const newTestCase = await screen.queryByRole("button", {
      name: "New Test Case",
    });
    expect(newTestCase).not.toBeInTheDocument();
  });
});
