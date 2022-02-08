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
  let testCases;
  beforeEach(() => {
    testCases = [
      {
        id: "1234",
        description: "Test IPP",
        title: "WhenAllGood",
        series: "IPP_Pass",
      },
      {
        id: "5678",
        description: "Test IPP Fail when something is wrong",
        title: "WhenSomethingIsWrong",
        series: "IPP_Fail",
      },
    ];
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render list of test cases", async () => {
    mockedAxios.get.mockResolvedValue({
      data: testCases,
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
      expect(tableHeaders[0]).toHaveTextContent("Title");
      expect(tableHeaders[1]).toHaveTextContent("Series");
      expect(tableHeaders[2]).toHaveTextContent("Status");

      const tableRows = table.querySelectorAll("tbody tr");
      expect(tableRows[0]).toHaveTextContent(testCases[0].title);
      expect(tableRows[0]).toHaveTextContent(testCases[0].series);
      expect(
        screen.getByTestId(`edit-test-case-${testCases[0].id}`)
      ).toBeInTheDocument();

      expect(tableRows[1]).toHaveTextContent(testCases[1].title);
      expect(tableRows[1]).toHaveTextContent(testCases[1].series);
      expect(
        screen.getByTestId(`edit-test-case-${testCases[1].id}`)
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
    mockedAxios.get.mockResolvedValue({
      data: testCases,
    });

    const { getByTestId } = render(
      <MemoryRouter>
        <ApiContextProvider value={serviceConfig}>
          <TestCaseList />
        </ApiContextProvider>
      </MemoryRouter>
    );
    await waitFor(() => {
      const editButton = getByTestId(`edit-test-case-${testCases[0].id}`);
      fireEvent.click(editButton);
      expect(mockedUsedNavigate).toHaveBeenCalled();
    });
  });
});
