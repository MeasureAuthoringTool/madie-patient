import * as React from "react";
import { act, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import TestCaseRoutes from "./TestCaseRoutes";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import { ApiContextProvider, ServiceConfig } from "../../api/ServiceContext";
import { MeasureScoring } from "../../models/MeasureScoring";

// mock the editor cause we don't care for this test and it gets rid of errors
jest.mock("../editor/Editor", () => () => <div>editor contents</div>);

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

const MEASURE_CREATEDBY = "testuser";
jest.mock("../../hooks/useOktaTokens", () =>
  jest.fn(() => ({
    getAccessToken: () => "test.jwt",
    getUserName: () => MEASURE_CREATEDBY,
  }))
);

describe("TestCaseRoutes", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render the landing component first", async () => {
    mockedAxios.get.mockImplementation((args) => {
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
    const viewBtn = screen.getByRole("button", { name: "View" });
    expect(viewBtn).toBeInTheDocument();
  });

  it("should allow navigation to create page from landing page ", async () => {
    mockedAxios.get.mockImplementation((args) => {
      if (args && args.endsWith("series")) {
        return Promise.resolve({ data: ["SeriesA"] });
      } else if (
        args &&
        args.startsWith(serviceConfig.measureService.baseUrl)
      ) {
        return Promise.resolve({
          data: {
            id: "m1234",
            createdBy: MEASURE_CREATEDBY,
            measureScoring: MeasureScoring.COHORT,
            measurementPeriodStart: "2023-01-01",
            measurementPeriodEnd: "2023-12-31",
          },
        });
      } else if (args && args.endsWith("test-cases")) {
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
      }
      return Promise.resolve({ data: null });
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
    const newBtn = await screen.findByRole("button", { name: "New Test Case" });
    userEvent.click(newBtn);
    const testCaseForm = await screen.findByTestId("create-test-case-form");
    expect(testCaseForm).toBeInTheDocument();
    const tcDescriptionLabel = await screen.findByText("Test Case Description");
    expect(tcDescriptionLabel).toBeInTheDocument();
    const tcDescriptionInput = await screen.findByTestId(
      "create-test-case-description"
    );
    expect(tcDescriptionInput).toBeInTheDocument();
    const createBtn = await screen.findByRole("button", {
      name: "Create Test Case",
    });
    expect(createBtn).toBeInTheDocument();
    const cancelBtn = await screen.findByRole("button", { name: "Cancel" });
    expect(cancelBtn).toBeInTheDocument();
    const newBtn2 = screen.queryByRole("button", { name: "New Test Case" });
    expect(newBtn2).not.toBeInTheDocument();
  });

  it("should allow navigation to create page, then back to landing page ", async () => {
    mockedAxios.get.mockImplementation((args) => {
      if (args && args.endsWith("series")) {
        return Promise.resolve({ data: ["SeriesA"] });
      } else if (
        args &&
        args.startsWith(serviceConfig.measureService.baseUrl)
      ) {
        return Promise.resolve({
          data: {
            id: "m1234",
            createdBy: MEASURE_CREATEDBY,
            measureScoring: MeasureScoring.COHORT,
            measurementPeriodStart: "2023-01-01",
            measurementPeriodEnd: "2023-12-31",
          },
        });
      } else if (args && args.endsWith("test-cases")) {
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
      }
      return Promise.resolve({ data: null });
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
    const newBtn = await screen.findByRole("button", { name: "New Test Case" });
    userEvent.click(newBtn);
    const testCaseForm = await screen.findByTestId("create-test-case-form");
    expect(testCaseForm).toBeInTheDocument();
    const cancelBtn = await screen.findByRole("button", { name: "Cancel" });
    expect(cancelBtn).toBeInTheDocument();
    userEvent.click(cancelBtn);
    const newBtn2 = await screen.findByRole("button", {
      name: "New Test Case",
    });
    expect(newBtn2).toBeInTheDocument();
  });

  it("should navigate back to landing page when test case is successfully saved", async () => {
    jest.useFakeTimers("modern");
    mockedAxios.get.mockImplementation((args) => {
      if (args && args.endsWith("series")) {
        return Promise.resolve({ data: ["SeriesA"] });
      } else if (
        args &&
        args.startsWith(serviceConfig.measureService.baseUrl)
      ) {
        return Promise.resolve({
          data: {
            id: "m1234",
            createdBy: MEASURE_CREATEDBY,
            measureScoring: MeasureScoring.COHORT,
            measurementPeriodStart: "2023-01-01",
            measurementPeriodEnd: "2023-12-31",
          },
        });
      } else if (args && args.endsWith("test-cases")) {
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
      }
    });

    render(
      <MemoryRouter initialEntries={["/measures/m1234/edit/test-cases"]}>
        <ApiContextProvider value={serviceConfig}>
          <TestCaseRoutes />
        </ApiContextProvider>
      </MemoryRouter>
    );

    mockedAxios.post.mockResolvedValue({
      data: {
        id: "testID",
        description: "Some Description",
        createdBy: MEASURE_CREATEDBY,
        hapiOperationOutcome: {
          code: 201,
        },
      },
    });

    const testCaseTitle = await screen.findByText("TC1");
    expect(testCaseTitle).toBeInTheDocument();
    const newBtn = screen.getByRole("button", { name: "New Test Case" });
    userEvent.click(newBtn);
    const testCaseForm = await screen.findByTestId("create-test-case-form");
    expect(testCaseForm).toBeInTheDocument();
    const tcDescriptionInput = screen.getByTestId(
      "create-test-case-description"
    );
    userEvent.type(tcDescriptionInput, "Some Description");
    await waitFor(() => {
      expect(tcDescriptionInput).toHaveValue("Some Description");
    });
    const createBtn = screen.getByRole("button", { name: "Create Test Case" });
    userEvent.click(createBtn);
    const feedback = await screen.findByRole("alert");
    expect(feedback).toHaveTextContent(
      "Test case created successfully! Redirecting back to Test Cases..."
    );
    act(() => {
      jest.advanceTimersByTime(3500);
    });
    const newBtn2 = await screen.findByRole("button", {
      name: "New Test Case",
    });
    expect(newBtn2).toBeInTheDocument();
  });

  it("should render 404 page", async () => {
    const { getByTestId } = render(
      <MemoryRouter initialEntries={["/measures/m1234/edit/test-case"]}>
        <TestCaseRoutes />
      </MemoryRouter>
    );

    expect(getByTestId("404-page")).toBeInTheDocument();
    expect(getByTestId("404-page-link")).toBeInTheDocument();
  });
});
