import * as React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import { ScanValidationDto } from "../../../../api/models/ScanValidationDto";
import TestCaseImportDialog from "./TestCaseImportDialog";
// @ts-ignore
import JSZip from "jszip";
import { Measure } from "@madie/madie-models";

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

const mockedTestCases = {
  id: "62c6c617e59fac0e20e02a03",
  title: "Dr",
  series: "Evil",
  description: "",
  createdAt: "2023-02-03T12:21:14.449Z",
  json: "Example Json",
};

describe("TestCaseImportDialog", () => {
  it("should render nothing when open is false", () => {
    const open = false;
    const handleClose = jest.fn();
    const onImport = jest.fn();

    render(
      <TestCaseImportDialog
        dialogOpen={open}
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
      <TestCaseImportDialog
        dialogOpen={open}
        handleClose={handleClose}
        onImport={onImport}
      />
    );

    expect(screen.getByText("Test Case Import")).toBeInTheDocument();
    const importButton = screen.getByRole("button", { name: "Import" });
    const selectFileButton = screen.getByRole("button", {
      name: "Select File",
    });
    expect(importButton).toBeInTheDocument();
    expect(selectFileButton).toBeInTheDocument();
    expect(importButton).toBeDisabled();
    expect(selectFileButton).toBeEnabled();
  });

  it("should call handleClose when Cancel button is clicked", () => {
    const open = true;
    const handleClose = jest.fn();
    const onImport = jest.fn();

    render(
      <TestCaseImportDialog
        dialogOpen={open}
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

  it("should preview a valid file", async () => {
    const open = true;
    const handleClose = jest.fn();
    const onImport = jest.fn();
    const fileName = "testcaseExample.json";

    const zip = new JSZip();
    zip.file(fileName, JSON.stringify(mockedTestCases));
    const finalZip = await zip.generateAsync({
      type: "blob",
      name: "TestCaseExport.zip",
    });

    const scanResult: ScanValidationDto = {
      fileName: "testcaseExample.json",
      valid: true,
      error: null,
    };

    mockedAxios.post.mockReset().mockResolvedValue({ data: scanResult });

    render(
      <TestCaseImportDialog
        dialogOpen={open}
        handleClose={handleClose}
        onImport={onImport}
      />
    );

    const inputEl = screen.getByTestId("file-drop-input");
    userEvent.upload(inputEl, finalZip);

    await waitFor(() => {
      const importBtn = screen.getByRole("button", { name: "Import" });
      expect(importBtn).toBeEnabled();
      userEvent.click(importBtn);
      expect(onImport).toHaveBeenCalled();
    });
  });

  it("should show error message when file scan validation call fails", async () => {
    const open = true;
    const handleClose = jest.fn();
    const onImport = jest.fn();
    const fileName = "testcaseExample.json";

    const zip = new JSZip();
    zip.file(fileName, JSON.stringify(mockedTestCases));
    const finalZip = await zip.generateAsync({
      type: "blob",
      name: "TestCaseExport.zip",
    });

    mockedAxios.post.mockReset().mockRejectedValue(new Error("BAD THINGS"));

    render(
      <TestCaseImportDialog
        dialogOpen={open}
        handleClose={handleClose}
        onImport={onImport}
      />
    );

    const inputEl = screen.getByTestId("file-drop-input"); // getByTestId because input is hidden
    userEvent.upload(inputEl, finalZip);

    expect(
      await screen.findByText(
        "An error occurred while validating the import file. Please try again or reach out to the Help Desk."
      )
    ).toBeInTheDocument();
  });

  it("displays error when scan validation returns invalid file", async () => {
    const open = true;
    const handleClose = jest.fn();
    const onImport = jest.fn();
    const fileName = "testcaseExample.json";

    const zip = new JSZip();
    zip.file(fileName, JSON.stringify(mockedTestCases));
    const finalZip = await zip.generateAsync({
      type: "blob",
      name: "TestCaseExport.zip",
    });

    const scanResult: ScanValidationDto = {
      fileName: "testcaseExample.json",
      valid: false,
      error: {
        codes: ["V100"],
        defaultMessage: "BAD THINGS HAPPENED",
      },
    };

    mockedAxios.post.mockReset().mockResolvedValue({ data: scanResult });

    render(
      <TestCaseImportDialog
        dialogOpen={open}
        handleClose={handleClose}
        onImport={onImport}
      />
    );

    const inputEl = screen.getByTestId("file-drop-input");
    userEvent.upload(inputEl, finalZip);

    await waitFor(() => {
      screen.getByText("BAD THINGS HAPPENED");
    });
    expect(screen.queryByText(/Test Cases from File/i)).not.toBeInTheDocument();
    // close toast
    userEvent.click(screen.getByTestId("close-toast-button"));
    expect(screen.queryByText(/BAD THINGS HAPPENED/i)).not.toBeInTheDocument();
  });
});
