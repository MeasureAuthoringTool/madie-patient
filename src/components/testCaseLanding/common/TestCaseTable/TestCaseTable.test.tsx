import * as React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import TestCaseTable from "./TestCaseTable";
import {
  Measure,
  MeasureScoring,
  PopulationType,
  TestCase,
} from "@madie/madie-models";
const testCase = {
  id: "ID",
  title: "TEST IPP",
  description: "TEST DESCRIPTION",
  series: "TEST SERIES",
  executionStatus: "pass",
} as unknown as TestCase;
const testCaseFail = {
  id: "ID1",
  title: "TEST IPP1",
  description: "TEST DESCRIPTION1",
  series: "TEST SERIES1",
  executionStatus: "fail",
} as unknown as TestCase;
const testCaseNA = {
  id: "ID2",
  title: "TEST IPP2",
  description: "TEST DESCRIPTION2",
  series: "TEST SERIES2",
  executionStatus: "NA",
} as unknown as TestCase;

const testCaseInvalid = {
  id: "ID3",
  title: "TEST IPP3",
  description: "TEST DESCRIPTION3",
  series: "TEST SERIES3",
  executionStatus: "Invalid",
} as unknown as TestCase;

const testCases = [testCase, testCaseFail, testCaseNA, testCaseInvalid];

const defaultMeasure = {
  id: "m1234",
  measureScoring: MeasureScoring.COHORT,
  createdBy: "testuser",
  groups: [
    {
      groupId: "Group1_ID",
      scoring: "Cohort",
      populations: [
        {
          id: "id-1",
          name: PopulationType.INITIAL_POPULATION,
          definition: "Pop1",
        },
      ],
      stratifications: [
        {
          id: "strat-id-1",
        },
      ],
    },
  ],
  model: "QI-Core v4.1.1",
  acls: [{ userId: "othertestuser@example.com", roles: ["SHARED_WITH"] }],
} as unknown as Measure;

let mockApplyDefaults = false;
jest.mock("@madie/madie-util", () => ({
  useFeatureFlags: () => {
    return { applyDefaults: mockApplyDefaults };
  },
}));

const renderWithTestCase = (
  testCases,
  canEdit,
  deleteTestCase,
  exportTestCase,
  onCloneTestCase,
  measure
) => {
  return render(
    <MemoryRouter>
      <TestCaseTable
        testCases={testCases}
        canEdit={canEdit}
        deleteTestCase={deleteTestCase}
        exportTestCase={exportTestCase}
        onCloneTestCase={onCloneTestCase}
        measure={measure}
      />
    </MemoryRouter>
  );
};

describe("TestCase component", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render test case population table and show available actions for owners and shared owners", async () => {
    const deleteTestCase = jest.fn();
    const exportTestCase = jest.fn();
    const onCloneTestCase = jest.fn();

    renderWithTestCase(
      testCases,
      true,
      deleteTestCase,
      exportTestCase,
      onCloneTestCase,
      defaultMeasure
    );

    const rows = await screen.findByTestId(`test-case-row-0`);
    const columns = rows.querySelectorAll("td");
    expect(columns[0]).toHaveTextContent("Pass");
    expect(columns[1]).toHaveTextContent(testCase.series);
    expect(columns[2]).toHaveTextContent(testCase.title);
    expect(columns[3]).toHaveTextContent(testCase.description);

    const buttons = await screen.findAllByRole("button");
    expect(buttons).toHaveLength(9);
    expect(buttons[5]).toHaveTextContent("Select");
    fireEvent.click(buttons[5]);
    expect(screen.getByText("edit")).toBeInTheDocument();
    expect(screen.getByText("export transaction bundle")).toBeInTheDocument();
    expect(screen.getByText("export collection bundle")).toBeInTheDocument();
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
    const deleteTestCase = jest.fn();
    const exportTestCase = jest.fn();
    const onCloneTestCase = jest.fn();
    renderWithTestCase(
      testCases,
      false,
      deleteTestCase,
      exportTestCase,
      onCloneTestCase,
      defaultMeasure
    );
    const rows = await screen.findByTestId(`test-case-row-0`);
    const columns = rows.querySelectorAll("td");
    expect(columns[0]).toHaveTextContent("Pass");
    expect(columns[1]).toHaveTextContent(testCase.series);
    expect(columns[2]).toHaveTextContent(testCase.title);
    expect(columns[3]).toHaveTextContent(testCase.description);

    const buttons = await screen.findAllByRole("button");
    expect(buttons).toHaveLength(9);
    expect(buttons[5]).toHaveTextContent("Select");
    fireEvent.click(buttons[5]);
    expect(screen.getByText("view")).toBeInTheDocument();
  });

  it("triggers handle close with escape key", async () => {
    const deleteTestCase = jest.fn();
    const exportTestCase = jest.fn();
    const onCloneTestCase = jest.fn();

    renderWithTestCase(
      testCases,
      true,
      deleteTestCase,
      exportTestCase,
      onCloneTestCase,
      defaultMeasure
    );

    const buttons = await screen.findAllByRole("button");
    expect(buttons).toHaveLength(9);
    expect(buttons[5]).toHaveTextContent("Select");
    fireEvent.click(buttons[5]);

    expect(screen.getByText("edit")).toBeInTheDocument();

    fireEvent.keyDown(screen.getByText(/edit/i), {
      key: "Escape",
      code: "Escape",
      keyCode: 27,
      charCode: 27,
    });
  });

  it("should trigger export test case", async () => {
    const deleteTestCase = jest.fn();
    const exportTestCase = jest.fn();
    const onCloneTestCase = jest.fn();

    renderWithTestCase(
      testCases,
      true,
      deleteTestCase,
      exportTestCase,
      onCloneTestCase,
      defaultMeasure
    );

    const rows = await screen.findByTestId(`test-case-row-0`);
    const columns = rows.querySelectorAll("td");
    expect(columns[0]).toHaveTextContent("Pass");
    expect(columns[1]).toHaveTextContent(testCase.series);
    expect(columns[2]).toHaveTextContent(testCase.title);
    expect(columns[3]).toHaveTextContent(testCase.description);

    const buttons = await screen.findAllByRole("button");
    expect(buttons).toHaveLength(9);
    expect(buttons[5]).toHaveTextContent("Select");
    fireEvent.click(buttons[5]);
    expect(screen.getByText("edit")).toBeInTheDocument();
    expect(screen.getByText("export transaction bundle")).toBeInTheDocument();

    const exportButton = screen.getByText("export transaction bundle");
    fireEvent.click(exportButton);
    expect(exportTestCase).toHaveBeenCalled();
  });
});
