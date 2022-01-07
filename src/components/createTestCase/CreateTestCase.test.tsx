import * as React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import CreateTestCase from "./CreateTestCase";

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
});
