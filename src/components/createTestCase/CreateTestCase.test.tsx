import * as React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import CreateTestCase from "./CreateTestCase";
import userEvent from "@testing-library/user-event";

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
        <CreateTestCase />
      </MemoryRouter>
    );

    const descriptionInput = screen.getByTestId("create-test-case-description");
    userEvent.type(descriptionInput, "TestCase123");

    const createBtn = screen.getByRole("button", { name: "Create Test Case" });
    userEvent.click(createBtn);

    const debugOutput = await screen.findByText(
      'create: {"description":"TestCase123"}'
    );
    expect(debugOutput).toBeInTheDocument();
  });
  //
});
