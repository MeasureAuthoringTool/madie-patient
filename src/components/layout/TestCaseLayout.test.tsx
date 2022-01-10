import * as React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import TestCaseLayout from "./TestCaseLayout";
import userEvent from "@testing-library/user-event";

describe("TestCaseLayout", () => {
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
});
