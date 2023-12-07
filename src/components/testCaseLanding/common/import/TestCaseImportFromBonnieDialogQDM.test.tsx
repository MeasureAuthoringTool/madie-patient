import * as React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Measure } from "@madie/madie-models";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import { ScanValidationDto } from "../../../../api/models/ScanValidationDto";
// @ts-ignore
import bonnieQdmJson from "../../../../__mocks__/bonnieQDM56Patients.json";
import TestCaseImportFromBonnieDialogQDM from "./TestCaseImportFromBonnieDialogQDM";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

jest.mock("@madie/madie-util", () => ({
  useDocumentTitle: jest.fn(),
  measureStore: {
    updateMeasure: jest.fn((measure) => measure),
    state: null,
    initialState: null,
    subscribe: (set) => {
      set({} as Measure);
      return { unsubscribe: () => null };
    },
    unsubscribe: () => null,
  },
  useOktaTokens: jest.fn(() => ({
    getAccessToken: () => "test.jwt",
  })),
  checkUserCanEdit: jest.fn(() => {
    return true;
  }),
  routeHandlerStore: {
    subscribe: () => {
      return { unsubscribe: () => null };
    },
    updateRouteHandlerState: () => null,
    state: { canTravel: false, pendingPath: "" },
    initialState: { canTravel: false, pendingPath: "" },
  },
}));

describe("TestCaseImportFromBonnieDialogQDM", () => {
  it("should render nothing when open is false", () => {
    const open = false;
    const handleClose = jest.fn();
    const onImport = jest.fn();

    render(
      <TestCaseImportFromBonnieDialogQDM
        openDialog={open}
        handleClose={handleClose}
        onImport={onImport}
      />
    );

    expect(screen.queryByText("Test Case Import")).not.toBeInTheDocument();
  });

  it("should render when open is true", () => {
    const open = true;
    const handleClose = jest.fn();
    const onImport = jest.fn();

    render(
      <TestCaseImportFromBonnieDialogQDM
        openDialog={open}
        handleClose={handleClose}
        onImport={onImport}
      />
    );

    expect(screen.getByText("Test Case Import")).toBeInTheDocument();
    const importButton = screen.getByRole("button", { name: "Import" });
    expect(importButton).toBeInTheDocument();
    expect(importButton).toBeDisabled();
  });

  it("should call handleClose when Cancel button is clicked", () => {
    const open = true;
    const handleClose = jest.fn();
    const onImport = jest.fn();

    render(
      <TestCaseImportFromBonnieDialogQDM
        openDialog={open}
        handleClose={handleClose}
        onImport={onImport}
      />
    );

    expect(screen.getByText("Test Case Import")).toBeInTheDocument();
    const importButton = screen.getByRole("button", { name: "Cancel" });
    expect(importButton).toBeInTheDocument();
    userEvent.click(importButton);
    expect(handleClose).toHaveBeenCalled();
  });

  it("should preview and import valid file", async () => {
    const open = true;
    const handleClose = jest.fn();
    const onImport = jest.fn();
    const fileName = "testcases.json";

    window.URL.createObjectURL = jest.fn().mockImplementation(() => "url");

    const scanResult: ScanValidationDto = {
      fileName: "testcases.json",
      valid: true,
      error: null,
    };

    mockedAxios.post.mockReset().mockResolvedValue({ data: scanResult });

    render(
      <TestCaseImportFromBonnieDialogQDM
        openDialog={open}
        handleClose={handleClose}
        onImport={onImport}
      />
    );

    const inputEl = screen.getByTestId("file-drop-input");
    const file = new File([JSON.stringify(bonnieQdmJson)], fileName, {
      type: "application/json",
    });
    Object.defineProperty(inputEl, "files", {
      value: [file],
    });
    fireEvent.drop(inputEl);

    await waitFor(() => {
      expect(screen.getByTestId("test-case-preview-header")).toHaveTextContent(
        `[2] Test Cases from File: ${fileName}`
      );
    });

    const importBtn = screen.getByRole("button", { name: "Import" });
    expect(importBtn).toBeInTheDocument();
    userEvent.click(importBtn);
    expect(onImport).toHaveBeenCalled();
  });

  it("should show error message when file scan validation call fails", async () => {
    const open = true;
    const handleClose = jest.fn();
    const onImport = jest.fn();
    const fileName = "testcases.json";

    window.URL.createObjectURL = jest.fn().mockImplementation(() => "url");

    mockedAxios.post.mockReset().mockRejectedValue(new Error("BAD THINGS"));

    render(
      <TestCaseImportFromBonnieDialogQDM
        openDialog={open}
        handleClose={handleClose}
        onImport={onImport}
      />
    );

    const inputEl = screen.getByTestId("file-drop-input");
    const file = new File([JSON.stringify(bonnieQdmJson)], fileName, {
      type: "application/json",
    });
    Object.defineProperty(inputEl, "files", {
      value: [file],
    });
    fireEvent.drop(inputEl);

    expect(
      await screen.findByText(
        "An error occurred while validating the import file. Please try again or reach out to the Help Desk."
      )
    ).toBeInTheDocument();
  });

  it("should display message when no patients are present", async () => {
    const open = true;
    const handleClose = jest.fn();
    const onImport = jest.fn();
    const fileName = "testcases.json";

    window.URL.createObjectURL = jest.fn().mockImplementation(() => "url");

    const scanResult: ScanValidationDto = {
      fileName: "testcases.json",
      valid: true,
      error: null,
    };

    mockedAxios.post.mockReset().mockResolvedValue({ data: scanResult });

    render(
      <TestCaseImportFromBonnieDialogQDM
        openDialog={open}
        handleClose={handleClose}
        onImport={onImport}
      />
    );

    const inputEl = screen.getByTestId("file-drop-input");
    const file = new File([JSON.stringify([])], fileName, {
      type: "application/json",
    });
    Object.defineProperty(inputEl, "files", {
      value: [file],
    });
    fireEvent.drop(inputEl);

    expect(
      await screen.findByText(
        "No patients were found in the selected import file!"
      )
    ).toBeInTheDocument();

    const importBtn = screen.getByRole("button", { name: "Import" });
    expect(importBtn).toBeInTheDocument();
    expect(importBtn).toBeDisabled();
  });

  it("displays error when scan validation returns invalid file", async () => {
    const open = true;
    const handleClose = jest.fn();
    const onImport = jest.fn();
    const fileName = "testcases.json";

    window.URL.createObjectURL = jest.fn().mockImplementation(() => "url");

    const scanResult: ScanValidationDto = {
      fileName: "testcases.json",
      valid: false,
      error: {
        codes: ["V100"],
        defaultMessage: "BAD THINGS HAPPENED",
      },
    };

    mockedAxios.post.mockReset().mockResolvedValue({ data: scanResult });

    render(
      <TestCaseImportFromBonnieDialogQDM
        openDialog={open}
        handleClose={handleClose}
        onImport={onImport}
      />
    );

    const inputEl = screen.getByTestId("file-drop-input");
    const file = new File([JSON.stringify(bonnieQdmJson)], fileName, {
      type: "application/json",
    });
    Object.defineProperty(inputEl, "files", {
      value: [file],
    });
    fireEvent.drop(inputEl);
    await waitFor(() => {
      screen.getByText("BAD THINGS HAPPENED");
    });
    expect(screen.queryByText(/Test Cases from File/i)).not.toBeInTheDocument();
    // close toast
    userEvent.click(screen.getByTestId("close-toast-button"));
    expect(screen.queryByText(/BAD THINGS HAPPENED/i)).not.toBeInTheDocument();
  });
});
