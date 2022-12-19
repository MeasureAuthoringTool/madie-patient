import * as React from "react";
import { describe, expect, test } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import StatusHandler from "./StatusHandler";

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
});
