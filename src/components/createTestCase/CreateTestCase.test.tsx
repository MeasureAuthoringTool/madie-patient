import * as React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import CreateTestCase from "./CreateTestCase";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import { ApiContextProvider, ServiceConfig } from "../../api/ServiceContext";

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

describe("CreateTestCase component", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render create test case page", () => {
    render(
      <MemoryRouter>
        <CreateTestCase />
      </MemoryRouter>
    );
    const descriptionTextArea = screen.getByTestId(
      "create-test-case-description"
    );
    expect(descriptionTextArea).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Create Test Case" })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
  });

  it("should create test case when create button is clicked", async () => {
    render(
      <MemoryRouter>
        <ApiContextProvider value={serviceConfig}>
          <CreateTestCase />
        </ApiContextProvider>
      </MemoryRouter>
    );
    const testCaseDescription = "TestCase123";
    mockedAxios.post.mockResolvedValue({
      data: {
        id: "testID",
        description: testCaseDescription,
      },
    });

    const descriptionInput = screen.getByTestId("create-test-case-description");
    userEvent.type(descriptionInput, testCaseDescription);

    const createBtn = screen.getByRole("button", { name: "Create Test Case" });
    userEvent.click(createBtn);

    const debugOutput = await screen.findByText(
      "Test case saved successfully! Redirecting back to Test Cases..."
    );
    expect(debugOutput).toBeInTheDocument();
  });

  it("should provide user alert when create test case fails", async () => {
    render(
      <MemoryRouter>
        <ApiContextProvider value={serviceConfig}>
          <CreateTestCase />
        </ApiContextProvider>
      </MemoryRouter>
    );
    const testCaseDescription = "TestCase123";
    mockedAxios.post.mockRejectedValue({
      data: {
        error: "Random error",
      },
    });

    const descriptionInput = screen.getByTestId("create-test-case-description");
    userEvent.type(descriptionInput, testCaseDescription);

    const createBtn = screen.getByRole("button", { name: "Create Test Case" });
    userEvent.click(createBtn);

    const alert = await screen.findByRole("alert");
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveTextContent(
      "An error occurred while creating the test case."
    );
  });

  it("should provide user alert for a success result but response is missing ID attribute", async () => {
    render(
      <MemoryRouter>
        <ApiContextProvider value={serviceConfig}>
          <CreateTestCase />
        </ApiContextProvider>
      </MemoryRouter>
    );
    const testCaseDescription = "TestCase123";
    mockedAxios.post.mockResolvedValue({
      data: `The requested URL was rejected. Please contact soc@hcqis.org.
            
             Your support ID is: 12345678901234567890
            `,
    });

    const descriptionInput = screen.getByTestId("create-test-case-description");
    userEvent.type(descriptionInput, testCaseDescription);

    const createBtn = screen.getByRole("button", { name: "Create Test Case" });
    userEvent.click(createBtn);

    const alert = await screen.findByRole("alert");
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveTextContent(
      "An error occurred - create did not return the expected successful result."
    );
  });

  it("should clear error alert when user clicks alert close button", async () => {
    render(
      <MemoryRouter>
        <ApiContextProvider value={serviceConfig}>
          <CreateTestCase />
        </ApiContextProvider>
      </MemoryRouter>
    );
    const testCaseDescription = "TestCase123";
    mockedAxios.post.mockRejectedValue({
      data: {
        error: "Random error",
      },
    });

    const descriptionInput = screen.getByTestId("create-test-case-description");
    userEvent.type(descriptionInput, testCaseDescription);

    const createBtn = screen.getByRole("button", { name: "Create Test Case" });
    userEvent.click(createBtn);

    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent(
      "An error occurred while creating the test case."
    );

    const closeAlertBtn = screen.getByRole("button", { name: "Close Alert" });
    userEvent.click(closeAlertBtn);

    const dismissedAlert = await screen.queryByRole("alert");
    expect(dismissedAlert).not.toBeInTheDocument();
  });
});
