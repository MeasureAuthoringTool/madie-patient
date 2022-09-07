import * as React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import TestCaseRoutes from "./TestCaseRoutes";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import { ApiContextProvider, ServiceConfig } from "../../api/ServiceContext";
import { MeasureScoring } from "@madie/madie-models";
import { getExampleValueSet } from "../../util/CalculationTestHelpers";
import { Bundle } from "fhir/r4";

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
  terminologyService: {
    baseUrl: "something.com",
  },
};

const MEASURE_CREATEDBY = "testuser";
const measureBundle = {} as Bundle;
const valueSets = [getExampleValueSet()];
const measure = {
  id: "m1234",
  model: "QI-Core v4.1.1",
  cqlLibraryName: "CM527Library",
  measurementPeriodStart: "01/05/2022",
  measurementPeriodEnd: "03/07/2022",
  active: true,
  cqlErrors: false,
  elmJson: "Fak3",
  groups: [],
  createdBy: MEASURE_CREATEDBY,
};

jest.mock("@madie/madie-util", () => ({
  measureStore: {
    updateMeasure: jest.fn((measure) => measure),
    state: null,
    initialState: null,
    subscribe: (set) => {
      set(measure);
      return { unsubscribe: () => null };
    },
    unsubscribe: () => null,
  },
  useOktaTokens: () => ({
    getAccessToken: () => "test.jwt",
    getUserName: () => MEASURE_CREATEDBY,
  }),
}));

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
    const editBtn = screen.getByRole("button", { name: "Edit" });
    expect(editBtn).toBeInTheDocument();
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
    userEvent.click(screen.getByTestId("details-tab"));
    const testCaseForm = await screen.findByTestId("create-test-case-form");
    expect(testCaseForm).toBeInTheDocument();
    const tcDescriptionLabel = await screen.findByText("Test Case Description");
    expect(tcDescriptionLabel).toBeInTheDocument();
    const tcDescriptionInput = await screen.findByTestId(
      "create-test-case-description"
    );
    expect(tcDescriptionInput).toBeInTheDocument();
    const createBtn = await screen.findByRole("button", {
      name: "Save",
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
    userEvent.click(screen.getByTestId("details-tab"));
    const testCaseForm = await screen.findByTestId("create-test-case-form");
    expect(testCaseForm).toBeInTheDocument();
    const cancelBtn = await screen.findByRole("button", {
      name: "Discard Changes",
    });
    expect(cancelBtn).toBeInTheDocument();
    userEvent.click(cancelBtn);
    const newBtn2 = await screen.findByRole("button", {
      name: "New Test Case",
    });
    expect(newBtn2).toBeInTheDocument();
  });

  it("should save test case successfully", async () => {
    jest.useFakeTimers("modern");
    mockedAxios.get.mockImplementation((args) => {
      if (args && args.endsWith("series")) {
        return Promise.resolve({ data: ["SeriesA"] });
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
      } else if (args?.endsWith("/bundles")) {
        return Promise.resolve({ data: measureBundle });
      } else if (args?.endsWith("/value-sets/searches")) {
        return Promise.resolve({ data: [valueSets] });
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
    userEvent.click(screen.getByTestId("details-tab"));
    const testCaseForm = await screen.findByTestId("create-test-case-form");
    expect(testCaseForm).toBeInTheDocument();
    const tcTitle = await screen.findByTestId("create-test-case-title");
    expect(tcTitle).toBeInTheDocument();
    userEvent.type(tcTitle, "TC1");
    await waitFor(() => {
      expect(tcTitle).toHaveValue("TC1");
    });
    const tcDescriptionInput = screen.getByTestId(
      "create-test-case-description"
    );
    userEvent.type(tcDescriptionInput, "Some Description");
    await waitFor(() => {
      expect(tcDescriptionInput).toHaveValue("Some Description");
    });
    const createBtn = screen.getByRole("button", { name: "Save" });
    userEvent.click(createBtn);
    const feedback = await screen.findByRole("alert");
    expect(feedback).toHaveTextContent("Test case created successfully!");
  });

  it("Fetch measure bundle on Routes load", async () => {
    mockedAxios.get.mockImplementation((args) => {
      if (args?.endsWith("/bundles")) {
        return Promise.resolve({ data: measureBundle });
      } else if (args?.endsWith("/value-sets/searches")) {
        return Promise.resolve({ data: [valueSets] });
      }
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
    const editBtn = screen.getByRole("button", { name: "Edit" });
    expect(editBtn).toBeInTheDocument();
  });

  it("should render 404 page", async () => {
    const { getByTestId } = render(
      <MemoryRouter initialEntries={["/measures/m1234/edit/test-case"]}>
        <ApiContextProvider value={serviceConfig}>
          <TestCaseRoutes />
        </ApiContextProvider>
      </MemoryRouter>
    );

    expect(getByTestId("404-page")).toBeInTheDocument();
    expect(getByTestId("404-page-link")).toBeInTheDocument();
  });
});
