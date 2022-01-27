import * as React from "react";
import {
  fireEvent,
  getByTestId,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import axios from "axios";
import { ApiContextProvider, ServiceConfig } from "../../api/ServiceContext";
import TestCaseList from "./TestCaseList";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

const serviceConfig: ServiceConfig = {
  testCaseService: {
    baseUrl: "base.url",
  },
};

jest.mock("../../hooks/useOktaTokens", () =>
  jest.fn(() => ({
    getAccessToken: () => "test.jwt",
  }))
);

const mockedUsedNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...(jest.requireActual("react-router-dom") as any),
  useNavigate: () => mockedUsedNavigate,
}));

describe("TestCaseList component", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render list of test cases", async () => {
    const testCaseIds = ["1234", "5678"];
    mockedAxios.get.mockResolvedValue({
      data: [
        {
          id: testCaseIds[0],
          description: "Test IPP",
        },
        {
          id: testCaseIds[1],
          description: "Test DENOM Pass",
        },
      ],
    });

    render(
      <MemoryRouter>
        <ApiContextProvider value={serviceConfig}>
          <TestCaseList />
        </ApiContextProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      const table = screen.getByTestId("test-case-tbl");

      const tableHeaders = table.querySelectorAll("thead th");
      expect(tableHeaders[0]).toHaveTextContent("Description");
      expect(tableHeaders[1]).toHaveTextContent("Status");

      const tableRows = table.querySelectorAll("tbody tr");
      expect(tableRows[0]).toHaveTextContent("Test IPP");
      expect(
        screen.getByTestId(`edit-test-case-${testCaseIds[0]}`)
      ).toBeInTheDocument();

      expect(tableRows[1]).toHaveTextContent("Test DENOM Pass");
      expect(
        screen.getByTestId(`edit-test-case-${testCaseIds[1]}`)
      ).toBeInTheDocument();
    });
  });

  it("should show error message when fetch request fails", async () => {
    mockedAxios.get.mockRejectedValue("500 error");
    render(
      <MemoryRouter>
        <ApiContextProvider value={serviceConfig}>
          <TestCaseList />
        </ApiContextProvider>
      </MemoryRouter>
    );
    await waitFor(() => {
      const errorMessage = screen.getByTestId("display-tests-error");
      expect(errorMessage).toHaveTextContent(
        "Unable to retrieve test cases, please try later."
      );
    });
  });

  it("should navigate to the Test Case details page on edit button click", async () => {
    const testCaseIds = ["1234", "5678"];
    mockedAxios.get.mockResolvedValue({
      data: [
        {
          id: testCaseIds[0],
          description: "Test IPP",
        },
        {
          id: testCaseIds[1],
          description: "Test DENOM Pass",
        },
      ],
    });

    const { getByTestId } = render(
      <MemoryRouter>
        <ApiContextProvider value={serviceConfig}>
          <TestCaseList />
        </ApiContextProvider>
      </MemoryRouter>
    );
    await waitFor(() => {
      const editButton = getByTestId(`edit-test-case-${testCaseIds[0]}`);
      fireEvent.click(editButton);
      expect(mockedUsedNavigate).toHaveBeenCalled();
    });
  });
});
