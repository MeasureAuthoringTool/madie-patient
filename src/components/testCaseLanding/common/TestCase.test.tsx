import * as React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import TestCaseComponent from "../common/TestCase";

describe("TestCase component", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const testCase = {
    id: "ID1",
    title: "TEST IPP",
    description: "TEST DESCRIPTION",
    series: "TEST SERIES",
    executionStatus: "pass",
  };

  it("should render test case population table and show available actions for owners and shared owners", async () => {
    const table = document.createElement("table");
    render(
      <tbody>
        <MemoryRouter>
          <TestCaseComponent testCase={testCase} canEdit={true} />
        </MemoryRouter>
      </tbody>,
      { container: document.body.appendChild(table) }
    );

    const rows = await screen.findByTestId(`test-case-row-${testCase.id}`);
    const columns = rows.querySelectorAll("td");
    expect(columns[0]).toHaveTextContent("Pass");
    expect(columns[1]).toHaveTextContent(testCase.series);
    expect(columns[2]).toHaveTextContent(testCase.title);
    expect(columns[3]).toHaveTextContent(testCase.description);

    const buttons = await screen.findAllByRole("button");
    expect(buttons).toHaveLength(1);
    expect(buttons[0]).toHaveTextContent("Select");
    fireEvent.click(buttons[0]);
    expect(screen.getByText("edit")).toBeInTheDocument();
    expect(screen.getByText("export")).toBeInTheDocument();
    expect(screen.getByText("delete")).toBeInTheDocument();

    const deleteButton = screen.getByText("delete");
    fireEvent.click(deleteButton);

    expect(screen.getByText("Delete Test Case")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
    expect(screen.getByText("Yes, Delete")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Cancel"));
    await waitFor(() => {
      const submitButton = screen.queryByText("Yes, Delete");
      expect(submitButton).not.toBeInTheDocument();
    });
  });

  it("should render test casee view for now owners and no delete option", async () => {
    const table = document.createElement("table");
    render(
      <tbody>
        <MemoryRouter>
          <TestCaseComponent testCase={testCase} canEdit={false} />
        </MemoryRouter>
      </tbody>,
      { container: document.body.appendChild(table) }
    );

    const rows = await screen.findByTestId(`test-case-row-${testCase.id}`);
    const columns = rows.querySelectorAll("td");
    expect(columns[0]).toHaveTextContent("Pass");
    expect(columns[1]).toHaveTextContent(testCase.series);
    expect(columns[2]).toHaveTextContent(testCase.title);
    expect(columns[3]).toHaveTextContent(testCase.description);

    const buttons = await screen.findAllByRole("button");
    expect(buttons).toHaveLength(1);
    expect(buttons[0]).toHaveTextContent("Select");
    fireEvent.click(buttons[0]);
    expect(screen.getByText("view")).toBeInTheDocument();
  });

  it("should generate the test case zip file", async () => {
    const table = document.createElement("table");
    render(
      <tbody>
        <MemoryRouter>
          <TestCaseComponent testCase={testCase} canEdit={true} />
        </MemoryRouter>
      </tbody>,
      { container: document.body.appendChild(table) }
    );

    const buttons = await screen.findAllByRole("button");
    expect(buttons).toHaveLength(1);
    expect(buttons[0]).toHaveTextContent("Select");
    fireEvent.click(buttons[0]);

    window.URL.createObjectURL = jest
      .fn()
      .mockReturnValueOnce("http://fileurl");
    const exportButton = screen.getByText("export");
    expect(exportButton).toBeInTheDocument();
    fireEvent.click(exportButton);

    await waitFor(() => {
      expect(
        screen.getByText("Test case exported successfully")
      ).toBeInTheDocument();
    });
  });
});
