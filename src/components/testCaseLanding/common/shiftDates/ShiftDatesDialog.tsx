import React from "react";
import { TestCase } from "@madie/madie-models";
import {
  MadieDialog,
  ReadOnlyTextField,
  NumberInput,
  Toast,
} from "@madie/madie-design-system/dist/react";
import { useFormik } from "formik";
import * as _ from "lodash";
import "./ShiftDatesDialog.scss";

interface shiftDatesDialogProps {
  open: boolean;
  onClose: Function;
  canEdit?: boolean;
  testCase?: TestCase;
  onTestCaseShiftDates?: (testCase: TestCase, shifted: number) => void;
}

const ShiftDatesDialog = ({
  open,
  onClose,
  canEdit,
  testCase,
  onTestCaseShiftDates,
}: shiftDatesDialogProps) => {
  const formik = useFormik({
    initialValues: {
      shiftDatesInput: "",
    },
    onSubmit: async (value) => {
      await handleSubmit(value);
      onClose();
    },
  });

  const handleSubmit = async (value) => {
    onTestCaseShiftDates(testCase, value.shiftDatesInput);
  };

  return (
    <MadieDialog
      form
      title="Shift Test Case dates"
      dialogProps={{
        onClose,
        open,
        onSubmit: formik.handleSubmit,
        maxWidth: "md",
        fullWidth: true,
      }}
      cancelButtonProps={{
        variant: "secondary",
        cancelText: "Cancel",
        "data-testid": "shift-dates-cancel-button",
      }}
      continueButtonProps={{
        variant: "cyan",
        type: "submit",
        "data-testid": "shift-dates-save-button",
        disabled: !(formik.isValid && formik.dirty),
        continueText: "Save",
      }}
    >
      <div
        data-testid="shift-dates-dialog"
        id="shift-dates-dialog"
        className="shift-dates-grid"
      >
        <div>
          <ReadOnlyTextField
            readOnly
            label="Group"
            placeholder=""
            id="testcase-series"
            data-testid={testCase?.series}
            value={testCase?.series}
            inputProps={{
              "data-testid": "current-testcase-series",
            }}
          />
        </div>
        <div>
          <ReadOnlyTextField
            readOnly
            label="Title"
            placeholder=""
            id="testcase-title"
            data-testid={testCase?.title}
            value={testCase?.title}
            inputProps={{
              "data-testid": "current-testcase-title",
            }}
          />
        </div>

        <div id="shift-test-case-dates-info" style={{ fontSize: 15 }}>
          Shift years on this test case by the number you enter. February 29th
          in leap years = February 28th in non leap years.
        </div>
        <div id="shift-test-case-dates-info" style={{ fontSize: 15 }}>
          Note that resulting years prior to 1900 will be set to 1900 and after
          9999 will be set to 9999.
        </div>
        <div>
          <NumberInput
            id="shift-dates"
            label="Shift Test Case Dates"
            placeholder="# of Years"
            disabled={!canEdit || _.isEmpty(testCase)}
            required={true}
            allowNegative={true}
            {...formik.getFieldProps("shiftDatesInput")}
            error={
              formik.touched.shiftDatesInput &&
              Boolean(formik.errors.shiftDatesInput)
            }
            helperText={
              formik.touched.shiftDatesInput && formik.errors.shiftDatesInput
            }
          ></NumberInput>
        </div>

        <div id="shift-test-case-dates-info-2" style={{ fontSize: 14 }}>
          Shift years on this test case by the number you enter. February 29th
          in leap years = February 28th in non leap years.
        </div>
      </div>
    </MadieDialog>
  );
};

export default ShiftDatesDialog;
