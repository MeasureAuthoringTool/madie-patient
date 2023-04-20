import * as React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import TestCaseImportDialog from "./TestCaseImportDialog";
import { Measure } from "@madie/madie-models";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import { ScanValidationDto } from "../../../api/models/ScanValidationDto";
import {
  processPatientBundles,
  readImportFile,
} from "../../../util/FhirImportHelper";
import bonnieJson from "../../../__mocks__/bonniePatient.json";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

let mockProcessedTestCases;
jest.mock("../../../util/FhirImportHelper", () => ({
  processPatientBundles: jest
    .fn()
    .mockImplementation(() => mockProcessedTestCases),
  readImportFile: jest.fn(),
}));

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
    subscribe: (set) => {
      return { unsubscribe: () => null };
    },
    updateRouteHandlerState: () => null,
    state: { canTravel: false, pendingPath: "" },
    initialState: { canTravel: false, pendingPath: "" },
  },
}));

describe("TestCaseImportDialog", () => {
  it("should render nothing when open is false", () => {
    const open = false;
    const handleClose = jest.fn();
    const onImport = jest.fn();

    render(
      <TestCaseImportDialog
        open={open}
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
        open={open}
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
      <TestCaseImportDialog
        open={open}
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

    mockProcessedTestCases = [
      {
        id: "62c6c617e59fac0e20e02a03",
        title: "Dr",
        series: "Evil",
        description: "",
        createdAt: "2023-02-03T12:21:14.449Z",
        json: JSON.stringify(bonnieJson),
      },
    ];

    window.URL.createObjectURL = jest.fn().mockImplementation(() => "url");

    const scanResult: ScanValidationDto = {
      fileName: "testcases.json",
      valid: true,
      error: null,
    };

    mockedAxios.post.mockReset().mockResolvedValue({ data: scanResult });
    (readImportFile as jest.Mock).mockResolvedValueOnce(bonnieJson);

    render(
      <TestCaseImportDialog
        open={open}
        handleClose={handleClose}
        onImport={onImport}
      />
    );

    const inputEl = screen.getByTestId("file-drop-input"); // getByTestId because input is hidden
    const file = new File([JSON.stringify(bonnieJson)], fileName, {
      type: "application/json",
    });
    Object.defineProperty(inputEl, "files", {
      value: [file],
    });
    fireEvent.drop(inputEl);

    expect(
      await screen.findByText(`[1] Test Case from File: ${fileName}`)
    ).toBeInTheDocument();

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

    mockProcessedTestCases = [
      {
        id: "62c6c617e59fac0e20e02a03",
        title: "Dr",
        series: "Evil",
        description: "",
        createdAt: "2023-02-03T12:21:14.449Z",
        json: JSON.stringify(bonnieJson),
      },
    ];

    window.URL.createObjectURL = jest.fn().mockImplementation(() => "url");

    mockedAxios.post.mockReset().mockRejectedValue(new Error("BAD THINGS"));

    render(
      <TestCaseImportDialog
        open={open}
        handleClose={handleClose}
        onImport={onImport}
      />
    );

    const inputEl = screen.getByTestId("file-drop-input"); // getByTestId because input is hidden
    const file = new File([JSON.stringify(bonnieJson)], fileName, {
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

  it("should display message when no bundles are present", async () => {
    const open = true;
    const handleClose = jest.fn();
    const onImport = jest.fn();
    const fileName = "testcases.json";

    mockProcessedTestCases = [
      {
        id: "62c6c617e59fac0e20e02a03",
        title: "Dr",
        series: "Evil",
        description: "",
        createdAt: "2023-02-03T12:21:14.449Z",
        json: JSON.stringify(bonnieJson),
      },
    ];

    window.URL.createObjectURL = jest.fn().mockImplementation(() => "url");

    const scanResult: ScanValidationDto = {
      fileName: "testcases.json",
      valid: true,
      error: null,
    };

    mockedAxios.post.mockReset().mockResolvedValue({ data: scanResult });
    (readImportFile as jest.Mock).mockResolvedValueOnce(null);

    render(
      <TestCaseImportDialog
        open={open}
        handleClose={handleClose}
        onImport={onImport}
      />
    );

    const inputEl = screen.getByTestId("file-drop-input"); // getByTestId because input is hidden
    const file = new File([JSON.stringify(bonnieJson)], fileName, {
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

  it("should display message when bundles empty", async () => {
    const open = true;
    const handleClose = jest.fn();
    const onImport = jest.fn();
    const fileName = "testcases.json";

    mockProcessedTestCases = [
      {
        id: "62c6c617e59fac0e20e02a03",
        title: "Dr",
        series: "Evil",
        description: "",
        createdAt: "2023-02-03T12:21:14.449Z",
        json: JSON.stringify(bonnieJson),
      },
    ];

    window.URL.createObjectURL = jest.fn().mockImplementation(() => "url");

    const scanResult: ScanValidationDto = {
      fileName: "testcases.json",
      valid: true,
      error: null,
    };

    mockedAxios.post.mockReset().mockResolvedValue({ data: scanResult });
    (readImportFile as jest.Mock).mockResolvedValueOnce([]);

    render(
      <TestCaseImportDialog
        open={open}
        handleClose={handleClose}
        onImport={onImport}
      />
    );

    const inputEl = screen.getByTestId("file-drop-input"); // getByTestId because input is hidden
    const file = new File([JSON.stringify(bonnieJson)], fileName, {
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

  it("should display bundle processing error", async () => {
    const open = true;
    const handleClose = jest.fn();
    const onImport = jest.fn();
    const fileName = "testcases.json";

    mockProcessedTestCases = [
      {
        id: "62c6c617e59fac0e20e02a03",
        title: "Dr",
        series: "Evil",
        description: "",
        createdAt: "2023-02-03T12:21:14.449Z",
        json: JSON.stringify(bonnieJson),
      },
    ];

    window.URL.createObjectURL = jest.fn().mockImplementation(() => "url");

    const scanResult: ScanValidationDto = {
      fileName: "testcases.json",
      valid: true,
      error: null,
    };

    mockedAxios.post.mockReset().mockResolvedValue({ data: scanResult });
    (readImportFile as jest.Mock).mockResolvedValueOnce(bonnieJson);
    (processPatientBundles as jest.Mock).mockImplementationOnce(() => {
      throw new Error("BAD THINGS");
    });

    render(
      <TestCaseImportDialog
        open={open}
        handleClose={handleClose}
        onImport={onImport}
      />
    );

    const inputEl = screen.getByTestId("file-drop-input"); // getByTestId because input is hidden
    const file = new File([JSON.stringify(bonnieJson)], fileName, {
      type: "application/json",
    });
    Object.defineProperty(inputEl, "files", {
      value: [file],
    });
    fireEvent.drop(inputEl);

    expect(
      await screen.findByText(
        "An error occurred while processing the patient bundles. Please try to regenerate the file and re-import, or contact the Help Desk."
      )
    ).toBeInTheDocument();
  });

  it("should show an error message when readImportFile fails", async () => {
    const open = true;
    const handleClose = jest.fn();
    const onImport = jest.fn();
    const fileName = "testcases.json";

    mockProcessedTestCases = [
      {
        id: "62c6c617e59fac0e20e02a03",
        title: "Dr",
        series: "Evil",
        description: "",
        createdAt: "2023-02-03T12:21:14.449Z",
        json: JSON.stringify(bonnieJson),
      },
    ];

    window.URL.createObjectURL = jest.fn().mockImplementation(() => "url");

    const scanResult: ScanValidationDto = {
      fileName: "testcases.json",
      valid: true,
      error: null,
    };

    mockedAxios.post.mockReset().mockResolvedValue({ data: scanResult });
    (readImportFile as jest.Mock).mockRejectedValueOnce("INVALID FILE!");

    render(
      <TestCaseImportDialog
        open={open}
        handleClose={handleClose}
        onImport={onImport}
      />
    );

    const inputEl = screen.getByTestId("file-drop-input"); // getByTestId because input is hidden
    const file = new File([JSON.stringify(bonnieJson)], fileName, {
      type: "application/json",
    });
    Object.defineProperty(inputEl, "files", {
      value: [file],
    });
    fireEvent.drop(inputEl);
    expect(
      await screen.findByText(
        "An error occurred while processing the import file. Please try to regenerate the file and re-import, or contact the Help Desk."
      )
    ).toBeInTheDocument();
    expect(readImportFile as jest.Mock).toHaveBeenCalled();
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
      <TestCaseImportDialog
        open={open}
        handleClose={handleClose}
        onImport={onImport}
      />
    );

    const inputEl = screen.getByTestId("file-drop-input"); // getByTestId because input is hidden
    const file = new File([JSON.stringify(bonnieJson)], fileName, {
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
