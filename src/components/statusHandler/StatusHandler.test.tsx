import * as React from "react";
import { render, screen } from "@testing-library/react";
import StatusHandler from "./StatusHandler";
import { TestCaseImportOutcome } from "../../../../madie-models/src/TestCase";

describe("StatusHandler Component", () => {
  const { getByTestId, queryByTestId, getByText } = screen;
  test("Should display nothing when error is false", () => {
    render(
      <StatusHandler
        error={false}
        errorMessages={[]}
        testDataId="test_data_id"
      />
    );
    expect(queryByTestId("test_data_id")).not.toBeInTheDocument();
  });

  test("Should display nothing when error is true but errorMessages are empty", () => {
    render(
      <StatusHandler
        error={true}
        errorMessages={[]}
        testDataId="test_data_id"
      />
    );
    expect(queryByTestId("test_data_id")).not.toBeInTheDocument();
  });

  test("Should display single error", () => {
    render(
      <StatusHandler
        error={true}
        errorMessages={["test error"]}
        testDataId="test_data_id"
      />
    );
    expect(getByTestId("test_data_id")).toBeInTheDocument();
    expect(getByText("test error")).toBeInTheDocument();
  });

  test("Should display multiple errors", () => {
    render(
      <StatusHandler
        error={true}
        errorMessages={["test error 1", "test error 2"]}
        testDataId="test_data_id"
      />
    );
    expect(getByTestId("test_data_id")).toBeInTheDocument();
    expect(getByText("2 errors were found")).toBeInTheDocument();
    expect(getByTestId("generic-fail-text-list")).toBeInTheDocument();
    expect(getByText("test error 1")).toBeInTheDocument();
    expect(getByText("test error 2")).toBeInTheDocument();
  });

  it("Should display import warning alert", () => {
    const importWarnings: TestCaseImportOutcome[] = [
      {
        patientId: "test.patientId",
        message: "Error while processing Test Case Json.",
        successful: false,
      },
      {
        patientId: "test.patientId2",
        message: "Patient Id is not found",
        successful: false,
      },
    ];
    render(<StatusHandler importWarnings={importWarnings} />);
    expect(screen.getAllByTestId("failed-test-cases")).toHaveLength(2);
  });

  it("Should display import warning alert for successful imports with warnings", () => {
    const importWarnings: TestCaseImportOutcome[] = [
      {
        patientId: "test.patientId",
        message: "Error while processing Test Case Json.",
        successful: false,
      },
      {
        patientId: "test.patientId2",
        message:
          "The measure populations do not match the populations in the import file. No expected values have been set.",
        successful: true,
      },
    ];
    render(<StatusHandler importWarnings={importWarnings} />);
    expect(screen.getAllByTestId("failed-test-cases")).toHaveLength(1);
    expect(screen.getAllByTestId("success-imports-with-warnings")).toHaveLength(
      1
    );
  });

  it("Should not display import warning alert", () => {
    const importWarnings: TestCaseImportOutcome[] = [];
    render(<StatusHandler importWarnings={importWarnings} />);
    expect(screen.queryByTestId("failed-test-cases")).toBeNull();
  });
});
