import * as React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axios from "../../../../api/axios-instance";
import { ScanValidationDto } from "../../../../api/models/ScanValidationDto";
import TestCaseImportDialog from "./TestCaseImportDialog";
// @ts-ignore
import JSZip from "jszip";
import {
  Measure,
  TestCaseExportMetaData,
  TestCaseImportRequest,
} from "@madie/madie-models";
import * as _ from "lodash";

jest.mock("../../../../api/axios-instance");
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
const madieFileContents: TestCaseExportMetaData[] = [
  {
    patientId: patientId1,
    testCaseId: "tc1ID",
    description: "the first test case",
    title: "TC1",
    series: undefined,
  },
  {
    patientId: patientId2,
    testCaseId: "tc2ID",
    description: "the second test case",
    title: "TC2",
    series: "IPFAIL",
  },
];
const defaultFileName = "testcaseExample.json";

const createZipFile = async (
  patientIds: string[],
  jsonBundle?: string[],
  jsonFileName?: string[],
  madieMetaData?: string,
  zipFileName = "CMS136FHIR-v0.0.000-FHIR4-TestCases"
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

    if (!_.isNil(madieMetaData)) {
      zip.file(".madie", madieMetaData);
    }

    const zipContent = await zip.generateAsync({ type: "nodebuffer" });
    const blob = new Blob([zipContent], { type: "application/zip" });
    return new File([blob], "CMS136FHIR-v0.0.000-FHIR4-TestCases", {
      type: "application/zip",
    });
  } catch (error) {
    throw error;
  }
};

const createZipFileBadMadie = async (
  patientIds: string[],
  jsonBundle?: string[],
  jsonFileName?: string[],
  zipFileName = "CMS136FHIR-v0.0.000-FHIR4-TestCases"
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

    zip.file(
      ".madie",
      JSON.stringify({
        patientId: "a",
        testCaseId: "a",
        description: "the first test case",
        title: "TC1",
        series: undefined,
      })
    );

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
        testCaseMetaData: madieFileContents[0],
      },
      {
        patientId: patientId2,
        json: jsonBundle,
        testCaseMetaData: madieFileContents[1],
      },
    ];

    const zipFile = await createZipFile(
      [patientId1, patientId2],
      [jsonBundle, jsonBundle],
      ["file1.json", "file2.json"],
      JSON.stringify(madieFileContents)
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

  it("should preview a valid file including .madie file", async () => {
    const expectedOutCome: TestCaseImportRequest[] = [
      {
        patientId: patientId1,
        json: jsonBundle,
        testCaseMetaData: madieFileContents[0],
      },
      {
        patientId: patientId2,
        json: jsonBundle,
        testCaseMetaData: madieFileContents[1],
      },
    ];

    const zipFile = await createZipFile(
      [patientId1, patientId2],
      [jsonBundle, jsonBundle],
      ["file1.json", "file2.json"],
      JSON.stringify(madieFileContents)
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
      [jsonBundle, jsonBundle],
      ["file1.json", "file2.json"],
      JSON.stringify(madieFileContents)
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
      [jsonBundle, jsonBundle],
      ["file1.json", "file2.json"],
      JSON.stringify(madieFileContents)
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
      ).toHaveTextContent(
        "The import file must be a zip file. No Test Cases can be imported."
      );
    });
  });

  it("Should ignore folders that are not a valid UUID", async () => {
    const expectedOutCome: TestCaseImportRequest[] = [
      {
        patientId: patientId2,
        json: jsonBundle,
        testCaseMetaData: madieFileContents[1],
      },
    ];

    const zipFile = await createZipFile(
      ["patientId1", patientId2],
      [jsonBundle, jsonBundle],
      ["file1.json", "file2.json"],
      JSON.stringify(madieFileContents)
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
        testCaseMetaData: madieFileContents[1],
      },
    ];

    const zipFile = await createZipFile(
      [patientId1, patientId2],
      [jsonBundle, jsonBundle],
      ["notAJsonFileName.txt", defaultFileName],
      JSON.stringify(madieFileContents)
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

  it("Should send a blank file if folder is empty", async () => {
    const madieFileContents: TestCaseExportMetaData[] = [
      {
        patientId: patientId1,
        testCaseId: "tc1ID",
        description: "the first test case",
        title: "TC1",
        series: undefined,
      },
      {
        patientId: patientId2,
        testCaseId: "tc2ID",
        description: "the second test case",
        title: "TC2",
        series: "IPFAIL",
      },
    ];

    const expectedOutCome: TestCaseImportRequest[] = [
      {
        patientId: patientId1,
        json: jsonBundle,
        testCaseMetaData: madieFileContents[0],
      },
      {
        patientId: patientId2,
        json: "",
        testCaseMetaData: madieFileContents[1],
      },
    ];

    const zipFile = await createZipFile(
      [patientId1, patientId2],
      [jsonBundle, ""],
      [defaultFileName, "ReadMe.txt"],
      JSON.stringify(madieFileContents)
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

  it("Should filter blank files for populated json", async () => {
    const expectedOutCome: TestCaseImportRequest[] = [
      {
        patientId: patientId1,
        json: jsonBundle,
        testCaseMetaData: madieFileContents[0],
      },
      {
        patientId: patientId2,
        json: jsonBundle,
        testCaseMetaData: madieFileContents[1],
      },
    ];

    const zipFile = await createZipFile(
      [patientId1, patientId2, patientId2],
      [jsonBundle, "", jsonBundle],
      ["notAJsonFileName.txt", "ReadMe.txt"],
      JSON.stringify(madieFileContents)
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

  it("Shouldn't preview as a valid file, if the madie file is not found", async () => {
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
      expect(importBtn).not.toBeEnabled();
      const noMadie = await screen.getByText(
        "Zip file is in an incorrect format. If this is an export prior to June 20, 2024 please reexport your test case and try again."
      );
      expect(noMadie).toBeInTheDocument();
    });
  });
  it("Shouldn't preview as a valid file, if there's an error", async () => {
    const zipFile = await createZipFile(
      [patientId1, patientId2],
      [jsonBundle, ""],
      [defaultFileName, "ReadMe.txt"],
      JSON.stringify({
        patientId: patientId1,
        json: jsonBundle,
        testCaseMetaData: madieFileContents[0],
      })
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
      const errorMessage = await screen.getByText("Error uploading zip file");
      expect(errorMessage).toBeInTheDocument();
    });
  });
});
