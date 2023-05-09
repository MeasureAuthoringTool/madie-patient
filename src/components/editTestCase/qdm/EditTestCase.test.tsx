import * as React from "react";
import { render, screen } from "@testing-library/react";
import EditTestCase from "./EditTestCase";

jest.mock("@madie/madie-util", () => {
  return {
    useDocumentTitle: jest.fn(),
  };
});

describe("EditTestCase QDM Component", () => {
  it("should render qdm edit test case component along with run execution button", async () => {
    render(<EditTestCase />);
    const runTestCaseButton = await screen.getByRole("button", {
      name: "QDM Run Execution",
    });
    expect(runTestCaseButton).toBeInTheDocument();
  });
});
