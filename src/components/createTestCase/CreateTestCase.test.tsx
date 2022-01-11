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

describe("CreateTestCase component", () => {
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
      "Test case saved successfully! Redirecting to Patients..."
    );
    expect(debugOutput).toBeInTheDocument();
  });
});
