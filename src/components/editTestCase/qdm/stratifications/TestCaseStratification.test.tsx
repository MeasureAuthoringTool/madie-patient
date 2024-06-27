import * as React from "react";
import {
  render,
  screen,
  waitFor,
  fireEvent,
  act,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TestCaseStratification from "./TestCaseStratification";

describe("Test Case Stratification Component", () => {
  const { findByTestId, findByText, getByTestId } = screen;
  const renderStrats = (
    strataCode,
    executionRun,
    stratification,
    populationBasis,
    showExpected,
    onStratificationChange,
    QDM,
    index
  ) =>
    render(
      <TestCaseStratification
        strataCode={strataCode}
        executionRun={executionRun}
        stratification={stratification}
        stratResult={stratification}
        populationBasis={populationBasis}
        showExpected={showExpected}
        onStratificationChange={onStratificationChange}
        QDM={QDM}
        index={index}
      />
    );

  it("component renders with default values when omitted", () => {
    const onStratChange = jest.fn();
    renderStrats(
      "testcode",
      false,
      { actual: false, name: "strat-name" },
      "boolean",
      undefined,
      onStratChange,
      undefined,
      1
    );
    expect(
      getByTestId("test-row-population-id-strat-name")
    ).toBeInTheDocument();
  });

  it("when QDM flag is enabled we display Stratification", async () => {
    const onStratChange = jest.fn();
    renderStrats(
      "testcode",
      true,
      { actual: false, name: "strat-name" },
      "boolean",
      undefined,
      onStratChange,
      true,
      1
    );
    const targetText = await findByText("Stratification");
    expect(targetText).toBeInTheDocument();
    const targetID = await findByTestId(
      `test-stratification-strat-name-actual-1`
    );
    expect(targetID).toBeInTheDocument();
  });
  it("when QDM flag is not enabled we display strataCode", async () => {
    const onStratChange = jest.fn();
    renderStrats(
      "testcode",
      true,
      { actual: false, name: "strat-name" },
      "boolean",
      undefined,
      onStratChange,
      false,
      1
    );
    const targetText = await findByText("testcode");
    expect(targetText).toBeInTheDocument();
    const targetID = await findByTestId(
      `test-stratification-strat-name-actual`
    );
    expect(targetID).toBeInTheDocument();
  });
  it("When the checkbox is clicked, passed in function is fired with expected items", async () => {
    const onStratChange = jest.fn();
    renderStrats(
      "testcode",
      true,
      {
        actual: false,
        name: "strat-name",
        expected: false,
        "data-testid": "input-test",
      },
      "boolean",
      undefined,
      onStratChange,
      false,
      1
    );
    const targetText = await findByText("testcode");
    expect(targetText).toBeInTheDocument();
    const input = await findByTestId("test-population-strat-name-expected");
    expect(input).toBeInTheDocument();
    act(() => {
      fireEvent.click(input);
      userEvent.type(input, "t");
    });
    await waitFor(() => {
      expect(onStratChange).toHaveBeenCalledWith({
        actual: false,
        "data-testid": "input-test",
        expected: "t",
        name: "strat-name",
      });
    });
  });
});
