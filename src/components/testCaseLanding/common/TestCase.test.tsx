import * as React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import TestCaseComponent from "../common/TestCase";
import { ApiContextProvider, ServiceConfig } from "../../../api/ServiceContext";
import { ExecutionContextProvider } from "../../routes/qiCore/ExecutionContext";
import {
  Measure,
  MeasureScoring,
  PopulationType,
  TestCase,
} from "@madie/madie-models";
import {
  buildMeasureBundle,
  getExampleValueSet,
} from "../../../util/CalculationTestHelpers";
import { simpleMeasureFixture } from "../../createTestCase/__mocks__/simpleMeasureFixture";

const testCase = {
  id: "ID1",
  title: "TEST IPP",
  description: "TEST DESCRIPTION",
  series: "TEST SERIES",
  executionStatus: "pass",
} as unknown as TestCase;

const serviceConfig: ServiceConfig = {
  measureService: {
    baseUrl: "measure.url",
  },
  testCaseService: {
    baseUrl: "base.url",
  },
  terminologyService: {
    baseUrl: "something.com",
  },
  elmTranslationService: {
    baseUrl: "",
  },
};

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
  acls: [{ userId: "othertestuser@example.com", roles: ["SHARED_WITH"] }],
} as unknown as Measure;

const measureBundle = buildMeasureBundle(simpleMeasureFixture);
const valueSets = [getExampleValueSet()];
const setMeasure = jest.fn();
const setMeasureBundle = jest.fn();
const setValueSets = jest.fn();
const setError = jest.fn();

const renderWithTestCase = (
  canEdit: boolean,
  measure: Measure = defaultMeasure
) => {
  return render(
    <MemoryRouter>
      <ApiContextProvider value={serviceConfig}>
        <ExecutionContextProvider
          value={{
            measureState: [measure, setMeasure],
            bundleState: [measureBundle, setMeasureBundle],
            valueSetsState: [valueSets, setValueSets],
            executionContextReady: true,
            executing: false,
            setExecuting: jest.fn(),
          }}
        >
          <TestCaseComponent
            testCase={testCase}
            canEdit={canEdit}
            executionResult={[]}
            deleteTestCase={jest.fn()}
            exportTestCase={jest.fn()}
          />
        </ExecutionContextProvider>
      </ApiContextProvider>
    </MemoryRouter>
  );
};

describe("TestCase component", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render test case population table and show available actions for owners and shared owners", async () => {
    const table = document.createElement("table");
    renderWithTestCase(true);

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
    renderWithTestCase(false);

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
});
