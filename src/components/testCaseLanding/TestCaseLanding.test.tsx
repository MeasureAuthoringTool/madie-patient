import * as React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import TestCaseLanding from "./TestCaseLanding";
import { MemoryRouter } from "react-router-dom";
import { ApiContextProvider, ServiceConfig } from "../../api/ServiceContext";
import axios from "axios";
import { MeasureScoring } from "../../models/MeasureScoring";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

const serviceConfig: ServiceConfig = {
  measureService: {
    baseUrl: "measure.url",
  },
  testCaseService: {
    baseUrl: "base.url",
  },
};

jest.mock("../../hooks/useOktaTokens", () =>
  jest.fn(() => ({
    getAccessToken: () => "test.jwt",
  }))
);

describe("TestCaseLanding component", () => {
  beforeEach(() => {
    mockedAxios.get.mockImplementation((args) => {
      if (args && args.startsWith(serviceConfig.measureService.baseUrl)) {
        return Promise.resolve({
          data: {
            id: "m1234",
            measureScoring: MeasureScoring.PROPORTION,
            measurementPeriodStart: "2023-01-01",
            measurementPeriodEnd: "2023-12-31",
          },
        });
      }
      return Promise.resolve({ data: null });
    });
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it("should render the landing component with a button to create new test case", async () => {
    render(
      <ApiContextProvider value={serviceConfig}>
        <MemoryRouter>
          <TestCaseLanding />
        </MemoryRouter>
      </ApiContextProvider>
    );
    await waitFor(() => {
      const newTestCase = screen.getByRole("button", { name: "New Test Case" });
      expect(newTestCase).toBeInTheDocument();
    });
  });
});
