import * as React from "react";
import { render, screen, waitFor } from "@testing-library/react";
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

describe("TestCaseList component", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render list of test cases", async () => {
    render(
      <MemoryRouter>
        <ApiContextProvider value={serviceConfig}>
          <TestCaseList />
        </ApiContextProvider>
      </MemoryRouter>
    );
    mockedAxios.get.mockResolvedValue({
      data: [
        {
          id: "1234",
          description: "Test IPP",
        },
        {
          id: "5678",
          description: "Test DENOM Pass",
        },
      ],
    });

    await waitFor(() => {
      const table = screen.getByTestId("test-case-tbl");

      const tableHeaders = table.querySelectorAll("thead th");
      expect(tableHeaders[0]).toHaveTextContent("Description");
      expect(tableHeaders[1]).toHaveTextContent("Status");

      const tableRows = table.querySelectorAll("tbody tr");
      expect(tableRows[0]).toHaveTextContent("Test IPP");
      expect(tableRows[1]).toHaveTextContent("Test DENOM Pass");
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
});
