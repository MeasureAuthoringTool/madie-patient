import * as React from "react";
import RunTestsButton from "./RunTestsButton";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const onRunTests = jest.fn();

describe("RunTestsButton", () => {
  it("RunTestsButton should be enabled with undefined shouldDisableRunTestsButton flag", () => {
    render(
      <RunTestsButton
        hasErrors={false}
        isExecutionContextReady={true}
        onRunTests={onRunTests}
        shouldDisableRunTestsButton={undefined}
      />
    );
    const executeButton = screen.getByTestId("execute-test-cases-button");
    expect(executeButton).toHaveProperty("disabled", false);
  });

  it("RunTestsButton should be enabled with no error, and shouldDisableRunTestsButton flag is false", () => {
    render(
      <RunTestsButton
        hasErrors={false}
        isExecutionContextReady={true}
        onRunTests={onRunTests}
        shouldDisableRunTestsButton={false}
      />
    );

    const executeButton = screen.getByTestId("execute-test-cases-button");
    expect(executeButton).toHaveProperty("disabled", false);
  });

  it("RunTestsButton should be disabled with error", () => {
    render(
      <RunTestsButton
        hasErrors={true}
        isExecutionContextReady={true}
        onRunTests={onRunTests}
        shouldDisableRunTestsButton={false}
      />
    );

    const executeButton = screen.getByTestId("execute-test-cases-button");
    expect(executeButton).toHaveProperty("disabled", true);
  });

  it("test click RunTestsButton execution is loading", () => {
    render(
      <RunTestsButton
        hasErrors={false}
        isExecutionContextReady={true}
        onRunTests={onRunTests}
        shouldDisableRunTestsButton={false}
      />
    );

    const executeButton = screen.getByTestId("execute-test-cases-button");
    expect(executeButton).toHaveProperty("disabled", false);

    userEvent.click(executeButton);
    expect(executeButton).toHaveProperty("disabled", true);
  });
});
