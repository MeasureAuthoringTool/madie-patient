import * as React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import { ScanValidationDto } from "../../../../api/models/ScanValidationDto";
import TestCaseImportDialog from "./TestCaseImportDialog";
// @ts-ignore
import JSZip from "jszip";
import { Measure, TestCaseImportRequest } from "@madie/madie-models";

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

const handleClose = jest.fn();
const onImport = jest.fn();

const jsonBundle = JSON.stringify({
  resourceType: "Bundle",
  id: "test.id",
  entry: [
    {
      resourceType: "Patient",
      id: "a648e724-ce72-4cac-b0a7-3c4d52784f73",
    },
  ],
});

const scanResult: ScanValidationDto = {
  fileName: "testcaseExample.json",
  valid: true,
  error: null,
};

const patientId1 = "8cdd6a96-732f-41da-9902-d680ca68157c";
const patientId2 = "a648e724-ce72-4cac-b0a7-3c4d52784f73";
const defaultFileName = "testcaseExample.json";

const createZipFile = async (
  patientIds: string[],
  jsonBundle?: string[],
  jsonFileName?: string[],
  zipFileName = "CMS136FHIR-v0.0.000-FHIR4-TestCases"
) => {
  try {
    const zip = new JSZip();
    const parentFolder = zip.folder(zipFileName);

    patientIds.forEach((patientId, index) => {
      const subFolderEntry = parentFolder.folder(patientId);
      subFolderEntry.file(
        jsonFileName ? jsonFileName[index] : defaultFileName,
        jsonBundle[index]
      );
    });

    const zipContent = await zip.generateAsync({ type: "nodebuffer" });
    const blob = new Blob([zipContent], { type: "application/zip" });
    return new File([blob], "CMS136FHIR-v0.0.000-FHIR4-TestCases", {
      type: "application/zip",
    });
  } catch (error) {
    throw error;
  }
};

const createZipFileWithNoParentFolder = async (
  patientIds: string[],
  jsonBundle?: string[],
  jsonFileName?: string[]
) => {
  try {
    const zip = new JSZip();
    patientIds.forEach((patientId, index) => {
      const subFolderEntry = zip.folder(patientId);
      subFolderEntry.file(
        jsonFileName ? jsonFileName[index] : defaultFileName,
        jsonBundle[index]
      );
    });

    const zipContent = await zip.generateAsync({ type: "nodebuffer" });
    const blob = new Blob([zipContent], { type: "application/zip" });
    return new File([blob], "CMS136FHIR-v0.0.000-FHIR4-TestCases", {
      type: "application/zip",
    });
  } catch (error) {
    throw error;
  }
};

describe("TestCaseImportDialog", () => {
  it("should render nothing when open is false", () => {
    render(
      <TestCaseImportDialog
        dialogOpen={false}
        handleClose={handleClose}
        onImport={onImport}
      />
    );

    expect(screen.queryByText("Test Case Import")).not.toBeInTheDocument();
  });

  it("should render when open is true", () => {
    render(
      <TestCaseImportDialog
        dialogOpen={true}
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
    render(
      <TestCaseImportDialog
        dialogOpen={true}
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
    const expectedOutCome: TestCaseImportRequest[] = [
      {
        patientId: patientId1,
        json: jsonBundle,
      },
      {
        patientId: patientId2,
        json: jsonBundle,
      },
    ];

    const zipFile = await createZipFile(
      [patientId1, patientId2],
      [jsonBundle, jsonBundle]
    );

    mockedAxios.post.mockReset().mockResolvedValue({ data: scanResult });

    render(
      <TestCaseImportDialog
        dialogOpen={true}
        handleClose={handleClose}
        onImport={onImport}
      />
    );

    const dropZone = screen.getByTestId("file-drop-input");
    userEvent.upload(dropZone, zipFile);

    await waitFor(async () => {
      const importBtn = await screen.getByRole("button", { name: "Import" });
      expect(importBtn).toBeEnabled();
      userEvent.click(importBtn);
      expect(onImport).toHaveBeenCalledWith(expectedOutCome);
      expect(screen.getByTestId("test-case-preview-header")).toHaveTextContent(
        "Complete"
      );
    });
  });

  it("should show error message when file scan validation call fails", async () => {
    const zipFile = await createZipFile(
      [patientId1, patientId2],
      [jsonBundle, jsonBundle]
    );

    mockedAxios.post.mockReset().mockRejectedValue(new Error("BAD THINGS"));

    render(
      <TestCaseImportDialog
        dialogOpen={true}
        handleClose={handleClose}
        onImport={onImport}
      />
    );

    const dropZone = screen.getByTestId("file-drop-input");
    userEvent.upload(dropZone, zipFile);

    await waitFor(() => {
      expect(
        screen.getByText(
          "An error occurred while uploading the file. Please try again or reach out to the helpdesk"
        )
      ).toBeInTheDocument();
    });
  });

  it("displays error when scan validation returns invalid file", async () => {
    const zipFile = await createZipFile(
      [patientId1, patientId2],
      [jsonBundle, jsonBundle]
    );

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
        dialogOpen={true}
        handleClose={handleClose}
        onImport={onImport}
      />
    );

    const dropZone = screen.getByTestId("file-drop-input");
    userEvent.upload(dropZone, zipFile);

    await waitFor(() => {
      screen.getByText("BAD THINGS HAPPENED");
    });
    userEvent.click(screen.getByTestId("close-toast-button"));
    expect(screen.queryByText(/BAD THINGS HAPPENED/i)).not.toBeInTheDocument();
  });

  it("Should display error message when file is rejected", async () => {
    const nonZipFile = new File(
      ["value"],
      "CMS136FHIR-v0.0.000-FHIR4-TestCases",
      {
        type: "application/json",
      }
    );

    mockedAxios.post.mockReset().mockResolvedValue({ data: scanResult });

    render(
      <TestCaseImportDialog
        dialogOpen={true}
        handleClose={handleClose}
        onImport={onImport}
      />
    );

    const dropZone = screen.getByTestId("file-drop-input");
    userEvent.upload(dropZone, nonZipFile);

    await waitFor(async () => {
      const importBtn = await screen.getByRole("button", { name: "Import" });
      expect(importBtn).toBeDisabled();
      expect(
        screen.getByTestId("test-case-import-error-div")
      ).toHaveTextContent("File type must be application/zip,.zip");
    });
  });

  it("Should ignore folders that are not a valid UUID", async () => {
    const expectedOutCome: TestCaseImportRequest[] = [
      {
        patientId: patientId2,
        json: jsonBundle,
      },
    ];

    const zipFile = await createZipFile(
      ["patientId1", patientId2],
      [jsonBundle, jsonBundle]
    );

    mockedAxios.post.mockReset().mockResolvedValue({ data: scanResult });

    render(
      <TestCaseImportDialog
        dialogOpen={true}
        handleClose={handleClose}
        onImport={onImport}
      />
    );

    const dropZone = screen.getByTestId("file-drop-input");
    userEvent.upload(dropZone, zipFile);

    await waitFor(async () => {
      const importBtn = await screen.getByRole("button", { name: "Import" });
      expect(importBtn).toBeEnabled();
      userEvent.click(importBtn);
      expect(onImport).toHaveBeenCalledWith(expectedOutCome);
      expect(screen.getByTestId("test-case-preview-header")).toHaveTextContent(
        "Complete"
      );
    });
  });

  it("Should ignore files that are not json", async () => {
    const expectedOutCome: TestCaseImportRequest[] = [
      {
        patientId: patientId2,
        json: jsonBundle,
      },
    ];

    const zipFile = await createZipFile(
      [patientId1, patientId2],
      [jsonBundle, jsonBundle],
      ["notAJsonFileName.txt", defaultFileName]
    );

    mockedAxios.post.mockReset().mockResolvedValue({ data: scanResult });

    render(
      <TestCaseImportDialog
        dialogOpen={true}
        handleClose={handleClose}
        onImport={onImport}
      />
    );

    const dropZone = screen.getByTestId("file-drop-input");
    userEvent.upload(dropZone, zipFile);

    await waitFor(async () => {
      const importBtn = await screen.getByRole("button", { name: "Import" });
      expect(importBtn).toBeEnabled();
      userEvent.click(importBtn);
      expect(onImport).toHaveBeenCalledWith(expectedOutCome);
      expect(screen.getByTestId("test-case-preview-header")).toHaveTextContent(
        "Complete"
      );
    });
  });

  it("Should display Failed status for file upload, if the zip doesn't contain any valid Json files", async () => {
    const zipFile = await createZipFile(
      [patientId1, patientId2],
      [jsonBundle, jsonBundle],
      ["notAJsonFileName.txt", "ReadMe.txt"]
    );

    mockedAxios.post.mockReset().mockResolvedValue({ data: scanResult });

    render(
      <TestCaseImportDialog
        dialogOpen={true}
        handleClose={handleClose}
        onImport={onImport}
      />
    );

    const dropZone = screen.getByTestId("file-drop-input");
    userEvent.upload(dropZone, zipFile);

    await waitFor(async () => {
      const importBtn = await screen.getByRole("button", { name: "Import" });
      expect(importBtn).toBeDisabled();
      expect(screen.getByTestId("test-case-preview-header")).toHaveTextContent(
        "Failed"
      );
      expect(
        screen.getByTestId("test-case-import-error-div")
      ).toHaveTextContent(
        "Unable to find any valid test case json. Please make sure the format is accurate"
      );
    });
  });

  it("Should preview as a valid file, if the parent folder is not found", async () => {
    const expectedOutCome: TestCaseImportRequest[] = [
      {
        patientId: patientId1,
        json: jsonBundle,
      },
      {
        patientId: patientId2,
        json: jsonBundle,
      },
    ];

    const zipFile = await createZipFileWithNoParentFolder(
      [patientId1, patientId2],
      [jsonBundle, jsonBundle]
    );

    mockedAxios.post.mockReset().mockResolvedValue({ data: scanResult });

    render(
      <TestCaseImportDialog
        dialogOpen={true}
        handleClose={handleClose}
        onImport={onImport}
      />
    );

    const dropZone = screen.getByTestId("file-drop-input");
    userEvent.upload(dropZone, zipFile);

    await waitFor(async () => {
      const importBtn = await screen.getByRole("button", { name: "Import" });
      expect(importBtn).toBeEnabled();
      userEvent.click(importBtn);
      expect(onImport).toHaveBeenCalledWith(expectedOutCome);
      expect(screen.getByTestId("test-case-preview-header")).toHaveTextContent(
        "Complete"
      );
    });
  });
});
