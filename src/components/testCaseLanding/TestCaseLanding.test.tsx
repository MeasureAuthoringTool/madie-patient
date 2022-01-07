import * as React from "react";
import { render, screen } from "@testing-library/react";
import TestCaseLanding from "./TestCaseLanding";
import { MemoryRouter } from "react-router-dom";

describe("TestCaseLanding component", () => {
  it("should render the landing component with a button to create new test case", () => {
    render(
      <MemoryRouter>
        <TestCaseLanding />
      </MemoryRouter>
    );
    const newTestCase = screen.getByRole("button", { name: "New Test Case" });
    expect(newTestCase).toBeInTheDocument();
  });
});
