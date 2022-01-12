import * as React from "react";
import { act, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import TestCaseLayout from "./TestCaseLayout";
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

describe("TestCaseLayout", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render the landing component first", () => {
    render(
      <MemoryRouter initialEntries={["/measure/m1234/edit/patients"]}>
        <TestCaseLayout />
      </MemoryRouter>
    );

    const createBtn = screen.getByRole("button", { name: "New Test Case" });
    expect(createBtn).toBeInTheDocument();
  });

  it("should allow navigation to create page from landing page ", () => {
    render(
      <MemoryRouter initialEntries={["/measure/m1234/edit/patients"]}>
        <TestCaseLayout />
      </MemoryRouter>
    );

    const newBtn = screen.getByRole("button", { name: "New Test Case" });
    userEvent.click(newBtn);
    const testCaseForm = screen.getByTestId("create-test-case-form");
    expect(testCaseForm).toBeInTheDocument();
    const tcDescriptionLabel = screen.getByText("Test Case Description");
    expect(tcDescriptionLabel).toBeInTheDocument();
    const tcDescriptionInput = screen.getByTestId(
      "create-test-case-description"
    );
    expect(tcDescriptionInput).toBeInTheDocument();
    const createBtn = screen.getByRole("button", { name: "Create Test Case" });
    expect(createBtn).toBeInTheDocument();
    const cancelBtn = screen.getByRole("button", { name: "Cancel" });
    expect(cancelBtn).toBeInTheDocument();
    const newBtn2 = screen.queryByRole("button", { name: "New Test Case" });
    expect(newBtn2).not.toBeInTheDocument();
  });

  it("should allow navigation to create page, then back to landing page ", () => {
    render(
      <MemoryRouter initialEntries={["/measure/m1234/edit/patients"]}>
        <TestCaseLayout />
      </MemoryRouter>
    );

    const newBtn = screen.getByRole("button", { name: "New Test Case" });
    userEvent.click(newBtn);
    const testCaseForm = screen.getByTestId("create-test-case-form");
    expect(testCaseForm).toBeInTheDocument();
    const cancelBtn = screen.getByRole("button", { name: "Cancel" });
    expect(cancelBtn).toBeInTheDocument();
    userEvent.click(cancelBtn);
    const newBtn2 = screen.getByRole("button", { name: "New Test Case" });
    expect(newBtn2).toBeInTheDocument();
  });

  it("should navigate back to landing page when test case is successfully saved", async () => {
    jest.useFakeTimers("modern");
    render(
      <MemoryRouter initialEntries={["/measure/m1234/edit/patients"]}>
        <ApiContextProvider value={serviceConfig}>
          <TestCaseLayout />
        </ApiContextProvider>
      </MemoryRouter>
    );
    mockedAxios.post.mockResolvedValue({
      data: {
        id: "testID",
        description: "Some Description",
      },
    });

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
      "Test case saved successfully! Redirecting back to Test Cases..."
    );
    act(() => {
      jest.advanceTimersByTime(3500);
    });
    // jest.advanceTimersByTime(3500);
    const newBtn2 = await screen.findByRole("button", {
      name: "New Test Case",
    });
    expect(newBtn2).toBeInTheDocument();
    // await waitFor(
    //   () => {
    //     jest.advanceTimersByTime(3500);
    //     const newBtn2 = screen.getByRole("button", {
    //       name: "New Test Case",
    //     });
    //     expect(newBtn2).toBeInTheDocument();
    //   },
    //   { timeout: 5000 }
    // );
  });
});
