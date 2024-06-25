import * as React from "react";
import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import userEvent from "@testing-library/user-event";
import ShiftDatesDialog from "./ShiftDatesDialog";
import { TestCase } from "@madie/madie-models";

const testCase = {
  title: "test case title",
  series: "test case series",
} as TestCase;

describe("Shift Test Case Dates Dialog", () => {
  test("should render ShiftDatesDialog", async () => {
    await act(async () => {
      const { findByTestId } = render(
        <ShiftDatesDialog
          open={true}
          onClose={jest.fn}
          canEdit={true}
          testCase={testCase}
        />
      );

      expect(await findByTestId("shift-dates-dialog")).toBeInTheDocument();
      expect(await findByTestId("test case series")).toBeInTheDocument();
      expect(await findByTestId("test case title")).toBeInTheDocument();
      expect(await findByTestId("shift-dates-input")).toBeInTheDocument();

      const cancelBtn = await findByTestId("shift-dates-cancel-button");
      expect(cancelBtn).toBeInTheDocument();
      expect(cancelBtn).toBeEnabled();

      const saveBtn = await findByTestId("shift-dates-save-button");
      expect(saveBtn).toBeInTheDocument();
      expect(saveBtn).not.toBeEnabled();
    });
  });

  test("Save button enalbed when user fill in shift dates input", async () => {
    const onClose = jest.fn();
    await act(async () => {
      const { findByTestId, queryByTestId } = render(
        <ShiftDatesDialog
          open={true}
          onClose={onClose}
          canEdit={true}
          testCase={testCase}
        />
      );

      const shiftDatesInput = (await findByTestId(
        "shift-dates-input"
      )) as HTMLInputElement;
      expect(shiftDatesInput).toBeInTheDocument();

      const saveBtn = await findByTestId("shift-dates-save-button");
      expect(saveBtn).toBeInTheDocument();
      expect(saveBtn).not.toBeEnabled();

      userEvent.type(shiftDatesInput, "1");
      expect(shiftDatesInput.value).toBe("1");
      expect(saveBtn).toBeEnabled();

      userEvent.click(saveBtn);
      expect(queryByTestId("shift-dates-dialog")).toBeInTheDocument();
    });
  });
});
