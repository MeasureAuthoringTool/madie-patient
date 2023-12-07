import Dialog from "@mui/material/Dialog";
import React, { useCallback, useEffect, useRef, useState } from "react";
import "twin.macro";
import "styled-components/macro";
import { CircularProgress, Divider } from "@mui/material";
import { readImportFile } from "../../../../util/FhirImportHelper";
import { useDropzone } from "react-dropzone";
import {
  Button,
  Toast,
  MadieDialog,
} from "@madie/madie-design-system/dist/react";
import "./TestCaseImportDialog.css";
import * as _ from "lodash";
import useTestCaseServiceApi from "../../../../api/useTestCaseServiceApi";
import { ScanValidationDto } from "../../../../api/models/ScanValidationDto";
import { TestCaseImportRequest } from "@madie/madie-models";

const TestCaseImportFromBonnieDialogQDM = ({
  openDialog,
  handleClose,
  onImport,
}) => {
  const [file, setFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [testCases, setTestCases] = useState([]);
  const testCaseService = useRef(useTestCaseServiceApi());
  const [uploadingFileSpinner, setUploadingFileSpinner] = useState(false);

  // Toast utilities
  const [toastOpen, setToastOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>("");
  const [toastType, setToastType] = useState<string>("danger");
  const onToastClose = () => {
    setToastMessage("");
    setToastOpen(false);
  };

  useEffect(() => {
    if (!openDialog) {
      setFile(null);
      setTestCases([]);
    }
  }, [openDialog]);

  const showErrorToast = (message: string) => {
    setToastOpen(true);
    setToastType("danger");
    setToastMessage(message);
  };

  const onDrop = useCallback(async (acceptedFiles) => {
    setErrorMessage(() => null);
    const importFile = acceptedFiles[0];
    let response: ScanValidationDto;
    setUploadingFileSpinner(true);
    try {
      response = await testCaseService.current.scanImportFile(importFile);
    } catch (error) {
      showErrorToast(
        "An error occurred while validating the import file. Please try again or reach out to the Help Desk."
      );
      return;
    }
    if (response.valid) {
      setUploadingFileSpinner(false);
      setFile(importFile);
      let bonniePatients;
      try {
        bonniePatients = await readImportFile(importFile);
      } catch (error) {
        setUploadingFileSpinner(false);
        showErrorToast(
          "An error occurred while processing the import file. Please try to regenerate the file and re-import, or contact the Help Desk."
        );
        return;
      }
      if (bonniePatients && bonniePatients.length > 0) {
        try {
          setUploadingFileSpinner(false);
          const testCases = processPatientBundlesForQDM(bonniePatients);
          setTestCases(testCases);
        } catch (error) {
          setUploadingFileSpinner(false);
          showErrorToast(
            "An error occurred while processing the patient bundles. Please try to regenerate the file and re-import, or contact the Help Desk."
          );
        }
      } else {
        setUploadingFileSpinner(false);
        showErrorToast("No patients were found in the selected import file!");
      }
    } else {
      setUploadingFileSpinner(false);
      showErrorToast(response.error.defaultMessage);
    }
  }, []);
  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop,
    noClick: true,
    noDrag: false,
    maxFiles: 1,
    multiple: false,
    accept: {
      "application/json": [".json"],
    },
  });

  function processPatientBundlesForQDM(
    bonniePatients
  ): TestCaseImportRequest[] {
    const testCases: TestCaseImportRequest[] = [];
    for (const patient of bonniePatients) {
      testCases.push({
        patientId: "",
        json: JSON.stringify(patient),
      } as TestCaseImportRequest);
    }
    return testCases;
  }

  const onClose = () => {
    setUploadingFileSpinner(false);
    setFile(null);
    setErrorMessage(null);
    setTestCases([]);
    handleClose();
  };

  const renderFileContent = () => {
    return (
      <div>
        <div data-testid="test-case-preview-header">
          [{testCases?.length | 0}] Test Case
          {testCases?.length === 1 ? "" : "s"} from File: {file.name}
        </div>
        <Divider style={{ borderColor: "#8c8c8c" }} />
        <div
          data-testid="test-case-preview-list"
          style={{ maxHeight: 450, overflowY: "scroll" }}
        >
          {testCases?.map((tc) => (
            <div key={tc.id}>
              <span>{tc.series}</span>
              <span style={{ width: 20 }}></span>
              <span>{tc.title}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };
  return (
    <MadieDialog
      title="Test Case Import"
      dialogProps={{
        onClose,
        open: openDialog,
        maxWidth: "md",
        fullWidth: true,
      }}
      cancelButtonProps={{
        variant: "secondary",
        cancelText: "Cancel",
        "data-testid": "test-case-import-cancel-btn",
      }}
      continueButtonProps={{
        variant: "cyan",
        type: "submit",
        "data-testid": "test-case-import-import-btn",
        disabled:
          _.isNil(testCases) ||
          testCases.length === 0 ||
          !_.isEmpty(errorMessage),
        continueText: "Import",
        onClick: () => onImport(testCases),
      }}
    >
      <div data-testid="test-case-import-content-div">
        <div
          data-testid="file-drop-div"
          {...getRootProps({ className: "dropzone" })}
        >
          <input data-testid="file-drop-input" {...getInputProps()} />
          <span tw="text-black">Drag 'n' drop file to upload </span>
          <span tw="pb-3" style={{ color: "#666666" }}>
            {" "}
            or{" "}
          </span>
          <Button
            variant="outline-filled"
            data-testid="select-file-button"
            onClick={open}
          >
            Select File
          </Button>
          <span tw="pt-3" style={{ color: "#666666" }}>
            (.json)
          </span>
        </div>
        {file && renderFileContent()}
        {uploadingFileSpinner && (
          <div
            tw="flex border border-l-4 mt-5 mx-16 mb-1"
            data-testid="test-case-preview-header"
          >
            <div tw="flex items-center ml-80 my-4">
              <CircularProgress size={32} />
            </div>
          </div>
        )}
      </div>
      <div
        tw="flex items-center ml-20"
        data-testid="test-case-import-error-div"
      ></div>
      <Toast
        toastKey="import-tests-toast"
        aria-live="polite"
        toastType={toastType}
        testId="error-toast"
        closeButtonProps={{
          "data-testid": "close-toast-button",
        }}
        open={toastOpen}
        message={toastMessage}
        onClose={onToastClose}
        autoHideDuration={10000}
      />
    </MadieDialog>
  );
};

export default TestCaseImportFromBonnieDialogQDM;
