import * as React from "react";
import { render, screen } from "@testing-library/react";
import TestCaseLanding from "./TestCaseLanding";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { ApiContextProvider, ServiceConfig } from "../../api/ServiceContext";
import { Measure, MeasureScoring } from "@madie/madie-models";
import { Bundle, ValueSet } from "fhir/r4";
import { ExecutionContextProvider } from "../routes/ExecutionContext";

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

const measure = {
  id: "m1234",
  createdBy: MEASURE_CREATEDBY,
  measurementPeriodStart: "2023-01-01",
  measurementPeriodEnd: "2023-12-31",
} as unknown as Measure;

const measureBundle = {} as Bundle;
const valueSets = [] as ValueSet[];
const setMeasure = jest.fn();
const setMeasureBundle = jest.fn();
const setValueSets = jest.fn();

jest.mock("@madie/madie-util", () => ({
  useOktaTokens: () => ({
    getAccessToken: () => "test.jwt",
    getUserName: () => MEASURE_CREATEDBY,
  }),
}));

describe("TestCaseLanding component", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  function renderTestCaseLandingComponent(measure: Measure) {
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
    renderTestCaseLandingComponent(measure);

    const newTestCase = await screen.findByRole("button", {
      name: "New Test Case",
    });
    expect(newTestCase).toBeInTheDocument();
  });

  it("should render the landing component without create new test case button if user is not the owner of the measure", async () => {
    const readOnlyMeasure = { ...measure, createdBy: "not me" };
    renderTestCaseLandingComponent(readOnlyMeasure);
    const newTestCase = await screen.queryByRole("button", {
      name: "New Test Case",
    });
    expect(newTestCase).not.toBeInTheDocument();
  });
});
